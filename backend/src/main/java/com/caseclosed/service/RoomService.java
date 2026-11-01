package com.caseclosed.service;

import com.caseclosed.dto.*;
import com.caseclosed.exception.GameRuleException;
import com.caseclosed.exception.ResourceNotFoundException;
import com.caseclosed.repository.*;
import com.caseclosed.security.PlayerTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomPlayerRepository roomPlayerRepository;
    private final RoomEvidenceRepository roomEvidenceRepository;
    private final RoomTaskRepository roomTaskRepository;
    private final RoomEventRepository roomEventRepository;
    private final RoomVerdictRepository roomVerdictRepository;
    private final UserRepository userRepository;
    private final CaseRepository caseRepository;
    private final CaseSolutionRepository caseSolutionRepository;
    private final PlayerTokenService playerTokenService;

    // Room state cache and per-room reentrant locks for atomic multiplayer operations
    private final Map<String, RoomResponse> activeRoomCache = new ConcurrentHashMap<>();
    private final Map<String, ReentrantLock> roomLocks = new ConcurrentHashMap<>();

    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("hh:mm a");

    @Autowired
    public RoomService(
            RoomRepository roomRepository,
            RoomPlayerRepository roomPlayerRepository,
            RoomEvidenceRepository roomEvidenceRepository,
            RoomTaskRepository roomTaskRepository,
            RoomEventRepository roomEventRepository,
            RoomVerdictRepository roomVerdictRepository,
            UserRepository userRepository,
            CaseRepository caseRepository,
            CaseSolutionRepository caseSolutionRepository,
            PlayerTokenService playerTokenService) {
        this.roomRepository = roomRepository;
        this.roomPlayerRepository = roomPlayerRepository;
        this.roomEvidenceRepository = roomEvidenceRepository;
        this.roomTaskRepository = roomTaskRepository;
        this.roomEventRepository = roomEventRepository;
        this.roomVerdictRepository = roomVerdictRepository;
        this.userRepository = userRepository;
        this.caseRepository = caseRepository;
        this.caseSolutionRepository = caseSolutionRepository;
        this.playerTokenService = playerTokenService;
    }

    private ReentrantLock getRoomLock(String roomCode) {
        return roomLocks.computeIfAbsent(roomCode.trim().toUpperCase(), k -> new ReentrantLock());
    }

    private String formatTime(LocalTime time) {
        return time.format(TIME_FMT);
    }

    private String generateRoomCode() {
        int num = 1000 + new Random().nextInt(9000);
        return "CC-" + num;
    }

    /**
     * Validates that the requesting player is an active member of the room.
     * Optionally validates cryptographic token if provided.
     */
    public void validateRoomMembership(RoomResponse room, String playerId, String authHeader) {
        if (playerId == null || playerId.isBlank()) {
            throw new GameRuleException("Unauthorized: missing player identifier.");
        }

        // If a session token was passed, verify it matches
        if (authHeader != null && !authHeader.isBlank()) {
            PlayerTokenService.PlayerSession session = playerTokenService.validateToken(authHeader);
            if (session != null) {
                if (!session.roomCode().equalsIgnoreCase(room.getRoomCode()) || !session.playerId().equals(playerId)) {
                    throw new GameRuleException("Forbidden: session token does not match room or player identity.");
                }
            }
        }

        boolean isMember = room.getPlayers().stream().anyMatch(p -> p.getId().equals(playerId));
        if (!isMember) {
            throw new GameRuleException("Forbidden: Player " + playerId + " is not an authorized member of Room " + room.getRoomCode());
        }
    }

    @Transactional
    public RoomActionResponse createRoom(CreateRoomRequest request) {
        String roomCode = generateRoomCode();
        ReentrantLock lock = getRoomLock(roomCode);
        lock.lock();
        try {
            String caseId = request.getCaseId() != null ? request.getCaseId() : "CC-001";
            String hostName = request.getHostPlayerName() != null ? request.getHostPlayerName().trim() : "Detective";
            String hostAvatar = request.getHostAvatar() != null ? request.getHostAvatar() : "🕵️‍♂️";
            String hostPlayerId = "p_" + System.currentTimeMillis();

            RoomResponse response = new RoomResponse();
            response.setRoomCode(roomCode);
            response.setCaseId(caseId);
            response.setStatus("WAITING");
            response.setCreatedAt(Instant.now().toString());
            response.setHoursLeft(6.0);

            RoomResponse.PlayerDto host = new RoomResponse.PlayerDto(
                    hostPlayerId,
                    hostName,
                    hostAvatar,
                    true,
                    true,
                    "study",
                    formatTime(LocalTime.now())
            );
            response.getPlayers().add(host);

            Map<String, Object> initEvent = new LinkedHashMap<>();
            initEvent.put("id", "evt_" + System.currentTimeMillis());
            initEvent.put("time", formatTime(LocalTime.now()));
            initEvent.put("category", "SYSTEM");
            initEvent.put("text", "Investigation Room " + roomCode + " opened for Case " + caseId + " by " + hostName + ".");
            response.getJournalEvents().add(initEvent);

            activeRoomCache.put(roomCode, response);

            // Register session token for secure authorization
            playerTokenService.generateToken(roomCode, hostPlayerId, hostName, true);

            return new RoomActionResponse(response, hostPlayerId);
        } finally {
            lock.unlock();
        }
    }

    @Transactional
    public RoomActionResponse joinRoom(String roomCode, JoinRoomRequest request) {
        String formattedCode = roomCode.trim().toUpperCase();
        ReentrantLock lock = getRoomLock(formattedCode);
        lock.lock();
        try {
            RoomResponse room = activeRoomCache.get(formattedCode);

            if (room == null) {
                throw new ResourceNotFoundException("Room " + formattedCode + " not found. Verify the room code and try again.");
            }

            String playerName = request.getPlayerName() != null ? request.getPlayerName().trim() : "Agent";
            String playerAvatar = request.getPlayerAvatar() != null ? request.getPlayerAvatar() : "🔍";

            // If player already in room, return existing player session
            Optional<RoomResponse.PlayerDto> existing = room.getPlayers().stream()
                    .filter(p -> p.getName().equalsIgnoreCase(playerName))
                    .findFirst();

            if (existing.isPresent()) {
                return new RoomActionResponse(room, existing.get().getId());
            }

            // Strictly enforce room capacity under concurrent access (2 to 4 players)
            if (room.getPlayers().size() >= 4) {
                throw new GameRuleException("Room " + formattedCode + " is already full (maximum 4 detectives allowed).");
            }

            String playerId = "p_" + System.currentTimeMillis() + "_" + (100 + new Random().nextInt(900));
            RoomResponse.PlayerDto newPlayer = new RoomResponse.PlayerDto(
                    playerId,
                    playerName,
                    playerAvatar,
                    false,
                    true,
                    "study",
                    formatTime(LocalTime.now())
            );

            room.getPlayers().add(newPlayer);

            Map<String, Object> joinEvent = new LinkedHashMap<>();
            joinEvent.put("id", "evt_" + System.currentTimeMillis());
            joinEvent.put("time", formatTime(LocalTime.now()));
            joinEvent.put("category", "PLAYER");
            joinEvent.put("text", playerName + " arrived at Blackwood Manor and joined the investigation team.");
            room.getJournalEvents().add(0, joinEvent);

            playerTokenService.generateToken(formattedCode, playerId, playerName, false);

            return new RoomActionResponse(room, playerId);
        } finally {
            lock.unlock();
        }
    }

    public RoomResponse getRoomState(String roomCode) {
        String formattedCode = roomCode.trim().toUpperCase();
        RoomResponse room = activeRoomCache.get(formattedCode);
        if (room == null) {
            throw new ResourceNotFoundException("Room " + roomCode + " not found.");
        }
        return room;
    }

    @Transactional
    public RoomResponse startInvestigation(String roomCode) {
        String formattedCode = roomCode.trim().toUpperCase();
        ReentrantLock lock = getRoomLock(formattedCode);
        lock.lock();
        try {
            RoomResponse room = getRoomState(formattedCode);

            if ("COMPLETED".equals(room.getStatus())) {
                throw new GameRuleException("Cannot restart an investigation that has already concluded.");
            }

            room.setStatus("INVESTIGATING");

            Map<String, Object> event = new LinkedHashMap<>();
            event.put("id", "evt_" + System.currentTimeMillis());
            event.put("time", formatTime(LocalTime.now()));
            event.put("category", "SYSTEM");
            event.put("text", "The iron gates have been locked. The official homicide investigation has begun.");
            room.getJournalEvents().add(0, event);

            return room;
        } finally {
            lock.unlock();
        }
    }

    @Transactional
    public RoomResponse updatePlayerLocation(String roomCode, String playerId, UpdateLocationRequest request, String authHeader) {
        String formattedCode = roomCode.trim().toUpperCase();
        ReentrantLock lock = getRoomLock(formattedCode);
        lock.lock();
        try {
            RoomResponse room = getRoomState(formattedCode);

            validateRoomMembership(room, playerId, authHeader);

            RoomResponse.PlayerDto player = room.getPlayers().stream()
                    .filter(p -> p.getId().equals(playerId))
                    .findFirst()
                    .orElseThrow(() -> new ResourceNotFoundException("Player " + playerId + " not found."));

            String locationId = request.getLocationId();
            if (locationId != null && !locationId.equals(player.getCurrentLocationId())) {
                player.setCurrentLocationId(locationId);

                Map<String, Object> event = new LinkedHashMap<>();
                event.put("id", "evt_" + System.currentTimeMillis());
                event.put("time", formatTime(LocalTime.now()));
                event.put("category", "LOCATION");
                event.put("text", player.getName() + " moved to " + locationId + ".");
                room.getJournalEvents().add(0, event);
            }

            return room;
        } finally {
            lock.unlock();
        }
    }

    @Transactional
    public DiscoverEvidenceResponse discoverEvidence(String roomCode, DiscoverEvidenceRequest request, String authHeader) {
        String formattedCode = roomCode.trim().toUpperCase();
        ReentrantLock lock = getRoomLock(formattedCode);
        lock.lock();
        try {
            RoomResponse room = getRoomState(formattedCode);

            validateRoomMembership(room, request.getPlayerId(), authHeader);

            RoomResponse.PlayerDto player = room.getPlayers().stream()
                    .filter(p -> p.getId().equals(request.getPlayerId()))
                    .findFirst()
                    .orElse(new RoomResponse.PlayerDto(request.getPlayerId(), "A detective", "🔍", false, true, "study", ""));

            // Record hotspot examination and time consumption atomically
            if (request.getHotspotId() != null && !room.getExaminedHotspotIds().contains(request.getHotspotId())) {
                room.getExaminedHotspotIds().add(request.getHotspotId());
                room.setHoursLeft(Math.max(0.0, room.getHoursLeft() - 0.5));
            }

            boolean clueDiscovered = false;
            String clueId = request.getClueId();

            // Idempotent shared evidence discovery with thread-safety
            if (clueId != null && !room.getDiscoveredEvidenceIds().contains(clueId)) {
                room.getDiscoveredEvidenceIds().add(clueId);
                clueDiscovered = true;

                Map<String, Object> event = new LinkedHashMap<>();
                event.put("id", "evt_" + System.currentTimeMillis());
                event.put("time", formatTime(LocalTime.now()));
                event.put("category", "EVIDENCE");
                event.put("text", "🔍 " + player.getName() + " uncovered critical evidence: \"" + clueId + "\". Shared with all detectives.");
                room.getJournalEvents().add(0, event);

                checkAndFulfillTaskForClue(room, clueId);
            }

            return new DiscoverEvidenceResponse(room, clueDiscovered);
        } finally {
            lock.unlock();
        }
    }

    private void checkAndFulfillTaskForClue(RoomResponse room, String clueId) {
        if ("clue_scotch".equals(clueId) && !room.getCompletedTaskIds().contains("task_corpse")) {
            room.getCompletedTaskIds().add("task_corpse");
        } else if ("clue_clock".equals(clueId) && !room.getCompletedTaskIds().contains("task_clock")) {
            room.getCompletedTaskIds().add("task_clock");
        } else if ("clue_footprint".equals(clueId) && !room.getCompletedTaskIds().contains("task_conservatory")) {
            room.getCompletedTaskIds().add("task_conservatory");
        } else if ("clue_vial".equals(clueId) && !room.getCompletedTaskIds().contains("task_vial")) {
            room.getCompletedTaskIds().add("task_vial");
        }
    }

    @Transactional
    public ConfrontSuspectResponse confrontSuspect(String roomCode, String suspectId, ConfrontSuspectRequest request, String authHeader) {
        String formattedCode = roomCode.trim().toUpperCase();
        ReentrantLock lock = getRoomLock(formattedCode);
        lock.lock();
        try {
            RoomResponse room = getRoomState(formattedCode);

            validateRoomMembership(room, request.getPlayerId(), authHeader);

            RoomResponse.PlayerDto player = room.getPlayers().stream()
                    .filter(p -> p.getId().equals(request.getPlayerId()))
                    .findFirst()
                    .orElse(new RoomResponse.PlayerDto(request.getPlayerId(), "A detective", "🔍", false, true, "study", ""));

            String clueId = request.getClueId();

            // Validate that the clue has actually been discovered before it can be used in confrontation
            if (!room.getDiscoveredEvidenceIds().contains(clueId)) {
                throw new GameRuleException("Cannot confront suspect with undiscovered evidence: " + clueId);
            }

            boolean success = false;
            String dialogue = "Irrelevant.";
            String breakdown = null;

            if ("thorne".equals(suspectId)) {
                if ("clue_vial".equals(clueId)) {
                    success = true;
                    dialogue = "You... you pulled that from the cellar hearth? (His hand twitches, composure cracking). Fine! I went up to Julian's study at 11:25 PM! But it was only to settle our financial disagreement! I didn't pour the poison... wait, you can't prove that!";
                    breakdown = "ALIBI BROKEN: Dr. Thorne lied about being in the lounge. He was in the study during the precise window of death with his hospital-grade cyanide!";
                } else if ("clue_clock".equals(clueId)) {
                    success = true;
                    dialogue = "The clock? I know nothing of clockwork! Though... Julian always did keep his timepieces eccentric. Why are you staring at my pocket watch screwdriver?";
                    breakdown = "Thorne becomes visibly unsettled when confronted about the tampered 11:42 PM clockwork.";
                }
            } else if ("vivienne".equals(suspectId)) {
                if ("clue_earring".equals(clueId)) {
                    success = true;
                    dialogue = "My South Sea pearl! You found it under the rug? (She gasps, trembling). All right, detective! I went to his study at 11:15 PM to beg for my contract back! He laughed at me. I slapped him and ran out at 11:20 PM! But I swear on my life—he was furious and alive when I left!";
                    breakdown = "ALIBI BROKEN: Vivienne admits being in the study at 11:15 PM, but testifies Julian was alive and unharmed when she fled.";
                }
            } else if ("arthur".equals(suspectId)) {
                if ("clue_footprint".equals(clueId)) {
                    success = true;
                    dialogue = "My cufflink and shoes? Blast it all! Yes, I broke through the conservatory window at 11:35 PM to crack the safe and steal the revised will! But hear me—when I opened the study door, Julian was ALREADY dead in his chair! His skin was blue and cold! I didn't kill him, I only stole the will!";
                    breakdown = "ALIBI BROKEN: Arthur admits breaking in at 11:35 PM, but confirms Julian was already dead from the poison when he arrived!";
                }
            }

            if (success && !room.getAlibiBrokenSuspectIds().contains(suspectId)) {
                room.getAlibiBrokenSuspectIds().add(suspectId);
                if (!room.getCompletedTaskIds().contains("task_alibi")) {
                    room.getCompletedTaskIds().add("task_alibi");
                }

                Map<String, Object> event = new LinkedHashMap<>();
                event.put("id", "evt_" + System.currentTimeMillis());
                event.put("time", formatTime(LocalTime.now()));
                event.put("category", "CONFRONTATION");
                event.put("text", "⚡ " + player.getName() + " shattered " + suspectId + "'s alibi using evidence! " + breakdown);
                room.getJournalEvents().add(0, event);
            }

            return new ConfrontSuspectResponse(room, success, dialogue, breakdown);
        } finally {
            lock.unlock();
        }
    }

    @Transactional
    public VerdictResultDto submitCooperativeVerdict(String roomCode, SubmitVerdictRequest request, String authHeader) {
        String formattedCode = roomCode.trim().toUpperCase();
        ReentrantLock lock = getRoomLock(formattedCode);
        lock.lock();
        try {
            RoomResponse room = getRoomState(formattedCode);

            // 1. Authorization: Only authorized room members can submit a verdict
            validateRoomMembership(room, request.getPlayerId(), authHeader);

            // 2. State & Concurrency Protection: exactly one cooperative verdict per room
            if (room.getVerdictResult() != null || "COMPLETED".equals(room.getStatus())) {
                throw new GameRuleException("Room " + formattedCode + " has already submitted its final verdict. Only one verdict per room is permitted.");
            }

            // 3. Minimum progression requirement: investigation must be active
            if ("WAITING".equals(room.getStatus())) {
                throw new GameRuleException("Cannot submit a verdict before starting the investigation.");
            }

            // 4. Confidential solution verification: Never expose private solution data in API responses
            boolean isCulpritRight = "thorne".equalsIgnoreCase(request.getCulpritId());
            boolean isMethodRight = "poison_scotch".equalsIgnoreCase(request.getMurderMethodId());
            boolean isMotiveRight = "narcotics_blackmail".equalsIgnoreCase(request.getMotiveId());
            boolean isSmokingGunRight = "clue_vial".equalsIgnoreCase(request.getSmokingGunId());

            int correctCount = 0;
            if (isCulpritRight) correctCount++;
            if (isMethodRight) correctCount++;
            if (isMotiveRight) correctCount++;
            if (isSmokingGunRight) correctCount++;

            boolean isFullWin = (correctCount == 4);

            String grade;
            String title;
            String epilogue;

            if (isFullWin) {
                grade = "S";
                title = "Master Sleuths of Scotland Yard & NYPD";
                epilogue = "Drawing the velvet drapes in the parlor, your team points directly at Dr. Reginald Thorne.\n\n"
                        + "\"The stopped grandfather clock was your undoing, Doctor. You turned the hands back to 11:42 PM to forge an alibi while seated with Lady Abernathy. But Julian was already dead by 11:30 PM—poisoned by the Potassium Cyanide you brought in the vintage Glenfarclas bottle.\"\n\n"
                        + "You place the crushed amber apothecary vial on the table. \"Embossed with your hospital stamp, code TR-8. Julian was blackmailing you with federal charges for narcotics diversion.\"\n\n"
                        + "Thorne's composure shatters as the constable snaps iron handcuffs onto his wrists. Justice has been delivered. Case closed!";
            } else if (isCulpritRight) {
                grade = "B";
                title = "Partial Conviction - Circumstantial Gaps";
                epilogue = "You correctly named Dr. Reginald Thorne as the mastermind! However, loopholes in your weapon or motive reconstruction allow his Manhattan defense attorneys to fight for manslaughter instead of first-degree murder.";
            } else {
                grade = "D";
                title = "Miscarriage of Justice - The Wrong Accusation";
                epilogue = "Your accusation crumbled under the district attorney's examination. The true killer escaped into the night as dawn broke over Hudson Valley.";
            }

            VerdictResultDto verdictResult = new VerdictResultDto(
                    isFullWin,
                    grade,
                    title,
                    epilogue,
                    correctCount,
                    formatTime(LocalTime.now()),
                    request.getPlayerId()
            );

            // Lock room permanently
            room.setStatus("COMPLETED");
            room.setVerdictResult(verdictResult);

            Map<String, Object> event = new LinkedHashMap<>();
            event.put("id", "evt_" + System.currentTimeMillis());
            event.put("time", "06:00 AM");
            event.put("category", "VERDICT");
            event.put("text", "⚖️ Final cooperative verdict delivered by the room. Result: Grade " + grade + " (" + title + ").");
            room.getJournalEvents().add(0, event);

            return verdictResult;
        } finally {
            lock.unlock();
        }
    }

    @Transactional
    public RoomResponse addSimulatedTeammate(String roomCode) {
        String formattedCode = roomCode.trim().toUpperCase();
        ReentrantLock lock = getRoomLock(formattedCode);
        lock.lock();
        try {
            RoomResponse room = getRoomState(formattedCode);

            if (room.getPlayers().size() >= 4) {
                return room;
            }

            String[][] simulatedPartners = {
                { "Agent Miller", "🕵️‍♀️" },
                { "Inspector Graves", "🎩" },
                { "Detective O'Connor", "🔍" }
            };

            String partnerName = null;
            String partnerAvatar = null;
            for (String[] partner : simulatedPartners) {
                boolean alreadyInRoom = room.getPlayers().stream().anyMatch(p -> p.getName().equalsIgnoreCase(partner[0]));
                if (!alreadyInRoom) {
                    partnerName = partner[0];
                    partnerAvatar = partner[1];
                    break;
                }
            }

            if (partnerName == null) {
                return room;
            }

            String partnerId = "sim_" + System.currentTimeMillis();
            RoomResponse.PlayerDto partnerDto = new RoomResponse.PlayerDto(
                    partnerId,
                    partnerName,
                    partnerAvatar,
                    false,
                    true,
                    "conservatory",
                    formatTime(LocalTime.now())
            );

            room.getPlayers().add(partnerDto);

            Map<String, Object> event = new LinkedHashMap<>();
            event.put("id", "evt_" + System.currentTimeMillis());
            event.put("time", formatTime(LocalTime.now()));
            event.put("category", "PLAYER");
            event.put("text", partnerName + " has entered the investigation room.");
            room.getJournalEvents().add(0, event);

            playerTokenService.generateToken(formattedCode, partnerId, partnerName, false);

            return room;
        } finally {
            lock.unlock();
        }
    }

    @Transactional
    public RoomResponse resetRoom(String roomCode) {
        String formattedCode = roomCode.trim().toUpperCase();
        ReentrantLock lock = getRoomLock(formattedCode);
        lock.lock();
        try {
            RoomResponse room = getRoomState(formattedCode);

            // Reset investigation status and timer
            room.setStatus("WAITING");
            room.setHoursLeft(6.0);

            // Clear room progress
            room.getDiscoveredEvidenceIds().clear();
            room.getCompletedTaskIds().clear();
            room.getAlibiBrokenSuspectIds().clear();
            room.getExaminedHotspotIds().clear();
            room.setVerdictResult(null);

            // Reset detective locations to default starting scene ('study')
            for (RoomResponse.PlayerDto p : room.getPlayers()) {
                p.setCurrentLocationId("study");
            }

            // Reset journal events to clean restart entry
            room.getJournalEvents().clear();
            Map<String, Object> resetEvent = new LinkedHashMap<>();
            resetEvent.put("id", "evt_" + System.currentTimeMillis());
            resetEvent.put("time", formatTime(LocalTime.now()));
            resetEvent.put("category", "SYSTEM");
            resetEvent.put("text", "Investigation Room " + formattedCode + " has been reopened and reset for Case " + room.getCaseId() + ".");
            room.getJournalEvents().add(resetEvent);

            return room;
        } finally {
            lock.unlock();
        }
    }
}

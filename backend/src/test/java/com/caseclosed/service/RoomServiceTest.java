package com.caseclosed.service;

import com.caseclosed.dto.*;
import com.caseclosed.exception.GameRuleException;
import com.caseclosed.exception.ResourceNotFoundException;
import com.caseclosed.repository.*;
import com.caseclosed.security.PlayerTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock private RoomRepository roomRepository;
    @Mock private RoomPlayerRepository roomPlayerRepository;
    @Mock private RoomEvidenceRepository roomEvidenceRepository;
    @Mock private RoomTaskRepository roomTaskRepository;
    @Mock private RoomEventRepository roomEventRepository;
    @Mock private RoomVerdictRepository roomVerdictRepository;
    @Mock private UserRepository userRepository;
    @Mock private CaseRepository caseRepository;
    @Mock private CaseSolutionRepository caseSolutionRepository;

    private PlayerTokenService playerTokenService;
    private RoomService roomService;

    @BeforeEach
    void setUp() {
        playerTokenService = new PlayerTokenService();
        roomService = new RoomService(
                roomRepository,
                roomPlayerRepository,
                roomEvidenceRepository,
                roomTaskRepository,
                roomEventRepository,
                roomVerdictRepository,
                userRepository,
                caseRepository,
                caseSolutionRepository,
                playerTokenService
        );
    }

    @Test
    void testCreateRoom_Success() {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Lead Detective", "🕵️‍♂️");
        RoomActionResponse res = roomService.createRoom(req);

        assertNotNull(res);
        assertNotNull(res.getRoom());
        assertNotNull(res.getCurrentPlayerId());
        assertEquals("WAITING", res.getRoom().getStatus());
        assertEquals(1, res.getRoom().getPlayers().size());
        assertEquals("Lead Detective", res.getRoom().getPlayers().get(0).getName());
        assertTrue(res.getRoom().getPlayers().get(0).isHost());
    }

    @Test
    void testJoinRoom_CapacityLimitEnforced() {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Host", "🕵️‍♂️");
        RoomActionResponse created = roomService.createRoom(req);
        String roomCode = created.getRoom().getRoomCode();

        roomService.joinRoom(roomCode, new JoinRoomRequest("Player 2", "🔍"));
        roomService.joinRoom(roomCode, new JoinRoomRequest("Player 3", "🔍"));
        roomService.joinRoom(roomCode, new JoinRoomRequest("Player 4", "🔍"));

        // 5th player should be rejected per room capacity constraint (max 4)
        assertThrows(GameRuleException.class, () ->
                roomService.joinRoom(roomCode, new JoinRoomRequest("Player 5", "🔍")));
    }

    @Test
    void testJoinRoom_ConcurrentJoins_CapacityProtection() throws InterruptedException {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Host", "🕵️‍♂️");
        RoomActionResponse created = roomService.createRoom(req);
        String roomCode = created.getRoom().getRoomCode();

        // Attempt 10 simultaneous joins across threads
        int threadCount = 10;
        ExecutorService executor = Executors.newFixedThreadPool(threadCount);
        CountDownLatch latch = new CountDownLatch(1);
        List<Boolean> joinSuccesses = Collections.synchronizedList(new ArrayList<>());

        for (int i = 0; i < threadCount; i++) {
            final String name = "Detective_" + i;
            executor.submit(() -> {
                try {
                    latch.await();
                    roomService.joinRoom(roomCode, new JoinRoomRequest(name, "🔍"));
                    joinSuccesses.add(true);
                } catch (Exception e) {
                    joinSuccesses.add(false);
                }
            });
        }

        latch.countDown();
        executor.shutdown();
        assertTrue(executor.awaitTermination(5, TimeUnit.SECONDS));

        // With 1 host already in room, at most 3 additional players can join successfully
        RoomResponse room = roomService.getRoomState(roomCode);
        assertEquals(4, room.getPlayers().size(), "Room capacity must strictly not exceed 4 detectives");
    }

    @Test
    void testDiscoverEvidence_IdempotencyAndTaskFulfillment() {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Host", "🕵️‍♂️");
        RoomActionResponse created = roomService.createRoom(req);
        String roomCode = created.getRoom().getRoomCode();
        String hostId = created.getCurrentPlayerId();

        // Discover clue_scotch
        DiscoverEvidenceRequest discReq = new DiscoverEvidenceRequest(hostId, "hs_desk", "clue_scotch");
        DiscoverEvidenceResponse res1 = roomService.discoverEvidence(roomCode, discReq, null);

        assertTrue(res1.isClueDiscovered());
        assertTrue(res1.getRoom().getDiscoveredEvidenceIds().contains("clue_scotch"));
        assertTrue(res1.getRoom().getCompletedTaskIds().contains("task_corpse"));

        // Discover again (idempotent test)
        DiscoverEvidenceResponse res2 = roomService.discoverEvidence(roomCode, discReq, null);
        assertFalse(res2.isClueDiscovered()); // Not newly discovered
        assertEquals(1, res2.getRoom().getDiscoveredEvidenceIds().size());
    }

    @Test
    void testConfrontSuspect_PrerequisiteUndiscoveredClue_ThrowsException() {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Host", "🕵️‍♂️");
        RoomActionResponse created = roomService.createRoom(req);
        String roomCode = created.getRoom().getRoomCode();
        String hostId = created.getCurrentPlayerId();

        // Attempt confrontation with clue that was never discovered
        ConfrontSuspectRequest confReq = new ConfrontSuspectRequest(hostId, "clue_vial");
        assertThrows(GameRuleException.class, () ->
                roomService.confrontSuspect(roomCode, "thorne", confReq, null));
    }

    @Test
    void testConfrontSuspect_AlibiBreaking_Success() {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Host", "🕵️‍♂️");
        RoomActionResponse created = roomService.createRoom(req);
        String roomCode = created.getRoom().getRoomCode();
        String hostId = created.getCurrentPlayerId();

        // First discover the clue
        roomService.discoverEvidence(roomCode, new DiscoverEvidenceRequest(hostId, "hs_hearth", "clue_vial"), null);

        // Now confront
        ConfrontSuspectRequest confReq = new ConfrontSuspectRequest(hostId, "clue_vial");
        ConfrontSuspectResponse res = roomService.confrontSuspect(roomCode, "thorne", confReq, null);

        assertTrue(res.isSuccess());
        assertTrue(res.getRoom().getAlibiBrokenSuspectIds().contains("thorne"));
        assertTrue(res.getRoom().getCompletedTaskIds().contains("task_alibi"));
    }

    @Test
    void testSubmitVerdict_UnauthorizedPlayer_ThrowsException() {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Host", "🕵️‍♂️");
        RoomActionResponse created = roomService.createRoom(req);
        String roomCode = created.getRoom().getRoomCode();

        roomService.startInvestigation(roomCode);

        // Non-member player ID
        SubmitVerdictRequest verdictReq = new SubmitVerdictRequest(
                "stranger_danger_id",
                "thorne",
                "poison_scotch",
                "narcotics_blackmail",
                "clue_vial"
        );

        assertThrows(GameRuleException.class, () ->
                roomService.submitCooperativeVerdict(roomCode, verdictReq, null));
    }

    @Test
    void testSubmitVerdict_BeforeInvestigationStarts_ThrowsException() {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Host", "🕵️‍♂️");
        RoomActionResponse created = roomService.createRoom(req);
        String roomCode = created.getRoom().getRoomCode();
        String hostId = created.getCurrentPlayerId();

        // Room is in WAITING status
        SubmitVerdictRequest verdictReq = new SubmitVerdictRequest(
                hostId,
                "thorne",
                "poison_scotch",
                "narcotics_blackmail",
                "clue_vial"
        );

        assertThrows(GameRuleException.class, () ->
                roomService.submitCooperativeVerdict(roomCode, verdictReq, null));
    }

    @Test
    void testSubmitCooperativeVerdict_SingleVerdictRule() {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Host", "🕵️‍♂️");
        RoomActionResponse created = roomService.createRoom(req);
        String roomCode = created.getRoom().getRoomCode();
        String hostId = created.getCurrentPlayerId();

        roomService.startInvestigation(roomCode);

        SubmitVerdictRequest verdictReq = new SubmitVerdictRequest(
                hostId,
                "thorne",
                "poison_scotch",
                "narcotics_blackmail",
                "clue_vial"
        );

        VerdictResultDto result = roomService.submitCooperativeVerdict(roomCode, verdictReq, null);
        assertNotNull(result);
        assertTrue(result.isWin());
        assertEquals("S", result.getGrade());
        assertEquals(4, result.getCorrectCount());

        // Second verdict submission in same room must be rejected
        assertThrows(GameRuleException.class, () ->
                roomService.submitCooperativeVerdict(roomCode, verdictReq, null));
    }

    @Test
    void testJoinRoom_InvalidRoomCode_ThrowsResourceNotFoundException() {
        JoinRoomRequest joinReq = new JoinRoomRequest("Watson", "🔍");
        assertThrows(ResourceNotFoundException.class, () ->
                roomService.joinRoom("CC-9999", joinReq));
    }

    @Test
    void testResetRoom_ClearsInvestigationStateAndPreservesPlayers() {
        CreateRoomRequest req = new CreateRoomRequest("CC-001", "Sherlock", "🕵️‍♂️");
        RoomActionResponse created = roomService.createRoom(req);
        String roomCode = created.getRoom().getRoomCode();
        String hostId = created.getCurrentPlayerId();

        // Join second player
        roomService.joinRoom(roomCode, new JoinRoomRequest("Watson", "🔍"));
        roomService.startInvestigation(roomCode);

        // Discover evidence and mutate state
        roomService.discoverEvidence(roomCode, new DiscoverEvidenceRequest(hostId, "hs_desk", "clue_scotch"), null);
        RoomResponse beforeReset = roomService.getRoomState(roomCode);
        assertEquals(2, beforeReset.getPlayers().size());
        assertEquals(1, beforeReset.getDiscoveredEvidenceIds().size());
        assertEquals("INVESTIGATING", beforeReset.getStatus());

        // Reset room
        RoomResponse afterReset = roomService.resetRoom(roomCode);
        assertEquals(2, afterReset.getPlayers().size(), "Players must be preserved across reset");
        assertEquals(0, afterReset.getDiscoveredEvidenceIds().size(), "Evidence must be cleared");
        assertEquals(0, afterReset.getCompletedTaskIds().size(), "Tasks must be cleared");
        assertEquals(0, afterReset.getAlibiBrokenSuspectIds().size(), "Alibis must be cleared");
        assertEquals(0, afterReset.getExaminedHotspotIds().size(), "Hotspots must be cleared");
        assertNull(afterReset.getVerdictResult(), "Verdict must be cleared");
        assertEquals("WAITING", afterReset.getStatus(), "Status must return to WAITING");
        assertEquals(6.0, afterReset.getHoursLeft(), "Timer must return to 6.0 hours");
    }
}

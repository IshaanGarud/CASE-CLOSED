package com.caseclosed.controller;

import com.caseclosed.dto.*;
import com.caseclosed.service.RoomService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;

    @Autowired
    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    /**
     * 1. Create a new multiplayer room
     * POST /api/rooms
     */
    @PostMapping
    public ResponseEntity<RoomActionResponse> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        RoomActionResponse response = roomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 2. Join an existing room
     * POST /api/rooms/{roomCode}/join
     */
    @PostMapping("/{roomCode}/join")
    public ResponseEntity<RoomActionResponse> joinRoom(
            @PathVariable String roomCode,
            @Valid @RequestBody JoinRoomRequest request) {
        RoomActionResponse response = roomService.joinRoom(roomCode, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 3. Get current room state
     * GET /api/rooms/{roomCode}
     */
    @GetMapping("/{roomCode}")
    public ResponseEntity<RoomResponse> getRoomState(@PathVariable String roomCode) {
        RoomResponse response = roomService.getRoomState(roomCode);
        return ResponseEntity.ok(response);
    }

    /**
     * 4. Start investigation
     * POST /api/rooms/{roomCode}/start
     */
    @PostMapping("/{roomCode}/start")
    public ResponseEntity<RoomResponse> startInvestigation(@PathVariable String roomCode) {
        RoomResponse response = roomService.startInvestigation(roomCode);
        return ResponseEntity.ok(response);
    }

    /**
     * 5. Update player location
     * PUT /api/rooms/{roomCode}/players/{playerId}/location
     */
    @PutMapping("/{roomCode}/players/{playerId}/location")
    public ResponseEntity<RoomResponse> updatePlayerLocation(
            @PathVariable String roomCode,
            @PathVariable String playerId,
            @Valid @RequestBody UpdateLocationRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        RoomResponse response = roomService.updatePlayerLocation(roomCode, playerId, request, authHeader);
        return ResponseEntity.ok(response);
    }

    /**
     * 6. Discover evidence & complete hotspot inspection
     * POST /api/rooms/{roomCode}/evidence
     */
    @PostMapping("/{roomCode}/evidence")
    public ResponseEntity<DiscoverEvidenceResponse> discoverEvidence(
            @PathVariable String roomCode,
            @Valid @RequestBody DiscoverEvidenceRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        DiscoverEvidenceResponse response = roomService.discoverEvidence(roomCode, request, authHeader);
        return ResponseEntity.ok(response);
    }

    /**
     * 7. Confront suspect with evidence (Alibi shattering)
     * POST /api/rooms/{roomCode}/suspects/{suspectId}/confront
     */
    @PostMapping("/{roomCode}/suspects/{suspectId}/confront")
    public ResponseEntity<ConfrontSuspectResponse> confrontSuspect(
            @PathVariable String roomCode,
            @PathVariable String suspectId,
            @Valid @RequestBody ConfrontSuspectRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        ConfrontSuspectResponse response = roomService.confrontSuspect(roomCode, suspectId, request, authHeader);
        return ResponseEntity.ok(response);
    }

    /**
     * 8. Submit cooperative final verdict
     * POST /api/rooms/{roomCode}/verdict
     */
    @PostMapping("/{roomCode}/verdict")
    public ResponseEntity<VerdictResultDto> submitCooperativeVerdict(
            @PathVariable String roomCode,
            @Valid @RequestBody SubmitVerdictRequest request,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        VerdictResultDto response = roomService.submitCooperativeVerdict(roomCode, request, authHeader);
        return ResponseEntity.ok(response);
    }

    /**
     * 9. Add simulated player (for demo testing multiplayer interactions)
     * POST /api/rooms/{roomCode}/simulated-player
     */
    @PostMapping("/{roomCode}/simulated-player")
    public ResponseEntity<RoomResponse> addSimulatedTeammate(@PathVariable String roomCode) {
        RoomResponse response = roomService.addSimulatedTeammate(roomCode);
        return ResponseEntity.ok(response);
    }

    /**
     * 10. Reset investigation room (Reopen and play again)
     * POST /api/rooms/{roomCode}/reset
     */
    @PostMapping("/{roomCode}/reset")
    public ResponseEntity<RoomResponse> resetRoom(@PathVariable String roomCode) {
        RoomResponse response = roomService.resetRoom(roomCode);
        return ResponseEntity.ok(response);
    }
}

package com.caseclosed.model.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "room_players", schema = "public")
public class RoomPlayer {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "room_id", nullable = false)
    private UUID roomId;

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "player_role", nullable = false, length = 20)
    private String playerRole = "PLAYER"; // HOST, PLAYER

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, LEFT, KICKED

    @Column(name = "current_location_id")
    private UUID currentLocationId;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private OffsetDateTime joinedAt = OffsetDateTime.now();

    @Column(name = "last_seen_at")
    private OffsetDateTime lastSeenAt;

    @Column(name = "left_at")
    private OffsetDateTime leftAt;

    public RoomPlayer() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getRoomId() {
        return roomId;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }

    public UUID getCaseId() {
        return caseId;
    }

    public void setCaseId(UUID caseId) {
        this.caseId = caseId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getPlayerRole() {
        return playerRole;
    }

    public void setPlayerRole(String playerRole) {
        this.playerRole = playerRole;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public UUID getCurrentLocationId() {
        return currentLocationId;
    }

    public void setCurrentLocationId(UUID currentLocationId) {
        this.currentLocationId = currentLocationId;
    }

    public OffsetDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(OffsetDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public OffsetDateTime getLastSeenAt() {
        return lastSeenAt;
    }

    public void setLastSeenAt(OffsetDateTime lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }

    public OffsetDateTime getLeftAt() {
        return leftAt;
    }

    public void setLeftAt(OffsetDateTime leftAt) {
        this.leftAt = leftAt;
    }
}

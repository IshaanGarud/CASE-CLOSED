package com.caseclosed.model.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "room_evidence", schema = "public")
@IdClass(RoomEvidence.RoomEvidenceId.class)
public class RoomEvidence {

    @Id
    @Column(name = "room_id", nullable = false)
    private UUID roomId;

    @Id
    @Column(name = "evidence_id", nullable = false)
    private UUID evidenceId;

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(name = "discovered_by_player_id", nullable = false)
    private UUID discoveredByPlayerId;

    @Column(name = "discovered_at", nullable = false, updatable = false)
    private OffsetDateTime discoveredAt = OffsetDateTime.now();

    public RoomEvidence() {}

    public RoomEvidence(UUID roomId, UUID caseId, UUID evidenceId, UUID discoveredByPlayerId) {
        this.roomId = roomId;
        this.caseId = caseId;
        this.evidenceId = evidenceId;
        this.discoveredByPlayerId = discoveredByPlayerId;
        this.discoveredAt = OffsetDateTime.now();
    }

    public UUID getRoomId() {
        return roomId;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }

    public UUID getEvidenceId() {
        return evidenceId;
    }

    public void setEvidenceId(UUID evidenceId) {
        this.evidenceId = evidenceId;
    }

    public UUID getCaseId() {
        return caseId;
    }

    public void setCaseId(UUID caseId) {
        this.caseId = caseId;
    }

    public UUID getDiscoveredByPlayerId() {
        return discoveredByPlayerId;
    }

    public void setDiscoveredByPlayerId(UUID discoveredByPlayerId) {
        this.discoveredByPlayerId = discoveredByPlayerId;
    }

    public OffsetDateTime getDiscoveredAt() {
        return discoveredAt;
    }

    public void setDiscoveredAt(OffsetDateTime discoveredAt) {
        this.discoveredAt = discoveredAt;
    }

    public static class RoomEvidenceId implements Serializable {
        private UUID roomId;
        private UUID evidenceId;

        public RoomEvidenceId() {}

        public RoomEvidenceId(UUID roomId, UUID evidenceId) {
            this.roomId = roomId;
            this.evidenceId = evidenceId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RoomEvidenceId that = (RoomEvidenceId) o;
            return Objects.equals(roomId, that.roomId) && Objects.equals(evidenceId, that.evidenceId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(roomId, evidenceId);
        }
    }
}

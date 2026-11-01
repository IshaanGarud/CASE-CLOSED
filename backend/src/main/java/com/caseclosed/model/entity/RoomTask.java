package com.caseclosed.model.entity;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

@Entity
@Table(name = "room_tasks", schema = "public")
@IdClass(RoomTask.RoomTaskId.class)
public class RoomTask {

    @Id
    @Column(name = "room_id", nullable = false)
    private UUID roomId;

    @Id
    @Column(name = "task_id", nullable = false)
    private UUID taskId;

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(name = "completed_by_player_id")
    private UUID completedByPlayerId;

    @Column(nullable = false, length = 20)
    private String status = "PENDING"; // PENDING, COMPLETED

    @Column(name = "completed_at")
    private OffsetDateTime completedAt;

    public RoomTask() {}

    public RoomTask(UUID roomId, UUID caseId, UUID taskId, UUID completedByPlayerId, String status) {
        this.roomId = roomId;
        this.caseId = caseId;
        this.taskId = taskId;
        this.completedByPlayerId = completedByPlayerId;
        this.status = status;
        if ("COMPLETED".equals(status)) {
            this.completedAt = OffsetDateTime.now();
        }
    }

    public UUID getRoomId() {
        return roomId;
    }

    public void setRoomId(UUID roomId) {
        this.roomId = roomId;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UUID getCaseId() {
        return caseId;
    }

    public void setCaseId(UUID caseId) {
        this.caseId = caseId;
    }

    public UUID getCompletedByPlayerId() {
        return completedByPlayerId;
    }

    public void setCompletedByPlayerId(UUID completedByPlayerId) {
        this.completedByPlayerId = completedByPlayerId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public OffsetDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(OffsetDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public static class RoomTaskId implements Serializable {
        private UUID roomId;
        private UUID taskId;

        public RoomTaskId() {}

        public RoomTaskId(UUID roomId, UUID taskId) {
            this.roomId = roomId;
            this.taskId = taskId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            RoomTaskId that = (RoomTaskId) o;
            return Objects.equals(roomId, that.roomId) && Objects.equals(taskId, that.taskId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(roomId, taskId);
        }
    }
}

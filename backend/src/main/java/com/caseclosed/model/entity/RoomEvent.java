package com.caseclosed.model.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "room_events", schema = "public")
public class RoomEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "room_id", nullable = false)
    private UUID roomId;

    @Column(name = "actor_room_player_id")
    private UUID actorRoomPlayerId;

    @Column(name = "event_type", nullable = false, length = 60)
    private String eventType;

    @Column(columnDefinition = "TEXT")
    private String payload = "{}";

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public RoomEvent() {}

    public RoomEvent(UUID roomId, UUID actorRoomPlayerId, String eventType, String payload) {
        this.roomId = roomId;
        this.actorRoomPlayerId = actorRoomPlayerId;
        this.eventType = eventType;
        this.payload = payload != null ? payload : "{}";
        this.createdAt = OffsetDateTime.now();
    }

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

    public UUID getActorRoomPlayerId() {
        return actorRoomPlayerId;
    }

    public void setActorRoomPlayerId(UUID actorRoomPlayerId) {
        this.actorRoomPlayerId = actorRoomPlayerId;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

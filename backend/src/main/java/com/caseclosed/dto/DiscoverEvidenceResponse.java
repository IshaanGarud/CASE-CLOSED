package com.caseclosed.dto;

public class DiscoverEvidenceResponse {

    private RoomResponse room;
    private boolean clueDiscovered;

    public DiscoverEvidenceResponse() {}

    public DiscoverEvidenceResponse(RoomResponse room, boolean clueDiscovered) {
        this.room = room;
        this.clueDiscovered = clueDiscovered;
    }

    public RoomResponse getRoom() {
        return room;
    }

    public void setRoom(RoomResponse room) {
        this.room = room;
    }

    public boolean isClueDiscovered() {
        return clueDiscovered;
    }

    public void setClueDiscovered(boolean clueDiscovered) {
        this.clueDiscovered = clueDiscovered;
    }
}

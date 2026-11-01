package com.caseclosed.dto;

public class RoomActionResponse {

    private RoomResponse room;
    private String currentPlayerId;

    public RoomActionResponse() {}

    public RoomActionResponse(RoomResponse room, String currentPlayerId) {
        this.room = room;
        this.currentPlayerId = currentPlayerId;
    }

    public RoomResponse getRoom() {
        return room;
    }

    public void setRoom(RoomResponse room) {
        this.room = room;
    }

    public String getCurrentPlayerId() {
        return currentPlayerId;
    }

    public void setCurrentPlayerId(String currentPlayerId) {
        this.currentPlayerId = currentPlayerId;
    }
}

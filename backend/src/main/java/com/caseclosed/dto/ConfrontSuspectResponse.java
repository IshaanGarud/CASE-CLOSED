package com.caseclosed.dto;

public class ConfrontSuspectResponse {

    private RoomResponse room;
    private boolean success;
    private String dialogue;
    private String breakdown;

    public ConfrontSuspectResponse() {}

    public ConfrontSuspectResponse(RoomResponse room, boolean success, String dialogue, String breakdown) {
        this.room = room;
        this.success = success;
        this.dialogue = dialogue;
        this.breakdown = breakdown;
    }

    public RoomResponse getRoom() {
        return room;
    }

    public void setRoom(RoomResponse room) {
        this.room = room;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getDialogue() {
        return dialogue;
    }

    public void setDialogue(String dialogue) {
        this.dialogue = dialogue;
    }

    public String getBreakdown() {
        return breakdown;
    }

    public void setBreakdown(String breakdown) {
        this.breakdown = breakdown;
    }
}

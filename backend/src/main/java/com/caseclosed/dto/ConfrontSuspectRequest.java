package com.caseclosed.dto;

import jakarta.validation.constraints.NotBlank;

public class ConfrontSuspectRequest {

    @NotBlank(message = "Player ID cannot be blank")
    private String playerId;

    @NotBlank(message = "Clue ID cannot be blank")
    private String clueId;

    public ConfrontSuspectRequest() {}

    public ConfrontSuspectRequest(String playerId, String clueId) {
        this.playerId = playerId;
        this.clueId = clueId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getClueId() {
        return clueId;
    }

    public void setClueId(String clueId) {
        this.clueId = clueId;
    }
}

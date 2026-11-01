package com.caseclosed.dto;

import jakarta.validation.constraints.NotBlank;

public class JoinRoomRequest {

    @NotBlank(message = "Player name cannot be blank")
    private String playerName = "Agent";

    private String playerAvatar = "🔍";

    public JoinRoomRequest() {}

    public JoinRoomRequest(String playerName, String playerAvatar) {
        this.playerName = playerName;
        this.playerAvatar = playerAvatar;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getPlayerAvatar() {
        return playerAvatar;
    }

    public void setPlayerAvatar(String playerAvatar) {
        this.playerAvatar = playerAvatar;
    }
}

package com.caseclosed.dto;

import jakarta.validation.constraints.NotBlank;

public class DiscoverEvidenceRequest {

    @NotBlank(message = "Player ID cannot be blank")
    private String playerId;

    private String hotspotId;

    private String clueId;

    public DiscoverEvidenceRequest() {}

    public DiscoverEvidenceRequest(String playerId, String hotspotId, String clueId) {
        this.playerId = playerId;
        this.hotspotId = hotspotId;
        this.clueId = clueId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getHotspotId() {
        return hotspotId;
    }

    public void setHotspotId(String hotspotId) {
        this.hotspotId = hotspotId;
    }

    public String getClueId() {
        return clueId;
    }

    public void setClueId(String clueId) {
        this.clueId = clueId;
    }
}

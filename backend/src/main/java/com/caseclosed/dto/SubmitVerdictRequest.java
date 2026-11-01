package com.caseclosed.dto;

import jakarta.validation.constraints.NotBlank;

public class SubmitVerdictRequest {

    @NotBlank(message = "Player ID cannot be blank")
    private String playerId;

    @NotBlank(message = "Culprit ID cannot be blank")
    private String culpritId;

    private String murderMethodId;
    private String motiveId;
    private String smokingGunId;

    public SubmitVerdictRequest() {}

    public SubmitVerdictRequest(String playerId, String culpritId, String murderMethodId, String motiveId, String smokingGunId) {
        this.playerId = playerId;
        this.culpritId = culpritId;
        this.murderMethodId = murderMethodId;
        this.motiveId = motiveId;
        this.smokingGunId = smokingGunId;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getCulpritId() {
        return culpritId;
    }

    public void setCulpritId(String culpritId) {
        this.culpritId = culpritId;
    }

    public String getMurderMethodId() {
        return murderMethodId;
    }

    public void setMurderMethodId(String murderMethodId) {
        this.murderMethodId = murderMethodId;
    }

    public String getMotiveId() {
        return motiveId;
    }

    public void setMotiveId(String motiveId) {
        this.motiveId = motiveId;
    }

    public String getSmokingGunId() {
        return smokingGunId;
    }

    public void setSmokingGunId(String smokingGunId) {
        this.smokingGunId = smokingGunId;
    }
}

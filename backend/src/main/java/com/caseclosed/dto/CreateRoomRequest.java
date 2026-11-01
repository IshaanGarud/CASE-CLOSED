package com.caseclosed.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateRoomRequest {

    private String caseId = "CC-001";

    @NotBlank(message = "Host player name cannot be blank")
    private String hostPlayerName = "Detective";

    private String hostAvatar = "🕵️‍♂️";

    public CreateRoomRequest() {}

    public CreateRoomRequest(String caseId, String hostPlayerName, String hostAvatar) {
        this.caseId = caseId;
        this.hostPlayerName = hostPlayerName;
        this.hostAvatar = hostAvatar;
    }

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }

    public String getHostPlayerName() {
        return hostPlayerName;
    }

    public void setHostPlayerName(String hostPlayerName) {
        this.hostPlayerName = hostPlayerName;
    }

    public String getHostAvatar() {
        return hostAvatar;
    }

    public void setHostAvatar(String hostAvatar) {
        this.hostAvatar = hostAvatar;
    }
}

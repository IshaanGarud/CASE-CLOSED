package com.caseclosed.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class RoomResponse {

    private String roomCode;
    private String caseId;
    private String status;
    private String createdAt;
    private double hoursLeft = 6.0;
    private List<PlayerDto> players = new ArrayList<>();
    private List<String> discoveredEvidenceIds = new ArrayList<>();
    private List<String> completedTaskIds = new ArrayList<>();
    private List<String> alibiBrokenSuspectIds = new ArrayList<>();
    private List<String> examinedHotspotIds = new ArrayList<>();
    private List<Map<String, Object>> journalEvents = new ArrayList<>();
    private String sharedNotes = "• Storm is severe. Coroner will arrive at dawn (06:00 AM).\n• Examine Julian's private study first for physical traces.";
    private VerdictResultDto verdictResult;

    public RoomResponse() {}

    public String getRoomCode() {
        return roomCode;
    }

    public void setRoomCode(String roomCode) {
        this.roomCode = roomCode;
    }

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public double getHoursLeft() {
        return hoursLeft;
    }

    public void setHoursLeft(double hoursLeft) {
        this.hoursLeft = hoursLeft;
    }

    public List<PlayerDto> getPlayers() {
        return players;
    }

    public void setPlayers(List<PlayerDto> players) {
        this.players = players;
    }

    public List<String> getDiscoveredEvidenceIds() {
        return discoveredEvidenceIds;
    }

    public void setDiscoveredEvidenceIds(List<String> discoveredEvidenceIds) {
        this.discoveredEvidenceIds = discoveredEvidenceIds;
    }

    public List<String> getCompletedTaskIds() {
        return completedTaskIds;
    }

    public void setCompletedTaskIds(List<String> completedTaskIds) {
        this.completedTaskIds = completedTaskIds;
    }

    public List<String> getAlibiBrokenSuspectIds() {
        return alibiBrokenSuspectIds;
    }

    public void setAlibiBrokenSuspectIds(List<String> alibiBrokenSuspectIds) {
        this.alibiBrokenSuspectIds = alibiBrokenSuspectIds;
    }

    public List<String> getExaminedHotspotIds() {
        return examinedHotspotIds;
    }

    public void setExaminedHotspotIds(List<String> examinedHotspotIds) {
        this.examinedHotspotIds = examinedHotspotIds;
    }

    public List<Map<String, Object>> getJournalEvents() {
        return journalEvents;
    }

    public void setJournalEvents(List<Map<String, Object>> journalEvents) {
        this.journalEvents = journalEvents;
    }

    public String getSharedNotes() {
        return sharedNotes;
    }

    public void setSharedNotes(String sharedNotes) {
        this.sharedNotes = sharedNotes;
    }

    public VerdictResultDto getVerdictResult() {
        return verdictResult;
    }

    public void setVerdictResult(VerdictResultDto verdictResult) {
        this.verdictResult = verdictResult;
    }

    public static class PlayerDto {
        private String id;
        private String name;
        private String avatar;
        private boolean isHost;
        private boolean isOnline;
        private String currentLocationId;
        private String joinedAt;

        public PlayerDto() {}

        public PlayerDto(String id, String name, String avatar, boolean isHost, boolean isOnline, String currentLocationId, String joinedAt) {
            this.id = id;
            this.name = name;
            this.avatar = avatar;
            this.isHost = isHost;
            this.isOnline = isOnline;
            this.currentLocationId = currentLocationId;
            this.joinedAt = joinedAt;
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getAvatar() {
            return avatar;
        }

        public void setAvatar(String avatar) {
            this.avatar = avatar;
        }

        public boolean isHost() {
            return isHost;
        }

        public void setHost(boolean host) {
            isHost = host;
        }

        public boolean isOnline() {
            return isOnline;
        }

        public void setOnline(boolean online) {
            isOnline = online;
        }

        public String getCurrentLocationId() {
            return currentLocationId;
        }

        public void setCurrentLocationId(String currentLocationId) {
            this.currentLocationId = currentLocationId;
        }

        public String getJoinedAt() {
            return joinedAt;
        }

        public void setJoinedAt(String joinedAt) {
            this.joinedAt = joinedAt;
        }
    }
}

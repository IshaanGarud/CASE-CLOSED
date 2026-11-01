package com.caseclosed.model.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "room_verdicts", schema = "public")
public class RoomVerdict {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "room_id", nullable = false, unique = true)
    private UUID roomId;

    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(name = "submitted_by_player_id", nullable = false)
    private UUID submittedByPlayerId;

    @Column(name = "selected_suspect_id", nullable = false)
    private UUID selectedSuspectId;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "evaluation_feedback", columnDefinition = "TEXT")
    private String evaluationFeedback;

    @Column(name = "submitted_at", nullable = false, updatable = false)
    private OffsetDateTime submittedAt = OffsetDateTime.now();

    @Column(name = "evaluated_at")
    private OffsetDateTime evaluatedAt;

    public RoomVerdict() {}

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

    public UUID getCaseId() {
        return caseId;
    }

    public void setCaseId(UUID caseId) {
        this.caseId = caseId;
    }

    public UUID getSubmittedByPlayerId() {
        return submittedByPlayerId;
    }

    public void setSubmittedByPlayerId(UUID submittedByPlayerId) {
        this.submittedByPlayerId = submittedByPlayerId;
    }

    public UUID getSelectedSuspectId() {
        return selectedSuspectId;
    }

    public void setSelectedSuspectId(UUID selectedSuspectId) {
        this.selectedSuspectId = selectedSuspectId;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean correct) {
        isCorrect = correct;
    }

    public String getEvaluationFeedback() {
        return evaluationFeedback;
    }

    public void setEvaluationFeedback(String evaluationFeedback) {
        this.evaluationFeedback = evaluationFeedback;
    }

    public OffsetDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(OffsetDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public OffsetDateTime getEvaluatedAt() {
        return evaluatedAt;
    }

    public void setEvaluatedAt(OffsetDateTime evaluatedAt) {
        this.evaluatedAt = evaluatedAt;
    }
}

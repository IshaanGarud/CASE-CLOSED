package com.caseclosed.model.entity;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "case_solutions", schema = "private")
public class CaseSolution {

    @Id
    @Column(name = "case_id", nullable = false)
    private UUID caseId;

    @Column(name = "correct_suspect_id", nullable = false)
    private UUID correctSuspectId;

    @Column(name = "solution_explanation", nullable = false, columnDefinition = "TEXT")
    private String solutionExplanation;

    @Column(name = "solution_data", columnDefinition = "TEXT")
    private String solutionData = "{}";

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public CaseSolution() {}

    public UUID getCaseId() {
        return caseId;
    }

    public void setCaseId(UUID caseId) {
        this.caseId = caseId;
    }

    public UUID getCorrectSuspectId() {
        return correctSuspectId;
    }

    public void setCorrectSuspectId(UUID correctSuspectId) {
        this.correctSuspectId = correctSuspectId;
    }

    public String getSolutionExplanation() {
        return solutionExplanation;
    }

    public void setSolutionExplanation(String solutionExplanation) {
        this.solutionExplanation = solutionExplanation;
    }

    public String getSolutionData() {
        return solutionData;
    }

    public void setSolutionData(String solutionData) {
        this.solutionData = solutionData;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

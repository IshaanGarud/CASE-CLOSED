package com.caseclosed.dto;

public class VerdictResultDto {

    private boolean isWin;
    private String grade;
    private String title;
    private String epilogue;
    private int correctCount;
    private String submittedAt;
    private String submittedByPlayerId;

    public VerdictResultDto() {}

    public VerdictResultDto(boolean isWin, String grade, String title, String epilogue, int correctCount, String submittedAt, String submittedByPlayerId) {
        this.isWin = isWin;
        this.grade = grade;
        this.title = title;
        this.epilogue = epilogue;
        this.correctCount = correctCount;
        this.submittedAt = submittedAt;
        this.submittedByPlayerId = submittedByPlayerId;
    }

    public boolean isWin() {
        return isWin;
    }

    public void setWin(boolean win) {
        isWin = win;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getEpilogue() {
        return epilogue;
    }

    public void setEpilogue(String epilogue) {
        this.epilogue = epilogue;
    }

    public int getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(int correctCount) {
        this.correctCount = correctCount;
    }

    public String getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getSubmittedByPlayerId() {
        return submittedByPlayerId;
    }

    public void setSubmittedByPlayerId(String submittedByPlayerId) {
        this.submittedByPlayerId = submittedByPlayerId;
    }
}

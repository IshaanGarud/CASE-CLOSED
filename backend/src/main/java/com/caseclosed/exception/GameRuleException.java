package com.caseclosed.exception;

public class GameRuleException extends RuntimeException {
    public GameRuleException(String message) {
        super(message);
    }
}

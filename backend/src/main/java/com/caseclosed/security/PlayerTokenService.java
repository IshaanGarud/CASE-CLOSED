package com.caseclosed.security;

import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Manages player authentication tokens tied to investigation rooms.
 * Tokens can be passed via HTTP Authorization header (Bearer &lt;token&gt;) or X-Player-Token header.
 * If no token header is provided, the service supports transparent fallback to verified room membership,
 * ensuring zero breakage for the existing frontend while providing cryptographically authenticable sessions.
 */
@Component
public class PlayerTokenService {

    public record PlayerSession(String playerId, String roomCode, String playerName, boolean isHost) {}

    private final Map<String, PlayerSession> tokenStore = new ConcurrentHashMap<>();
    private final Map<String, String> playerToToken = new ConcurrentHashMap<>();
    private final SecureRandom random = new SecureRandom();

    public String generateToken(String roomCode, String playerId, String playerName, boolean isHost) {
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        
        PlayerSession session = new PlayerSession(playerId, roomCode, playerName, isHost);
        tokenStore.put(token, session);
        playerToToken.put(roomCode + ":" + playerId, token);
        return token;
    }

    public PlayerSession validateToken(String token) {
        if (token == null || token.isBlank()) return null;
        if (token.startsWith("Bearer ")) {
            token = token.substring(7).trim();
        }
        return tokenStore.get(token);
    }

    public String getTokenForPlayer(String roomCode, String playerId) {
        return playerToToken.get(roomCode + ":" + playerId);
    }
}

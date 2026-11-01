package com.caseclosed.repository;

import com.caseclosed.model.entity.RoomPlayer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomPlayerRepository extends JpaRepository<RoomPlayer, UUID> {
    List<RoomPlayer> findByRoomId(UUID roomId);
    Optional<RoomPlayer> findByRoomIdAndUserId(UUID roomId, UUID userId);
    long countByRoomId(UUID roomId);
}

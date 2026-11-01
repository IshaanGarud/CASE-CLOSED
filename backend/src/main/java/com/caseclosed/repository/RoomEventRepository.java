package com.caseclosed.repository;

import com.caseclosed.model.entity.RoomEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoomEventRepository extends JpaRepository<RoomEvent, UUID> {
    List<RoomEvent> findByRoomIdOrderByCreatedAtDesc(UUID roomId);
}

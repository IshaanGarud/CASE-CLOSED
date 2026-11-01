package com.caseclosed.repository;

import com.caseclosed.model.entity.RoomVerdict;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomVerdictRepository extends JpaRepository<RoomVerdict, UUID> {
    Optional<RoomVerdict> findByRoomId(UUID roomId);
    boolean existsByRoomId(UUID roomId);
}

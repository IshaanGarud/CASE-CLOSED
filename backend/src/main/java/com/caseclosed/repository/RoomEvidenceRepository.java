package com.caseclosed.repository;

import com.caseclosed.model.entity.RoomEvidence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface RoomEvidenceRepository extends JpaRepository<RoomEvidence, RoomEvidence.RoomEvidenceId> {
    List<RoomEvidence> findByRoomId(UUID roomId);
    boolean existsByRoomIdAndEvidenceId(UUID roomId, UUID evidenceId);
}

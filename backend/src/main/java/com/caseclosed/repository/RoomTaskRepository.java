package com.caseclosed.repository;

import com.caseclosed.model.entity.RoomTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface RoomTaskRepository extends JpaRepository<RoomTask, RoomTask.RoomTaskId> {
    List<RoomTask> findByRoomId(UUID roomId);
    Optional<RoomTask> findByRoomIdAndTaskId(UUID roomId, UUID taskId);
}

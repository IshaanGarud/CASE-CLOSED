package com.caseclosed.repository;

import com.caseclosed.model.entity.Case;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CaseRepository extends JpaRepository<Case, UUID> {
}

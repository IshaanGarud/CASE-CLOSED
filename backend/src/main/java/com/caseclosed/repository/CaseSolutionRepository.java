package com.caseclosed.repository;

import com.caseclosed.model.entity.CaseSolution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CaseSolutionRepository extends JpaRepository<CaseSolution, UUID> {
    Optional<CaseSolution> findByCaseId(UUID caseId);
}

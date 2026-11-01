# CASE CLOSED — Overall Development Roadmap & Workflow

This document defines the 10-phase roadmap for CASE CLOSED, specifying deliverables, prerequisites, and completion criteria for each phase.

---

### Phase 1: Repository & Architecture Audit
- **Status:** **COMPLETE** (2026-11-01)
- **Deliverables:** Read-only audit report covering directory tree, Git status, build tool verification, schema review, and dependency analysis.
- **Criteria:** No modifications to existing files. Both frontend and backend compile cleanly.

---

### Phase 2: Backend API Implementation
- **Status:** **COMPLETE** (2026-11-01)
- **Deliverables:** REST controllers, request/response DTOs, and room services matching `apiService.js` in Stella's frontend.
- **Criteria:** Endpoints respond with expected schemas. Zero changes made to frontend files.

---

### Phase 3: Backend Security, Concurrency & Schema Review
- **Status:** **COMPLETE** (2026-11-01)
- **Deliverables:** 
  - Token-based room player authentication via `PlayerTokenService` (with backward compatibility).
  - Per-room concurrency locks (`ReentrantLock`) preventing race conditions during room joins (4-player capacity), evidence discovery, and verdict submissions.
  - Complete JPA entity mapping (`User`, `Case`, `Room`, `RoomPlayer`, `RoomEvidence`, `RoomTask`, `RoomEvent`, `RoomVerdict`, `Location`, `Suspect`, `Evidence`, `Task`, `CaseSolution`).
  - Unit test suite (`RoomServiceTest`) covering concurrency, capacity, idempotency, and verdict uniqueness (9/9 passed).
  - Persistent documentation suite created (`PROJECT_STATE.md`, `WORKFLOW.md`, `CHANGELOG.md`, `docs/api-contract.md`, `docs/technical-decisions.md`).
- **Criteria:** `.\mvnw.cmd test -Dtest=RoomServiceTest` builds and passes cleanly.

---

### Phase 4: Local PostgreSQL Integration Testing
- **Status:** **PLANNED**
- **Prerequisites:** Phase 3 complete.
- **Deliverables:**
  - Test profile or Testcontainers setup executing migrations 1 & 2 against a clean local PostgreSQL database.
  - Integration tests verifying JPA repository CRUD, constraints, foreign keys, and transaction rollbacks.
- **Completion Criteria:** All repository and entity mappings verified against a live PostgreSQL instance with zero errors.

---

### Phase 5: Supabase Migration Validation & Deployment Approval
- **Status:** **PLANNED**
- **Prerequisites:** Phase 4 complete and team design approval for CC-001 content.
- **Deliverables:**
  - Review of schema improvements and additive migration script (e.g. `updated_at` triggers).
  - Explicit sign-off from Ishaan and Masood.
  - Rollback and backup plan before execution.
- **Completion Criteria:** Migrations deployed to remote Supabase with application tables verified.

---

### Phase 6: Database-Backed API Integration
- **Status:** **PLANNED**
- **Prerequisites:** Phase 5 complete.
- **Deliverables:**
  - Transition `RoomService` from memory cache fallback to direct transactional JPA persistence against PostgreSQL.
  - Seed database with approved CC-001 cases, locations, suspects, evidence, and private solution.
- **Completion Criteria:** Endpoints read and write directly to PostgreSQL.

---

### Phase 7: Frontend-Backend End-to-End Testing
- **Status:** **PLANNED**
- **Prerequisites:** Phase 6 complete.
- **Deliverables:**
  - Run Vite dev server with `VITE_USE_MOCK_DATA=false` connected to `http://localhost:8080/api`.
  - Validate end-to-end user flows in browser: lobby creation, joining, map navigation, clue discovery, suspect interrogation, and verdict submission.
- **Completion Criteria:** Complete investigation workflow successfully played and recorded.

---

### Phase 8: Realtime Integration
- **Status:** **PLANNED**
- **Prerequisites:** Phase 7 complete.
- **Deliverables:**
  - Coordinate WebSocket / Supabase Realtime event emission from Spring Boot backend (`room_events`).
  - Connect `realtimeService.js` in frontend to backend event channel.
- **Completion Criteria:** Multi-browser investigation state updates synchronously in real time without page reload.

---

### Phase 9: Final Multiplayer Stress & Edge Case Testing
- **Status:** **PLANNED**
- **Prerequisites:** Phase 8 complete.
- **Deliverables:**
  - Multi-client concurrency tests, reconnection resilience, and edge case validation (timeouts, network drops).
- **Completion Criteria:** Stable 4-player cooperative investigation without desynchronization.

---

### Phase 10: Project Documentation & Delivery
- **Status:** **PLANNED**
- **Prerequisites:** Phase 9 complete.
- **Deliverables:**
  - Final project report, architecture documentation, presentation slides, and demonstration instructions.
- **Completion Criteria:** Academic requirements satisfied and code packaged.

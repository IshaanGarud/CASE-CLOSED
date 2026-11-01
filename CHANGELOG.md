# CASE CLOSED — Chronological Changelog

All notable technical changes, fixes, and architecture implementations are documented in this file.

---

## [2026-11-01] — Session 5: Invalid Room Rejection, Room Reset & Gameplay Guidance

### Problems Addressed:
1. **Invalid Room Code Rejection (Priority 1):** Joining with nonexistent room codes previously triggered auto-room creation in `RoomService.java` or mock fallbacks in `apiService.js`, generating fabricated sessions.
2. **Reopen & Play Again / Room Reset (Priority 2):** "Reopen & Play Again" previously called `createRoom` with a default mock host in `App.jsx`, failing to reset the actual room or clear evidence on the backend.
3. **Gameplay UX Guidance (Priority 3):** First-time players had difficulty knowing what actions to take next across lobby, map, suspects, and verdict.

### Created / Modified Files:
- `backend/src/main/java/com/caseclosed/service/RoomService.java` (MODIFIED: removed join auto-creation, throw `ResourceNotFoundException`; added `resetRoom(String roomCode)`)
- `backend/src/main/java/com/caseclosed/controller/RoomController.java` (MODIFIED: added `POST /api/rooms/{roomCode}/reset`)
- `backend/src/main/java/com/caseclosed/exception/GlobalExceptionHandler.java` (MODIFIED: return `code: "ROOM_NOT_FOUND"`)
- `backend/src/test/java/com/caseclosed/service/RoomServiceTest.java` (MODIFIED: added unit tests for invalid room rejection and room reset; 11/11 tests pass)
- `frontend/Blackwood_Manor_Detective_Game/src/services/apiService.js` (MODIFIED: removed mock fallback on join failure, added `resetRoom(roomCode)`)
- `frontend/Blackwood_Manor_Detective_Game/src/App.jsx` (MODIFIED: wired `handleResetInvestigation` to `apiService.resetRoom`, added `DetectiveGuidance`)
- `frontend/Blackwood_Manor_Detective_Game/src/components/DetectiveGuidance.jsx` (CREATED: contextual guidance element based on room/case state)
- `frontend/Blackwood_Manor_Detective_Game/src/components/MultiplayerLobby.jsx` (MODIFIED: clarified 2-player requirement and host launch duties)
- `docs/api-contract.md` (MODIFIED: documented Section 2.10 `POST /api/rooms/{roomCode}/reset` and `ROOM_NOT_FOUND`)
- `docs/technical-decisions.md` (MODIFIED: added Decisions 6 and 7)
- `WORKFLOW.md` (MODIFIED: updated Phase 4 verification status)
- `PROJECT_STATE.md` (MODIFIED: updated verification status and test results)

### Multi-Browser Test Results:
- **Test A (Valid Room):** Browser A created `CC-3838` as `Dupin`, Browser B joined with `CC-3838` as `Watson`. Both saw identical roster (`Dupin`, `Agent Miller`, `Watson`).
- **Test B (Invalid Room):** Nonexistent code `CC-9999` returned HTTP 404 with `code: "ROOM_NOT_FOUND"`. No room or fake players created.
- **Test C (Reset):** Room `CC-3838` with 5/5 evidence reset via `POST /api/rooms/CC-3838/reset`. Evidence cleared to `0/5`, status to `WAITING`, hours to `6.0`, players preserved at `study`.
- **Test D (Multiplayer Regression):** Backend polling (2.5s) and `sessionStorage` isolation intact. All 12 backend tests pass in `.\mvnw.cmd clean test`. Frontend builds cleanly with zero errors.

---

## [2026-11-01] — Session 4: Multiplayer State Synchronization & Room Membership Fix

### Root Cause of Inconsistency:
- In two-browser testing, both browsers showed room `CC-3968` but completely different detective rosters ("Lavda & Agent Miller" vs "Detective Vance & Puchimaare").
- **Root Cause 1:** The frontend was missing a `.env` file; Vite defaulted `VITE_USE_MOCK_DATA` to `true`. Both browsers were operating in isolated browser `localStorage` mock stores rather than communicating with the Spring Boot backend.
- **Root Cause 2:** The "Add Demo Partner" feature was implemented purely client-side in `apiService.js` without any backend API endpoint, generating local mock detectives invisible to any other browser.
- **Root Cause 3:** `App.jsx` only received state updates via client-side `BroadcastChannel`, which did not bridge across separate browsers, and had no backend polling loop.

### Created / Modified Files:
- `frontend/Blackwood_Manor_Detective_Game/.env` (CREATED: `VITE_API_BASE_URL=http://localhost:8080/api`, `VITE_USE_MOCK_DATA=false`)
- `backend/src/main/java/com/caseclosed/service/RoomService.java` (MODIFIED: added thread-safe `addSimulatedTeammate(String roomCode)` method)
- `backend/src/main/java/com/caseclosed/controller/RoomController.java` (MODIFIED: added `POST /api/rooms/{roomCode}/simulated-player`)
- `frontend/Blackwood_Manor_Detective_Game/src/services/apiService.js` (MODIFIED: updated `addSimulatedTeammate` to invoke `POST /api/rooms/{roomCode}/simulated-player`)
- `frontend/Blackwood_Manor_Detective_Game/src/App.jsx` (MODIFIED: tab-isolated session management, removed auto-join on startup, added 2.5s polling loop against `apiService.getRoomState`)
- `frontend/Blackwood_Manor_Detective_Game/src/components/MultiplayerLobby.jsx` (MODIFIED: proper tab synchronization with active room)
- `frontend/Blackwood_Manor_Detective_Game/src/components/Header.jsx` (MODIFIED: added Lobby navigation tab)
- `docs/api-contract.md` (MODIFIED: documented `POST /api/rooms/{roomCode}/simulated-player`)
- `PROJECT_STATE.md` (MODIFIED: updated verification status and testing results)

### Multi-Browser Test Results:
- **Browser A (Sherlock):** Created room `CC-3504`, clicked "+ Add Demo Partner" to add `Agent Miller`. Investigated The Private Study and discovered `Poisoned Crystal Tumbler` (1/5 evidence).
- **Browser B (Watson):** Loaded `http://localhost:5173/`, displayed clean entry screen, joined `CC-3504` as `Watson`.
- **Verified Cross-Browser Synchronization:**
  1. `GET /api/rooms/CC-3504` returned identical roster to both: `Sherlock`, `Agent Miller`, and `Watson` (3 detectives).
  2. Evidence counter synchronized to `1 / 5` in Browser B without manual refresh.
  3. Shared Evidence Archive in Browser B displayed `Poisoned Crystal Tumbler` unlocked.

---

## [2026-11-01] — Session 3: Standalone Local Demo Mode & Runnable Launchers

### Created / Modified Files:
- `backend/src/main/resources/application-local.properties` (CREATED)
- `backend/pom.xml` (MODIFIED: added isolated `com.h2database:h2` runtime dependency)
- `start-backend.ps1` (CREATED)
- `start-frontend.ps1` (CREATED)
- `start-case-closed.ps1` (CREATED)
- `README.md` (MODIFIED)
- `PROJECT_STATE.md` (MODIFIED)
- `docs/technical-decisions.md` (MODIFIED)

### Features & Execution Fixes:
- **Standalone Local Demo Profile:** Created `application-local.properties` providing an isolated in-memory H2 database with `INIT=CREATE SCHEMA IF NOT EXISTS private`. Allows complete local execution and frontend-backend connectivity without needing external Supabase credentials or database deployment.
- **PowerShell Launch Scripts:** Added `start-backend.ps1`, `start-frontend.ps1`, and `start-case-closed.ps1` in root with prerequisite validation (checking Java, Maven Wrapper, and Node.js).
- **HTTP Workflow Demonstration:** Verified complete end-to-end HTTP investigation workflow against running backend on port 8080 (room creation, joining, starting, location change, evidence discovery, alibi confrontation, and final cooperative verdict).
- **Authentication & Concurrency Clarity:** Documented honest limitations regarding local demo authentication (room membership validation vs. cryptographic caller proof) and single-JVM in-memory locks vs. database-level constraints.

### Test Results:
- `.\mvnw.cmd clean test`: 10 tests run, 0 failures, 0 errors in 20.3s (`BUILD SUCCESS`).
- `npm run build`: Frontend compiled cleanly in 3.10s.
- `Frontend files changed`: **0 (Zero)**.

---

## [2026-11-01] — Session 2: Security Review, Concurrency Hardening & Schema Alignment

### Created / Modified Files:
- `backend/src/main/java/com/caseclosed/security/PlayerTokenService.java` (CREATED)
- `backend/src/main/java/com/caseclosed/model/entity/Location.java` (CREATED)
- `backend/src/main/java/com/caseclosed/model/entity/Suspect.java` (CREATED)
- `backend/src/main/java/com/caseclosed/model/entity/Evidence.java` (CREATED)
- `backend/src/main/java/com/caseclosed/model/entity/Task.java` (CREATED)
- `backend/src/main/java/com/caseclosed/model/entity/CaseSolution.java` (CREATED)
- `backend/src/main/java/com/caseclosed/repository/CaseSolutionRepository.java` (CREATED)
- `backend/src/main/java/com/caseclosed/service/RoomService.java` (MODIFIED)
- `backend/src/main/java/com/caseclosed/controller/RoomController.java` (MODIFIED)
- `backend/src/test/java/com/caseclosed/service/RoomServiceTest.java` (MODIFIED)
- `AGENTS.md` (MODIFIED)
- `PROJECT_STATE.md` (CREATED)
- `WORKFLOW.md` (CREATED)
- `CHANGELOG.md` (CREATED)
- `docs/api-contract.md` (CREATED)
- `docs/technical-decisions.md` (CREATED)

---

## [2026-11-01] — Session 1: Backend-First REST Integration & Domain Architecture

### Created Files:
- `backend/src/main/java/com/caseclosed/config/SecurityConfig.java`
- `backend/src/main/java/com/caseclosed/controller/RoomController.java`
- `backend/src/main/java/com/caseclosed/service/RoomService.java`
- `backend/src/main/java/com/caseclosed/dto/*` (11 DTOs)
- `backend/src/main/java/com/caseclosed/model/entity/*`
- `backend/src/main/java/com/caseclosed/repository/*`
- `backend/src/main/java/com/caseclosed/exception/*`
- `backend/src/test/java/com/caseclosed/service/RoomServiceTest.java`

# CASE CLOSED — Technical Architecture Decisions

This document logs significant technical decisions, alternatives evaluated, and underlying architectural rationale.

---

## 1. Zero Frontend Modifications Architecture

- **Context:** Stella's frontend (`frontend/Blackwood_Manor_Detective_Game/`) was designed and tested independently. The user instructed: *do not modify, create, delete, rename, reformat, or overwrite any file inside `frontend/`*.
- **Decision:** Build backend REST controllers, DTO schemas, and response envelopes strictly around the expectations of `apiService.js`.
- **Alternatives Considered:** Refactoring frontend API models to use snake_case or different endpoints. Rejected to respect strict project boundaries.

---

## 2. Authentication Strategy for Preserved Frontend

- **Context:** The existing frontend passes `playerId` in JSON bodies and does not include an `Authorization` header by default. Trusting an unverified client-provided `playerId` introduces security vulnerabilities.
- **Decision:**
  - Introduce `PlayerTokenService` which creates cryptographically secure tokens on room creation and joining.
  - Implement a dual-mode authorization check in `RoomService.validateRoomMembership`:
    1. If `Authorization: Bearer <token>` is present, it validates token identity and room scope.
    2. If omitted, it enforces membership by verifying that the requesting `playerId` is an active player registered in the targeted room.
  - Reject requests from arbitrary non-member IDs.
- **Future Improvement:** When frontend modifications are authorized, update `apiService.js` to store and pass the bearer token in headers.

---

## 3. Concurrency Protection Model

- **Context:** In multiplayer sessions, race conditions can occur if multiple players join at the same moment, discover clues simultaneously, or attempt double verdict submissions.
- **Decision:**
  - Utilize per-room `ReentrantLock` instances in `RoomService` for critical operations (`joinRoom`, `discoverEvidence`, `confrontSuspect`, `submitCooperativeVerdict`).
  - At the database level, rely on PostgreSQL constraints (`UNIQUE (room_id)` on `room_verdicts`, composite primary key on `room_evidence`, and `room_players` constraints).
- **Outcome:** Capacity limit (max 4 players), idempotency, and single verdict submission are strictly guaranteed even under high concurrent load.

---

## 4. Separation of Private Solution Data

- **Context:** `private.case_solutions` holds the authoritative mystery solution. Unprivileged or untrusted clients must never see this table.
- **Decision:**
  - PostgreSQL schema isolates it under `private`.
  - JPA entity `CaseSolution` is mapped under schema `private`.
  - Spring Boot performs evaluation server-side and only returns outcome feedback (grade, title, narrative epilogue) to the client. No solution data is serialized into client DTOs.

---

## 5. Hibernate DDL Management

- **Context:** Hibernate auto-generation (`ddl-auto=create/update`) can alter existing PostgreSQL schema or break Supabase permissions.
- **Decision:** Explicitly set `spring.jpa.hibernate.ddl-auto=none` and `spring.sql.init.mode=never`. All schema evolution is managed through versioned SQL migrations in `supabase/migrations/`.

---

## 6. Authoritative Room Existence & Rejection Contract
- **Context:** Previous mock fallback automatically created a room or fabricated player state when an arbitrary nonexistent code was supplied.
- **Decision:**
  - `joinRoom` throws `ResourceNotFoundException` with `code: "ROOM_NOT_FOUND"` and HTTP 404 if the room code is not in active memory/database.
  - `apiService.js` strictly raises `ROOM_NOT_FOUND` errors to the UI and never creates mock rooms or player rosters upon API lookup failures.

---

## 7. Room-Scoped Reset Protocol
- **Context:** "Reopen and Play Again" previously created a fresh room with default mock host or failed to clear evidence.
- **Decision:**
  - Implemented `POST /api/rooms/{roomCode}/reset` under per-room `ReentrantLock`.
  - Clears mutable game state (`discoveredEvidenceIds`, `completedTaskIds`, `alibiBrokenSuspectIds`, `examinedHotspotIds`, `verdictResult`), restores `hoursLeft = 6.0` and `status = WAITING`, moves all currently connected detectives back to `"study"`, and logs a clean reset event in the journal.
  - State propagates synchronously to all players via the 2.5s polling loop without requiring room re-creation.


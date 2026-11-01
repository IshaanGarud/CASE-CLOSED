# CASE CLOSED — Antigravity Project Handoff

> Project: CASE CLOSED — Interactive Mystery Investigation Platform  
> Academic project: Java Miniproject 2026  
> Handoff owner: Ishaan (backend / integration)  
> Last updated: 2026-11-01

---

## 1. MANDATORY INSTRUCTIONS FOR ANY NEW AI CODING AGENT

**CRITICAL RULE BEFORE WRITING CODE:**
You MUST read [PROJECT_STATE.md](file:///c:/Users/Ishaan/Desktop/Programming/Java-Miniproject/PROJECT_STATE.md) and [WORKFLOW.md](file:///c:/Users/Ishaan/Desktop/Programming/Java-Miniproject/WORKFLOW.md) completely before modifying, creating, or deleting code.

- **Frontend Preservation:** NEVER modify, delete, rename, reformat, or overwrite ANY file inside `frontend/Blackwood_Manor_Detective_Game/`. Frontend files changed MUST ALWAYS BE ZERO.
- **Database Safety:** Do NOT deploy migrations to remote Supabase or execute destructive DDL commands without explicit user approval. Keep `spring.jpa.hibernate.ddl-auto=none`.
- **Narrative Protection:** Do NOT invent game content, mystery facts, culprit identities, or solutions. Content must be designed and approved by the team.
- **Cross-Account Continuity:** Keep documentation strictly updated in [PROJECT_STATE.md](file:///c:/Users/Ishaan/Desktop/Programming/Java-Miniproject/PROJECT_STATE.md), [CHANGELOG.md](file:///c:/Users/Ishaan/Desktop/Programming/Java-Miniproject/CHANGELOG.md), [docs/api-contract.md](file:///c:/Users/Ishaan/Desktop/Programming/Java-Miniproject/docs/api-contract.md), and [docs/technical-decisions.md](file:///c:/Users/Ishaan/Desktop/Programming/Java-Miniproject/docs/technical-decisions.md).

---

## 2. Product Overview and Agreed Design

CASE CLOSED is a cooperative multiplayer detective mystery platform. Players investigate pre-designed fictional cases by exploring locations, examining evidence, questioning suspects/witnesses, completing tasks, connecting clues, and submitting one cooperative verdict per room.

- **Investigation style:** Hybrid — interactive map plus dedicated location screens, suspect dossiers, evidence archive, tasks, and case journal.
- **Evidence discovery:** Shared at room level.
- **Task completion:** Shared at room level.
- **Exploration:** Players may independently explore different locations.
- **Room capacity:** Exactly 2–4 players.
- **Verdict:** One cooperative verdict per room.
- **Content:** Case CC-001 contains exactly 3 locations, 3 suspects, 5 evidence items, tasks, dialogues, and 1 logically consistent solution.

---

## 3. Team Ownership Boundaries

- **Ishaan — Backend & Integration:** Spring Boot APIs, Spring Security/authentication, business rules, concurrency control, verdict evaluation, database JPA mapping, frontend API contracts.
- **Masood — Database:** PostgreSQL schema, migrations, constraints, indexes, seed data, documentation, and RLS/Realtime preparation.
- **Stella — Frontend:** React UI/UX, investigation map, suspect profiles, evidence archive, tasks, journal, lobby, client-side API/Realtime integration.

---

## 4. Repository Layout

```text
Java-Miniproject/
├── .git/
├── .gitignore
├── AGENTS.md                 # Permanent project instructions & rules
├── PROJECT_STATE.md          # Current verified implementation status & next tasks
├── WORKFLOW.md               # 10-phase roadmap and criteria
├── CHANGELOG.md              # Chronological change history
├── README.md
├── backend/                  # Spring Boot 4.1.2 (Java 21)
├── frontend/                 # React 19 + Vite + Tailwind (Stella's UI)
│   └── Blackwood_Manor_Detective_Game/
├── docs/                     # API contracts, architectural decisions, database notes
│   ├── api-contract.md
│   ├── technical-decisions.md
│   └── database/
└── supabase/                 # Migrations & seed placeholders
    ├── config.toml
    ├── seed.sql
    └── migrations/
```

---

## 5. Backend Architecture & Implementation State

- **Spring Boot 4.1.2 / Java 21** configured under `backend/`.
- **CORS & Security:** Configured in `SecurityConfig.java` to support Vite local development (`http://localhost:*`, `http://127.0.0.1:*`) with cryptographic session token authentication (`PlayerTokenService.java`).
- **REST Endpoints:** Implemented in `RoomController.java` matching Stella's `apiService.js` 1:1.
- **Concurrency & Game Logic:** Implemented in `RoomService.java` using per-room reentrant locks (`ReentrantLock`), atomic capacity checking, idempotent clue discovery, task fulfillment, and single-verdict protection.
- **JPA Domain Mappings:** Entities map 1:1 to Supabase PostgreSQL tables with `spring.jpa.hibernate.ddl-auto=none`.
- **Confidentiality:** `private.case_solutions` is isolated; solutions are evaluated server-side and never returned in API payloads.

---

## 6. Working Rules & Next Session Instructions

1. Verify tests using `.\mvnw.cmd test -Dtest=RoomServiceTest`.
2. Do not touch frontend files.
3. Check [PROJECT_STATE.md](file:///c:/Users/Ishaan/Desktop/Programming/Java-Miniproject/PROJECT_STATE.md) for the active phase and exact next steps.

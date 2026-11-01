# CASE CLOSED — Database Documentation (recovery)

## 1. Recovery scope

This document reconstructs only database decisions and SQL explicitly present in the conversation.
It is not a claim that the schema is production-ready or deployed.

## 2. Confirmed architecture

- Supabase PostgreSQL is the database.
- Spring Boot is intended to own game actions, validation and verdict evaluation.
- Spring Security was recommended as the application authentication owner; Supabase Auth was not selected in the conversation.
- Mystery content is pre-designed and stored in the database.
- Room evidence discovery and task completion are shared at room level.
- Players may explore locations independently.
- A room has one cooperative verdict.
- Initial demo capacity is 2–4 players.
- CC-001 must contain exactly 3 locations, 3 suspects and 5 evidence items.

## 3. Recovered public tables

Migration 1 creates:
`users`, `cases`, `locations`, `suspects`, `evidence`, `evidence_suspects`,
`evidence_prerequisites`, `tasks`, `task_prerequisites`,
`interrogation_dialogues`, `rooms`, `room_players`,
`room_location_progress`, `room_evidence`, `room_tasks`,
`room_events`, `room_verdicts`.

Migration 2 adds:
`interrogation_options`, `evidence_task_prerequisites`,
`evidence_dialogue_prerequisites`, `room_dialogues`,
and `room_players.case_id` plus its constraints.

Private schema:
`private.case_solutions`.

## 4. Authentication

The conversation recommended application-owned authentication:
- Spring Security handles authentication.
- Password hashes are stored in `public.users.password_hash`.
- Passwords must never be stored in plaintext.

No token format, password hashing algorithm, registration API, or user lifecycle policy was finalized in the database conversation. BCrypt or Argon2 was mentioned as options, not a final selection.

## 5. Multiplayer data model

- `rooms` represents an investigation room and its case.
- `room_players` records room membership and presence fields.
- `room_location_progress` tracks individual exploration.
- `room_evidence` stores shared room discoveries, with primary key `(room_id, evidence_id)`.
- `room_tasks` stores shared task state, with primary key `(room_id, task_id)`.
- `room_events` stores chronological events with a JSONB payload.
- `room_verdicts` has `UNIQUE(room_id)` to limit a room to one verdict.
- `room_dialogues` stores shared dialogue triggers.

The backend was assigned responsibility for validating room capacity, prerequisites, discovery, task completion and verdict submission.

## 6. Content and prerequisites

- Evidence can be associated with a location.
- Evidence can relate to multiple suspects through `evidence_suspects`.
- Evidence prerequisites can depend on other evidence.
- Task prerequisites can depend on other tasks.
- Migration 2 adds evidence prerequisites based on tasks and dialogue.
- Interrogation dialogue can require evidence.
- Dialogue options can branch to another dialogue.

The migrations do not implement cycle detection for prerequisite graphs or enforce that all prerequisites are satisfied. Those checks were assigned to backend logic.

## 7. Confidential solution

`private.case_solutions` stores the correct suspect, explanation and JSONB solution data. The migration revokes access from `PUBLIC`, `anon` and `authenticated` for this schema/table.

The conversation did not establish the exact database role used by Spring Boot to read this schema. It also did not implement a verdict-evaluation function or API.

## 8. Recovered indexes

Migration 1:
- `idx_locations_case`
- `idx_suspects_case`
- `idx_evidence_case`
- `idx_tasks_case`
- `idx_rooms_case`
- `idx_room_players_user`
- `idx_room_events_timeline`
- `idx_room_evidence_room`
- `idx_room_tasks_room`

Migration 2:
- `idx_room_players_case`
- `idx_interrogation_options_source`
- `idx_evidence_task_prerequisites`
- `idx_evidence_dialogue_prerequisites`
- `idx_room_dialogues_room`

## 9. Security / RLS status

Migration 1 contains these privilege revocations:
- Revoke all on `private` schema from `PUBLIC`, `anon`, `authenticated`.
- Revoke all on all tables in `private` from `PUBLIC`, `anon`, `authenticated`.
- Revoke all on all tables in `public` from `anon`, `authenticated`.
- Revoke all on `public` schema from `anon`, `authenticated`.

No `ENABLE ROW LEVEL SECURITY`, `CREATE POLICY`, grants for a dedicated backend role, or RLS policy tests were present in the conversation. Therefore RLS policies are **not recovered and were not confirmed implemented**.

## 10. Realtime status

`room_events` and seven proposed event names were discussed:
- `PLAYER_JOINED`
- `PLAYER_LEFT`
- `EVIDENCE_DISCOVERED`
- `TASK_COMPLETED`
- `PLAYER_LOCATION_CHANGED`
- `INVESTIGATION_EVENT_CREATED`
- `VERDICT_SUBMITTED`

The conversation said payload structures should be finalized jointly with Ishaan. No final payload contract, publication alteration, Broadcast trigger, subscription authorization or Realtime SQL configuration was developed.

## 11. Known schema limitations / unresolved issues

These are observations about the recovered SQL, not silent changes:

1. `room_players.current_location_id` has a case-scoped foreign key added in Migration 2, but it is nullable.
2. `room_location_progress` supports per-player exploration.
3. Room capacity (2–4) is bounded by `rooms.max_players`, but actual membership count enforcement is not implemented in SQL.
4. `room_tasks.status` and `completed_at` consistency is not enforced by a CHECK constraint.
5. `room_verdicts` allows a single row per room, but the SQL does not itself enforce that verdict submission occurs only after all required tasks or evidence.
6. `room_events.event_type` is a varchar, not a CHECK-constrained enum.
7. Prerequisite tables prevent direct self-reference but do not prevent longer cycles.
8. `private.case_solutions` has no explicit grant to a dedicated backend role in the recovered SQL.
9. The public schema revocation may require deliberate grants/role setup for the Spring Boot database role; no such role setup was recovered.
10. RLS and Supabase Realtime authorization are unresolved.
11. No CC-001 content rows were recovered.
12. No automatic timestamp-update triggers were recovered despite `updated_at` columns.
13. The `users` table is application-owned in the recommended approach; integration with Supabase's built-in `auth.users` was not implemented.

Do not amend these silently during recovery. Resolve with Ishaan and the database owner before production deployment.

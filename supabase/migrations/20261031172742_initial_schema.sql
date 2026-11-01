-- =====================================================
-- CASE CLOSED - INITIAL DATABASE SCHEMA
-- Reconstructed from the SQL supplied in the conversation.
-- Original filename recovered: 20261031172742_initial_schema.sql
-- =====================================================

-- 1. USERS
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CASES
CREATE TABLE public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL
        CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT'
        CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. LOCATIONS
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id),
    name VARCHAR(120) NOT NULL,
    description TEXT NOT NULL,
    map_x NUMERIC(6,2),
    map_y NUMERIC(6,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (case_id, id)
);

-- 4. SUSPECTS
CREATE TABLE public.suspects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id),
    name VARCHAR(120) NOT NULL,
    role VARCHAR(100),
    biography TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (case_id, id)
);

-- 5. EVIDENCE
CREATE TABLE public.evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id),
    location_id UUID,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    evidence_type VARCHAR(50),
    is_hidden BOOLEAN NOT NULL DEFAULT FALSE,
    discovery_hint TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (case_id, id),
    FOREIGN KEY (case_id, location_id)
        REFERENCES public.locations(case_id, id)
);

-- 6. EVIDENCE-SUSPECT RELATIONSHIP
CREATE TABLE public.evidence_suspects (
    evidence_id UUID NOT NULL,
    suspect_id UUID NOT NULL,
    case_id UUID NOT NULL,
    relationship_description TEXT,
    PRIMARY KEY (evidence_id, suspect_id),
    FOREIGN KEY (case_id, evidence_id)
        REFERENCES public.evidence(case_id, id),
    FOREIGN KEY (case_id, suspect_id)
        REFERENCES public.suspects(case_id, id)
);

-- 7. EVIDENCE PREREQUISITES
CREATE TABLE public.evidence_prerequisites (
    evidence_id UUID NOT NULL,
    prerequisite_evidence_id UUID NOT NULL,
    case_id UUID NOT NULL,
    PRIMARY KEY (evidence_id, prerequisite_evidence_id),
    CHECK (evidence_id <> prerequisite_evidence_id),
    FOREIGN KEY (case_id, evidence_id)
        REFERENCES public.evidence(case_id, id),
    FOREIGN KEY (case_id, prerequisite_evidence_id)
        REFERENCES public.evidence(case_id, id)
);

-- 8. TASKS
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (case_id, id)
);

-- 9. TASK PREREQUISITES
CREATE TABLE public.task_prerequisites (
    task_id UUID NOT NULL,
    prerequisite_task_id UUID NOT NULL,
    case_id UUID NOT NULL,
    PRIMARY KEY (task_id, prerequisite_task_id),
    CHECK (task_id <> prerequisite_task_id),
    FOREIGN KEY (case_id, task_id)
        REFERENCES public.tasks(case_id, id),
    FOREIGN KEY (case_id, prerequisite_task_id)
        REFERENCES public.tasks(case_id, id)
);

-- 10. INTERROGATION DIALOGUES
CREATE TABLE public.interrogation_dialogues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL,
    suspect_id UUID NOT NULL,
    topic VARCHAR(150) NOT NULL,
    dialogue_text TEXT NOT NULL,
    required_evidence_id UUID,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (case_id, id),
    FOREIGN KEY (case_id, suspect_id)
        REFERENCES public.suspects(case_id, id),
    FOREIGN KEY (case_id, required_evidence_id)
        REFERENCES public.evidence(case_id, id)
);

-- =====================================================
-- MULTIPLAYER TABLES
-- =====================================================

-- 11. ROOMS
CREATE TABLE public.rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_code VARCHAR(10) NOT NULL UNIQUE,
    case_id UUID NOT NULL REFERENCES public.cases(id),
    host_user_id UUID NOT NULL REFERENCES public.users(id),
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING'
        CHECK (status IN ('WAITING', 'ACTIVE', 'COMPLETED', 'CLOSED')),
    max_players INTEGER NOT NULL DEFAULT 4
        CHECK (max_players BETWEEN 2 AND 4),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    UNIQUE (id, case_id)
);

-- 12. ROOM PLAYERS
CREATE TABLE public.room_players (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id),
    user_id UUID NOT NULL REFERENCES public.users(id),
    player_role VARCHAR(20) NOT NULL DEFAULT 'PLAYER'
        CHECK (player_role IN ('HOST', 'PLAYER')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'LEFT', 'KICKED')),
    current_location_id UUID,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    UNIQUE (room_id, user_id),
    UNIQUE (room_id, id)
);

-- 13. INDIVIDUAL LOCATION PROGRESS
CREATE TABLE public.room_location_progress (
    room_id UUID NOT NULL,
    room_player_id UUID NOT NULL,
    case_id UUID NOT NULL,
    location_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE'
        CHECK (status IN ('AVAILABLE', 'VISITED', 'EXPLORED')),
    first_entered_at TIMESTAMPTZ,
    explored_at TIMESTAMPTZ,
    PRIMARY KEY (room_player_id, location_id),
    FOREIGN KEY (room_id, case_id)
        REFERENCES public.rooms(id, case_id),
    FOREIGN KEY (room_id, room_player_id)
        REFERENCES public.room_players(room_id, id),
    FOREIGN KEY (case_id, location_id)
        REFERENCES public.locations(case_id, id)
);

-- 14. SHARED DISCOVERED EVIDENCE
CREATE TABLE public.room_evidence (
    room_id UUID NOT NULL,
    case_id UUID NOT NULL,
    evidence_id UUID NOT NULL,
    discovered_by_player_id UUID NOT NULL,
    discovered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (room_id, evidence_id),
    FOREIGN KEY (room_id, case_id)
        REFERENCES public.rooms(id, case_id),
    FOREIGN KEY (case_id, evidence_id)
        REFERENCES public.evidence(case_id, id),
    FOREIGN KEY (room_id, discovered_by_player_id)
        REFERENCES public.room_players(room_id, id)
);

-- 15. SHARED TASK PROGRESS
CREATE TABLE public.room_tasks (
    room_id UUID NOT NULL,
    case_id UUID NOT NULL,
    task_id UUID NOT NULL,
    completed_by_player_id UUID,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'COMPLETED')),
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (room_id, task_id),
    FOREIGN KEY (room_id, case_id)
        REFERENCES public.rooms(id, case_id),
    FOREIGN KEY (case_id, task_id)
        REFERENCES public.tasks(case_id, id),
    FOREIGN KEY (room_id, completed_by_player_id)
        REFERENCES public.room_players(room_id, id)
);

-- 16. ROOM EVENTS
CREATE TABLE public.room_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL REFERENCES public.rooms(id),
    actor_room_player_id UUID,
    event_type VARCHAR(60) NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (room_id, actor_room_player_id)
        REFERENCES public.room_players(room_id, id)
);

-- 17. ROOM VERDICTS
CREATE TABLE public.room_verdicts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    case_id UUID NOT NULL,
    submitted_by_player_id UUID NOT NULL,
    selected_suspect_id UUID NOT NULL,
    explanation TEXT,
    is_correct BOOLEAN,
    evaluation_feedback TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    evaluated_at TIMESTAMPTZ,
    UNIQUE (room_id),
    FOREIGN KEY (room_id, case_id)
        REFERENCES public.rooms(id, case_id),
    FOREIGN KEY (room_id, submitted_by_player_id)
        REFERENCES public.room_players(room_id, id),
    FOREIGN KEY (case_id, selected_suspect_id)
        REFERENCES public.suspects(case_id, id)
);

-- =====================================================
-- PRIVATE SOLUTION DATA
-- =====================================================

CREATE SCHEMA IF NOT EXISTS private;

CREATE TABLE private.case_solutions (
    case_id UUID PRIMARY KEY REFERENCES public.cases(id),
    correct_suspect_id UUID NOT NULL,
    solution_explanation TEXT NOT NULL,
    solution_data JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (case_id, correct_suspect_id)
        REFERENCES public.suspects(case_id, id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_locations_case
    ON public.locations(case_id);

CREATE INDEX idx_suspects_case
    ON public.suspects(case_id);

CREATE INDEX idx_evidence_case
    ON public.evidence(case_id);

CREATE INDEX idx_tasks_case
    ON public.tasks(case_id);

CREATE INDEX idx_rooms_case
    ON public.rooms(case_id);

CREATE INDEX idx_room_players_user
    ON public.room_players(user_id);

CREATE INDEX idx_room_events_timeline
    ON public.room_events(room_id, created_at);

CREATE INDEX idx_room_evidence_room
    ON public.room_evidence(room_id);

CREATE INDEX idx_room_tasks_room
    ON public.room_tasks(room_id);

-- =====================================================
-- SECURITY: CLIENTS MUST NOT ACCESS PRIVATE SOLUTIONS
-- =====================================================

REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
REVOKE ALL ON ALL TABLES IN SCHEMA private FROM PUBLIC, anon, authenticated;

-- Application access will be handled through Spring Boot.
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON SCHEMA public FROM anon, authenticated;

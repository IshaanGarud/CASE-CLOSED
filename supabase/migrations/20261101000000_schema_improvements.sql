-- =====================================================
-- CASE CLOSED - SCHEMA IMPROVEMENTS
-- Reconstructed from the SQL supplied in the conversation.
-- Original timestamped filename was not preserved in chat.
-- =====================================================

-- 1. FIX PLAYER LOCATION RELATIONSHIPS
-- Ensure a player's current location belongs to their room's case.

ALTER TABLE public.room_players
ADD COLUMN case_id UUID;

UPDATE public.room_players rp
SET case_id = r.case_id
FROM public.rooms r
WHERE rp.room_id = r.id;

ALTER TABLE public.room_players
ALTER COLUMN case_id SET NOT NULL;

ALTER TABLE public.room_players
ADD CONSTRAINT fk_room_player_room_case
FOREIGN KEY (room_id, case_id)
REFERENCES public.rooms(id, case_id);

ALTER TABLE public.room_players
ADD CONSTRAINT fk_room_player_current_location
FOREIGN KEY (case_id, current_location_id)
REFERENCES public.locations(case_id, id);


-- 2. INTERROGATION DIALOGUE OPTIONS
-- Supports branching conversations.

CREATE TABLE public.interrogation_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    case_id UUID NOT NULL,
    source_dialogue_id UUID NOT NULL,
    next_dialogue_id UUID,

    option_text TEXT NOT NULL,

    required_evidence_id UUID,

    sort_order INTEGER NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    FOREIGN KEY (case_id, source_dialogue_id)
        REFERENCES public.interrogation_dialogues(case_id, id),

    FOREIGN KEY (case_id, next_dialogue_id)
        REFERENCES public.interrogation_dialogues(case_id, id),

    FOREIGN KEY (case_id, required_evidence_id)
        REFERENCES public.evidence(case_id, id),

    CHECK (
        next_dialogue_id IS NULL
        OR next_dialogue_id <> source_dialogue_id
    )
);


-- 3. EVIDENCE UNLOCKED BY COMPLETED TASKS

CREATE TABLE public.evidence_task_prerequisites (
    evidence_id UUID NOT NULL,
    prerequisite_task_id UUID NOT NULL,
    case_id UUID NOT NULL,

    PRIMARY KEY (evidence_id, prerequisite_task_id),

    FOREIGN KEY (case_id, evidence_id)
        REFERENCES public.evidence(case_id, id),

    FOREIGN KEY (case_id, prerequisite_task_id)
        REFERENCES public.tasks(case_id, id)
);


-- 4. EVIDENCE UNLOCKED BY DIALOGUE DISCOVERY

CREATE TABLE public.evidence_dialogue_prerequisites (
    evidence_id UUID NOT NULL,
    prerequisite_dialogue_id UUID NOT NULL,
    case_id UUID NOT NULL,

    PRIMARY KEY (evidence_id, prerequisite_dialogue_id),

    FOREIGN KEY (case_id, evidence_id)
        REFERENCES public.evidence(case_id, id),

    FOREIGN KEY (case_id, prerequisite_dialogue_id)
        REFERENCES public.interrogation_dialogues(case_id, id)
);


-- 5. TRACK SHARED DIALOGUE DISCOVERY IN ROOMS

CREATE TABLE public.room_dialogues (
    room_id UUID NOT NULL,
    case_id UUID NOT NULL,
    dialogue_id UUID NOT NULL,

    triggered_by_player_id UUID NOT NULL,

    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (room_id, dialogue_id),

    FOREIGN KEY (room_id, case_id)
        REFERENCES public.rooms(id, case_id),

    FOREIGN KEY (case_id, dialogue_id)
        REFERENCES public.interrogation_dialogues(case_id, id),

    FOREIGN KEY (room_id, triggered_by_player_id)
        REFERENCES public.room_players(room_id, id)
);


-- 6. INDEXES

CREATE INDEX idx_room_players_case
    ON public.room_players(case_id);

CREATE INDEX idx_interrogation_options_source
    ON public.interrogation_options(case_id, source_dialogue_id);

CREATE INDEX idx_evidence_task_prerequisites
    ON public.evidence_task_prerequisites(evidence_id);

CREATE INDEX idx_evidence_dialogue_prerequisites
    ON public.evidence_dialogue_prerequisites(evidence_id);

CREATE INDEX idx_room_dialogues_room
    ON public.room_dialogues(room_id);

-- Challenge core tables required for Phase 1 (single challenge end-to-end).
-- Leaderboard, badge, friend, entitlement, and device tables are added in
-- their own migrations when those phases ship.

CREATE TABLE challenges (
    id           text PRIMARY KEY,
    release_date date        NOT NULL,
    difficulty   text        NOT NULL CHECK (difficulty IN ('easy', 'intermediate', 'hard')),
    language     text        NOT NULL CHECK (language IN ('java', 'kotlin', 'either')),
    type         text        NOT NULL,
    title        text        NOT NULL,
    tags         text[]      NOT NULL DEFAULT '{}',
    tracks       text[]      NOT NULL DEFAULT '{}',
    base_xp      int         NOT NULL DEFAULT 10,
    metadata     jsonb       NOT NULL DEFAULT '{}',
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_challenges_release_date ON challenges (release_date);
CREATE INDEX idx_challenges_difficulty   ON challenges (difficulty);
CREATE INDEX idx_challenges_language     ON challenges (language);

CREATE TABLE challenge_submissions (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid        NOT NULL REFERENCES users (id),
    challenge_id text        NOT NULL REFERENCES challenges (id),
    language     text        NOT NULL,
    source_code  text        NOT NULL,
    is_correct   boolean     NOT NULL,
    visible_pass int         NOT NULL DEFAULT 0,
    hidden_pass  int         NOT NULL DEFAULT 0,
    hidden_total int         NOT NULL DEFAULT 0,
    runtime_ms   int,
    memory_kb    int,
    byte_length  int,
    shared       boolean     NOT NULL DEFAULT false,
    created_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subs_user_chal    ON challenge_submissions (user_id, challenge_id);
CREATE INDEX idx_subs_chal_correct ON challenge_submissions (challenge_id) WHERE is_correct;
CREATE INDEX idx_subs_user_date    ON challenge_submissions (user_id, created_at DESC);

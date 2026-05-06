-- Friend duels: two users race on the same challenge
CREATE TABLE duels (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id    VARCHAR(100) NOT NULL REFERENCES challenges(id),
    challenger_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    opponent_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    challenger_submission_id UUID REFERENCES challenge_submissions(id),
    opponent_submission_id   UUID REFERENCES challenge_submissions(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',  -- pending | active | completed | declined
    winner_id       UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    UNIQUE(challenge_id, challenger_id, opponent_id),
    CHECK(challenger_id != opponent_id)
);

CREATE INDEX idx_duels_challenger ON duels(challenger_id, status);
CREATE INDEX idx_duels_opponent   ON duels(opponent_id, status);
CREATE INDEX idx_duels_challenge  ON duels(challenge_id);

-- Per-challenge discussion: server enforces solved-gate before returning posts
CREATE TABLE discussion_posts (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id VARCHAR(100) NOT NULL REFERENCES challenges(id),
    user_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    body         TEXT NOT NULL CHECK(char_length(body) <= 4000),
    upvotes      INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at   TIMESTAMPTZ
);

CREATE INDEX idx_discussion_challenge ON discussion_posts(challenge_id, created_at)
    WHERE deleted_at IS NULL;

-- Solution upvotes: voter-per-submission, one row each
CREATE TABLE solution_votes (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES challenge_submissions(id) ON DELETE CASCADE,
    voter_id      UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(submission_id, voter_id)
);

CREATE INDEX idx_solution_votes_sub ON solution_votes(submission_id);

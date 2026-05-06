-- Friend graph: bidirectional edges, pending until accepted
CREATE TABLE friend_edges (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status          VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(requester_id, addressee_id),
    CHECK(requester_id != addressee_id)
);

CREATE INDEX idx_friend_edges_requester ON friend_edges(requester_id, status);
CREATE INDEX idx_friend_edges_addressee ON friend_edges(addressee_id, status);

-- League assignments: one row per user per ISO week
CREATE TABLE league_assignments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    league_id       UUID NOT NULL,
    tier            VARCHAR(20) NOT NULL DEFAULT 'bronze',
    iso_week        VARCHAR(10) NOT NULL,
    week_xp         INT NOT NULL DEFAULT 0,
    rank_in_league  INT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, iso_week)
);

CREATE INDEX idx_league_assignments_league_week ON league_assignments(league_id, iso_week);
CREATE INDEX idx_league_assignments_user_week   ON league_assignments(user_id, iso_week);

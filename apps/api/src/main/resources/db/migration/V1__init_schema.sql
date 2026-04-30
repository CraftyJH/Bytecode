-- V1: Initial Bytecode schema
-- Covers: users, curriculum skeleton, subscriptions, progress

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE users (
    id                  UUID PRIMARY KEY,
    email               TEXT UNIQUE NOT NULL,
    name                TEXT,
    avatar_url          TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    premium_until       TIMESTAMPTZ,
    streak_count        INT NOT NULL DEFAULT 0,
    last_active_at      TIMESTAMPTZ,
    is_founding_member  BOOLEAN NOT NULL DEFAULT FALSE,
    founding_locked_until TIMESTAMPTZ,
    role                TEXT NOT NULL DEFAULT 'user'
                        CHECK (role IN ('user', 'premium', 'author', 'staff'))
);

-- ─── Curriculum ────────────────────────────────────────────────────────────────
CREATE TABLE tracks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    "order"     INT NOT NULL,
    description TEXT
);

CREATE TABLE modules (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    track_id    UUID NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
    slug        TEXT NOT NULL,
    title       TEXT NOT NULL,
    "order"     INT NOT NULL,
    description TEXT,
    is_premium  BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (track_id, slug)
);

CREATE TABLE lessons (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id           UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    slug                TEXT UNIQUE NOT NULL,
    title               TEXT NOT NULL,
    body_mdx            TEXT,
    "order"             INT NOT NULL,
    is_premium          BOOLEAN NOT NULL DEFAULT FALSE,
    estimated_minutes   INT
);

CREATE TABLE exercises (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id       UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    prompt          TEXT NOT NULL,
    starter_code    TEXT,
    test_cases_json JSONB,
    solution        TEXT,
    runner_type     TEXT NOT NULL DEFAULT 'stdin_stdout'
);

CREATE TABLE quiz_items (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id           UUID REFERENCES lessons(id) ON DELETE CASCADE,
    position            TEXT NOT NULL
                        CHECK (position IN ('mid_lesson', 'end_of_lesson', 'end_of_module', 'daily_challenge')),
    type                TEXT NOT NULL
                        CHECK (type IN ('multiple_choice', 'fill_in_blank', 'predict_output', 'find_the_bug', 'order_the_steps')),
    payload_json        JSONB NOT NULL,
    explanation         TEXT,
    difficulty          TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard'))
);

CREATE TABLE capstones (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id           UUID REFERENCES modules(id),
    track_id            UUID REFERENCES tracks(id),
    type                TEXT NOT NULL,
    title               TEXT NOT NULL,
    brief_mdx           TEXT,
    hidden_tests_json   JSONB,
    is_premium          BOOLEAN NOT NULL DEFAULT TRUE,
    reward_badge_id     UUID
);

-- ─── Progress ──────────────────────────────────────────────────────────────────
CREATE TABLE user_progress (
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id           UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    time_spent_seconds  INT NOT NULL DEFAULT 0,
    PRIMARY KEY (user_id, lesson_id)
);

CREATE TABLE user_quiz_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id         UUID NOT NULL REFERENCES quiz_items(id) ON DELETE CASCADE,
    score           INT NOT NULL,
    total           INT NOT NULL,
    attempted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE capstone_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    capstone_id     UUID NOT NULL REFERENCES capstones(id) ON DELETE CASCADE,
    code            TEXT,
    passed          BOOLEAN NOT NULL DEFAULT FALSE,
    attempted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    test_results_json JSONB
);

-- ─── Badges ────────────────────────────────────────────────────────────────────
CREATE TABLE badges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        TEXT UNIQUE NOT NULL,
    title       TEXT NOT NULL,
    description TEXT,
    icon_url    TEXT
);

CREATE TABLE user_badges (
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id    UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    awarded_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, badge_id)
);

-- ─── Subscriptions ─────────────────────────────────────────────────────────────
CREATE TABLE subscriptions (
    user_id                 UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id      TEXT UNIQUE,
    stripe_subscription_id  TEXT UNIQUE,
    status                  TEXT,
    current_period_end      TIMESTAMPTZ,
    plan                    TEXT
);

-- ─── Seed: curriculum skeleton ────────────────────────────────────────────────
INSERT INTO tracks (slug, title, "order", description) VALUES
    ('java-beginner',    'Java Beginner',    1, 'Variables, control flow, methods, arrays, strings.'),
    ('java-intermediate','Java Intermediate', 2, 'Classes, OOP, interfaces, generics, collections.'),
    ('java-advanced',    'Java Advanced',    3, 'Lambdas, streams, concurrency, JVM, design patterns.'),
    ('kotlin-bridge',    'Kotlin Bridge',    4, 'Java → Kotlin for experienced Java developers.'),
    ('kotlin-advanced',  'Kotlin Advanced',  5, 'Coroutines, DSLs, extension functions, multiplatform.'),
    ('projects',         'Projects',         6, 'Spring Boot, Android, multi-threaded applications.');

INSERT INTO modules (track_id, slug, title, "order", is_premium) VALUES
    ((SELECT id FROM tracks WHERE slug = 'java-beginner'), 'module-1', 'Java Foundations', 1, FALSE);

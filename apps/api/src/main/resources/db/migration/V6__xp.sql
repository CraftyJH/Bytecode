-- Add total XP accumulator to users.
-- Awarded when a user submits their first correct solution to a daily challenge.
ALTER TABLE users ADD COLUMN xp_total int NOT NULL DEFAULT 0;

-- V4: Expand subscription state for billing lifecycle handling
ALTER TABLE subscriptions
    ADD COLUMN IF NOT EXISTS stripe_price_id TEXT,
    ADD COLUMN IF NOT EXISTS grace_expires_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS last_payment_failed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS last_event_at TIMESTAMPTZ;

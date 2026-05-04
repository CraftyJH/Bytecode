# Bytecode Web App

This app handles the public marketing pages, authenticated learner experience, and Stripe billing frontend + webhook handlers.

## Stripe billing environment variables

Set these variables for local/dev/prod deployments:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_PREMIUM_MONTHLY`
- `STRIPE_PRICE_PREMIUM_YEARLY`
- `BYTECODE_INTERNAL_BILLING_SYNC_TOKEN`

Optional:

- `STRIPE_LOOKUP_KEY_PREMIUM_MONTHLY` (default: `bytecode_premium_monthly_v1`)
- `STRIPE_LOOKUP_KEY_PREMIUM_YEARLY` (default: `bytecode_premium_yearly_v1`)

## Stripe webhook endpoint

Configure Stripe to send billing events to:

- `POST /api/stripe/webhook`

Handled event types:

- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

## Grace-period enforcement

When `invoice.payment_failed` fires:

1. user remains `past_due` with a `24h` grace window,
2. a follow-up check is scheduled,
3. if still unpaid after grace, the subscription is canceled and user is downgraded.

### Endpoints used by internal automation

- `POST /api/internal/billing/schedule-grace`
- `POST /api/internal/billing/process-grace`
- `POST /api/internal/billing/run-grace-sweep`

All internal billing endpoints require `X-Bytecode-Internal-Token` with the value from `BYTECODE_INTERNAL_BILLING_SYNC_TOKEN`.

To enforce the 24-hour retry/cancel lifecycle in production, trigger:

- `POST /api/internal/billing/run-grace-sweep`

from an external scheduler (for example every 10-15 minutes).

## Running locally

```bash
pnpm dev
```

Then open `http://localhost:3000`.

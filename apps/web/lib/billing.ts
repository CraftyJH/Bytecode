import type Stripe from "stripe";

export const GRACE_PERIOD_HOURS = 24;

export interface StripePlanConfig {
  slug: "premium-monthly" | "premium-yearly";
  priceId: string;
  lookupKey: string;
}

export const PLAN_CONFIGS: StripePlanConfig[] = [
  {
    slug: "premium-monthly",
    priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY ?? "",
    lookupKey: process.env.STRIPE_LOOKUP_KEY_PREMIUM_MONTHLY ?? "bytecode_premium_monthly_v1",
  },
  {
    slug: "premium-yearly",
    priceId: process.env.STRIPE_PRICE_PREMIUM_YEARLY ?? "",
    lookupKey: process.env.STRIPE_LOOKUP_KEY_PREMIUM_YEARLY ?? "bytecode_premium_yearly_v1",
  },
];

export function resolvePlanByPriceId(priceId?: string | null): StripePlanConfig | null {
  if (!priceId) return null;
  return PLAN_CONFIGS.find((config) => config.priceId === priceId) ?? null;
}

export function resolvePlanBySlug(slug?: string | null): StripePlanConfig | null {
  if (!slug) return null;
  return PLAN_CONFIGS.find((config) => config.slug === slug) ?? null;
}

export function activeSubscriptionStatuses(): Stripe.Subscription.Status[] {
  return ["active", "trialing", "past_due"];
}

export function toIsoOrNull(timestampSec?: number | null): string | null {
  if (!timestampSec) return null;
  return new Date(timestampSec * 1000).toISOString();
}

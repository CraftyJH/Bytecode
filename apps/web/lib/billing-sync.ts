import type Stripe from "stripe";

import { GRACE_PERIOD_HOURS, resolvePlanByPriceId, toIsoOrNull } from "@/lib/billing";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, requireInternalBillingSyncToken } from "@/lib/stripe";

const BYTECODE_API_URL = process.env.BYTECODE_API_URL ?? "http://localhost:8080";

interface InternalSubscriptionSyncRequest {
  userId: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  status: string | null;
  plan: string | null;
  currentPeriodEnd: string | null;
  graceExpiresAt: string | null;
  lastPaymentFailedAt: string | null;
  canceledAt: string | null;
  premiumUntil: string | null;
  role: string | null;
  eventCreatedAt: string | null;
}

type MinimalSyncPayload = {
  userId?: string | null;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
  status?: string | null;
  plan?: string | null;
  currentPeriodEnd?: string | null;
  graceExpiresAt?: string | null;
  lastPaymentFailedAt?: string | null;
  canceledAt?: string | null;
  premiumUntil?: string | null;
  role?: string | null;
  eventCreatedAt?: string | null;
};

export async function syncFromSubscriptionEvent(
  subscription: Stripe.Subscription,
  eventCreatedAtSec: number,
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;

  const priceId = subscription.items.data[0]?.price?.id ?? null;
  const mappedPlan = resolvePlanByPriceId(priceId)?.slug ?? null;
  const userId =
    readMetadataUserId(subscription.metadata) ??
    (await resolveUserIdFromStripe(customerId, subscription.id));
  const isActiveLike = ["active", "trialing", "past_due"].includes(subscription.status);

  const payload: MinimalSyncPayload = {
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: priceId,
    status: subscription.status,
    plan: mappedPlan,
    currentPeriodEnd: toIsoOrNull(subscription.current_period_end),
    premiumUntil: isActiveLike ? toIsoOrNull(subscription.current_period_end) : null,
    graceExpiresAt: null,
    lastPaymentFailedAt: null,
    canceledAt: subscription.canceled_at ? toIsoOrNull(subscription.canceled_at) : null,
    role: null,
    eventCreatedAt: toIsoOrNull(eventCreatedAtSec),
  };

  await syncToInternalApi(payload);
  if (payload.userId) {
    await syncSupabasePlan(payload.userId, isActiveLike);
  }
}

export async function syncFromInvoicePaymentFailed(
  invoice: Stripe.Invoice,
  eventCreatedAtSec: number,
) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id ?? null;
  const subscriptionId = readInvoiceSubscriptionId(invoice);
  const priceId = invoice.lines.data[0]?.pricing?.price_details?.price ?? null;
  const mappedPlan = resolvePlanByPriceId(priceId)?.slug ?? null;
  const subscriptionSnapshot = await fetchSubscriptionSnapshot(subscriptionId);
  const userIdFromSubscription = subscriptionSnapshot
    ? readMetadataUserId(subscriptionSnapshot.metadata)
    : null;
  const effectivePriceId = priceId ?? subscriptionSnapshot?.items.data[0]?.price?.id ?? null;
  const effectivePlan = resolvePlanByPriceId(effectivePriceId)?.slug ?? mappedPlan;

  const failedAt = toIsoOrNull(eventCreatedAtSec);
  const graceExpiresAtIso = new Date(
    Date.now() + GRACE_PERIOD_HOURS * 60 * 60 * 1000,
  ).toISOString();

  await syncToInternalApi({
    userId: userIdFromSubscription,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    stripePriceId: effectivePriceId,
    status: "past_due",
    plan: effectivePlan,
    graceExpiresAt: graceExpiresAtIso,
    lastPaymentFailedAt: failedAt,
    eventCreatedAt: failedAt,
  });

  const resolved = userIdFromSubscription ?? (await resolveUserIdFromStripe(customerId, subscriptionId));
  if (resolved) {
    await syncSupabasePlan(resolved, true);
    await scheduleGraceCheck({
      userId: resolved,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      runAt: graceExpiresAtIso,
    });
  }
}

export async function syncFromInvoicePaid(
  invoice: Stripe.Invoice,
  eventCreatedAtSec: number,
) {
  const customerId =
    typeof invoice.customer === "string"
      ? invoice.customer
      : invoice.customer?.id ?? null;
  const subscriptionId = readInvoiceSubscriptionId(invoice);
  const priceId = invoice.lines.data[0]?.pricing?.price_details?.price ?? null;
  const subscriptionSnapshot = await fetchSubscriptionSnapshot(subscriptionId);
  const userIdFromSubscription = subscriptionSnapshot
    ? readMetadataUserId(subscriptionSnapshot.metadata)
    : null;
  const effectivePriceId = priceId ?? subscriptionSnapshot?.items.data[0]?.price?.id ?? null;
  const mappedPlan = resolvePlanByPriceId(effectivePriceId)?.slug ?? null;
  const periodEndSec = invoice.lines.data[0]?.period?.end ?? subscriptionSnapshot?.current_period_end ?? null;

  await syncToInternalApi({
    userId: userIdFromSubscription,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    stripePriceId: effectivePriceId,
    status: "active",
    plan: mappedPlan,
    currentPeriodEnd: toIsoOrNull(periodEndSec),
    premiumUntil: toIsoOrNull(periodEndSec),
    graceExpiresAt: null,
    lastPaymentFailedAt: null,
    eventCreatedAt: toIsoOrNull(eventCreatedAtSec),
  });

  const resolved = userIdFromSubscription ?? (await resolveUserIdFromStripe(customerId, subscriptionId));
  if (resolved) {
    await syncSupabasePlan(resolved, true);
  }
}

export async function syncFromSubscriptionDeleted(
  subscription: Stripe.Subscription,
  eventCreatedAtSec: number,
) {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer?.id ?? null;
  const userId = readMetadataUserId(subscription.metadata);

  await syncToInternalApi({
    userId,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscription.id,
    stripePriceId: subscription.items.data[0]?.price?.id ?? null,
    status: "canceled",
    plan: "free",
    premiumUntil: null,
    graceExpiresAt: null,
    canceledAt: toIsoOrNull(subscription.canceled_at ?? eventCreatedAtSec),
    eventCreatedAt: toIsoOrNull(eventCreatedAtSec),
  });

  const resolved = userId ?? (await resolveUserIdFromStripe(customerId, subscription.id));
  if (resolved) {
    await syncSupabasePlan(resolved, false);
  }
}

async function syncToInternalApi(input: MinimalSyncPayload) {
  const token = requireInternalBillingSyncToken();
  const payload: InternalSubscriptionSyncRequest = {
    userId: input.userId ?? null,
    stripeCustomerId: input.stripeCustomerId ?? null,
    stripeSubscriptionId: input.stripeSubscriptionId ?? null,
    stripePriceId: input.stripePriceId ?? null,
    status: input.status ?? null,
    plan: input.plan ?? null,
    currentPeriodEnd: input.currentPeriodEnd ?? null,
    graceExpiresAt: input.graceExpiresAt ?? null,
    lastPaymentFailedAt: input.lastPaymentFailedAt ?? null,
    canceledAt: input.canceledAt ?? null,
    premiumUntil: input.premiumUntil ?? null,
    role: input.role ?? null,
    eventCreatedAt: input.eventCreatedAt ?? null,
  };

  const res = await fetch(`${BYTECODE_API_URL}/api/internal/billing/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Bytecode-Internal-Token": token,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Internal billing sync failed (${res.status}): ${text}`);
  }
}

function readMetadataUserId(metadata?: Stripe.Metadata | null): string | null {
  const raw = metadata?.supabase_user_id;
  return raw && raw.trim() ? raw : null;
}

function readInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const fromParent = (
    invoice as unknown as { parent?: { subscription_details?: { subscription?: unknown } } }
  ).parent?.subscription_details?.subscription;
  if (typeof fromParent === "string") return fromParent;
  if (fromParent && typeof fromParent === "object") {
    const id = (fromParent as { id?: unknown }).id;
    if (typeof id === "string") return id;
  }

  // Backward compatibility for older API responses carrying `invoice.subscription`.
  const legacy = (invoice as unknown as { subscription?: unknown }).subscription;
  if (typeof legacy === "string") return legacy;
  if (legacy && typeof legacy === "object") {
    const id = (legacy as { id?: unknown }).id;
    if (typeof id === "string") return id;
  }

  return null;
}

async function resolveUserIdFromStripe(
  stripeCustomerId: string | null,
  stripeSubscriptionId: string | null,
): Promise<string | null> {
  const token = requireInternalBillingSyncToken();
  const query = new URLSearchParams();
  if (stripeCustomerId) query.set("stripeCustomerId", stripeCustomerId);
  if (stripeSubscriptionId) query.set("stripeSubscriptionId", stripeSubscriptionId);
  if (!query.toString()) return null;

  const response = await fetch(`${BYTECODE_API_URL}/api/internal/billing/resolve?${query.toString()}`, {
    method: "POST",
    headers: {
      "X-Bytecode-Internal-Token": token,
    },
    cache: "no-store",
  });

  if (!response.ok) return null;
  const json = (await response.json()) as { userId?: string | null };
  return json.userId ?? null;
}

async function fetchSubscriptionSnapshot(
  stripeSubscriptionId: string | null,
): Promise<Stripe.Subscription | null> {
  if (!stripeSubscriptionId) return null;
  const stripe = getStripe();
  try {
    return await stripe.subscriptions.retrieve(stripeSubscriptionId);
  } catch {
    return null;
  }
}

async function syncSupabasePlan(userId: string, premium: boolean) {
  const admin = createAdminClient();
  const {
    data: { user },
    error: getError,
  } = await admin.auth.admin.getUserById(userId);

  if (getError || !user) {
    throw new Error(getError?.message ?? `Unable to load Supabase user ${userId}`);
  }

  const nextPlan = premium ? "premium" : "free";
  const currentPlan = (user.app_metadata?.plan as string | undefined) ?? "free";
  if (currentPlan === nextPlan) return;

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...(user.app_metadata ?? {}),
      plan: nextPlan,
    },
  });

  if (updateError) {
    throw new Error(`Supabase metadata sync failed: ${updateError.message}`);
  }
}

interface GraceScheduleRequest {
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  runAt: string;
}

async function scheduleGraceCheck(request: GraceScheduleRequest) {
  const token = requireInternalBillingSyncToken();
  const siteBase =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const response = await fetch(`${siteBase.replace(/\/$/, "")}/api/internal/billing/schedule-grace`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Bytecode-Internal-Token": token,
    },
    body: JSON.stringify(request),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Grace scheduling failed (${response.status}): ${text}`);
  }
}

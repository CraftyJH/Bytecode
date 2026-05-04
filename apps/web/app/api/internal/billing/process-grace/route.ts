import { NextResponse } from "next/server";

import { forceDowngradeSubscription } from "@/lib/billing-grace";
import { getStripe, requireInternalBillingSyncToken } from "@/lib/stripe";

export const runtime = "nodejs";

interface ProcessGraceRequest {
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  userId?: string;
  force?: boolean;
  cancelStripe?: boolean;
}

function isAuthorized(inbound: string | null): boolean {
  if (!inbound) return false;
  return inbound === requireInternalBillingSyncToken();
}

export async function POST(request: Request) {
  const token = request.headers.get("X-Bytecode-Internal-Token");
  if (!isAuthorized(token)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as ProcessGraceRequest;
  const stripeSubscriptionId = body.stripeSubscriptionId ?? null;
  const stripeCustomerId = body.stripeCustomerId ?? null;
  const force = body.force === true;
  const cancelStripe = body.cancelStripe !== false;
  let userId = body.userId ?? null;
  if (!stripeSubscriptionId && !stripeCustomerId && !userId) {
    return NextResponse.json({ error: "Missing subscription or customer identifier" }, { status: 400 });
  }

  const stripe = getStripe();
  const subscription = stripeSubscriptionId
    ? await stripe.subscriptions.retrieve(stripeSubscriptionId)
    : null;
  const resolvedCustomerId =
    stripeCustomerId ??
    (subscription
      ? (typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id ?? null)
      : null);

  if (!userId) {
    if (!resolvedCustomerId && !stripeSubscriptionId) {
      return NextResponse.json({ error: "Unable to resolve Stripe customer" }, { status: 404 });
    }
    userId = await resolveUserIdByStripe(
      resolvedCustomerId,
      subscription?.id ?? stripeSubscriptionId ?? null,
    );
    if (!userId) {
      return NextResponse.json({ error: "Unable to resolve billing record" }, { status: 404 });
    }
  }

  const billingStatus = await fetchBillingStatusByUserId(userId);
  if (!billingStatus) {
    return NextResponse.json({ error: "Unable to resolve billing record" }, { status: 404 });
  }

  const graceExpiresAt = billingStatus.subscription?.graceExpiresAt;
  if (!force && (!graceExpiresAt || Date.parse(graceExpiresAt) > Date.now())) {
    return NextResponse.json({ ok: true, action: "still_in_grace" });
  }

  if (subscription && cancelStripe) {
    await stripe.subscriptions.cancel(subscription.id, { prorate: false });
  }

  await forceDowngradeSubscription({
    userId: billingStatus.userId,
    stripeCustomerId: resolvedCustomerId ?? billingStatus.subscription?.stripeCustomerId ?? null,
    stripeSubscriptionId: subscription?.id ?? stripeSubscriptionId ?? null,
  });

  return NextResponse.json({ ok: true, action: "canceled_and_downgraded" });
}

async function resolveUserIdByStripe(
  stripeCustomerId: string | null,
  stripeSubscriptionId: string | null,
): Promise<string | null> {
  const token = requireInternalBillingSyncToken();
  const params = new URLSearchParams();
  if (stripeCustomerId) params.set("stripeCustomerId", stripeCustomerId);
  if (stripeSubscriptionId) params.set("stripeSubscriptionId", stripeSubscriptionId);
  if (!params.toString()) return null;

  const resolveRes = await fetch(
    `${process.env.BYTECODE_API_URL ?? "http://localhost:8080"}/api/internal/billing/resolve?${params.toString()}`,
    {
      method: "POST",
      headers: { "X-Bytecode-Internal-Token": token },
      cache: "no-store",
    },
  );

  if (!resolveRes.ok) {
    return null;
  }
  const resolved = (await resolveRes.json()) as { userId?: string | null };
  return resolved.userId ?? null;
}

async function fetchBillingStatusByUserId(userId: string) {
  const token = requireInternalBillingSyncToken();
  const statusRes = await fetch(
    `${process.env.BYTECODE_API_URL ?? "http://localhost:8080"}/api/internal/billing/status?userId=${encodeURIComponent(userId)}`,
    {
      method: "POST",
      headers: { "X-Bytecode-Internal-Token": token },
      cache: "no-store",
    },
  );
  if (!statusRes.ok) return null;

  return (await statusRes.json()) as {
    userId: string;
    subscription: { graceExpiresAt: string | null; stripeCustomerId?: string | null } | null;
  };
}

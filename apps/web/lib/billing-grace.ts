import { requireInternalBillingSyncToken } from "@/lib/stripe";

const BYTECODE_API_URL = process.env.BYTECODE_API_URL ?? "http://localhost:8080";

export interface ExpiredGraceRecord {
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

interface InternalResolveResponse {
  ok: boolean;
  userId: string | null;
}

export async function resolveUserByStripe(
  stripeCustomerId: string | null,
  stripeSubscriptionId: string | null,
): Promise<string | null> {
  const token = requireInternalBillingSyncToken();
  const query = new URLSearchParams();
  if (stripeCustomerId) query.set("stripeCustomerId", stripeCustomerId);
  if (stripeSubscriptionId) query.set("stripeSubscriptionId", stripeSubscriptionId);
  if (!query.toString()) return null;

  const response = await fetch(
    `${BYTECODE_API_URL}/api/internal/billing/resolve?${query.toString()}`,
    {
      method: "POST",
      headers: {
        "X-Bytecode-Internal-Token": token,
      },
      cache: "no-store",
    },
  );
  if (!response.ok) return null;

  const json = (await response.json()) as InternalResolveResponse;
  return json.userId ?? null;
}

interface InternalSyncBody {
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

export async function forceDowngradeSubscription(record: ExpiredGraceRecord) {
  const token = requireInternalBillingSyncToken();
  const nowIso = new Date().toISOString();
  const body: InternalSyncBody = {
    userId: record.userId,
    stripeCustomerId: record.stripeCustomerId,
    stripeSubscriptionId: record.stripeSubscriptionId,
    stripePriceId: null,
    status: "canceled",
    plan: "free",
    currentPeriodEnd: null,
    graceExpiresAt: null,
    lastPaymentFailedAt: nowIso,
    canceledAt: nowIso,
    premiumUntil: null,
    role: null,
    eventCreatedAt: nowIso,
  };

  const syncRes = await fetch(`${BYTECODE_API_URL}/api/internal/billing/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Bytecode-Internal-Token": token,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!syncRes.ok) {
    throw new Error(`Unable to persist forced downgrade (${syncRes.status})`);
  }

  const siteBaseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const downgradeRes = await fetch(
    `${siteBaseUrl.replace(/\/$/, "")}/api/internal/billing/downgrade`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Bytecode-Internal-Token": token,
      },
      body: JSON.stringify({ userId: record.userId }),
      cache: "no-store",
    },
  );
  if (!downgradeRes.ok) {
    throw new Error(`Unable to mirror downgrade into Supabase (${downgradeRes.status})`);
  }
}

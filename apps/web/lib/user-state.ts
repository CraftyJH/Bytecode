import type { User } from "@supabase/supabase-js";

const BYTECODE_API_URL = process.env.BYTECODE_API_URL ?? "http://localhost:8080";

export interface BackendUserState {
  role: string;
  premiumUntil: string | null;
  streakCount: number;
}

export interface BillingSubscriptionState {
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  status: string | null;
  currentPeriodEnd: string | null;
  graceExpiresAt: string | null;
  lastPaymentFailedAt: string | null;
  canceledAt: string | null;
  plan: string | null;
}

export interface BillingState {
  userId: string;
  plan: string;
  role: string;
  premiumUntil: string | null;
  subscription: BillingSubscriptionState | null;
}

export interface PlanState {
  isPremium: boolean;
  isAdmin: boolean;
  label: string;
}

export async function fetchBackendUserState(accessToken?: string): Promise<BackendUserState | null> {
  if (!accessToken) return null;

  try {
    const res = await fetch(`${BYTECODE_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as Partial<BackendUserState>;
    return {
      role: data.role ?? "user",
      premiumUntil: data.premiumUntil ?? null,
      streakCount: data.streakCount ?? 0,
    };
  } catch {
    return null;
  }
}

export async function fetchBillingStatus(accessToken?: string): Promise<BillingState | null> {
  if (!accessToken) return null;

  try {
    const res = await fetch(`${BYTECODE_API_URL}/api/users/me/billing`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const data = (await res.json()) as BillingState;
    return data;
  } catch {
    return null;
  }
}

export function resolvePlanState(user: User | null, backend: BackendUserState | null): PlanState {
  const appRole = user?.app_metadata?.role;
  const appPlan = user?.app_metadata?.plan;
  const backendRole = backend?.role ?? "user";
  const isAdmin = appRole === "admin" || backendRole === "staff" || backendRole === "author";

  const premiumUntilMs = backend?.premiumUntil ? Date.parse(backend.premiumUntil) : NaN;
  const premiumByBackend = Number.isFinite(premiumUntilMs) && premiumUntilMs > Date.now();
  const premiumByRole = backendRole === "premium" || appPlan === "premium" || isAdmin;
  const isPremium = premiumByBackend || premiumByRole;

  return {
    isPremium,
    isAdmin,
    label: isPremium ? "Premium" : "Free",
  };
}

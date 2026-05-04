import { redirect } from "next/navigation";

import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { createClient } from "@/lib/supabase/server";
import {
  fetchBackendUserState,
  fetchBillingStatus,
  resolvePlanState,
  type BillingState,
} from "@/lib/user-state";
import { BillingActionsClient } from "./BillingActionsClient";

interface BillingPageProps {
  searchParams: Promise<{ checkout?: string }>;
}

type PremiumPlanSlug = "premium-monthly" | "premium-yearly";

function formatDate(value?: string | null): string | null {
  if (!value) return null;
  const ts = Date.parse(value);
  if (!Number.isFinite(ts)) return null;
  return new Date(ts).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function BillingPage({ searchParams }: BillingPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!user) redirect("/signin");

  const [backendUser, billingStatus] = await Promise.all([
    fetchBackendUserState(session?.access_token),
    fetchBillingStatus(session?.access_token),
  ]);
  const plan = resolvePlanState(user, backendUser);
  const { checkout } = await searchParams;

  const renewal = formatDate(billingStatus?.subscription?.currentPeriodEnd);
  const graceEnds = formatDate(billingStatus?.subscription?.graceExpiresAt);
  const paymentFailedAt = formatDate(billingStatus?.subscription?.lastPaymentFailedAt);
  const subscriptionStatus = billingStatus?.subscription?.status ?? "none";
  const preferredPlan: PremiumPlanSlug = resolvePreferredPlan(billingStatus);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <p className="text-prose-faint text-xs mb-1" style={{ fontFamily: "var(--font-mono)" }}>
          // billing
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">Billing &amp; subscription</h1>
      </div>

      {checkout === "success" && (
        <div
          className="mb-6 px-4 py-3 rounded-md text-sm text-ok border"
          style={{ backgroundColor: "rgba(111,168,111,0.08)", borderColor: "rgba(111,168,111,0.25)" }}
          role="status"
        >
          Checkout completed. Your plan will update shortly.
        </div>
      )}
      {checkout === "cancelled" && (
        <div
          className="mb-6 px-4 py-3 rounded-md text-sm text-prose-muted border"
          style={{ backgroundColor: "var(--color-subtle)", borderColor: "var(--border-subtle)" }}
          role="status"
        >
          Checkout canceled. No changes were made.
        </div>
      )}

      <Card padding="lg" className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-sm font-semibold text-prose tracking-tight">Current plan</h2>
          <Pill variant={plan.isPremium ? "premium" : "free"} label={plan.label} />
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <span className="text-prose-muted">Subscription status</span>
            <span className="text-prose">{subscriptionStatus}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <span className="text-prose-muted">Renews / expires</span>
            <span className="text-prose">{renewal ?? "—"}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b" style={{ borderColor: "var(--border-subtle)" }}>
            <span className="text-prose-muted">Grace period ends</span>
            <span className="text-prose">{graceEnds ?? "—"}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-prose-muted">Last payment failure</span>
            <span className="text-prose">{paymentFailedAt ?? "—"}</span>
          </div>
        </div>
      </Card>

      <Card padding="lg">
        <h2 className="text-sm font-semibold text-prose mb-2 tracking-tight">
          {plan.isPremium ? "Manage your subscription" : "Upgrade to Premium"}
        </h2>
        <p className="text-sm text-prose-muted mb-5">
          {plan.isPremium
            ? "Open the billing portal to update payment method, change plan, or cancel."
            : "Unlock all premium tracks, graded capstones, and certificates with Stripe checkout."}
        </p>
        <BillingActionsClient isPremium={plan.isPremium} preferredPlan={preferredPlan} />
      </Card>
    </div>
  );
}

function resolvePreferredPlan(billingStatus: BillingState | null): PremiumPlanSlug {
  return billingStatus?.subscription?.plan === "premium-yearly"
    ? "premium-yearly"
    : "premium-monthly";
}

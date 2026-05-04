"use client";

import { useMemo } from "react";

import { BillingActions } from "@/components/billing/BillingActions";

interface BillingActionsClientProps {
  isPremium: boolean;
  preferredPlan: "premium-monthly" | "premium-yearly";
}

export function BillingActionsClient({ isPremium, preferredPlan }: BillingActionsClientProps) {
  const plan = useMemo(() => preferredPlan, [preferredPlan]);
  return <BillingActions isPremium={isPremium} preferredPlan={plan} />;
}

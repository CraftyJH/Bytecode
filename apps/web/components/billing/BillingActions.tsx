"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";

type BillingActionStatus = "idle" | "working" | "error";

interface BillingActionsProps {
  isPremium: boolean;
  preferredPlan?: "premium-monthly" | "premium-yearly";
}

async function requestRedirect(
  endpoint: "/api/billing/checkout" | "/api/billing/portal",
  body?: unknown,
) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = (await response.json().catch(() => null)) as
    | { url?: string; error?: string }
    | null;

  if (!response.ok || !json?.url) {
    throw new Error(json?.error ?? "Unable to open billing flow");
  }

  window.location.href = json.url;
}

export function BillingActions({ isPremium, preferredPlan = "premium-monthly" }: BillingActionsProps) {
  const [status, setStatus] = useState<BillingActionStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function openCheckout(plan: "premium-monthly" | "premium-yearly") {
    try {
      setStatus("working");
      setMessage(null);
      await requestRedirect("/api/billing/checkout", { plan });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to open checkout");
    } finally {
      setStatus((current) => (current === "error" ? "error" : "idle"));
    }
  }

  async function openPortal() {
    try {
      setStatus("working");
      setMessage(null);
      await requestRedirect("/api/billing/portal");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to open billing portal");
    } finally {
      setStatus((current) => (current === "error" ? "error" : "idle"));
    }
  }

  const disabled = status === "working";

  if (isPremium) {
    return (
      <div className="space-y-3">
        <Button onClick={openPortal} variant="primary" size="sm" className="w-full justify-center" disabled={disabled}>
          {disabled ? "Opening portal…" : "Manage billing"}
        </Button>
        {message && <p className="text-xs text-fail">{message}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={() => openCheckout(preferredPlan)}
        variant="primary"
        size="sm"
        className="w-full justify-center"
        disabled={disabled}
      >
        {disabled
          ? "Opening checkout…"
          : preferredPlan === "premium-yearly"
            ? "Upgrade yearly — $59/yr"
            : "Upgrade monthly — $9.99/mo"}
      </Button>
      <Button
        onClick={() =>
          openCheckout(preferredPlan === "premium-yearly" ? "premium-monthly" : "premium-yearly")
        }
        variant="secondary"
        size="sm"
        className="w-full justify-center"
        disabled={disabled}
      >
        {disabled
          ? "Opening checkout…"
          : preferredPlan === "premium-yearly"
            ? "Upgrade monthly — $9.99/mo"
            : "Upgrade yearly — $59/yr"}
      </Button>
      {message && <p className="text-xs text-fail">{message}</p>}
    </div>
  );
}

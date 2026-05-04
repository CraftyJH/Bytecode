import { NextResponse } from "next/server";

import { requireInternalBillingSyncToken } from "@/lib/stripe";

export const runtime = "nodejs";
export const maxDuration = 60;

interface ScheduleGraceRequest {
  userId?: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  runAt?: string;
}

function isAuthorized(inbound: string | null): boolean {
  if (!inbound) return false;
  return inbound === requireInternalBillingSyncToken();
}

function resolveSiteBase(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ).replace(/\/$/, "");
}

export async function POST(request: Request) {
  const token = request.headers.get("X-Bytecode-Internal-Token");
  if (!isAuthorized(token)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as ScheduleGraceRequest;
  const targetAt = body.runAt ? Date.parse(body.runAt) : NaN;
  if (!Number.isFinite(targetAt)) {
    return NextResponse.json({ error: "Missing or invalid runAt" }, { status: 400 });
  }

  const delayMs = Math.max(0, targetAt - Date.now());
  const siteBase = resolveSiteBase();
  const internalToken = requireInternalBillingSyncToken();

  setTimeout(async () => {
    try {
      await fetch(`${siteBase}/api/internal/billing/process-grace`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Bytecode-Internal-Token": internalToken,
        },
        body: JSON.stringify({
          userId: body.userId ?? null,
          stripeCustomerId: body.stripeCustomerId ?? null,
          stripeSubscriptionId: body.stripeSubscriptionId ?? null,
          force: true,
          cancelStripe: true,
        }),
        cache: "no-store",
      });
    } catch {
      // Scheduler is best-effort in this environment.
    }
  }, delayMs);

  return NextResponse.json({
    ok: true,
    scheduledFor: new Date(targetAt).toISOString(),
    delayMs,
  });
}

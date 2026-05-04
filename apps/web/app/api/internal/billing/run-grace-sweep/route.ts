import { NextResponse } from "next/server";

import { requireInternalBillingSyncToken } from "@/lib/stripe";

export const runtime = "nodejs";

function isAuthorized(inbound: string | null): boolean {
  if (!inbound) return false;
  return inbound === requireInternalBillingSyncToken();
}

interface ExpiredGraceRecord {
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

export async function POST(request: Request) {
  const token = request.headers.get("X-Bytecode-Internal-Token");
  if (!isAuthorized(token)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const apiBase = process.env.BYTECODE_API_URL ?? "http://localhost:8080";
  const siteBase =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
  const internalToken = requireInternalBillingSyncToken();
  const now = new Date().toISOString();

  const expiredRes = await fetch(
    `${apiBase}/api/internal/billing/expired-grace?at=${encodeURIComponent(now)}`,
    {
      method: "POST",
      headers: { "X-Bytecode-Internal-Token": internalToken },
      cache: "no-store",
    },
  );

  if (!expiredRes.ok) {
    return NextResponse.json(
      { error: `Unable to fetch expired grace records (${expiredRes.status})` },
      { status: 500 },
    );
  }

  const records = (await expiredRes.json()) as ExpiredGraceRecord[];
  let processed = 0;
  let failed = 0;

  for (const record of records) {
    const response = await fetch(
      `${siteBase.replace(/\/$/, "")}/api/internal/billing/process-grace`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Bytecode-Internal-Token": internalToken,
        },
        body: JSON.stringify({
          userId: record.userId,
          stripeCustomerId: record.stripeCustomerId,
          stripeSubscriptionId: record.stripeSubscriptionId,
          force: true,
          cancelStripe: false,
        }),
        cache: "no-store",
      },
    );

    if (response.ok) {
      processed += 1;
    } else {
      failed += 1;
    }
  }

  return NextResponse.json({
    ok: true,
    expired: records.length,
    processed,
    failed,
  });
}

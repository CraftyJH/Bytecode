import { NextResponse } from "next/server";

import { fetchBillingStatus } from "@/lib/user-state";

export const runtime = "nodejs";

function parseBearerToken(headers: Headers): string | null {
  const authorization = headers.get("authorization");
  if (!authorization) return null;
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function GET(request: Request) {
  const accessToken = parseBearerToken(request.headers);
  if (!accessToken) {
    return NextResponse.json({ error: "missing_token" }, { status: 401 });
  }

  const billing = await fetchBillingStatus(accessToken);
  if (!billing) {
    return NextResponse.json({ error: "Unable to resolve billing state" }, { status: 503 });
  }

  return NextResponse.json(billing);
}

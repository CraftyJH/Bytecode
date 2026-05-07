import { BYTECODE_API_URL, parseBearerToken, unauthorized } from "@/lib/api-proxy";
import { getStaticDaily } from "@/lib/challenges";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();

  if (BYTECODE_API_URL) {
    try {
      const res = await fetch(`${BYTECODE_API_URL}/api/challenges/daily`, {
        headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) return NextResponse.json(await res.json());
    } catch {
      // fall through to static
    }
  }

  return NextResponse.json(getStaticDaily());
}

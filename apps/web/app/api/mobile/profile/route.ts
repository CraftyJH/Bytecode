import { NextResponse } from "next/server";

const BYTECODE_API_URL = process.env.BYTECODE_API_URL ?? "http://localhost:8080";

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

  try {
    const response = await fetch(`${BYTECODE_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (response.status === 401 || response.status === 403) {
      return NextResponse.json({ error: "unauthorized" }, { status: response.status });
    }
    if (!response.ok) {
      return NextResponse.json(
        { error: "profile_unavailable", statusCode: response.status },
        { status: 503 },
      );
    }

    const profile = (await response.json()) as {
      role?: string;
      premiumUntil?: string | null;
      streakCount?: number;
    };
    return NextResponse.json({
      role: profile.role ?? "user",
      premiumUntil: profile.premiumUntil ?? null,
      streakCount: profile.streakCount ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "profile_unavailable" }, { status: 503 });
  }
}

import { NextResponse } from "next/server";

const BYTECODE_API_URL = process.env.BYTECODE_API_URL?.trim() ?? "";

export const runtime = "nodejs";

function parseBearerToken(headers: Headers): string | null {
  const authorization = headers.get("authorization");
  if (!authorization) return null;
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const decoded = Buffer.from(parts[1], "base64url").toString("utf8");
    const parsed = JSON.parse(decoded);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null;
    }
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function stringOrNull(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function fallbackRoleFromClaims(payload: Record<string, unknown>): string {
  const appMetadata = asRecord(payload.app_metadata);
  const explicitRole = stringOrNull(appMetadata?.role);
  if (explicitRole) {
    return explicitRole;
  }
  const plan = stringOrNull(appMetadata?.plan);
  if (plan === "premium") {
    return "premium";
  }
  return "user";
}

function buildFallbackProfile(accessToken: string) {
  const payload = parseJwtPayload(accessToken);
  const premiumUntil =
    stringOrNull(payload?.premiumUntil) ??
    stringOrNull(payload?.premium_until) ??
    null;

  return {
    email: stringOrNull(payload?.email),
    role: payload ? fallbackRoleFromClaims(payload) : "user",
    premiumUntil,
    streakCount: 0,
    xpTotal: 0,
    handle: null as string | null,
  };
}

export async function GET(request: Request) {
  const accessToken = parseBearerToken(request.headers);
  if (!accessToken) {
    return NextResponse.json({ error: "missing_token" }, { status: 401 });
  }

  const fallbackProfile = buildFallbackProfile(accessToken);
  try {
    if (!BYTECODE_API_URL) {
      return NextResponse.json(fallbackProfile);
    }

    const response = await fetch(`${BYTECODE_API_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(fallbackProfile);
    }

    const profile = (await response.json()) as {
      email?: string | null;
      role?: string;
      premiumUntil?: string | null;
      streakCount?: number;
      xpTotal?: number;
      name?: string | null;
    };
    return NextResponse.json({
      email: profile.email ?? fallbackProfile.email,
      role: profile.role ?? fallbackProfile.role,
      premiumUntil: profile.premiumUntil ?? null,
      streakCount: profile.streakCount ?? 0,
      xpTotal: profile.xpTotal ?? 0,
      handle: profile.name ?? null,
    });
  } catch {
    return NextResponse.json(fallbackProfile);
  }
}

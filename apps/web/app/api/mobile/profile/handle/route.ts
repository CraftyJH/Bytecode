import { NextResponse } from "next/server";

const BYTECODE_API_URL = process.env.BYTECODE_API_URL?.trim() ?? "";

export const runtime = "nodejs";

function parseBearerToken(headers: Headers): string | null {
  const authorization = headers.get("authorization");
  if (!authorization) return null;
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function PATCH(request: Request) {
  const accessToken = parseBearerToken(request.headers);
  if (!accessToken) {
    return NextResponse.json({ error: "missing_token" }, { status: 401 });
  }

  let body: { handle?: unknown };
  try {
    body = (await request.json()) as { handle?: unknown };
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const handle =
    typeof body?.handle === "string" ? body.handle.trim() : "";
  if (handle.length < 2 || handle.length > 30) {
    return NextResponse.json({ error: "invalid_handle" }, { status: 400 });
  }

  if (!BYTECODE_API_URL) {
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }

  try {
    const response = await fetch(`${BYTECODE_API_URL}/api/users/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name: handle }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "upstream_error" }, { status: response.status });
    }

    const updated = (await response.json()) as { name?: string | null };
    return NextResponse.json({ handle: updated.name ?? handle });
  } catch {
    return NextResponse.json({ error: "service_error" }, { status: 503 });
  }
}

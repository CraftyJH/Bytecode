import { NextResponse } from "next/server";

export const BYTECODE_API_URL = (process.env.BYTECODE_API_URL ?? "").trim();

export function parseBearerToken(headers: Headers): string | null {
  const auth = headers.get("authorization");
  if (!auth) return null;
  const m = auth.match(/^Bearer\s+(.+)$/i);
  return m?.[1]?.trim() ?? null;
}

export function unauthorized() {
  return NextResponse.json({ error: "missing_token" }, { status: 401 });
}

export async function proxyGet<T>(
  path: string,
  token: string,
  fallback: T,
): Promise<NextResponse> {
  if (!BYTECODE_API_URL) return NextResponse.json(fallback);
  try {
    const res = await fetch(`${BYTECODE_API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json(fallback);
    return NextResponse.json((await res.json()) as T);
  } catch {
    return NextResponse.json(fallback);
  }
}

export async function proxyPost<T>(
  path: string,
  token: string,
  body: unknown,
  fallback: T,
): Promise<NextResponse> {
  if (!BYTECODE_API_URL) return NextResponse.json(fallback);
  try {
    const res = await fetch(`${BYTECODE_API_URL}${path}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json(fallback);
    return NextResponse.json((await res.json()) as T);
  } catch {
    return NextResponse.json(fallback);
  }
}

export async function proxyDelete(
  path: string,
  token: string,
): Promise<NextResponse> {
  if (!BYTECODE_API_URL) return NextResponse.json({ status: "ok" });
  try {
    const res = await fetch(`${BYTECODE_API_URL}${path}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return NextResponse.json({ status: "error" });
    return NextResponse.json({ status: "ok" });
  } catch {
    return NextResponse.json({ status: "ok" });
  }
}

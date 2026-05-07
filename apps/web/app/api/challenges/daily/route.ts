import { parseBearerToken, proxyGet, unauthorized } from "@/lib/api-proxy";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyGet("/api/challenges/daily", token, {
    easy: null,
    intermediate: null,
    hard: null,
  });
}

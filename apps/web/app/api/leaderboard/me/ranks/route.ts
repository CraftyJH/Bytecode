import { parseBearerToken, proxyGet, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

const fallback = { isoWeek: "" };

export async function GET(request: Request) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyGet("/api/leaderboard/me/ranks", token, fallback);
}

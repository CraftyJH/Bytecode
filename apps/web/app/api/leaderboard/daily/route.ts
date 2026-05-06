import { parseBearerToken, proxyGet, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

const fallback = { challengeId: "", challengeTitle: "", entries: [] };

export async function GET(request: Request) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyGet("/api/leaderboard/daily", token, fallback);
}

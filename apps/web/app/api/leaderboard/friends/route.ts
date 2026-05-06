import { parseBearerToken, proxyGet, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

const fallback = { isoWeek: "", entries: [], myScore: 0 };

export async function GET(request: Request) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyGet("/api/leaderboard/friends", token, fallback);
}

import { parseBearerToken, proxyGet, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: { difficulty: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyGet(`/api/leaderboard/diff/${params.difficulty}`, token, { board: params.difficulty, entries: [] });
}

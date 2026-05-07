import { parseBearerToken, proxyGet, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ difficulty: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { difficulty } = await params;
  return proxyGet(`/api/leaderboard/diff/${difficulty}`, token, { board: difficulty, entries: [] });
}

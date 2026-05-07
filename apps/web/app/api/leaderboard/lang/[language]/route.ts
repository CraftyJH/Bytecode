import { parseBearerToken, proxyGet, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ language: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { language } = await params;
  return proxyGet(`/api/leaderboard/lang/${language}`, token, { board: language, entries: [] });
}

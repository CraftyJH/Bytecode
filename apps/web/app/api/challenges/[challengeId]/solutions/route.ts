import { parseBearerToken, proxyGet, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ challengeId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { challengeId } = await params;
  return proxyGet(`/api/challenges/${challengeId}/solutions`, token, []);
}

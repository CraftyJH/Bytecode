import { parseBearerToken, proxyGet, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ challengeId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { challengeId } = await params;
  return proxyGet(`/api/challenges/${challengeId}/discuss`, token, []);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ challengeId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { challengeId } = await params;
  const body = (await request.json()) as unknown;
  return proxyPost(`/api/challenges/${challengeId}/discuss`, token, body, { id: "", challengeId, authorName: "", body: "", upvotes: 0, isOwn: true, createdAt: "" });
}

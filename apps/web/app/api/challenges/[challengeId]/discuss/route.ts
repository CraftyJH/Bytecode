import { parseBearerToken, proxyGet, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: { challengeId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyGet(`/api/challenges/${params.challengeId}/discuss`, token, []);
}

export async function POST(
  request: Request,
  { params }: { params: { challengeId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const body = (await request.json()) as unknown;
  return proxyPost(`/api/challenges/${params.challengeId}/discuss`, token, body, { id: "", challengeId: params.challengeId, authorName: "", body: "", upvotes: 0, isOwn: true, createdAt: "" });
}

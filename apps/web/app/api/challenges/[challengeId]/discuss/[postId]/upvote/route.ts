import { parseBearerToken, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ challengeId: string; postId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { challengeId, postId } = await params;
  return proxyPost(`/api/challenges/${challengeId}/discuss/${postId}/upvote`, token, {}, { status: "ok" });
}

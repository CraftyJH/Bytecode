import { parseBearerToken, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: { challengeId: string; postId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyPost(`/api/challenges/${params.challengeId}/discuss/${params.postId}/upvote`, token, {}, { status: "ok" });
}

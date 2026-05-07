import { parseBearerToken, proxyDelete, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ challengeId: string; postId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { challengeId, postId } = await params;
  return proxyDelete(`/api/challenges/${challengeId}/discuss/${postId}`, token);
}

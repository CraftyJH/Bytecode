import { parseBearerToken, proxyDelete, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: { challengeId: string; postId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyDelete(`/api/challenges/${params.challengeId}/discuss/${params.postId}`, token);
}

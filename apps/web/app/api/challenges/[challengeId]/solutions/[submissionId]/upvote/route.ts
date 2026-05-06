import { parseBearerToken, proxyDelete, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: { challengeId: string; submissionId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyPost(`/api/challenges/${params.challengeId}/solutions/${params.submissionId}/upvote`, token, {}, { status: "ok" });
}

export async function DELETE(
  request: Request,
  { params }: { params: { challengeId: string; submissionId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyDelete(`/api/challenges/${params.challengeId}/solutions/${params.submissionId}/upvote`, token);
}

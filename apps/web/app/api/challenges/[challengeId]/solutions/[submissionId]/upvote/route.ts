import { parseBearerToken, proxyDelete, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ challengeId: string; submissionId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { challengeId, submissionId } = await params;
  return proxyPost(`/api/challenges/${challengeId}/solutions/${submissionId}/upvote`, token, {}, { status: "ok" });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ challengeId: string; submissionId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { challengeId, submissionId } = await params;
  return proxyDelete(`/api/challenges/${challengeId}/solutions/${submissionId}/upvote`, token);
}

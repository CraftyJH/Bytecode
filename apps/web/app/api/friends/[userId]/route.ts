import { parseBearerToken, proxyDelete, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { userId } = await params;
  return proxyDelete(`/api/friends/${userId}`, token);
}

import { parseBearerToken, proxyDelete, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyDelete(`/api/friends/${params.userId}`, token);
}

import { parseBearerToken, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ requesterId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { requesterId } = await params;
  return proxyPost(`/api/friends/accept/${requesterId}`, token, {}, { status: "accepted", message: "Friend request accepted" });
}

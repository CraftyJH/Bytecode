import { parseBearerToken, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: { requesterId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyPost(`/api/friends/accept/${params.requesterId}`, token, {}, { status: "accepted", message: "Friend request accepted" });
}

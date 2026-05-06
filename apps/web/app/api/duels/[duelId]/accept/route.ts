import { parseBearerToken, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: { duelId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  return proxyPost(`/api/duels/${params.duelId}/accept`, token, {}, { status: "accepted", message: "Duel accepted" });
}

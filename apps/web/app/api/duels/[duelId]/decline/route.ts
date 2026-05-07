import { parseBearerToken, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ duelId: string }> },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const { duelId } = await params;
  return proxyPost(`/api/duels/${duelId}/decline`, token, {}, { status: "declined", message: "Duel declined" });
}

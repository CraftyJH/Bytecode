import { parseBearerToken, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const body = (await request.json()) as unknown;
  return proxyPost("/api/duels/challenge", token, body, { status: "pending", message: "Challenge sent" });
}

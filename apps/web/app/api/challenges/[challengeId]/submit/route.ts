import { parseBearerToken, proxyPost, unauthorized } from "@/lib/api-proxy";

export const runtime = "nodejs";

const fallback = {
  isCorrect: false,
  visibleResults: [],
  hiddenPass: 0,
  hiddenTotal: 0,
};

export async function POST(
  request: Request,
  { params }: { params: { challengeId: string } },
) {
  const token = parseBearerToken(request.headers);
  if (!token) return unauthorized();
  const body = (await request.json()) as unknown;
  return proxyPost(`/api/challenges/${params.challengeId}/submit`, token, body, fallback);
}

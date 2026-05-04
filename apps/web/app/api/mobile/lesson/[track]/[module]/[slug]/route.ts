import { NextResponse } from "next/server";

import { buildMobileLessonResponse } from "@/lib/mobile-curriculum";

export const runtime = "nodejs";

interface MobileLessonRouteParams {
  params: Promise<{
    track: string;
    module: string;
    slug: string;
  }>;
}

export async function GET(_request: Request, { params }: MobileLessonRouteParams) {
  const { track, module, slug } = await params;
  const response = await buildMobileLessonResponse(track, module, slug, _request.headers);
  if ("status" in response) {
    return NextResponse.json(response.body, { status: response.status });
  }

  return NextResponse.json(response);
}

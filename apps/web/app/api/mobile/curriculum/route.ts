import { NextResponse } from "next/server";

import { buildMobileCurriculumResponse } from "@/lib/mobile-curriculum";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const response = await buildMobileCurriculumResponse(request.headers);
  return NextResponse.json(response);
}

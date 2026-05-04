import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BYTECODE_API_URL = process.env.BYTECODE_API_URL ?? "http://localhost:8080";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return NextResponse.json({ completedLessonSlugs: [] });
  }

  const res = await fetch(`${BYTECODE_API_URL}/api/progress`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

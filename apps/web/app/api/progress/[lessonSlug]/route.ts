import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BYTECODE_API_URL = process.env.BYTECODE_API_URL ?? "http://localhost:8080";

async function proxy(method: "POST" | "DELETE", lessonSlug: string) {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const res = await fetch(`${BYTECODE_API_URL}/api/progress/${encodeURIComponent(lessonSlug)}`, {
    method,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> },
) {
  const { lessonSlug } = await params;
  return proxy("POST", lessonSlug);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ lessonSlug: string }> },
) {
  const { lessonSlug } = await params;
  return proxy("DELETE", lessonSlug);
}

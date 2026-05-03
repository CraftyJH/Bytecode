import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const {
    data: { user: caller },
  } = await adminClient.auth.admin.getUserById(user.id);

  if (caller?.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, slug, author, excerpt, content } = await req.json() as {
    title: string;
    slug: string;
    author: string;
    excerpt?: string;
    content: string;
  };

  if (!title || !slug || !content) {
    return NextResponse.json({ error: "title, slug and content are required" }, { status: 400 });
  }

  const { error } = await adminClient
    .from("posts")
    .insert({ title, slug, author, excerpt: excerpt || null, content });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ slug });
}

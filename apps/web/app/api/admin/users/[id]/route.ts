import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // Verify caller is authenticated
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Verify caller is admin via fresh app_metadata
  const adminClient = createAdminClient();
  const {
    data: { user: caller },
  } = await adminClient.auth.admin.getUserById(user.id);

  if (caller?.app_metadata?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json() as { field: string; value: string | boolean };
  const { field, value } = body;

  if (!["plan", "role", "streak_disabled"].includes(field)) {
    return NextResponse.json({ error: "Invalid field" }, { status: 400 });
  }

  if (field === "streak_disabled" && typeof value !== "boolean") {
    return NextResponse.json({ error: "Invalid streak_disabled value" }, { status: 400 });
  }

  if ((field === "plan" || field === "role") && typeof value !== "string") {
    return NextResponse.json({ error: "Invalid metadata value" }, { status: 400 });
  }

  const { data: existing } = await adminClient.auth.admin.getUserById(id);
  const appMetadata = {
    ...(existing.user?.app_metadata ?? {}),
    [field]: value,
  };

  const { error } = await adminClient.auth.admin.updateUserById(id, {
    app_metadata: appMetadata,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

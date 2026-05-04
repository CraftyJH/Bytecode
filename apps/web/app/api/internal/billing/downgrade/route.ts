import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireInternalBillingSyncToken } from "@/lib/stripe";

export const runtime = "nodejs";

interface DowngradeRequestBody {
  userId?: string;
}

function isAuthorized(inbound: string | null): boolean {
  if (!inbound) return false;
  return inbound === requireInternalBillingSyncToken();
}

export async function POST(request: Request) {
  const token = request.headers.get("X-Bytecode-Internal-Token");
  if (!isAuthorized(token)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as DowngradeRequestBody;
  const userId = body.userId;
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  const admin = createAdminClient();
  const {
    data: { user },
    error: getError,
  } = await admin.auth.admin.getUserById(userId);

  if (getError || !user) {
    return NextResponse.json(
      { error: getError?.message ?? `Unable to load user ${userId}` },
      { status: 404 },
    );
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...(user.app_metadata ?? {}),
      plan: "free",
    },
  });

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

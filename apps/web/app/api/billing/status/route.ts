import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { fetchBillingStatus } from "@/lib/user-state";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const billing = await fetchBillingStatus(session?.access_token);
  if (!billing) {
    return NextResponse.json({ billing: null });
  }

  return NextResponse.json({ billing });
}

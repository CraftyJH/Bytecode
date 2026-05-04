import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";
import { fetchBillingStatus } from "@/lib/user-state";

export const runtime = "nodejs";

function buildAbsoluteUrl(path: string): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return `${explicit.replace(/\/$/, "")}${path}`;

  const fallback = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  return `${fallback}${path}`;
}

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const billingStatus = await fetchBillingStatus(session?.access_token);
  const knownCustomerId = billingStatus?.subscription?.stripeCustomerId ?? null;

  const stripe = getStripe();
  let customerId = knownCustomerId;
  if (!customerId) {
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    customerId = customers.data[0]?.id ?? null;
  }

  if (!customerId) {
    return NextResponse.json({ error: "No billing customer found" }, { status: 404 });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: buildAbsoluteUrl("/me/billing"),
  });

  return NextResponse.json({ url: portalSession.url });
}

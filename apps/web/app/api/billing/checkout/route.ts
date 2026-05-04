import { NextResponse } from "next/server";

import { resolvePlanBySlug } from "@/lib/billing";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

interface CheckoutRequestBody {
  plan?: string;
}

function buildAbsoluteUrl(path: string): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return `${explicit.replace(/\/$/, "")}${path}`;

  const fallback = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  return `${fallback}${path}`;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as CheckoutRequestBody;
  const plan = resolvePlanBySlug(body.plan ?? "premium-monthly");
  if (!plan || !plan.priceId) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const stripe = getStripe();
  const customerEmail = user.email ?? undefined;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: customerEmail,
    line_items: [{ price: plan.priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: buildAbsoluteUrl("/me/billing?checkout=success"),
    cancel_url: buildAbsoluteUrl("/me/billing?checkout=cancelled"),
    metadata: {
      supabase_user_id: user.id,
      bytecode_plan_slug: plan.slug,
      bytecode_plan_lookup_key: plan.lookupKey,
    },
    subscription_data: {
      metadata: {
        supabase_user_id: user.id,
        bytecode_plan_slug: plan.slug,
        bytecode_plan_lookup_key: plan.lookupKey,
      },
    },
  });

  if (!session.url) {
    return NextResponse.json({ error: "Unable to create checkout session" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}

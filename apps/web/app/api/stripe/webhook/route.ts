import { NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  syncFromInvoicePaid,
  syncFromInvoicePaymentFailed,
  syncFromSubscriptionDeleted,
  syncFromSubscriptionEvent,
} from "@/lib/billing-sync";
import { getStripe, requireWebhookSecret } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature header" }, { status: 400 });
  }

  const payload = await request.text();
  const stripe = getStripe();
  const webhookSecret = requireWebhookSecret();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown webhook signature error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    await handleEvent(event);
    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unhandled webhook error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function handleEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== "subscription") return;
      const subscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null;
      if (!subscriptionId) return;

      const stripe = getStripe();
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await syncFromSubscriptionEvent(subscription, event.created);
      return;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncFromSubscriptionEvent(subscription, event.created);
      return;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await syncFromSubscriptionDeleted(subscription, event.created);
      return;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      await syncFromInvoicePaid(invoice, event.created);
      return;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await syncFromInvoicePaymentFailed(invoice, event.created);
      return;
    }

    default:
      return;
  }
}


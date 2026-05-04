import Stripe from "stripe";

let stripeClient: Stripe | null = null;
const stripeApiVersion = "2026-04-22.dahlia";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getStripe(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
      apiVersion: stripeApiVersion,
      appInfo: {
        name: "Bytecode Billing",
        version: "1.0.0",
      },
    });
  }
  return stripeClient;
}

export function requireWebhookSecret(): string {
  return requireEnv("STRIPE_WEBHOOK_SECRET");
}

export function requireInternalBillingSyncToken(): string {
  return requireEnv("BYTECODE_INTERNAL_BILLING_SYNC_TOKEN");
}

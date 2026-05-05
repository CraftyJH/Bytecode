import { NextResponse } from "next/server";

export const runtime = "nodejs";

interface MobileConfigResponse {
  supabaseUrl: string;
  supabasePublishableKey: string;
  bytecodeApiUrl: string;
  webBaseUrl: string;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

function resolveOriginFallback(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ??
    process.env.NEXT_PUBLIC_APP_URL?.trim() ??
    ""
  );
}

function sanitizeOrigin(value: string): string {
  return value.trim().replace(/\/$/, "");
}

function resolveRequestOrigin(request: Request): string {
  try {
    return sanitizeOrigin(new URL(request.url).origin);
  } catch {
    return "";
  }
}

function resolveVercelOrigin(): string {
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (!vercelUrl) return "";
  return sanitizeOrigin(`https://${vercelUrl}`);
}

export async function GET(request: Request) {
  try {
    const supabasePublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ??
      "";
    if (!supabasePublishableKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY",
      );
    }

    const requestOrigin = resolveRequestOrigin(request);
    const originFallback = resolveOriginFallback() || resolveVercelOrigin() || requestOrigin;
    let bytecodeApiUrl = process.env.BYTECODE_API_URL?.trim() ?? "";
    let webBaseUrl = originFallback;

    if (!bytecodeApiUrl && originFallback) {
      bytecodeApiUrl = originFallback;
    }
    if (!webBaseUrl && bytecodeApiUrl) {
      webBaseUrl = bytecodeApiUrl;
    }

    if (!bytecodeApiUrl || !webBaseUrl) {
      throw new Error("Missing BYTECODE_API_URL or NEXT_PUBLIC_SITE_URL for mobile config");
    }

    const response: MobileConfigResponse = {
      supabaseUrl: requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
      supabasePublishableKey,
      bytecodeApiUrl,
      webBaseUrl,
    };

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to resolve mobile config";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

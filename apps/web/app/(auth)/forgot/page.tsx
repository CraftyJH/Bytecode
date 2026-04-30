import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface ForgotPageProps {
  searchParams: Promise<{ error?: string; sent?: string }>;
}

async function sendReset(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const email = formData.get("email") as string;

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback?next=/me/settings`,
  });

  // Always redirect to success — don't reveal whether the email exists
  redirect("/forgot?sent=1");
}

export default async function ForgotPage({ searchParams }: ForgotPageProps) {
  const { sent } = await searchParams;

  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        <p
          className="text-prose-faint text-xs mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // check your inbox
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight mb-3">
          Reset link sent.
        </h1>
        <p className="text-sm text-prose-muted">
          If that address has an account, you&apos;ll receive a reset link within a
          minute. Check your spam folder if nothing arrives.
        </p>
        <p className="mt-6">
          <a
            href="/signin"
            className="text-sm text-accent hover:text-accent-warm transition-colors duration-100"
          >
            Back to sign in →
          </a>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-7 text-center">
        <p
          className="text-prose-faint text-xs mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // forgot password
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Reset your password.
        </h1>
        <p className="mt-2 text-sm text-prose-muted">
          Enter your email and we&apos;ll send a reset link.
        </p>
      </div>

      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <form action={sendReset} className="flex flex-col gap-4">
          <Input label="Email" name="email" type="email" required autoComplete="email" autoFocus />
          <Button variant="primary" size="md" className="w-full justify-center mt-1">
            Send reset link
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-prose-faint mt-6">
        Remembered it?{" "}
        <a
          href="/signin"
          className="text-prose-muted hover:text-prose transition-colors duration-100"
        >
          Sign in
        </a>
      </p>
    </div>
  );
}

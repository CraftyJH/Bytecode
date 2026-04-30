import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface SignUpPageProps {
  searchParams: Promise<{ plan?: string; error?: string }>;
}

async function signUp(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  // Show confirmation message
  redirect("/signup?check_email=1");
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const { plan, error } = await searchParams;
  const params = await searchParams;
  const checkEmail = "check_email" in params;

  if (checkEmail) {
    return (
      <div className="w-full max-w-sm text-center">
        <p
          className="text-prose-faint text-xs mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // check your inbox
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight mb-3">
          One more step.
        </h1>
        <p className="text-sm text-prose-muted">
          We sent a confirmation link to your email. Click it to activate your
          account — then you can sign in.
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
          // create account
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Start learning for free.
        </h1>
        {plan === "premium" && (
          <p className="mt-2 text-sm text-prose-muted">
            You&apos;ll choose a plan after signing up.
          </p>
        )}
      </div>

      <div
        className="rounded-lg border p-6"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        {error && (
          <div
            className="mb-5 px-3.5 py-2.5 rounded-md text-sm text-fail border"
            style={{
              backgroundColor: "rgba(199,123,123,0.08)",
              borderColor: "rgba(199,123,123,0.25)",
            }}
            role="alert"
          >
            {decodeURIComponent(error)}
          </div>
        )}

        <form action={signUp} className="flex flex-col gap-4">
          <Input label="Name" name="name" type="text" required autoComplete="name" autoFocus placeholder="Sam" />
          <Input label="Email" name="email" type="email" required autoComplete="email" />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            hint="At least 8 characters."
            minLength={8}
          />
          <Button variant="primary" size="md" className="w-full justify-center mt-1">
            Create account — it&apos;s free
          </Button>
        </form>
      </div>

      <p className="text-center text-xs text-prose-faint mt-6">
        By signing up you agree to our{" "}
        <a href="/terms" className="hover:text-prose-muted transition-colors duration-100">
          Terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="hover:text-prose-muted transition-colors duration-100">
          Privacy Policy
        </a>
        .
      </p>

      <p className="text-center text-sm text-prose-faint mt-4">
        Already have an account?{" "}
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

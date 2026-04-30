import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface SignInPageProps {
  searchParams: Promise<{ next?: string; error?: string }>;
}

async function signIn(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const next = (formData.get("next") as string) || "/dashboard";

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/signin?error=${encodeURIComponent(error.message)}&next=${encodeURIComponent(next)}`);
  }

  redirect(next);
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next = "/dashboard", error } = await searchParams;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-7 text-center">
        <p
          className="text-prose-faint text-xs mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // sign in
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Welcome back.
        </h1>
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

        <form action={signIn} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <Input label="Email" name="email" type="email" required autoComplete="email" autoFocus />
          <Input
            label="Password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
          <div className="flex justify-end">
            <a
              href="/forgot"
              className="text-xs text-prose-faint hover:text-prose-muted transition-colors duration-100"
            >
              Forgot password?
            </a>
          </div>
          <Button variant="primary" size="md" className="w-full justify-center mt-1">
            Sign in
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-prose-faint mt-6">
        No account?{" "}
        <a
          href="/signup"
          className="text-prose-muted hover:text-prose transition-colors duration-100"
        >
          Start free
        </a>
      </p>
    </div>
  );
}

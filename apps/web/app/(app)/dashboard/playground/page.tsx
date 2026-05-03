import { createClient } from "@/lib/supabase/server";
import { PlaygroundEditor } from "@/components/playground/PlaygroundEditor";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";
import { hasFullAccess } from "@/lib/access";

export const metadata = { title: "Playground — Bytecode" };

export default async function PlaygroundPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!hasFullAccess(user)) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <p
            className="text-prose-faint text-xs mb-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // playground
          </p>
          <h1 className="text-2xl font-semibold text-prose tracking-tight">
            Coding Playground
          </h1>
        </div>

        <div
          className="flex flex-col items-center justify-center text-center rounded-xl border py-20 px-6"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
            style={{ backgroundColor: "var(--color-subtle)" }}
          >
            <Lock size={20} className="text-prose-faint" />
          </div>
          <h2 className="text-xl font-semibold text-prose tracking-tight mb-2">
            Premium feature
          </h2>
          <p className="text-sm text-prose-muted mb-8 max-w-sm leading-relaxed">
            The coding playground is available to Premium members. Upgrade to get unlimited
            access — write, run, and experiment with any Java code, no lesson required.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button as="a" href="/pricing" variant="primary" size="md">
              View pricing
            </Button>
            <Button as="a" href="/dashboard" variant="secondary" size="md">
              Back to dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8">
        <p
          className="text-prose-faint text-xs mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // playground
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Coding Playground
        </h1>
        <p className="text-sm text-prose-muted mt-1">
          Write and run any Java code — no lesson, no rules.
        </p>
      </div>

      <PlaygroundEditor />
    </div>
  );
}

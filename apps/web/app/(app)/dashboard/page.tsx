import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Pill } from "@/components/ui/Pill";
import { Button } from "@/components/ui/Button";
import { Lock, Code2 } from "lucide-react";

const tracks = [
  { num: "01", title: "Java Beginner", progress: 0, total: 8, variant: "free" as const },
  { num: "02", title: "Java Intermediate", progress: 0, total: 12, variant: "free" as const },
  { num: "03", title: "Java Advanced", progress: 0, total: 15, variant: "premium" as const },
  { num: "04", title: "Kotlin Bridge", progress: 0, total: 10, variant: "premium" as const },
  { num: "05", title: "Kotlin Advanced", progress: 0, total: 10, variant: "premium" as const },
  { num: "06", title: "Projects", progress: 0, total: 7, variant: "free" as const },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName =
    user?.user_metadata?.name ?? user?.email?.split("@")[0] ?? "there";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Greeting */}
      <div className="mb-10">
        <p
          className="text-prose-faint text-xs mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // dashboard
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Welcome back, {firstName}.
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resume card */}
          <Card padding="lg">
            <p
              className="text-prose-faint text-xs mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // pick up where you left off
            </p>
            <h2 className="text-lg font-semibold text-prose mb-1 tracking-tight">
              Lesson 1: Hello, Java
            </h2>
            <p className="text-sm text-prose-muted mb-5">
              Java Beginner › Module 1: Java Foundations · ~10 min
            </p>
            <Button as="a" href="/curriculum/java-beginner/module-1/lesson/hello-java" variant="primary" size="sm">
              Start lesson →
            </Button>
          </Card>

          {/* Playground card */}
          <Card padding="lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p
                  className="text-prose-faint text-xs mb-3"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  // coding playground
                </p>
                <h2 className="text-lg font-semibold text-prose mb-1 tracking-tight">
                  Playground
                </h2>
                <p className="text-sm text-prose-muted mb-5">
                  Write and run any Java code freely — no lesson, no constraints.
                </p>
                <div className="flex items-center gap-3">
                  <Button as="a" href="/dashboard/playground" variant="secondary" size="sm">
                    <Code2 size={13} className="mr-1.5" />
                    Open playground
                  </Button>
                  <span className="flex items-center gap-1 text-xs text-prose-faint">
                    <Lock size={11} />
                    Premium
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Path progress */}
          <div>
            <p
              className="text-prose-faint text-xs mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // the path
            </p>
            <div className="space-y-3">
              {tracks.map(({ num, title, progress, total, variant }) => (
                <div
                  key={num}
                  className="flex items-center gap-4 py-3.5 px-4 rounded-md border"
                  style={{
                    backgroundColor: "var(--color-elevated)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <span
                    className="text-prose-faint text-xs w-6 shrink-0"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {num}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-prose mb-1.5 truncate">
                      {title}
                    </p>
                    {/* Progress bar */}
                    <div
                      className="h-1 rounded-full overflow-hidden"
                      style={{ backgroundColor: "var(--color-subtle)" }}
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={total}
                      aria-label={`${title} progress`}
                    >
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-300"
                        style={{ width: `${(progress / total) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-prose-faint mt-1">
                      {progress}/{total} lessons
                    </p>
                  </div>
                  <Pill variant={variant} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Stats */}
          <Card padding="md">
            <p
              className="text-prose-faint text-xs mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // your stats
            </p>
            {[
              { label: "Lessons completed", value: "0" },
              { label: "Current streak", value: "0 days" },
              { label: "Quizzes passed", value: "0" },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-baseline py-2 border-b last:border-0"
                style={{ borderColor: "var(--border-subtle)" }}>
                <span className="text-xs text-prose-muted">{label}</span>
                <span className="text-sm font-semibold text-prose">{value}</span>
              </div>
            ))}
          </Card>

          {/* Plan */}
          <Card padding="md">
            <p
              className="text-prose-faint text-xs mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // your plan
            </p>
            <Pill variant="free" className="mb-3" />
            <p className="text-xs text-prose-muted mb-4">
              Upgrade to Premium for full Java + Kotlin tracks, capstones, and certificates.
            </p>
            <Button as="a" href="/pricing" variant="secondary" size="sm" className="w-full justify-center">
              View pricing
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

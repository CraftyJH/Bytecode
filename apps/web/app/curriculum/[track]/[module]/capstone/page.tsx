import { notFound } from "next/navigation";
import { getTrack, getModule } from "@/lib/curriculum";
import { CAPSTONE_STARTER_CODE, HINTS, REFERENCE_SOLUTION, TOTAL_TESTS } from "@/lib/capstone";
import { CapstonePanel } from "@/components/capstone/CapstonePanel";
import { Pill } from "@/components/ui/Pill";
import { Clock, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ track: string; module: string }>;
}

export default async function CapstonePage({ params }: Props) {
  const { track: trackSlug, module: moduleSlug } = await params;

  const track = getTrack(trackSlug);
  const mod = getModule(trackSlug, moduleSlug);
  if (!track || !mod) notFound();

  // Only Module 1 of java-beginner has a capstone for now
  if (trackSlug !== "java-beginner" || moduleSlug !== "module-1") notFound();

  // TODO (Sprint 5): replace with real entitlement check via subscriptions table.
  // For now, authenticated users are treated as Premium so the capstone is testable.
  let isPremium = false;
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  ) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.auth.getUser();
      isPremium = !!data.user;
    } catch { /* continue as free */ }
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ paddingTop: "56px" }}>
      {/* Page header */}
      <div
        className="border-b px-6 lg:px-10 py-6"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}
      >
        <nav
          className="mb-3 flex items-center gap-1.5 text-xs text-prose-faint"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <a href="/curriculum" className="hover:text-prose-muted transition-colors">curriculum</a>
          <span>/</span>
          <a href={`/curriculum/${trackSlug}`} className="hover:text-prose-muted transition-colors">{track.title}</a>
          <span>/</span>
          <a href={`/curriculum/${trackSlug}/${moduleSlug}`} className="hover:text-prose-muted transition-colors">{mod.title}</a>
          <span>/</span>
          <span className="text-prose-muted">capstone</span>
        </nav>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Pill variant="premium" />
              <span
                className="flex items-center gap-1 text-xs text-prose-faint"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <Clock size={11} />
                ~30 min
              </span>
              <span
                className="flex items-center gap-1 text-xs text-prose-faint"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <Trophy size={11} />
                {TOTAL_TESTS} tests
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-semibold text-prose tracking-tight">
              Capstone: Number Guessing Game
            </h1>
            <p className="text-sm text-prose-muted mt-1">
              {mod.title} · {track.title}
            </p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-1 flex-col lg:flex-row min-h-0">
        {/* Left — brief */}
        <article className="lg:w-[42%] shrink-0 px-6 lg:px-10 py-8 overflow-y-auto border-r"
          style={{ borderColor: "var(--border-subtle)" }}>

          <section className="mb-8">
            <h2 className="text-base font-semibold text-prose mb-3 tracking-tight">What you&apos;ll build</h2>
            <p className="text-sm text-prose-muted leading-relaxed mb-4">
              A classic number guessing game engine. You&apos;ll write two methods:
            </p>
            <div className="space-y-3">
              <div className="px-4 py-3 rounded-md border text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}>
                <code className="font-semibold text-prose" style={{ fontFamily: "var(--font-mono)" }}>getHint(int guess, int secret)</code>
                <p className="text-prose-muted mt-1">Returns <code style={{ fontFamily: "var(--font-mono)" }}>&quot;Too low!&quot;</code>, <code style={{ fontFamily: "var(--font-mono)" }}>&quot;Too high!&quot;</code>, or <code style={{ fontFamily: "var(--font-mono)" }}>&quot;Correct!&quot;</code></p>
              </div>
              <div className="px-4 py-3 rounded-md border text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}>
                <code className="font-semibold text-prose" style={{ fontFamily: "var(--font-mono)" }}>countGuesses(int[] guesses, int secret)</code>
                <p className="text-prose-muted mt-1">Returns the 1-indexed position of the first matching guess, or <code style={{ fontFamily: "var(--font-mono)" }}>-1</code> if not found.</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-semibold text-prose mb-3 tracking-tight">Why this challenge</h2>
            <p className="text-sm text-prose-muted leading-relaxed mb-3">
              This brings together everything from Module 1:
            </p>
            <ul className="space-y-1.5 text-sm text-prose-muted">
              {[
                "Methods with parameters and return values",
                "Conditionals to decide the hint",
                "Loops to walk the array of guesses",
                "Arrays as inputs",
                "Strings as return values",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-semibold text-prose mb-3 tracking-tight">How it works</h2>
            <ol className="space-y-2 text-sm text-prose-muted">
              {[
                "Write your two methods in the editor.",
                "Click Run to test with the demo inputs.",
                "Click Submit to run all 14 hidden tests.",
                "Up to 5 progressive hints are available after failed submissions.",
                "The reference solution unlocks after 3 failed submissions.",
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: "var(--color-subtle)", color: "var(--color-prose-muted)" }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-base font-semibold text-prose mb-3 tracking-tight">Reward</h2>
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-md border"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}
            >
              <Trophy size={18} className="text-accent shrink-0" />
              <div>
                <p className="text-sm font-medium text-prose">Java Beginner — Module 1 Mastery</p>
                <p className="text-xs text-prose-faint mt-0.5">Badge · Certificate · Unlocks Module 2</p>
              </div>
            </div>
          </section>
        </article>

        {/* Right — editor panel */}
        <div className="flex-1 min-w-0">
          <CapstonePanel
            capstoneId="capstone-java-beginner-1"
            starterCode={CAPSTONE_STARTER_CODE}
            hints={HINTS}
            referenceSolution={REFERENCE_SOLUTION}
            totalTests={TOTAL_TESTS}
            isPremium={isPremium}
            nextPath={`/curriculum/${trackSlug}/${moduleSlug}`}
            certificatePath={`/curriculum/${trackSlug}/${moduleSlug}/capstone/certificate`}
          />
        </div>
      </div>
    </div>
  );
}

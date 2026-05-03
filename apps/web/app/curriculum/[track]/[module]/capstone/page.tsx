import { notFound } from "next/navigation";
import { getTrack, getModule } from "@/lib/curriculum";
import { getCapstoneForModule } from "@/lib/capstones";
import { CapstonePanel } from "@/components/capstone/CapstonePanel";
import { Pill } from "@/components/ui/Pill";
import { Clock, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { hasFullAccess } from "@/lib/access";

interface Props {
  params: Promise<{ track: string; module: string }>;
}

export default async function CapstonePage({ params }: Props) {
  const { track: trackSlug, module: moduleSlug } = await params;

  const track = getTrack(trackSlug);
  const mod = getModule(trackSlug, moduleSlug);
  if (!track || !mod) notFound();

  const capstone = getCapstoneForModule(trackSlug, moduleSlug);
  if (!capstone) notFound();

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const isPremium = hasFullAccess(data.user);

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
                {capstone.duration}
              </span>
              <span
                className="flex items-center gap-1 text-xs text-prose-faint"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                <Trophy size={11} />
                {capstone.totalTests} tests
              </span>
            </div>
            <h1 className="text-xl lg:text-2xl font-semibold text-prose tracking-tight">
              Capstone: {capstone.title}
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
              {capstone.description}
            </p>
            <div className="space-y-3">
              {capstone.methods.map((m) => (
                <div key={m.signature} className="px-4 py-3 rounded-md border text-sm" style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}>
                  <code className="font-semibold text-prose" style={{ fontFamily: "var(--font-mono)" }}>{m.signature}</code>
                  <p className="text-prose-muted mt-1">{m.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-base font-semibold text-prose mb-3 tracking-tight">Why this challenge</h2>
            <p className="text-sm text-prose-muted leading-relaxed mb-3">
              This brings together everything from {mod.title}:
            </p>
            <ul className="space-y-1.5 text-sm text-prose-muted">
              {capstone.whyBullets.map((item) => (
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
                "Write your solution in the editor.",
                "Click Run to test with the demo inputs.",
                `Click Submit to run all ${capstone.totalTests} hidden tests.`,
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
                <p className="text-sm font-medium text-prose">{capstone.badgeTitle}</p>
                <p className="text-xs text-prose-faint mt-0.5">{capstone.badgeSubtitle}</p>
              </div>
            </div>
          </section>
        </article>

        {/* Right — editor panel */}
        <div className="flex-1 min-w-0">
          <CapstonePanel
            capstoneId={capstone.id}
            starterCode={capstone.starterCode}
            hints={capstone.hints}
            referenceSolution={capstone.referenceSolution}
            totalTests={capstone.totalTests}
            isPremium={isPremium}
            nextPath={`/curriculum/${trackSlug}/${moduleSlug}`}
            certificatePath={`/curriculum/${trackSlug}/${moduleSlug}/capstone/certificate`}
            badgeTitle={capstone.badgeTitle}
          />
        </div>
      </div>
    </div>
  );
}

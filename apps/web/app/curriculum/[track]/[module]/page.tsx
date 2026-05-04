import { notFound } from "next/navigation";
import { getTrack, getModule, curriculum } from "@/lib/curriculum";
import { getCapstoneForModule } from "@/lib/capstones";
import { Pill } from "@/components/ui/Pill";
import {
  Clock,
  ChevronRight,
  Trophy,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Zap,
  MessageSquare,
  Star,
  Lock,
} from "lucide-react";

interface ModulePageProps {
  params: Promise<{ track: string; module: string }>;
}

export async function generateStaticParams() {
  const params: { track: string; module: string }[] = [];
  for (const track of curriculum) {
    for (const mod of track.modules) {
      params.push({ track: track.slug, module: mod.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ModulePageProps) {
  const { track: trackSlug, module: moduleSlug } = await params;
  const track = getTrack(trackSlug);
  const mod = getModule(trackSlug, moduleSlug);
  if (!track || !mod) return {};
  return {
    title: `${mod.title} — ${track.title} — Bytecode`,
    description: `${mod.lessons.length} lessons covering ${mod.title}.`,
  };
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { track: trackSlug, module: moduleSlug } = await params;
  const track = getTrack(trackSlug);
  const mod = getModule(trackSlug, moduleSlug);
  if (!track || !mod) notFound();

  const totalMinutes = mod.lessons.reduce((sum, l) => sum + l.duration, 0);
  const freeCount = mod.lessons.filter((l) => !l.isPremium).length;
  const premiumCount = mod.lessons.length - freeCount;
  const firstLesson = mod.lessons[0];

  // Find the previous module (prerequisite) and next module
  const trackModules = track.modules;
  const modIndex = trackModules.findIndex((m) => m.slug === moduleSlug);
  const prevMod = modIndex > 0 ? trackModules[modIndex - 1] : null;
  const nextMod = modIndex < trackModules.length - 1 ? trackModules[modIndex + 1] : null;

  const capstone = getCapstoneForModule(trackSlug, moduleSlug);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-20 pt-10">
      {/* Breadcrumb */}
      <nav
        className="mb-8 flex items-center gap-1.5 text-xs text-prose-faint"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <a href="/curriculum" className="hover:text-prose-muted transition-colors">
          curriculum
        </a>
        <span>/</span>
        <a
          href={`/curriculum/${trackSlug}`}
          className="hover:text-prose-muted transition-colors"
        >
          {track.title}
        </a>
        <span>/</span>
        <span className="text-prose-muted">{mod.title}</span>
      </nav>

      {/* ── Welcome hero ─────────────────────────────────────────────── */}
      <div className="mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Pill variant={mod.isPremium ? "premium" : "free"} />
          <span
            className="text-xs text-prose-faint"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            module{" "}
            <span className="text-accent font-semibold tabular-nums">
              {String(mod.order).padStart(2, "0")}
            </span>{" "}
            · {track.title}
          </span>
        </div>
        <h1 className="text-3xl font-semibold text-prose tracking-tight mb-4">
          {mod.title}
        </h1>
        <p className="text-prose-muted leading-relaxed text-base mb-6 max-w-2xl">
          {mod.order === 1
            ? `Welcome to your first module on the ${track.title} path. Whether you have zero programming experience or just need a clean foundation, you're in the right place. By the end of this module you'll be reading and writing real Java code with confidence.`
            : `You've already got the foundations. This module builds on what you know and takes your skills to the next level — opening the door to everything more advanced in Java.`}
        </p>

        {/* Stats bar */}
        <div
          className="flex flex-wrap gap-4 p-4 rounded-lg border"
          style={{
            backgroundColor: "var(--color-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-2 text-sm text-prose-muted">
            <BookOpen size={14} className="text-accent" />
            <span>{mod.lessons.length} lessons</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-prose-muted">
            <Clock size={14} className="text-accent" />
            <span>~{totalMinutes} min total</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-prose-muted">
            <CheckCircle2 size={14} className="text-ok" />
            <span>{freeCount} free lesson{freeCount !== 1 ? "s" : ""}</span>
          </div>
          {premiumCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-prose-muted">
              <Star size={14} className="text-accent" />
              <span>{premiumCount} premium lesson{premiumCount !== 1 ? "s" : ""}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── What you'll learn ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-prose mb-4 flex items-center gap-2">
          <Zap size={16} className="text-accent" />
          What you&rsquo;ll learn
        </h2>
        <div className="grid gap-2">
          {mod.lessons.map((lesson) => (
            <div
              key={lesson.slug}
              className="flex items-center gap-3 text-sm text-prose-muted"
            >
              <CheckCircle2 size={13} className="text-accent shrink-0" />
              {lesson.title}
            </div>
          ))}
        </div>
      </section>

      {/* ── Prerequisites ────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-prose mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-accent" />
          Prerequisites
        </h2>
        {prevMod ? (
          <div
            className="p-4 rounded-lg border text-sm text-prose-muted"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <p className="mb-2">
              This module builds on{" "}
              <a
                href={`/curriculum/${trackSlug}/${prevMod.slug}`}
                className="text-accent hover:text-accent-warm transition-colors"
              >
                {prevMod.title}
              </a>
              . If you haven&rsquo;t completed it yet, start there — the concepts here will make much more sense once you have the foundations in place.
            </p>
          </div>
        ) : (
          <div
            className="p-4 rounded-lg border"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <p className="text-sm text-prose-muted">
              <strong className="font-semibold text-prose">None.</strong> This module assumes no prior programming experience whatsoever. You don&rsquo;t need to install anything — the interactive editor runs real Java in your browser. All you need is curiosity and a willingness to make mistakes.
            </p>
          </div>
        )}
      </section>

      {/* ── Free vs. premium ─────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-prose mb-4 flex items-center gap-2">
          <Star size={16} className="text-accent" />
          Free &amp; premium content
        </h2>
        <div
          className="p-4 rounded-lg border text-sm text-prose-muted space-y-2"
          style={{
            backgroundColor: "var(--color-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <p>
            <strong className="font-semibold text-prose">{freeCount} lessons are completely free</strong>{" "}
            — no account needed.
            {premiumCount > 0 ? (
              <> The remaining {premiumCount} lesson{premiumCount !== 1 ? "s" : ""} are premium. Premium lessons go deeper: harder exercises, longer explanations, and more real-world examples.</>
            ) : (
              <> Every lesson in this module is free. Enjoy.</>
            )}
          </p>
          {capstone && (
            <p>
              The <strong className="font-semibold text-prose">Capstone Challenge</strong> at the end of this module is premium. It&rsquo;s a fully graded project that earns you a badge and certificate — the kind of thing worth putting in a portfolio.
            </p>
          )}
          <p>
            Premium access is unlocked with a Bytecode subscription. You can see all content and attempt free lessons without signing up.
          </p>
        </div>
      </section>

      {/* ── Where to get help ────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-prose mb-4 flex items-center gap-2">
          <HelpCircle size={16} className="text-accent" />
          Where to get help
        </h2>
        <div
          className="p-4 rounded-lg border text-sm text-prose-muted space-y-3"
          style={{
            backgroundColor: "var(--color-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <p>
            Every lesson has a <strong className="font-semibold text-prose">&ldquo;Stuck? Ask the forum&rdquo;</strong> link at the bottom. The community forum is the best place for specific questions about exercises.
          </p>
          <p>
            Each lesson also has <strong className="font-semibold text-prose">hints</strong> in the exercise section and after wrong quiz attempts — read them carefully before heading to the forum.
          </p>
          <div className="pt-1">
            <a
              href="/forum"
              className="inline-flex items-center gap-1.5 text-accent hover:text-accent-warm transition-colors"
            >
              <MessageSquare size={13} />
              Browse the forum
            </a>
          </div>
        </div>
      </section>

      {/* ── Start CTA ────────────────────────────────────────────────── */}
      {firstLesson && (
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-6 rounded-lg border"
          style={{
            background: "linear-gradient(135deg, rgba(199,123,58,0.06) 0%, transparent 60%)",
            borderColor: "rgba(199,123,58,0.3)",
          }}>
          <div className="flex-1">
            <p className="text-base font-semibold text-prose mb-1">Ready to start?</p>
            <p className="text-sm text-prose-muted">
              Take it one lesson at a time. The exercises use real Java — each one runs in a sandbox right in your browser.
            </p>
          </div>
          <a
            href={`/curriculum/${trackSlug}/${moduleSlug}/lesson/${firstLesson.slug}`}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-accent text-inverse hover:bg-accent-warm transition-colors duration-100"
          >
            Start lesson 1 <ChevronRight size={14} />
          </a>
        </div>
      )}

      {/* ── Lesson list ──────────────────────────────────────────────── */}
      <div className="mb-3">
        <p
          className="text-xs text-prose-faint mb-3"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // lessons
        </p>
        <div className="space-y-2">
          {mod.lessons.map((lesson) => (
            <a
              key={lesson.slug}
              href={`/curriculum/${trackSlug}/${moduleSlug}/lesson/${lesson.slug}`}
              className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg border transition-colors duration-100 hover:border-[var(--border-default)] group"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderColor: "var(--border-subtle)",
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-xs text-prose-faint w-5 shrink-0"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {String(lesson.order).padStart(2, "0")}
                </span>
                <div>
                  <p className="text-sm font-medium text-prose-muted group-hover:text-prose transition-colors duration-100">
                    {lesson.title}
                  </p>
                  <p
                    className="text-xs text-prose-faint mt-0.5"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    ~{lesson.duration} min
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Pill variant={lesson.isPremium ? "premium" : "free"} />
                <ChevronRight
                  size={14}
                  className="text-prose-faint group-hover:text-prose-muted transition-colors duration-100"
                />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Summary page ─────────────────────────────────────────────── */}
      {mod.lessons.length > 0 && (
        <div className="mt-4 mb-4">
          <a
            href={`/curriculum/${trackSlug}/${moduleSlug}/summary`}
            className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg border transition-colors duration-100 hover:border-[var(--border-default)] group"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={14} className="text-accent shrink-0" />
              <div>
                <p className="text-sm font-medium text-prose-muted group-hover:text-prose transition-colors duration-100">
                  Module Summary &amp; Final Quiz
                </p>
                <p
                  className="text-xs text-prose-faint mt-0.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  review + optional final quiz + next steps
                </p>
              </div>
            </div>
            <ChevronRight
              size={14}
              className="text-prose-faint group-hover:text-prose-muted transition-colors duration-100 shrink-0"
            />
          </a>
        </div>
      )}

      {/* ── Capstone ─────────────────────────────────────────────────── */}
      {capstone && (
        <div className="mt-4">
          <p
            className="text-prose-faint text-xs mb-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // capstone challenge
          </p>
          <a
            href={`/curriculum/${trackSlug}/${moduleSlug}/capstone`}
            className="flex items-center justify-between gap-4 px-5 py-4 rounded-lg border transition-colors duration-100 hover:border-[var(--border-default)] group"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div className="flex items-center gap-3">
              <Trophy size={14} className="text-accent shrink-0" />
              <div>
                <p className="text-sm font-medium text-prose-muted group-hover:text-prose transition-colors duration-100">
                  {capstone.title}
                </p>
                <p
                  className="text-xs text-prose-faint mt-0.5"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {capstone.duration} · {capstone.totalTests} tests · badge + certificate
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Pill variant="premium" />
              <ChevronRight
                size={14}
                className="text-prose-faint group-hover:text-prose-muted transition-colors duration-100"
              />
            </div>
          </a>
        </div>
      )}

      {/* ── Good luck message ────────────────────────────────────────── */}
      <div
        className="mt-12 p-5 rounded-lg border text-center"
        style={{
          borderColor: "var(--border-subtle)",
          backgroundColor: "var(--color-elevated)",
        }}
      >
        <p className="text-sm text-prose-muted leading-relaxed">
          {mod.order === 1 ? (
            <>
              Every great Java developer started exactly where you are now. The code you write today will feel obvious in a few weeks — that&rsquo;s the sign of real learning.{" "}
              <strong className="font-semibold text-prose">Good luck, and enjoy the process.</strong>
            </>
          ) : (
            <>
              You already know the basics — now you&rsquo;re building the skills that separate beginners from real developers.{" "}
              <strong className="font-semibold text-prose">Keep going. You&rsquo;re doing great.</strong>
            </>
          )}
        </p>
      </div>

      {/* ── Next module preview ──────────────────────────────────────── */}
      {nextMod && (
        <div className="mt-6 text-center">
          <p className="text-xs text-prose-faint mb-2" style={{ fontFamily: "var(--font-mono)" }}>
            // up next
          </p>
          <a
            href={`/curriculum/${trackSlug}/${nextMod.slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-prose-muted hover:text-prose transition-colors duration-100"
          >
            {nextMod.title} <ChevronRight size={13} />
          </a>
        </div>
      )}
    </div>
  );
}

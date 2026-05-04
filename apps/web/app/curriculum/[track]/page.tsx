import { notFound } from "next/navigation";
import { getTrack, curriculum } from "@/lib/curriculum";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { Lock, ChevronRight } from "lucide-react";

interface TrackPageProps {
  params: Promise<{ track: string }>;
}

export async function generateStaticParams() {
  return curriculum.map((t) => ({ track: t.slug }));
}

export async function generateMetadata({ params }: TrackPageProps) {
  const { track: trackSlug } = await params;
  const track = getTrack(trackSlug);
  if (!track) return {};
  return {
    title: `${track.title} — Bytecode`,
    description: track.tagline,
  };
}

export default async function TrackPage({ params }: TrackPageProps) {
  const { track: trackSlug } = await params;
  const track = getTrack(trackSlug);
  if (!track) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <nav
        className="mb-8 flex items-center gap-1.5 text-xs text-prose-faint"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <a href="/curriculum" className="hover:text-prose-muted transition-colors">
          curriculum
        </a>
        <span>/</span>
        <span className="text-prose-muted">{track.title}</span>
      </nav>

      <SectionHeader
        label={`track ${String(track.order).padStart(2, "0")}`}
        heading={track.title}
        subheading={track.tagline}
        className="mb-10"
      />

      <div className="space-y-3">
        {track.modules.length === 0 ? (
          <div
            className="rounded-lg border px-6 py-8 text-center"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <Lock size={18} className="text-prose-faint mx-auto mb-2" />
            <p className="text-sm text-prose-muted">Modules coming soon.</p>
          </div>
        ) : (
          track.modules.map((mod) => {
            const firstLesson = mod.lessons[0];
            return (
              <div
                key={mod.slug}
                className="rounded-lg border overflow-hidden"
                style={{
                  backgroundColor: "var(--color-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="px-6 py-5 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs text-accent font-semibold tabular-nums"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {String(mod.order).padStart(2, "0")}
                      </span>
                      <h2 className="text-base font-semibold text-prose tracking-tight">
                        {mod.title}
                      </h2>
                      <Pill variant={mod.isPremium ? "premium" : "free"} />
                    </div>
                    <p className="text-sm text-prose-faint">
                      {mod.lessons.length} lesson{mod.lessons.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {firstLesson ? (
                    <a
                      href={`/curriculum/${trackSlug}/${mod.slug}/lesson/${firstLesson.slug}`}
                      className="shrink-0 flex items-center gap-1 text-sm text-accent hover:text-accent-warm transition-colors duration-100"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      Start <ChevronRight size={13} />
                    </a>
                  ) : (
                    <span
                      className="shrink-0 flex items-center gap-1 text-xs text-prose-faint"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      <Lock size={11} /> coming soon
                    </span>
                  )}
                </div>

                {mod.lessons.length > 0 && (
                  <div
                    className="border-t px-6 py-3"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <div className="flex flex-wrap gap-1.5">
                      {mod.lessons.map((lesson) => (
                        <a
                          key={lesson.slug}
                          href={`/curriculum/${trackSlug}/${mod.slug}/lesson/${lesson.slug}`}
                          className="text-xs text-prose-faint hover:text-prose-muted transition-colors duration-100 px-2 py-1 rounded-sm bg-subtle"
                          style={{ fontFamily: "var(--font-mono)" }}
                          title={lesson.title}
                        >
                          <span className="text-prose font-semibold tabular-nums">
                            {String(lesson.order).padStart(2, "0")}
                          </span>{" "}
                          {lesson.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

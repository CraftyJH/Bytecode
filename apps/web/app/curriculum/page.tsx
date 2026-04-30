import { curriculum } from "@/lib/curriculum";
import { Pill } from "@/components/ui/Pill";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Lock } from "lucide-react";

export const metadata = {
  title: "Curriculum — Bytecode",
  description: "Six tracks from Java Beginner to Kotlin Advanced and real-world projects.",
};

export default function CurriculumPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeader
        label="the path"
        heading="Full curriculum."
        subheading="Six tracks, one destination. Start free — no credit card."
        className="mb-12"
      />

      <div className="space-y-4">
        {curriculum.map((track) => (
          <div
            key={track.slug}
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
                    className="text-xs text-prose-faint"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {String(track.order).padStart(2, "0")}
                  </span>
                  <h2 className="text-base font-semibold text-prose tracking-tight">
                    {track.title}
                  </h2>
                  <Pill variant={track.isPremium ? "premium" : "free"} />
                </div>
                <p className="text-sm text-prose-muted">{track.tagline}</p>
              </div>

              {track.modules.length > 0 ? (
                <a
                  href={`/curriculum/${track.slug}/${track.modules[0].slug}`}
                  className="shrink-0 text-sm text-accent hover:text-accent-warm transition-colors duration-100"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Start →
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

            {/* Module list */}
            {track.modules.map((mod) => (
              <div
                key={mod.slug}
                className="border-t px-6 py-3"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-prose-muted mb-1">
                      {mod.title}
                    </p>
                    <p className="text-xs text-prose-faint">
                      {mod.lessons.length} lessons
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.lessons.slice(0, 4).map((l) => (
                      <a
                        key={l.slug}
                        href={`/curriculum/${track.slug}/${mod.slug}/lesson/${l.slug}`}
                        className="text-xs text-prose-faint hover:text-prose-muted transition-colors duration-100 px-2 py-1 rounded-sm bg-subtle"
                        style={{ fontFamily: "var(--font-mono)" }}
                        title={l.title}
                      >
                        {String(l.order).padStart(2, "0")}
                      </a>
                    ))}
                    {mod.lessons.length > 4 && (
                      <span className="text-xs text-prose-faint px-2 py-1">
                        +{mod.lessons.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

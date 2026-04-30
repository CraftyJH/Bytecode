import { notFound } from "next/navigation";
import { getTrack, getModule, curriculum } from "@/lib/curriculum";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { Clock, ChevronRight } from "lucide-react";

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
        <a
          href={`/curriculum/${trackSlug}`}
          className="hover:text-prose-muted transition-colors"
        >
          {track.title}
        </a>
        <span>/</span>
        <span className="text-prose-muted">{mod.title}</span>
      </nav>

      <div className="flex items-center gap-2 mb-3">
        <Pill variant={mod.isPremium ? "premium" : "free"} />
        <span
          className="flex items-center gap-1 text-xs text-prose-faint"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <Clock size={11} />
          ~{totalMinutes} min total
        </span>
      </div>

      <SectionHeader
        label={`module ${String(mod.order).padStart(2, "0")}`}
        heading={mod.title}
        subheading={`${mod.lessons.length} lessons · ${track.title}`}
        className="mb-10"
      />

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
  );
}

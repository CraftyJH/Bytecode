import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";
import { getTrack } from "@/lib/curriculum";

const tracks = [
  {
    num: "01",
    slug: "java-beginner",
    title: "Java Beginner",
    description: "Foundations in Java 21: variables, control flow, methods, arrays, and strings.",
    tag: "Free, forever.",
    variant: "free" as const,
  },
  {
    num: "02",
    slug: "java-intermediate",
    title: "Java Intermediate",
    description: "Object-oriented Java: classes, interfaces, exceptions, collections, and files.",
    tag: "Fully free.",
    variant: "free" as const,
  },
  {
    num: "03",
    slug: "java-advanced",
    title: "Java Advanced",
    description: "Advanced Java: streams, concurrency, design patterns, testing, and JVM internals.",
    tag: "Premium.",
    variant: "premium" as const,
  },
  {
    num: "04",
    slug: "kotlin-bridge",
    title: "Kotlin Bridge",
    description: "Bridge from Java to idiomatic Kotlin: null safety, data classes, and interop.",
    tag: "Premium.",
    variant: "premium" as const,
  },
  {
    num: "05",
    slug: "kotlin-advanced",
    title: "Kotlin Advanced",
    description: "Advanced Kotlin topics including coroutines, DSL patterns, and language internals.",
    tag: "Premium.",
    variant: "premium" as const,
  },
  {
    num: "06",
    slug: "projects",
    title: "Projects",
    description: "Applied portfolio work across backend, app, and systems-style projects.",
    tag: "Mixed access.",
    variant: "free" as const,
  },
];

export function ThePath() {
  return (
    <section
      className="border-y py-20 lg:py-28"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="the path"
          heading="Six tracks. One destination."
          className="mb-12"
        />

        <div className="space-y-0">
          {tracks.map(({ num, slug, title, description, tag, variant }) => {
            const track = getTrack(slug);
            const moduleCount = track?.modules.length ?? 0;
            const lessonCount = track?.modules.reduce((sum, m) => sum + m.lessons.length, 0) ?? 0;
            return (
            <div
              key={num}
              className="group flex flex-col sm:flex-row sm:items-center gap-4 py-5 border-b"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              {/* Track number */}
              <span
                className="text-prose-faint text-sm w-8 shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
                aria-hidden="true"
              >
                {num}
              </span>

              {/* Title + description */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-prose tracking-tight">
                    {title}
                  </h3>
                  <Pill variant={variant} label={tag} />
                </div>
                <p className="text-sm text-prose-muted">{description}</p>
              </div>

              {/* Example lesson — shown on hover */}
              <div className="sm:text-right shrink-0">
                <span
                  className="text-xs text-prose-faint group-hover:text-prose-muted transition-colors duration-100"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {"// "}
                  <span className="text-accent font-semibold tabular-nums">{moduleCount}</span>
                  {" modules covering "}
                  <span className="text-accent font-semibold tabular-nums">{lessonCount}</span>
                  {" lessons"}
                </span>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </section>
  );
}

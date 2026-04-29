import { SectionHeader } from "@/components/ui/SectionHeader";
import { Pill } from "@/components/ui/Pill";

const tracks = [
  {
    num: "01",
    title: "Java Beginner",
    description: "Variables, control flow, methods, arrays, strings.",
    tag: "Free, forever.",
    variant: "free" as const,
    example: "lesson: Hello, Java",
  },
  {
    num: "02",
    title: "Java Intermediate",
    description: "Classes, OOP, interfaces, generics, collections.",
    tag: "Half free.",
    variant: "free" as const,
    example: "lesson: Interfaces vs Abstract Classes",
  },
  {
    num: "03",
    title: "Java Advanced",
    description: "Lambdas, streams, concurrency, JVM internals, design patterns.",
    tag: "Premium.",
    variant: "premium" as const,
    example: "lesson: Thread Safety with synchronized",
  },
  {
    num: "04",
    title: "Kotlin Bridge",
    description: "Java → Kotlin in days, not weeks. Built for experienced Java devs.",
    tag: "Premium.",
    variant: "premium" as const,
    example: "lesson: Data Classes and sealed when",
  },
  {
    num: "05",
    title: "Kotlin Advanced",
    description: "Coroutines, DSLs, extension functions, multiplatform.",
    tag: "Premium.",
    variant: "premium" as const,
    example: "lesson: Structured Concurrency with Flow",
  },
  {
    num: "06",
    title: "Projects",
    description: "Spring Boot API. Android Weather App. Multi-threaded scraper.",
    tag: "First one free.",
    variant: "free" as const,
    example: "project: Spring Boot Bookmarks API",
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
          {tracks.map(({ num, title, description, tag, variant, example }, idx) => (
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
                  {`// ${example}`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

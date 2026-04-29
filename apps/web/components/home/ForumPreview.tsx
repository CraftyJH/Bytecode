import { SectionHeader } from "@/components/ui/SectionHeader";

interface ForumThread {
  title: string;
  excerpt: string;
  answeredBy: string;
  category: string;
  timeAgo: string;
}

const threads: ForumThread[] = [
  {
    title: "Why does `int / int` give me 3 instead of 3.5?",
    excerpt:
      "I tried `7 / 2` and expected 3.5 but got 3. Is this a bug or am I missing something?",
    answeredBy: "alex_dev",
    category: "Help — Beginner Java",
    timeAgo: "2h ago",
  },
  {
    title: "When should I use an interface vs an abstract class?",
    excerpt:
      "I keep reading different explanations. Can someone give a concrete rule for Java?",
    answeredBy: "priya_k",
    category: "Help — Intermediate / Advanced Java",
    timeAgo: "5h ago",
  },
  {
    title: "How do Kotlin coroutines compare to Java threads?",
    excerpt:
      "Coming from Java threading — trying to understand what coroutines actually replace and when.",
    answeredBy: "mjordan_jvm",
    category: "Help — Kotlin",
    timeAgo: "1d ago",
  },
];

export function ForumPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
        <SectionHeader
          label="from the forum"
          heading="Real questions. Real answers."
        />
        <a
          href="/forum"
          className="text-sm text-accent hover:text-accent-warm transition-colors duration-100 shrink-0"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          View all threads →
        </a>
      </div>

      <div className="space-y-4">
        {threads.map(({ title, excerpt, answeredBy, category, timeAgo }) => (
          <a
            key={title}
            href="/forum"
            className="block group rounded-lg border p-5 hover:border-[rgba(255,255,255,0.18)] transition-colors duration-100"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="text-sm font-medium text-prose group-hover:text-accent transition-colors duration-100 leading-snug">
                {title}
              </h3>
              <span
                className="text-xs text-prose-faint shrink-0"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {timeAgo}
              </span>
            </div>
            <p className="text-xs text-prose-faint mb-3 leading-relaxed line-clamp-2">
              {excerpt}
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-xs text-ok"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                ✓ Answered by {answeredBy}
              </span>
              <span
                className="text-xs text-prose-faint px-2 py-0.5 rounded-sm bg-subtle"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {category}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

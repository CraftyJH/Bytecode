const RULES = [
  {
    n: "01",
    title: "Be kind.",
    body: "Beginners are welcome — stupid questions are not a thing. Every expert was once a beginner who needed someone to answer a 'dumb' question without making them feel dumb.",
  },
  {
    n: "02",
    title: "Show what you tried.",
    body: "Even if you tried nothing — say so honestly. Paste your code, describe the error, explain what you expected vs. what happened. Context is the single biggest factor in reply quality.",
  },
  {
    n: "03",
    title: "Help by teaching, not by handing over answers.",
    body: "Point to the right direction. Ask a clarifying question. Share a relevant link. Don't just dump a solution — the person asking needs to understand it, not just copy it.",
  },
  {
    n: "04",
    title: "Code blocks for code. Always.",
    body: "Inline code is unreadable. Wrap any code — even a single line — in triple backticks. Use the correct language tag for syntax highlighting.",
  },
  {
    n: "05",
    title: "Don't repost.",
    body: "Search before posting. If a similar question exists, add a comment there rather than starting a new thread. This keeps the archive useful for everyone who comes later.",
  },
  {
    n: "06",
    title: "No promotion.",
    body: "No self-promotion of unrelated products, services, or social accounts. Mentioning your project in context (Show & Tell, Career) is fine. Cold-pitching your SaaS is not.",
  },
  {
    n: "07",
    title: "No politics, no harassment, no slurs.",
    body: "Don't make the moderators have to write rule 7. You know what's in scope. If you're unsure whether something is appropriate, it probably isn't.",
  },
];

export default function RulesPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-10">
        <nav
          className="mb-2 flex items-center gap-1.5 text-xs text-prose-faint"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <a href="/forum" className="hover:text-prose-muted transition-colors">forum</a>
          <span>/</span>
          <span className="text-prose-muted">rules</span>
        </nav>
        <h1 className="text-2xl font-semibold text-prose tracking-tight mb-2">House rules</h1>
        <p className="text-sm text-prose-muted leading-relaxed">
          Seven rules. They all come down to one thing: be a good person in a learning community.
        </p>
      </div>

      <div className="space-y-6">
        {RULES.map(({ n, title, body }) => (
          <div key={n} className="flex gap-5">
            <span
              className="shrink-0 text-lg font-semibold text-prose-faint w-8 pt-0.5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {n}
            </span>
            <div>
              <h2 className="text-base font-semibold text-prose mb-1 tracking-tight">{title}</h2>
              <p className="text-sm text-prose-muted leading-relaxed">{body}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-12 pt-8 border-t text-sm text-prose-muted"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <p className="mb-2">
          <strong className="text-prose">Moderation:</strong> Threads and replies that violate these rules will be locked or removed.
          Repeated violations result in suspension.
        </p>
        <p>
          Questions or appeals? Post in{" "}
          <a href="/forum/meta" className="text-accent hover:underline">Meta</a>.
        </p>
      </div>
    </div>
  );
}

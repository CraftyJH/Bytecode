import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const freeFeatures = [
  "Full Java Beginner track + half of Java Intermediate",
  "Every quiz, every lesson",
  "One full project — CLI Todo App",
  "Full forum access",
  "Unlimited code playground",
  "No ads. Ever.",
];

const premiumFeatures = [
  "Everything in Free, plus:",
  "Full Java + full Kotlin tracks",
  "Every capstone challenge and project",
  "Daily coding challenges",
  "Saved playground snippets",
  "Certificates of completion",
  "Priority forum tag",
  "7-day free trial on annual",
];

function FeatureItem({ text, dim }: { text: string; dim?: boolean }) {
  return (
    <li className={`flex items-start gap-2.5 text-sm ${dim ? "text-prose-faint" : "text-prose-muted"}`}>
      <span className="text-ok mt-px shrink-0 text-xs">✓</span>
      {text}
    </li>
  );
}

export function Pricing() {
  return (
    <section
      className="border-y py-20 lg:py-28"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          label="pricing — one tier, no surprises"
          heading="Simple, honest pricing."
          align="center"
          className="mb-4"
        />

        {/* Founding Member banner */}
        <div
          className="mx-auto max-w-2xl mb-10 mt-6 rounded-md px-5 py-3.5 flex items-center justify-between gap-4 flex-wrap border"
          style={{
            backgroundColor: "var(--accent-muted)",
            borderColor: "rgba(199,123,58,0.25)",
          }}
        >
          <p className="text-sm text-prose-muted">
            <span className="text-accent font-medium">Founding Member:</span>{" "}
            First 1,000 subscribers get their rate locked for 3 years + a badge.
          </p>
          <span
            className="text-xs text-accent shrink-0"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            472 spots left
          </span>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {/* Free */}
          <Card padding="lg" className="flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-prose mb-1 tracking-tight">
                Free
              </h3>
              <p className="text-3xl font-semibold text-prose tracking-tight">
                $0
                <span className="text-base font-normal text-prose-faint ml-1">
                  forever
                </span>
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {freeFeatures.map((f) => (
                <FeatureItem key={f} text={f} />
              ))}
            </ul>
            <Button as="a" href="/signup" variant="secondary" size="md" className="w-full justify-center">
              Start free
            </Button>
          </Card>

          {/* Premium */}
          <Card
            padding="lg"
            className="flex flex-col relative"
            style={{ borderColor: "rgba(199,123,58,0.3)" } as React.CSSProperties}
          >
            {/* "Best value" chip */}
            <span
              className="absolute -top-3 left-6 px-3 py-1 rounded-sm text-xs font-medium bg-accent text-inverse"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              most popular
            </span>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-prose mb-1 tracking-tight">
                Premium
              </h3>
              <p className="text-3xl font-semibold text-prose tracking-tight">
                $9.99
                <span className="text-base font-normal text-prose-faint ml-1">
                  / mo
                </span>
              </p>
              <p className="text-sm text-prose-faint mt-1">
                or{" "}
                <span className="text-prose-muted font-medium">$59/yr</span>{" "}
                (~$4.92/mo) · 7-day free trial
              </p>
            </div>
            <ul className="space-y-3 flex-1 mb-8">
              {premiumFeatures.map((f) => (
                <FeatureItem key={f} text={f} dim={f === "Everything in Free, plus:"} />
              ))}
            </ul>
            <Button as="a" href="/signup?plan=premium" variant="primary" size="md" className="w-full justify-center">
              Go Premium
            </Button>
          </Card>
        </div>

        {/* Footnote */}
        <p className="text-center text-xs text-prose-faint mt-8">
          No surprise tiers. No "Pro vs Max." No hearts. Cancel in two clicks.
        </p>
      </div>
    </section>
  );
}

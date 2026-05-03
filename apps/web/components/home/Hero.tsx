import { Button } from "@/components/ui/Button";
import { CodeBlock, type CodeLine } from "@/components/ui/CodeBlock";

const heroCode: CodeLine[] = [
  [{ text: "// a taste of modern Java", type: "comment" }],
  [],
  [
    { text: "record ", type: "keyword" },
    { text: "Coffee", type: "type" },
    { text: "(" },
    { text: "String ", type: "type" },
    { text: "name" },
    { text: ", " },
    { text: "int ", type: "type" },
    { text: "oz" },
    { text: ") {}" },
  ],
  [],
  [
    { text: "var ", type: "keyword" },
    { text: "espresso " },
    { text: "= " },
    { text: "new ", type: "keyword" },
    { text: "Coffee", type: "type" },
    { text: "(" },
    { text: '"Espresso"', type: "string" },
    { text: ", " },
    { text: "2", type: "number" },
    { text: ");" },
  ],
  [
    { text: "System", type: "type" },
    { text: ".out." },
    { text: "println", type: "method" },
    { text: "(" },
    { text: "espresso", type: "method" },
    { text: "." },
    { text: "name", type: "method" },
    { text: "() + " },
    { text: '" — "', type: "string" },
    { text: " + espresso." },
    { text: "oz", type: "method" },
    { text: "() + " },
    { text: '"oz"', type: "string" },
    { text: ");" },
  ],
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 60% 20%, rgba(199,123,58,0.06) 0%, transparent 60%)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — copy */}
          <div>
            <p
              className="text-prose-faint text-sm mb-5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // java + kotlin
            </p>

            <h1
              className="text-4xl lg:text-5xl font-semibold text-prose leading-tight tracking-tight mb-5"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.03em" }}
            >
              Java and Kotlin,
              <br />
              <span className="text-accent">mastered.</span>
            </h1>

            <p className="text-lg text-prose-muted leading-relaxed mb-8 max-w-md">
              From your first{" "}
              <code
                className="text-sm px-1.5 py-0.5 rounded-sm bg-subtle text-prose-muted"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                Hello World
              </code>{" "}
              to deploying production Spring Boot — one focused path, no shortcuts, no fluff.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button as="a" href="/signup" variant="primary" size="lg">
                Start free
              </Button>
              <Button as="a" href="/curriculum" variant="secondary" size="lg">
                See the curriculum
              </Button>
            </div>

            {/* Trust signals */}
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              {[
                "No credit card",
                "No ads",
                "No mistake limits",
              ].map((signal) => (
                <span
                  key={signal}
                  className="flex items-center gap-1.5 text-xs text-prose-faint"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  <span className="text-ok">✓</span>
                  {signal}
                </span>
              ))}
            </div>
          </div>

          {/* Right — live code block (desktop only) */}
          <div className="hidden lg:block lg:pl-4">
            <CodeBlock
              lines={heroCode}
              output={"Espresso — 2oz"}
              language="java"
              showRunButton
            />
          </div>
        </div>
      </div>
    </section>
  );
}

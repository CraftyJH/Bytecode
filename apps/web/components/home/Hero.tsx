import { Button } from "@/components/ui/Button";
import { AnimatedCodeBlock } from "@/components/home/AnimatedCodeBlock";
import type { Snippet } from "@/components/home/AnimatedCodeBlock";
import type { CodeLine } from "@/components/ui/CodeBlock";

// ── Snippet 1: Java records + sealed interfaces + pattern matching ────────────

const javaSealed: CodeLine[] = [
  [{ text: "// sealed types + pattern matching", type: "comment" }],
  [],
  [
    { text: "sealed interface ", type: "keyword" },
    { text: "Shape", type: "type" },
    { text: " permits " },
    { text: "Circle", type: "type" },
    { text: ", " },
    { text: "Square", type: "type" },
    { text: " {}" },
  ],
  [],
  [
    { text: "record ", type: "keyword" },
    { text: "Circle", type: "type" },
    { text: "(" },
    { text: "double ", type: "type" },
    { text: "r" },
    { text: ") " },
    { text: "implements ", type: "keyword" },
    { text: "Shape ", type: "type" },
    { text: "{}" },
  ],
  [
    { text: "record ", type: "keyword" },
    { text: "Square", type: "type" },
    { text: "(" },
    { text: "double ", type: "type" },
    { text: "side" },
    { text: ") " },
    { text: "implements ", type: "keyword" },
    { text: "Shape ", type: "type" },
    { text: "{}" },
  ],
  [],
  [
    { text: "double ", type: "type" },
    { text: "area", type: "method" },
    { text: "(" },
    { text: "Shape ", type: "type" },
    { text: "s) {" },
  ],
  [
    { text: "  return ", type: "keyword" },
    { text: "switch ", type: "keyword" },
    { text: "(s) {" },
  ],
  [
    { text: "    case ", type: "keyword" },
    { text: "Circle ", type: "type" },
    { text: "c -> " },
    { text: "Math", type: "type" },
    { text: ".PI * c." },
    { text: "r", type: "method" },
    { text: "() * c." },
    { text: "r", type: "method" },
    { text: "();" },
  ],
  [
    { text: "    case ", type: "keyword" },
    { text: "Square ", type: "type" },
    { text: "q -> q." },
    { text: "side", type: "method" },
    { text: "() * q." },
    { text: "side", type: "method" },
    { text: "();" },
  ],
  [{ text: "  };" }],
  [{ text: "}" }],
];

// ── Snippet 2: Java Streams ───────────────────────────────────────────────────

const javaStreams: CodeLine[] = [
  [{ text: "// functional pipelines with Streams", type: "comment" }],
  [],
  [
    { text: "var ", type: "keyword" },
    { text: "words " },
    { text: "= " },
    { text: "List", type: "type" },
    { text: ".of(" },
  ],
  [
    { text: "    " },
    { text: '"hello"', type: "string" },
    { text: ", " },
    { text: '"world"', type: "string" },
    { text: ", " },
    { text: '"java"', type: "string" },
    { text: ", " },
    { text: '"streams"', type: "string" },
  ],
  [{ text: ");" }],
  [],
  [
    { text: "var ", type: "keyword" },
    { text: "result " },
    { text: "= words." },
    { text: "stream", type: "method" },
    { text: "()" },
  ],
  [
    { text: "    ." },
    { text: "filter", type: "method" },
    { text: "(w -> w." },
    { text: "length", type: "method" },
    { text: "() > " },
    { text: "4", type: "number" },
    { text: ")" },
  ],
  [
    { text: "    ." },
    { text: "map", type: "method" },
    { text: "(" },
    { text: "String", type: "type" },
    { text: "::" },
    { text: "toUpperCase", type: "method" },
    { text: ")" },
  ],
  [
    { text: "    ." },
    { text: "sorted", type: "method" },
    { text: "()" },
  ],
  [
    { text: "    ." },
    { text: "toList", type: "method" },
    { text: "();" },
  ],
  [],
  [
    { text: "// [JAVA, STREAMS, WORLD]", type: "comment" },
  ],
];

// ── Snippet 3: Kotlin data class + extension function ─────────────────────────

const kotlinExtensions: CodeLine[] = [
  [{ text: "// Kotlin — concise & expressive", type: "comment" }],
  [],
  [
    { text: "data class ", type: "keyword" },
    { text: "User", type: "type" },
    { text: "(" },
    { text: "val ", type: "keyword" },
    { text: "name" },
    { text: ": " },
    { text: "String", type: "type" },
    { text: ", " },
    { text: "val ", type: "keyword" },
    { text: "score" },
    { text: ": " },
    { text: "Int", type: "type" },
    { text: ")" },
  ],
  [],
  [
    { text: "fun ", type: "keyword" },
    { text: "List", type: "type" },
    { text: "<" },
    { text: "User", type: "type" },
    { text: ">." },
    { text: "top", type: "method" },
    { text: "(n: " },
    { text: "Int", type: "type" },
    { text: ") =" },
  ],
  [
    { text: "    sortedByDescending", type: "method" },
    { text: " { it.score }." },
    { text: "take", type: "method" },
    { text: "(n)" },
  ],
  [],
  [
    { text: "val ", type: "keyword" },
    { text: "users " },
    { text: "= listOf(" },
  ],
  [
    { text: "    " },
    { text: "User", type: "type" },
    { text: "(" },
    { text: '"Alice"', type: "string" },
    { text: ", " },
    { text: "92", type: "number" },
    { text: "), " },
    { text: "User", type: "type" },
    { text: "(" },
    { text: '"Bob"', type: "string" },
    { text: ", " },
    { text: "85", type: "number" },
    { text: ")," },
  ],
  [
    { text: "    " },
    { text: "User", type: "type" },
    { text: "(" },
    { text: '"Carol"', type: "string" },
    { text: ", " },
    { text: "97", type: "number" },
    { text: ")," },
  ],
  [{ text: ")" }],
  [],
  [
    { text: "users." },
    { text: "top", type: "method" },
    { text: "(" },
    { text: "2", type: "number" },
    { text: ")." },
    { text: "forEach", type: "method" },
    { text: " { println(it.name) }" },
  ],
];

const heroSnippets: Snippet[] = [
  { code: javaSealed,      filename: "Main.java"    },
  { code: javaStreams,     filename: "Streams.java" },
  { code: kotlinExtensions, filename: "Main.kt"    },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
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

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2">
              {["No credit card", "No ads", "No mistake limits"].map((signal) => (
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

          {/* Right — animated code panel.
              min-w-0 prevents the grid cell from expanding beyond its track.
              overflow-hidden clips any code line that would bleed out. */}
          <div className="min-w-0 overflow-hidden lg:pl-4">
            <AnimatedCodeBlock snippets={heroSnippets} />
          </div>
        </div>
      </div>
    </section>
  );
}

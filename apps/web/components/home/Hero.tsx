"use client";

import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import type { CodeLine } from "@/components/ui/CodeBlock";

const AnimatedCodeBlock = dynamic(
  () => import("@/components/home/AnimatedCodeBlock").then(m => m.AnimatedCodeBlock),
  { ssr: false }
);

const heroCode: CodeLine[] = [
  [{ text: "// modern Java — records + pattern matching", type: "comment" }],
  [],
  [
    { text: "sealed interface ", type: "keyword" },
    { text: "Shape ", type: "type" },
    { text: "permits ", type: "keyword" },
    { text: "Circle", type: "type" },
    { text: ", " },
    { text: "Rect", type: "type" },
    { text: " {}" },
  ],
  [],
  [
    { text: "record ", type: "keyword" },
    { text: "Circle", type: "type" },
    { text: "(" },
    { text: "double ", type: "type" },
    { text: "r" },
    { text: ")   " },
    { text: "implements ", type: "keyword" },
    { text: "Shape ", type: "type" },
    { text: "{}" },
  ],
  [
    { text: "record ", type: "keyword" },
    { text: "Rect", type: "type" },
    { text: "(" },
    { text: "double ", type: "type" },
    { text: "w" },
    { text: ", " },
    { text: "double ", type: "type" },
    { text: "h" },
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
    { text: "Rect ", type: "type" },
    { text: "r   -> r." },
    { text: "w", type: "method" },
    { text: "() * r." },
    { text: "h", type: "method" },
    { text: "();" },
  ],
  [{ text: "  };" }],
  [{ text: "}" }],
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

            {/* Trust signals */}
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

          {/* Right — animated code editor */}
          <div className="lg:pl-4">
            <AnimatedCodeBlock
              lines={heroCode}
              output={"78.53981633974483\n12.0"}
              language="java"
              typingSpeedMs={26}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

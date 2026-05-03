import type React from "react";
import { QuizBlock } from "@/components/lesson/QuizBlock";
import type { QuizItem } from "@/lib/quiz";

// Inline code
function Code({ children }: { children?: React.ReactNode }) {
  return (
    <code
      className="text-sm px-1.5 py-0.5 rounded-sm bg-subtle text-prose-muted"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </code>
  );
}

// Fenced code block (rendered by rehype-highlight into <pre><code class="language-*">)
function Pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      {...props}
      className="my-4 p-4 rounded-md text-sm overflow-x-auto leading-relaxed border border-[var(--border-subtle)] bg-subtle"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </pre>
  );
}

// Quiz MDX component — usage: <Quiz data={quizItem} label="mid-lesson quiz" />
function Quiz({ data, label }: { data: QuizItem; label?: string }) {
  return <QuizBlock quiz={data} label={label} />;
}

// Note / callout
function Note({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className="my-4 px-4 py-3 rounded-md border-l-2 text-sm text-prose-muted"
      style={{
        borderLeftColor: "var(--color-accent)",
        backgroundColor: "var(--accent-muted)",
      }}
    >
      {children}
    </div>
  );
}

// Exercise block — visually distinct coding challenge at the bottom of each lesson
function Exercise({ children }: { children?: React.ReactNode }) {
  return (
    <div
      className="mt-10 rounded-lg border overflow-hidden"
      style={{
        borderColor: "rgba(199,123,58,0.45)",
        backgroundColor: "var(--color-elevated)",
      }}
    >
      <div
        className="px-5 py-3 flex items-center gap-3"
        style={{
          borderBottom: "1px solid rgba(199,123,58,0.2)",
          background: "rgba(199,123,58,0.08)",
        }}
      >
        <span
          className="text-xs font-semibold text-accent tracking-widest uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Exercise
        </span>
        <span
          className="text-xs text-prose-faint ml-auto"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          write your solution in the editor →
        </span>
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

type HtmlProps = React.HTMLAttributes<HTMLElement>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildMdxComponents(): Record<string, any> {
  return {
    code: Code,
    pre: Pre,
    Quiz,
    Note,
    Exercise,
    h1: (p: HtmlProps) => <h1 className="text-2xl font-semibold text-prose mt-8 mb-3 tracking-tight" {...p} />,
    h2: (p: HtmlProps) => <h2 className="text-xl font-semibold text-prose mt-7 mb-2.5 tracking-tight" {...p} />,
    h3: (p: HtmlProps) => <h3 className="text-base font-semibold text-prose mt-5 mb-2 tracking-tight" {...p} />,
    p:  (p: HtmlProps) => <p  className="text-prose-muted leading-relaxed mb-4" {...p} />,
    ul: (p: HtmlProps) => <ul className="list-disc list-outside pl-5 space-y-1.5 mb-4 text-prose-muted text-sm" {...p} />,
    ol: (p: HtmlProps) => <ol className="list-decimal list-outside pl-5 space-y-1.5 mb-4 text-prose-muted text-sm" {...p} />,
    li: (p: HtmlProps) => <li className="leading-relaxed" {...p} />,
    strong: (p: HtmlProps) => <strong className="font-semibold text-prose" {...p} />,
    hr: () => <hr className="my-8 border-[var(--border-subtle)]" />,
    blockquote: (p: HtmlProps) => (
      <blockquote
        className="pl-4 border-l-2 italic text-prose-muted my-4"
        style={{ borderLeftColor: "var(--border-emphasis)" }}
        {...p}
      />
    ),
    table: (p: HtmlProps) => (
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse" {...p} />
      </div>
    ),
    thead: (p: HtmlProps) => <thead {...p} />,
    tbody: (p: HtmlProps) => <tbody {...p} />,
    tr: (p: HtmlProps) => (
      <tr
        className="border-b"
        style={{ borderBottomColor: "var(--border-subtle)" }}
        {...p}
      />
    ),
    th: (p: HtmlProps) => (
      <th
        className="text-left py-2 px-3 font-semibold text-prose text-xs uppercase tracking-wide"
        style={{ borderBottomColor: "var(--border-emphasis)", borderBottomWidth: "1px", borderBottomStyle: "solid" }}
        {...p}
      />
    ),
    td: (p: HtmlProps) => (
      <td className="py-2 px-3 text-prose-muted leading-relaxed" {...p} />
    ),
  };
}

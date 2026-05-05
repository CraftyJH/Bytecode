"use client";

import { useEffect, useMemo, useState } from "react";
import type { CodeLine } from "@/components/ui/CodeBlock";

const TOKEN_COLORS: Record<string, string> = {
  keyword: "var(--color-syn-keyword)",
  string:  "var(--color-syn-string)",
  number:  "var(--color-syn-number)",
  comment: "var(--color-syn-comment)",
  type:    "var(--color-syn-type)",
  method:  "var(--color-syn-method)",
  default: "var(--color-prose)",
};

const tokenColor = (type?: string) =>
  TOKEN_COLORS[type ?? "default"] ?? TOKEN_COLORS.default;

export interface Snippet {
  code: CodeLine[];
  filename: string;
}

interface Props {
  snippets: Snippet[];
  typingSpeedMs?: number;
  className?: string;
}

export function AnimatedCodeBlock({
  snippets,
  typingSpeedMs = 52,
  className = "",
}: Props) {
  const [idx, setIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [fading, setFading] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  const { code, filename } = snippets[idx];

  const { lineLens, lineStarts, total } = useMemo(() => {
    const lens = code.map(l => l.reduce((s, t) => s + t.text.length, 0));
    let cum = 0;
    const starts = lens.map(len => { const s = cum; cum += len; return s; });
    return { lineLens: lens, lineStarts: starts, total: cum };
  }, [code]);

  // Fixed height sized to the tallest snippet — prevents any vertical reflow.
  const maxLines = useMemo(
    () => Math.max(...snippets.map(s => s.code.length)),
    [snippets]
  );

  const done = charCount >= total;

  // Typing
  useEffect(() => {
    if (done) return;
    const id = setInterval(
      () => setCharCount(c => Math.min(c + 1, total)),
      typingSpeedMs
    );
    return () => clearInterval(id);
  }, [done, total, typingSpeedMs]);

  // After done: pause → fade out → switch → fade in
  useEffect(() => {
    if (!done) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(
      setTimeout(() => {
        setFading(true);
        timers.push(
          setTimeout(() => {
            setIdx(i => (i + 1) % snippets.length);
            setCharCount(0);
            setFading(false);
          }, 380)
        );
      }, 2000)
    );
    return () => timers.forEach(clearTimeout);
  }, [done, snippets.length]);

  // Cursor blink
  useEffect(() => {
    const id = setInterval(() => setCursorOn(v => !v), 530);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`rounded-xl border overflow-hidden shadow-2xl ${className}`}
      style={{ borderColor: "var(--border-subtle)" }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-1.5 px-4 py-2.5 border-b"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(255,95,87,0.7)" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(255,189,46,0.7)" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(40,200,64,0.7)" }} />
        <span
          className="ml-3 text-xs text-prose-faint"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {filename}
        </span>
      </div>

      {/* Code — fixed height prevents vertical reflow as lines are typed */}
      <pre
        className="overflow-x-auto px-5 py-4 text-sm leading-relaxed"
        style={{
          backgroundColor: "var(--color-subtle)",
          fontFamily: "var(--font-mono)",
          margin: 0,
          // border-box: height includes py-4 (2rem). Content area = maxLines * 1.625em.
          height: `calc(${maxLines} * 1.625em + 2rem)`,
          overflowY: "hidden",
          opacity: fading ? 0 : 1,
          transition: "opacity 0.32s",
        }}
      >
        <code>
          {code.map((line, li) => {
            const start = lineStarts[li];
            const len = lineLens[li];
            const charsHere = Math.max(0, Math.min(len, charCount - start));
            const isCursorLine = charCount > start && charCount <= start + len;

            let rem = charsHere;
            const segs: Array<{ text: string; type?: string }> = [];
            for (const tok of line) {
              if (rem <= 0) break;
              const take = Math.min(rem, tok.text.length);
              segs.push({ text: tok.text.slice(0, take), type: tok.type });
              rem -= take;
            }

            return (
              // ​ on every line keeps untyped lines at full line-height.
              // Plain inline cursor (|) avoids inline-block height nudges.
              <span key={li} className="block">
                {segs.map((s, i) => (
                  <span key={i} style={{ color: tokenColor(s.type) }}>{s.text}</span>
                ))}
                {isCursorLine && (
                  <span style={{ color: "var(--color-accent)", opacity: cursorOn ? 1 : 0 }}>
                    |
                  </span>
                )}
                {"​"}
              </span>
            );
          })}
        </code>
      </pre>
    </div>
  );
}

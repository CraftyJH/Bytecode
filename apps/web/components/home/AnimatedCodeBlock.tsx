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

interface AnimatedCodeBlockProps {
  lines: CodeLine[];
  output?: string;
  language?: string;
  typingSpeedMs?: number;
  className?: string;
}

export function AnimatedCodeBlock({
  lines,
  output,
  language = "java",
  typingSpeedMs = 30,
  className = "",
}: AnimatedCodeBlockProps) {
  const [charCount, setCharCount] = useState(0);
  const [showOutput, setShowOutput] = useState(false);
  const [cursorOn, setCursorOn] = useState(true);

  const { lineLens, lineStarts, total } = useMemo(() => {
    const lens = lines.map(l => l.reduce((s, t) => s + t.text.length, 0));
    let cum = 0;
    const starts: number[] = lens.map(len => { const s = cum; cum += len; return s; });
    return { lineLens: lens, lineStarts: starts, total: cum };
  }, [lines]);

  const done = charCount >= total;

  // Typing
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setCharCount(c => Math.min(c + 1, total)), typingSpeedMs);
    return () => clearInterval(id);
  }, [done, total, typingSpeedMs]);

  // Show output after typing finishes
  useEffect(() => {
    if (!done || output === undefined) return;
    const id = setTimeout(() => setShowOutput(true), 700);
    return () => clearTimeout(id);
  }, [done, output]);

  // Loop: restart after showing output
  useEffect(() => {
    if (!showOutput) return;
    const id = setTimeout(() => { setCharCount(0); setShowOutput(false); }, 4500);
    return () => clearTimeout(id);
  }, [showOutput]);

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
        style={{ backgroundColor: "var(--color-elevated)", borderColor: "var(--border-subtle)" }}
      >
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(255,95,87,0.7)" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(255,189,46,0.7)" }} />
        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "rgba(40,200,64,0.7)" }} />
        <span
          className="ml-3 text-xs text-prose-faint"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Main.{language === "kotlin" ? "kt" : "java"}
        </span>
      </div>

      {/* Code area */}
      <pre
        className="overflow-x-auto px-5 py-4 text-sm leading-relaxed"
        style={{
          backgroundColor: "var(--color-subtle)",
          fontFamily: "var(--font-mono)",
          margin: 0,
          minHeight: "200px",
        }}
      >
        <code>
          {lines.map((line, li) => {
            const start = lineStarts[li];
            const len = lineLens[li];
            const charsHere = Math.max(0, Math.min(len, charCount - start));
            const isCursorLine =
              !done && charCount > start && charCount <= start + len;

            let rem = charsHere;
            const segs: Array<{ text: string; type?: string }> = [];
            for (const tok of line) {
              if (rem <= 0) break;
              const take = Math.min(rem, tok.text.length);
              segs.push({ text: tok.text.slice(0, take), type: tok.type });
              rem -= take;
            }

            return (
              <span key={li} className="block">
                {segs.map((s, i) => (
                  <span key={i} style={{ color: tokenColor(s.type) }}>
                    {s.text}
                  </span>
                ))}
                {isCursorLine && (
                  <span
                    style={{
                      display: "inline-block",
                      width: "2px",
                      height: "1.1em",
                      backgroundColor: "var(--color-accent)",
                      verticalAlign: "text-bottom",
                      opacity: cursorOn ? 1 : 0,
                    }}
                  />
                )}
                {len === 0 && "​"}
              </span>
            );
          })}
        </code>
      </pre>

      {/* Output panel */}
      {output !== undefined && (
        <div
          className="border-t px-5 py-3 transition-opacity duration-700"
          style={{
            backgroundColor: "var(--color-canvas)",
            borderColor: "var(--border-subtle)",
            opacity: showOutput ? 1 : 0,
          }}
        >
          <p
            className="text-xs text-prose-faint mb-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // output
          </p>
          <p
            className="text-sm text-ok whitespace-pre"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {output}
          </p>
        </div>
      )}
    </div>
  );
}

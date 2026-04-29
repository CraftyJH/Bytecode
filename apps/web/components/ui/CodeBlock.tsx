export interface CodeToken {
  text: string;
  type?: "keyword" | "string" | "number" | "comment" | "type" | "method" | "default";
}

export type CodeLine = CodeToken[];

interface CodeBlockProps {
  lines: CodeLine[];
  output?: string;
  language?: string;
  showRunButton?: boolean;
  className?: string;
}

const tokenColorVar: Record<string, string> = {
  keyword: "var(--color-syn-keyword)",
  string:  "var(--color-syn-string)",
  number:  "var(--color-syn-number)",
  comment: "var(--color-syn-comment)",
  type:    "var(--color-syn-type)",
  method:  "var(--color-syn-method)",
  default: "var(--color-prose)",
};

function resolveColor(type?: string) {
  return tokenColorVar[type ?? "default"] ?? tokenColorVar.default;
}

export function CodeBlock({
  lines,
  output,
  language = "java",
  showRunButton = false,
  className = "",
}: CodeBlockProps) {
  return (
    <div className={`rounded-md border overflow-hidden ${className}`}
      style={{ borderColor: "var(--border-subtle)" }}>
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2 border-b"
        style={{
          backgroundColor: "var(--color-subtle)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <span
          className="text-xs text-prose-faint"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {language}
        </span>
        {showRunButton && (
          <button
            className="text-xs text-accent hover:text-accent-warm transition-colors duration-100 cursor-pointer"
            style={{ fontFamily: "var(--font-mono)" }}
            aria-label="Run code"
          >
            ▶ Run
          </button>
        )}
      </div>

      {/* Code */}
      <pre
        className="overflow-x-auto p-5 text-sm leading-relaxed"
        style={{
          backgroundColor: "var(--color-subtle)",
          fontFamily: "var(--font-mono)",
          margin: 0,
        }}
        aria-label={`${language} code block`}
      >
        <code>
          {lines.map((line, lineIdx) => (
            <span key={lineIdx} className="block">
              {line.map((token, tokIdx) => (
                <span
                  key={tokIdx}
                  style={{ color: resolveColor(token.type) }}
                >
                  {token.text}
                </span>
              ))}
              {line.length === 0 && "​"}
            </span>
          ))}
        </code>
      </pre>

      {/* Output panel */}
      {output !== undefined && (
        <div
          className="border-t px-5 py-3"
          style={{
            backgroundColor: "var(--color-canvas)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <p
            className="text-xs text-prose-faint mb-1"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // output
          </p>
          <p
            className="text-sm text-prose-muted whitespace-pre"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {output}
          </p>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { QuizBlock } from "@/components/lesson/QuizBlock";
import type { QuizItem } from "@/lib/quiz";
import { ChevronDown, ChevronUp, MessageSquare, X, CheckCircle } from "lucide-react";

// ── Final quiz (collapsible) ─────────────────────────────────────────────────

export function FinalQuizSection({ quizzes }: { quizzes: QuizItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <section className="mb-10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 rounded-lg border transition-colors duration-100 hover:border-[var(--border-default)] cursor-pointer"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderColor: "var(--border-subtle)",
        }}
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-sm font-semibold text-prose">Final Quiz</span>
          <span className="text-xs text-prose-faint" style={{ fontFamily: "var(--font-mono)" }}>
            optional · {quizzes.length} question{quizzes.length !== 1 ? "s" : ""}
          </span>
        </div>
        {open ? (
          <ChevronUp size={15} className="text-prose-faint shrink-0" />
        ) : (
          <ChevronDown size={15} className="text-prose-faint shrink-0" />
        )}
      </button>

      {open && (
        <div className="mt-3 space-y-0">
          {quizzes.map((q, i) => (
            <QuizBlock
              key={q.id}
              quiz={q}
              label={`final quiz · question ${i + 1} of ${quizzes.length}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ── Feedback ─────────────────────────────────────────────────────────────────

export function FeedbackButton({ moduleTitle }: { moduleTitle: string }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    // Future: POST to /api/feedback
    setSent(true);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm border transition-colors duration-100 hover:bg-subtle cursor-pointer text-prose-muted hover:text-prose"
        style={{ borderColor: "var(--border-emphasis)" }}
      >
        <MessageSquare size={14} />
        Leave feedback (optional)
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full max-w-md rounded-xl border shadow-2xl"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderColor: "var(--border-subtle)",
            }}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderBottomColor: "var(--border-subtle)" }}
            >
              <span className="text-sm font-semibold text-prose">
                Feedback on {moduleTitle}
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-prose-faint hover:text-prose transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-6 py-5">
              {sent ? (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                  <CheckCircle size={32} className="text-ok" />
                  <p className="text-sm font-semibold text-prose">Thanks for the feedback!</p>
                  <p className="text-xs text-prose-faint">Your response helps us improve the course.</p>
                  <button
                    onClick={() => { setOpen(false); setSent(false); setValue(""); }}
                    className="mt-2 text-xs text-prose-faint hover:text-prose transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-xs text-prose-faint mb-3">
                    What did you think of this module? Anything confusing, too fast, too slow, or just right?
                  </p>
                  <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Your thoughts…"
                    rows={4}
                    className="w-full px-3 py-2 rounded-md text-sm border bg-subtle text-prose placeholder:text-prose-faint focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                    style={{ borderColor: "var(--border-default)" }}
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="px-4 py-2 text-sm text-prose-muted hover:text-prose transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!value.trim()}
                      className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse hover:bg-accent-warm disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                    >
                      Send
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

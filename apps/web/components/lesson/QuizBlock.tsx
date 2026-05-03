"use client";

import { useState } from "react";
import type {
  QuizItem,
  MultipleChoiceQuiz,
  FillInBlankQuiz,
  PredictOutputQuiz,
  FindTheBugQuiz,
  OrderTheStepsQuiz,
} from "@/lib/quiz";

// ── Try-state machine ───────────────────────────────────────────────────────

type Outcome = "none" | "wrong" | "correct" | "exhausted";

interface AttemptState {
  attempts: number;
  outcome: Outcome;
  locked: boolean;
  triesLeft: number;
  submit: (isCorrect: boolean) => Outcome;
}

function useAttempts(maxTries: number): AttemptState {
  const [attempts, setAttempts] = useState(0);
  const [outcome, setOutcome] = useState<Outcome>("none");

  function submit(isCorrect: boolean): Outcome {
    if (isCorrect) {
      setOutcome("correct");
      return "correct";
    }
    const next = attempts + 1;
    setAttempts(next);
    const result: Outcome = next >= maxTries ? "exhausted" : "wrong";
    setOutcome(result);
    return result;
  }

  return {
    attempts,
    outcome,
    locked: outcome === "correct" || outcome === "exhausted",
    triesLeft: Math.max(0, maxTries - attempts),
    submit,
  };
}

// ── Feedback banners ────────────────────────────────────────────────────────

function CorrectBanner({ explanation }: { explanation: string }) {
  return (
    <div className="mt-4 p-3.5 rounded-md text-sm border text-ok border-[rgba(111,168,111,0.3)] bg-[rgba(111,168,111,0.08)]">
      <span className="font-semibold mr-1">Correct.</span>
      {explanation}
    </div>
  );
}

function WrongBanner({ triesLeft, hint }: { triesLeft: number; hint?: string }) {
  return (
    <div className="mt-4 p-3.5 rounded-md text-sm border text-fail border-[rgba(199,123,123,0.3)] bg-[rgba(199,123,123,0.08)]">
      <div>
        <span className="font-semibold mr-1">Not quite.</span>
        {triesLeft === 1 ? "1 try left." : `${triesLeft} tries left.`}
      </div>
      {hint && (
        <div className="mt-2 text-prose-muted">
          <span className="font-semibold mr-1 text-prose">Hint:</span>
          {hint}
        </div>
      )}
    </div>
  );
}

function RevealBanner({ answer, explanation }: { answer: React.ReactNode; explanation: string }) {
  return (
    <div className="mt-4 p-3.5 rounded-md text-sm border text-warn border-[rgba(199,153,90,0.3)] bg-[rgba(199,153,90,0.08)]">
      <div>
        <span className="font-semibold mr-1">Out of tries.</span>
        Here&rsquo;s the answer:
      </div>
      <div className="mt-2 text-prose">{answer}</div>
      <div className="mt-2 text-prose-muted">{explanation}</div>
    </div>
  );
}

// ── Tries indicator ─────────────────────────────────────────────────────────

function TriesIndicator({ used, max }: { used: number; max: number }) {
  return (
    <span
      className="text-xs text-prose-faint"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {used}/{max} tries
    </span>
  );
}

// ── Multiple choice ─────────────────────────────────────────────────────────

const MC_TRIES = 2;

function MultipleChoice({ quiz }: { quiz: MultipleChoiceQuiz }) {
  const [selected, setSelected] = useState<number | null>(null);
  const a = useAttempts(MC_TRIES);

  function check() {
    if (selected === null) return;
    a.submit(quiz.options[selected].correct);
  }

  const correctIdx = quiz.options.findIndex((o) => o.correct);
  const selectedFeedback =
    a.outcome === "wrong" && selected !== null
      ? quiz.options[selected].feedback
      : undefined;
  const hint = selectedFeedback ?? quiz.hint;

  return (
    <div>
      <p className="text-sm font-medium text-prose mb-3">{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-start gap-3 p-3 rounded-md border transition-colors duration-100 ${
              a.locked && opt.correct
                ? "border-[rgba(111,168,111,0.4)] bg-[rgba(111,168,111,0.06)]"
                : a.locked && selected === i && !opt.correct
                ? "border-[rgba(199,123,123,0.4)] bg-[rgba(199,123,123,0.06)]"
                : selected === i
                ? "border-[var(--border-emphasis)] bg-subtle"
                : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
            } ${a.locked ? "cursor-default" : "cursor-pointer"}`}
          >
            <input
              type="radio"
              name={quiz.id}
              value={i}
              disabled={a.locked}
              checked={selected === i}
              onChange={() => setSelected(i)}
              className="mt-0.5 accent-[#C77B3A]"
            />
            <span
              className="text-sm"
              style={{ color: "var(--color-prose)" }}
              dangerouslySetInnerHTML={{ __html: opt.text }}
            />
          </label>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-3">
        {!a.locked && (
          <button
            onClick={check}
            disabled={selected === null}
            className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100"
          >
            Check answer
          </button>
        )}
        <TriesIndicator used={a.attempts} max={MC_TRIES} />
      </div>
      {a.outcome === "correct" && <CorrectBanner explanation={quiz.explanation} />}
      {a.outcome === "wrong" && <WrongBanner triesLeft={a.triesLeft} hint={hint} />}
      {a.outcome === "exhausted" && (
        <RevealBanner
          answer={
            <span dangerouslySetInnerHTML={{ __html: quiz.options[correctIdx]?.text ?? "" }} />
          }
          explanation={quiz.explanation}
        />
      )}
    </div>
  );
}

// ── Fill in the blank ───────────────────────────────────────────────────────

const TEXT_TRIES = 3;

function FillInBlank({ quiz }: { quiz: FillInBlankQuiz }) {
  const [value, setValue] = useState("");
  const a = useAttempts(TEXT_TRIES);

  function check(v: string) {
    return quiz.correctAnswers.some((ans) =>
      quiz.caseSensitive
        ? v.trim() === ans
        : v.trim().toLowerCase() === ans.toLowerCase(),
    );
  }

  function handleSubmit() {
    if (!value || a.locked) return;
    a.submit(check(value));
  }

  return (
    <div>
      <p
        className="text-sm font-medium text-prose mb-3"
        dangerouslySetInnerHTML={{ __html: quiz.prompt }}
      />
      {quiz.code && (
        <pre
          className="mb-3 p-3 rounded-md text-sm text-prose-muted bg-subtle border border-[var(--border-subtle)] overflow-x-auto"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {quiz.code}
        </pre>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={a.locked}
          placeholder="Your answer…"
          className="px-3 py-2 rounded-md text-sm border bg-subtle text-prose placeholder:text-prose-faint focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
          style={{
            borderColor: "var(--border-default)",
            fontFamily: "var(--font-mono)",
            width: "min(20rem, 100%)",
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
        {!a.locked && (
          <button
            onClick={handleSubmit}
            disabled={!value}
            className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100"
          >
            Check
          </button>
        )}
        <TriesIndicator used={a.attempts} max={TEXT_TRIES} />
      </div>
      {a.outcome === "correct" && <CorrectBanner explanation={quiz.explanation} />}
      {a.outcome === "wrong" && <WrongBanner triesLeft={a.triesLeft} hint={quiz.hint} />}
      {a.outcome === "exhausted" && (
        <RevealBanner
          answer={
            <code
              className="px-1.5 py-0.5 rounded-sm bg-subtle text-prose"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {quiz.correctAnswers[0]}
            </code>
          }
          explanation={quiz.explanation}
        />
      )}
    </div>
  );
}

// ── Predict output ──────────────────────────────────────────────────────────

function PredictOutput({ quiz }: { quiz: PredictOutputQuiz }) {
  const expectedLines = quiz.expectedOutput.replace(/\n+$/, "").split("\n");
  const isMulti = expectedLines.length > 1;
  const [values, setValues] = useState<string[]>(() => expectedLines.map(() => ""));
  const a = useAttempts(TEXT_TRIES);

  function check() {
    return values.every((v, i) => v.trim() === expectedLines[i].trim());
  }

  function handleSubmit() {
    if (a.locked) return;
    if (values.some((v) => v.length === 0)) return;
    a.submit(check());
  }

  function setValue(i: number, v: string) {
    setValues((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  return (
    <div>
      <p className="text-sm font-medium text-prose mb-3">What does this print?</p>
      <pre
        className="mb-3 p-3 rounded-md text-sm text-prose-muted bg-subtle border border-[var(--border-subtle)] overflow-x-auto"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {quiz.code}
      </pre>

      <p
        className="text-xs text-prose-faint mb-2"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {isMulti
          ? `// expected output — ${expectedLines.length} lines, one per box`
          : "// expected output — one line"}
      </p>

      <div className="space-y-1.5 mb-3">
        {expectedLines.map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            {isMulti && (
              <span
                className="text-xs text-prose-faint w-6 text-right select-none"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {i + 1}.
              </span>
            )}
            <input
              type="text"
              value={values[i]}
              onChange={(e) => setValue(i, e.target.value)}
              disabled={a.locked}
              placeholder={isMulti ? `line ${i + 1}…` : "Expected output…"}
              className="px-3 py-2 rounded-md text-sm border bg-subtle text-prose placeholder:text-prose-faint focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-60"
              style={{
                borderColor: "var(--border-default)",
                fontFamily: "var(--font-mono)",
                width: "min(24rem, 100%)",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {!a.locked && (
          <button
            onClick={handleSubmit}
            disabled={values.some((v) => v.length === 0)}
            className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100"
          >
            Check
          </button>
        )}
        <TriesIndicator used={a.attempts} max={TEXT_TRIES} />
      </div>

      {a.outcome === "correct" && <CorrectBanner explanation={quiz.explanation} />}
      {a.outcome === "wrong" && <WrongBanner triesLeft={a.triesLeft} hint={quiz.hint} />}
      {a.outcome === "exhausted" && (
        <RevealBanner
          answer={
            <pre
              className="mt-1 p-2 rounded-sm bg-subtle text-prose text-xs overflow-x-auto"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {expectedLines.join("\n")}
            </pre>
          }
          explanation={quiz.explanation}
        />
      )}
    </div>
  );
}

// ── Find the bug ────────────────────────────────────────────────────────────

const CHOICE_TRIES = 2;

function FindTheBug({ quiz }: { quiz: FindTheBugQuiz }) {
  const [selected, setSelected] = useState<number | null>(null);
  const a = useAttempts(CHOICE_TRIES);
  const lines = quiz.code.split("\n");

  function check() {
    if (selected === null) return;
    a.submit(selected === quiz.buggyLine - 1);
  }

  return (
    <div>
      <p className="text-sm font-medium text-prose mb-3">
        Click the line with the bug:
      </p>
      <div
        className="rounded-md border overflow-hidden mb-3"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        {lines.map((line, i) => (
          <button
            key={i}
            onClick={() => !a.locked && setSelected(i)}
            disabled={a.locked}
            className={`w-full text-left flex gap-3 px-3 py-1.5 transition-colors duration-100 ${
              a.locked && i === quiz.buggyLine - 1
                ? "bg-[rgba(199,123,123,0.12)]"
                : a.locked && selected === i && i !== quiz.buggyLine - 1
                ? "bg-[rgba(199,123,123,0.06)]"
                : selected === i
                ? "bg-subtle"
                : "hover:bg-subtle"
            } ${i > 0 ? "border-t border-[var(--border-subtle)]" : ""} ${
              a.locked ? "cursor-default" : "cursor-pointer"
            }`}
          >
            <span
              className="text-xs text-prose-faint w-5 shrink-0 select-none"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {i + 1}
            </span>
            <span
              className="text-sm text-prose-muted"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {line || " "}
            </span>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {!a.locked && (
          <button
            onClick={check}
            disabled={selected === null}
            className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100"
          >
            Check
          </button>
        )}
        <TriesIndicator used={a.attempts} max={CHOICE_TRIES} />
      </div>
      {a.outcome === "correct" && (
        <CorrectBanner explanation={`Line ${quiz.buggyLine}: ${quiz.issue}. ${quiz.explanation}`} />
      )}
      {a.outcome === "wrong" && (
        <WrongBanner triesLeft={a.triesLeft} hint={quiz.hint ?? "Look at each line carefully — what's missing or wrong?"} />
      )}
      {a.outcome === "exhausted" && (
        <RevealBanner
          answer={<>Line {quiz.buggyLine} — {quiz.issue}.</>}
          explanation={quiz.explanation}
        />
      )}
    </div>
  );
}

// ── Order the steps ─────────────────────────────────────────────────────────

function OrderTheSteps({ quiz }: { quiz: OrderTheStepsQuiz }) {
  const [order, setOrder] = useState(() => [...quiz.items]);
  const a = useAttempts(CHOICE_TRIES);

  function isCorrect(o: typeof order) {
    return o.map((i) => i.id).join(",") === quiz.correctOrder.join(",");
  }

  function check() {
    if (a.locked) return;
    const result = a.submit(isCorrect(order));
    if (result === "exhausted") {
      // Snap to correct order on reveal
      const byId = new Map(quiz.items.map((it) => [it.id, it]));
      setOrder(quiz.correctOrder.map((id) => byId.get(id)!));
    }
  }

  function move(idx: number, dir: -1 | 1) {
    if (a.locked) return;
    const next = [...order];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setOrder(next);
  }

  return (
    <div>
      <p className="text-sm font-medium text-prose mb-3">{quiz.prompt}</p>
      <div className="space-y-1.5 mb-3">
        {order.map((item, i) => (
          <div
            key={item.id}
            className="flex items-center gap-2 p-3 rounded-md border"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderColor: "var(--border-subtle)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span className="text-xs text-prose-faint w-5 shrink-0">{i + 1}</span>
            <span className="text-sm text-prose flex-1">{item.text}</span>
            {!a.locked && (
              <div className="flex gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="px-1.5 py-0.5 text-xs text-prose-faint hover:text-prose disabled:opacity-30 cursor-pointer"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  className="px-1.5 py-0.5 text-xs text-prose-faint hover:text-prose disabled:opacity-30 cursor-pointer"
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3">
        {!a.locked && (
          <button
            onClick={check}
            className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm transition-colors duration-100"
          >
            Check order
          </button>
        )}
        <TriesIndicator used={a.attempts} max={CHOICE_TRIES} />
      </div>
      {a.outcome === "correct" && <CorrectBanner explanation={quiz.explanation} />}
      {a.outcome === "wrong" && (
        <WrongBanner triesLeft={a.triesLeft} hint={quiz.hint ?? "Think about what has to happen first before later steps make sense."} />
      )}
      {a.outcome === "exhausted" && (
        <RevealBanner
          answer={<span>The correct order is shown above.</span>}
          explanation={quiz.explanation}
        />
      )}
    </div>
  );
}

// ── Public wrapper ──────────────────────────────────────────────────────────

interface QuizBlockProps {
  quiz: QuizItem;
  label?: string;
}

export function QuizBlock({ quiz, label }: QuizBlockProps) {
  return (
    <div
      className="my-6 p-5 rounded-lg border"
      style={{
        backgroundColor: "var(--color-elevated)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {label && (
        <p
          className="text-xs text-prose-faint mb-3"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {`// ${label}`}
        </p>
      )}
      {quiz.type === "multiple_choice" && <MultipleChoice quiz={quiz} />}
      {quiz.type === "fill_in_blank" && <FillInBlank quiz={quiz} />}
      {quiz.type === "predict_output" && <PredictOutput quiz={quiz} />}
      {quiz.type === "find_the_bug" && <FindTheBug quiz={quiz} />}
      {quiz.type === "order_the_steps" && <OrderTheSteps quiz={quiz} />}
    </div>
  );
}

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

// ── Shared result banner ────────────────────────────────────────────────────

function Result({ correct, explanation }: { correct: boolean; explanation: string }) {
  return (
    <div
      className={`mt-4 p-3.5 rounded-md text-sm border ${
        correct
          ? "text-ok border-[rgba(111,168,111,0.3)] bg-[rgba(111,168,111,0.08)]"
          : "text-fail border-[rgba(199,123,123,0.3)] bg-[rgba(199,123,123,0.08)]"
      }`}
    >
      <span className="font-semibold mr-1">{correct ? "Correct." : "Not quite."}</span>
      {explanation}
    </div>
  );
}

// ── Multiple choice ─────────────────────────────────────────────────────────

function MultipleChoice({ quiz }: { quiz: MultipleChoiceQuiz }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const correct = selected !== null && quiz.options[selected].correct;

  return (
    <div>
      <p className="text-sm font-medium text-prose mb-3">{quiz.question}</p>
      <div className="space-y-2">
        {quiz.options.map((opt, i) => (
          <label
            key={i}
            className={`flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors duration-100 ${
              submitted && opt.correct
                ? "border-[rgba(111,168,111,0.4)] bg-[rgba(111,168,111,0.06)]"
                : submitted && selected === i && !opt.correct
                ? "border-[rgba(199,123,123,0.4)] bg-[rgba(199,123,123,0.06)]"
                : selected === i
                ? "border-[var(--border-emphasis)] bg-subtle"
                : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
            }`}
          >
            <input
              type="radio"
              name={quiz.id}
              value={i}
              disabled={submitted}
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
      {!submitted && selected !== null && (
        <button
          onClick={() => setSubmitted(true)}
          className="mt-3 px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm transition-colors duration-100"
        >
          Check answer
        </button>
      )}
      {submitted && <Result correct={correct} explanation={quiz.explanation} />}
    </div>
  );
}

// ── Fill in the blank ───────────────────────────────────────────────────────

function FillInBlank({ quiz }: { quiz: FillInBlankQuiz }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function check(v: string, answers: string[], cs?: boolean) {
    return answers.some((a) =>
      cs ? v.trim() === a : v.trim().toLowerCase() === a.toLowerCase(),
    );
  }

  const correct = check(value, quiz.correctAnswers, quiz.caseSensitive);

  return (
    <div>
      <p className="text-sm font-medium text-prose mb-3"
         dangerouslySetInnerHTML={{ __html: quiz.prompt }} />
      {quiz.code && (
        <pre
          className="mb-3 p-3 rounded-md text-sm text-prose-muted bg-subtle border border-[var(--border-subtle)] overflow-x-auto"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {quiz.code}
        </pre>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={submitted && correct}
        placeholder="Your answer…"
        className="w-full max-w-xs px-3 py-2 rounded-md text-sm border bg-subtle text-prose placeholder:text-prose-faint focus:outline-none focus:ring-2 focus:ring-accent"
        style={{ borderColor: "var(--border-default)", fontFamily: "var(--font-mono)" }}
        onKeyDown={(e) => { if (e.key === "Enter" && value && !submitted) setSubmitted(true); }}
      />
      {!submitted && value && (
        <button
          onClick={() => setSubmitted(true)}
          className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm transition-colors duration-100"
        >
          Check
        </button>
      )}
      {submitted && <Result correct={correct} explanation={quiz.explanation} />}
    </div>
  );
}

// ── Predict output ──────────────────────────────────────────────────────────

function PredictOutput({ quiz }: { quiz: PredictOutputQuiz }) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const correct = value.trim() === quiz.expectedOutput.trim();

  return (
    <div>
      <p className="text-sm font-medium text-prose mb-3">What does this print?</p>
      <pre
        className="mb-3 p-3 rounded-md text-sm text-prose-muted bg-subtle border border-[var(--border-subtle)] overflow-x-auto"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {quiz.code}
      </pre>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={submitted && correct}
        placeholder="Expected output…"
        className="w-full max-w-xs px-3 py-2 rounded-md text-sm border bg-subtle text-prose placeholder:text-prose-faint focus:outline-none focus:ring-2 focus:ring-accent"
        style={{ borderColor: "var(--border-default)", fontFamily: "var(--font-mono)" }}
        onKeyDown={(e) => { if (e.key === "Enter" && value && !submitted) setSubmitted(true); }}
      />
      {!submitted && value && (
        <button
          onClick={() => setSubmitted(true)}
          className="ml-2 px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm transition-colors duration-100"
        >
          Check
        </button>
      )}
      {submitted && <Result correct={correct} explanation={quiz.explanation} />}
    </div>
  );
}

// ── Find the bug ────────────────────────────────────────────────────────────

function FindTheBug({ quiz }: { quiz: FindTheBugQuiz }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const lines = quiz.code.split("\n");
  const correct = selected === quiz.buggyLine - 1; // buggyLine is 1-indexed

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
            onClick={() => !submitted && setSelected(i)}
            disabled={submitted}
            className={`w-full text-left flex gap-3 px-3 py-1.5 transition-colors duration-100 ${
              submitted && i === quiz.buggyLine - 1
                ? "bg-[rgba(199,123,123,0.12)]"
                : submitted && selected === i && i !== quiz.buggyLine - 1
                ? "bg-[rgba(199,123,123,0.06)]"
                : selected === i
                ? "bg-subtle"
                : "hover:bg-subtle"
            } ${i > 0 ? "border-t border-[var(--border-subtle)]" : ""}`}
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
      {!submitted && selected !== null && (
        <button
          onClick={() => setSubmitted(true)}
          className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm transition-colors duration-100"
        >
          Check
        </button>
      )}
      {submitted && <Result correct={correct} explanation={`Line ${quiz.buggyLine}: ${quiz.issue}. ${quiz.explanation}`} />}
    </div>
  );
}

// ── Order the steps ─────────────────────────────────────────────────────────

function OrderTheSteps({ quiz }: { quiz: OrderTheStepsQuiz }) {
  const [order, setOrder] = useState(() => [...quiz.items]);
  const [submitted, setSubmitted] = useState(false);

  const correct =
    order.map((i) => i.id).join(",") === quiz.correctOrder.join(",");

  function move(idx: number, dir: -1 | 1) {
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
            {!submitted && (
              <div className="flex gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="px-1.5 py-0.5 text-xs text-prose-faint hover:text-prose disabled:opacity-30 cursor-pointer"
                  aria-label="Move up"
                >↑</button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === order.length - 1}
                  className="px-1.5 py-0.5 text-xs text-prose-faint hover:text-prose disabled:opacity-30 cursor-pointer"
                  aria-label="Move down"
                >↓</button>
              </div>
            )}
          </div>
        ))}
      </div>
      {!submitted && (
        <button
          onClick={() => setSubmitted(true)}
          className="px-4 py-2 rounded-md text-sm font-medium bg-accent text-inverse cursor-pointer hover:bg-accent-warm transition-colors duration-100"
        >
          Check order
        </button>
      )}
      {submitted && <Result correct={correct} explanation={quiz.explanation} />}
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
      {quiz.type === "multiple_choice"  && <MultipleChoice  quiz={quiz} />}
      {quiz.type === "fill_in_blank"    && <FillInBlank    quiz={quiz} />}
      {quiz.type === "predict_output"   && <PredictOutput  quiz={quiz} />}
      {quiz.type === "find_the_bug"     && <FindTheBug     quiz={quiz} />}
      {quiz.type === "order_the_steps"  && <OrderTheSteps  quiz={quiz} />}
    </div>
  );
}

"use client";

import { useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { PremiumGate } from "@/components/capstone/PremiumGate";
import { Play, Send, ChevronDown, ChevronRight, Trophy, RotateCcw, Lightbulb } from "lucide-react";
import type { GradeResult } from "@/lib/capstone";

const CodeEditor = dynamic(
  () => import("@/components/lesson/CodeEditor").then((m) => m.CodeEditor),
  { ssr: false },
);

interface Props {
  capstoneId: string;
  starterCode: string;
  hints: string[];
  referenceSolution: string;
  totalTests: number;
  isPremium: boolean;
  nextPath: string;
  certificatePath: string;
}

type PanelState = "idle" | "running" | "grading" | "passed" | "failed";

const STORAGE_KEY = (id: string) => `bytecode:capstone:${id}`;

function loadState(id: string): { attempts: number; passed: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(id));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { attempts: 0, passed: false };
}

function saveState(id: string, state: { attempts: number; passed: boolean }) {
  try {
    localStorage.setItem(STORAGE_KEY(id), JSON.stringify(state));
  } catch { /* ignore */ }
}

export function CapstonePanel({
  capstoneId,
  starterCode,
  hints,
  referenceSolution,
  totalTests,
  isPremium,
  nextPath,
  certificatePath,
}: Props) {
  const [code, setCode] = useState(starterCode);
  const [panelState, setPanelState] = useState<PanelState>("idle");
  const [runOutput, setRunOutput] = useState<string | null>(null);
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [compileError, setCompileError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionOpen, setSolutionOpen] = useState(false);

  useEffect(() => {
    const s = loadState(capstoneId);
    setAttempts(s.attempts);
    if (s.passed) setPanelState("passed");
  }, [capstoneId]);

  const handleRun = useCallback(async () => {
    setPanelState("running");
    setRunOutput(null);
    setCompileError(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setRunOutput(data.output ?? data.error ?? "No output");
    } catch {
      setRunOutput("Error reaching the code runner.");
    } finally {
      setPanelState("idle");
    }
  }, [code]);

  const handleSubmit = useCallback(async () => {
    setPanelState("grading");
    setRunOutput(null);
    setCompileError(null);
    setGradeResult(null);
    try {
      const res = await fetch("/api/capstone/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();

      if (data.compileError) {
        setCompileError(data.compileError);
        setPanelState("idle");
        return;
      }

      const result: GradeResult = data;
      setGradeResult(result);

      if (result.allPassed) {
        setPanelState("passed");
        const newState = { attempts, passed: true };
        saveState(capstoneId, newState);
      } else {
        setPanelState("failed");
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setHintsShown(Math.min(newAttempts, hints.length));
        saveState(capstoneId, { attempts: newAttempts, passed: false });
      }
    } catch {
      setCompileError("Error reaching the grader. Please try again.");
      setPanelState("idle");
    }
  }, [code, attempts, capstoneId, hints.length]);

  const handleReset = useCallback(() => {
    setCode(starterCode);
    setPanelState("idle");
    setRunOutput(null);
    setGradeResult(null);
    setCompileError(null);
  }, [starterCode]);

  const isWorking = panelState === "running" || panelState === "grading";
  const showSolutionButton = attempts >= 3;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b shrink-0"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}
      >
        <span className="text-xs text-prose-faint flex-1" style={{ fontFamily: "var(--font-mono)" }}>
          Main.java
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={isWorking}
          className="gap-1.5 text-prose-faint hover:text-prose"
        >
          <RotateCcw size={12} /> Reset
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRun}
          disabled={isWorking}
          className="gap-1.5"
        >
          <Play size={12} /> Run
        </Button>
        {isPremium ? (
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit}
            disabled={isWorking || panelState === "passed"}
            className="gap-1.5"
          >
            <Send size={12} />
            {panelState === "grading" ? "Grading…" : "Submit"}
          </Button>
        ) : null}
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 relative">
        <CodeEditor
          value={code}
          onChange={setCode}
          readOnly={panelState === "passed"}
        />

        {/* Premium gate overlay — shown on top of editor for non-premium users */}
        {!isPremium && (
          <PremiumGate nextPath={nextPath} />
        )}
      </div>

      {/* Output / results area */}
      <div
        className="shrink-0 border-t"
        style={{ borderColor: "var(--border-subtle)", maxHeight: "40vh", overflowY: "auto" }}
      >
        {/* Compile error */}
        {compileError && (
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-fail mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>
              Compile error
            </p>
            <pre className="text-xs text-fail whitespace-pre-wrap leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
              {compileError}
            </pre>
          </div>
        )}

        {/* Run output */}
        {runOutput !== null && !compileError && (
          <div className="px-4 py-3">
            <p className="text-xs text-prose-faint mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>// output</p>
            <pre className="text-xs text-prose-muted whitespace-pre-wrap leading-relaxed" style={{ fontFamily: "var(--font-mono)" }}>
              {runOutput}
            </pre>
          </div>
        )}

        {/* Grade results */}
        {gradeResult && (
          <div className="px-4 py-3">
            {/* Summary bar */}
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`text-sm font-semibold ${gradeResult.allPassed ? "text-ok" : "text-fail"}`}
              >
                {gradeResult.passed}/{gradeResult.total} tests passed
              </span>
              {!gradeResult.allPassed && (
                <span className="text-xs text-prose-faint">
                  {gradeResult.total - gradeResult.passed} failing
                </span>
              )}
            </div>

            {/* Per-test results */}
            <div className="space-y-1">
              {gradeResult.results.map((r) => (
                <div key={r.name} className="flex items-start gap-2 text-xs">
                  <span className={`shrink-0 font-semibold mt-0.5 ${r.passed ? "text-ok" : "text-fail"}`}
                    style={{ fontFamily: "var(--font-mono)" }}>
                    {r.passed ? "✓" : "✗"}
                  </span>
                  <div>
                    <span className={r.passed ? "text-prose-muted" : "text-prose"}>{r.name}</span>
                    {!r.passed && r.expected !== undefined && (
                      <p className="text-prose-faint mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                        expected <span className="text-ok">{r.expected}</span>
                        {" · "}got <span className="text-fail">{r.got ?? "(empty)"}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All passed — celebration */}
        {panelState === "passed" && (
          <div
            className="px-4 py-4 border-t"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "rgba(111,168,111,0.06)" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Trophy size={20} className="text-ok shrink-0" />
              <div>
                <p className="text-sm font-semibold text-ok">All {totalTests} tests passed!</p>
                <p className="text-xs text-prose-muted mt-0.5">Java Beginner — Module 1 Mastery badge earned.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button as="a" href={certificatePath} variant="primary" size="sm" className="gap-1.5">
                <Trophy size={12} /> View certificate
              </Button>
              <Button as="a" href={nextPath} variant="secondary" size="sm">
                Back to module
              </Button>
            </div>
          </div>
        )}

        {/* Hints (shown progressively after failed submissions) */}
        {isPremium && hintsShown > 0 && panelState !== "passed" && (
          <div className="px-4 py-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-prose mb-2">
              <Lightbulb size={12} className="text-accent" />
              Hints ({hintsShown} of {Math.min(attempts, hints.length)} available)
            </p>
            <div className="space-y-2">
              {hints.slice(0, hintsShown).map((hint, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded text-xs text-prose-muted leading-relaxed border-l-2"
                  style={{ borderLeftColor: "var(--color-accent)", backgroundColor: "var(--accent-muted)" }}
                >
                  <span className="font-semibold text-prose-faint mr-1">Hint {i + 1}:</span>
                  {hint}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reference solution (after 3 failed submissions) */}
        {isPremium && showSolutionButton && panelState !== "passed" && (
          <div className="px-4 py-3 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <button
              onClick={() => setSolutionOpen((o) => !o)}
              className="flex items-center gap-1.5 text-xs text-prose-faint hover:text-prose transition-colors"
            >
              {solutionOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              Show reference solution
            </button>
            {solutionOpen && (
              <pre
                className="mt-3 p-3 rounded text-xs leading-relaxed overflow-x-auto border"
                style={{
                  fontFamily: "var(--font-mono)",
                  backgroundColor: "var(--color-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--color-prose-muted)",
                }}
              >
                {referenceSolution}
              </pre>
            )}
          </div>
        )}

        {/* Idle placeholder */}
        {panelState === "idle" && !runOutput && !gradeResult && !compileError && (
          <div className="px-4 py-3">
            <p className="text-xs text-prose-faint" style={{ fontFamily: "var(--font-mono)" }}>
              {isPremium
                ? "// click Run to test your demo · click Submit to run all 14 tests"
                : "// click Run to test your code"}
            </p>
          </div>
        )}

        {isWorking && (
          <div className="px-4 py-3">
            <p className="text-xs text-prose-faint animate-pulse" style={{ fontFamily: "var(--font-mono)" }}>
              {panelState === "grading" ? "// running 14 tests…" : "// running…"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

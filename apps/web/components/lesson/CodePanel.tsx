"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Play, CheckCircle, XCircle, Loader2, MessageSquare, RotateCcw } from "lucide-react";
import type { RunResult } from "@/app/api/run/route";

const CodeEditor = dynamic(
  () => import("./CodeEditor").then((m) => m.CodeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={16} className="text-prose-faint animate-spin" />
      </div>
    ),
  },
);

interface CodePanelProps {
  lessonSlug: string;
  trackSlug: string;
  moduleSlug: string;
  starterCode: string;
  expectedOutput?: string;
}

type RunState = "idle" | "running" | "passed" | "failed" | "error";

function gradeOutput(stdout: string, expected: string): boolean {
  const got = stdout.trim();
  // Special case: "__any__" as second segment means "first line correct + any second line"
  if (expected.includes("__any__")) {
    const lines = got.split("\n");
    const expectedLines = expected.split("\n");
    if (lines.length < 2) return false;
    return lines[0].trim() === expectedLines[0].trim() && lines[1].trim().length > 0;
  }
  return got === expected.trim();
}

export function CodePanel({ lessonSlug, trackSlug, moduleSlug, starterCode, expectedOutput }: CodePanelProps) {
  const [code, setCode] = useState(starterCode);
  const [result, setResult] = useState<RunResult | null>(null);
  const [runState, setRunState] = useState<RunState>("idle");

  async function handleRun() {
    setRunState("running");
    setResult(null);

    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data: RunResult & { error?: string } = await res.json();

      if (!res.ok || data.error) {
        setRunState("error");
        setResult({
          stdout: "",
          stderr: data.error ?? "Unexpected error from execution service.",
          time: null,
          memory: null,
          status: { id: 0, description: "Error" },
        });
        return;
      }

      setResult(data);

      // Status IDs: 3 = Accepted, 4 = Wrong Answer, 5 = TLE, 6 = Compilation Error
      const compiled = data.status.id !== 6 && !data.stderr.includes("error:");
      if (!compiled) {
        setRunState("error");
        return;
      }

      if (expectedOutput) {
        const passed = gradeOutput(data.stdout, expectedOutput);
        setRunState(passed ? "passed" : "failed");
        if (passed) {
          try {
            const key = `bytecode:progress:${trackSlug}:${moduleSlug}`;
            const prev = JSON.parse(localStorage.getItem(key) ?? "[]") as string[];
            if (!prev.includes(lessonSlug)) {
              const next = [...prev, lessonSlug];
              localStorage.setItem(key, JSON.stringify(next));
              window.dispatchEvent(new StorageEvent("storage", { key, newValue: JSON.stringify(next) }));
            }
          } catch { /* ignore */ }
        }
      } else {
        setRunState("idle");
      }
    } catch {
      setRunState("error");
      setResult({
        stdout: "",
        stderr: "Network error — could not reach the execution service.",
        time: null,
        memory: null,
        status: { id: 0, description: "Network Error" },
      });
    }
  }

  const statusBar = {
    passed: { icon: <CheckCircle size={13} className="text-ok" />, label: "All tests passed", color: "text-ok" },
    failed: { icon: <XCircle size={13} className="text-fail" />,  label: "Wrong output",     color: "text-fail" },
    error:  { icon: <XCircle size={13} className="text-warn" />,  label: "Error",            color: "text-warn" },
    running:{ icon: <Loader2 size={13} className="text-prose-faint animate-spin" />, label: "Running…", color: "text-prose-faint" },
    idle:   null,
  }[runState];

  const output = result
    ? (result.stdout || result.stderr || "").replace(/\n$/, "")
    : null;

  return (
    <aside
      className="hidden lg:flex flex-col border-l w-[38%] shrink-0"
      style={{
        borderColor: "var(--border-subtle)",
        position: "sticky",
        top: "56px",
        height: "calc(100vh - 56px)",
      }}
    >
      {/* ── Toolbar ── */}
      <div
        className="px-4 py-2.5 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs text-prose-faint"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // exercise
          </span>
          <span
            className="text-xs text-prose-faint px-1.5 py-0.5 rounded-sm bg-subtle"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            java
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            onClick={() => { setCode(starterCode); setResult(null); setRunState("idle"); }}
            className="text-prose-faint hover:text-prose-muted transition-colors duration-100 cursor-pointer"
            title="Reset to starter code"
          >
            <RotateCcw size={13} />
          </button>

          {/* Run */}
          <button
            onClick={handleRun}
            disabled={runState === "running"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-accent text-inverse hover:bg-accent-warm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100 cursor-pointer"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {runState === "running"
              ? <Loader2 size={12} className="animate-spin" />
              : <Play size={12} />}
            Run
          </button>
        </div>
      </div>

      {/* ── Editor ── */}
      <div className="flex-1 min-h-0 overflow-hidden" style={{ minHeight: 0 }}>
        <CodeEditor value={code} onChange={setCode} />
      </div>

      {/* ── Output panel ── */}
      <div
        className="shrink-0 border-t"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        {/* Output header */}
        <div
          className="px-4 py-2 flex items-center justify-between border-b"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <span
            className="text-xs text-prose-faint"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            output
          </span>
          {statusBar && (
            <span className={`flex items-center gap-1.5 text-xs ${statusBar.color}`}
              style={{ fontFamily: "var(--font-mono)" }}>
              {statusBar.icon}
              {statusBar.label}
            </span>
          )}
          {result?.time && (
            <span className="text-xs text-prose-faint ml-auto" style={{ fontFamily: "var(--font-mono)" }}>
              {result.time}s
            </span>
          )}
        </div>

        {/* Output content */}
        <div
          className="px-4 py-3 h-28 overflow-y-auto"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {output !== null ? (
            <pre className={`text-xs whitespace-pre-wrap leading-relaxed ${
              result?.stderr && !result.stdout ? "text-fail" : "text-prose-muted"
            }`}>
              {output || <span className="text-prose-faint italic">no output</span>}
            </pre>
          ) : (
            <p className="text-xs text-prose-faint italic">
              {runState === "running" ? "Running…" : "Click Run to execute your code."}
            </p>
          )}
        </div>
      </div>

      {/* ── Forum link ── */}
      <div className="p-4 border-t shrink-0" style={{ borderColor: "var(--border-subtle)" }}>
        <a
          href={`/forum/new?lesson=${lessonSlug}&track=${trackSlug}`}
          className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-md text-sm text-prose-muted border hover:text-prose hover:bg-subtle transition-colors duration-100"
          style={{ borderColor: "var(--border-emphasis)" }}
        >
          <MessageSquare size={14} />
          Ask in the forum
        </a>
      </div>
    </aside>
  );
}

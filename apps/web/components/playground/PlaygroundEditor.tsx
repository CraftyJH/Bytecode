"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Play, Loader2, RotateCcw, Trash2, Save, FolderOpen } from "lucide-react";
import type { RunResult } from "@/app/api/run/route";

const CodeEditor = dynamic(
  () => import("@/components/lesson/CodeEditor").then((m) => m.CodeEditor),
  {
    ssr: false,
    loading: () => (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={16} className="text-prose-faint animate-spin" />
      </div>
    ),
  },
);

const DEFAULT_CODE = `public class Main {
    public static void main(String[] args) {
        // Write and run any Java code here
        System.out.println("Hello, playground!");
    }
}`;

const PLAYGROUND_STORAGE_KEY = "bytecode:playground:java";

export function PlaygroundEditor() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  function saveCode() {
    try {
      localStorage.setItem(PLAYGROUND_STORAGE_KEY, code);
      setNotice("Saved to browser storage.");
    } catch {
      setNotice("Could not save code in this browser.");
    }
  }

  function loadCode() {
    try {
      const stored = localStorage.getItem(PLAYGROUND_STORAGE_KEY);
      if (!stored) {
        setNotice("No saved code found.");
        return;
      }
      setCode(stored);
      setResult(null);
      setNotice("Loaded saved code.");
    } catch {
      setNotice("Could not load saved code.");
    }
  }

  async function handleRun() {
    setRunning(true);
    setResult(null);
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data: RunResult & { error?: string } = await res.json();
      setResult(
        !res.ok || data.error
          ? { stdout: "", stderr: data.error ?? "Unexpected error.", time: null, memory: null, status: { id: 0, description: "Error" } }
          : data,
      );
    } catch {
      setResult({ stdout: "", stderr: "Network error — could not reach the execution service.", time: null, memory: null, status: { id: 0, description: "Network Error" } });
    } finally {
      setRunning(false);
    }
  }

  const output = result ? (result.stdout || result.stderr || "").replace(/\n$/, "") : null;
  const isError = result && !result.stdout && !!result.stderr;

  return (
    <div
      className="flex flex-col rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--border-subtle)",
        height: "calc(100vh - 220px)",
        minHeight: "480px",
      }}
    >
      {/* Toolbar */}
      <div
        className="px-4 py-2.5 border-b flex items-center justify-between shrink-0"
        style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-prose-faint" style={{ fontFamily: "var(--font-mono)" }}>
            // playground
          </span>
          <span
            className="text-xs text-prose-faint px-1.5 py-0.5 rounded-sm bg-subtle"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            java
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={saveCode}
            className="text-prose-faint hover:text-prose-muted transition-colors duration-100 cursor-pointer"
            title="Save current code"
          >
            <Save size={13} />
          </button>
          <button
            onClick={loadCode}
            className="text-prose-faint hover:text-prose-muted transition-colors duration-100 cursor-pointer"
            title="Load saved code"
          >
            <FolderOpen size={13} />
          </button>
          <button
            onClick={() => { setCode(DEFAULT_CODE); setResult(null); }}
            className="text-prose-faint hover:text-prose-muted transition-colors duration-100 cursor-pointer"
            title="Reset to default"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={() => { setCode(""); setResult(null); }}
            className="text-prose-faint hover:text-prose-muted transition-colors duration-100 cursor-pointer"
            title="Clear editor"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-accent text-inverse hover:bg-accent-warm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-100 cursor-pointer"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {running ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
            Run
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <CodeEditor value={code} onChange={setCode} />
      </div>

      {notice && (
        <div
          className="px-4 py-2 text-xs border-t text-prose-faint"
          style={{ borderColor: "var(--border-subtle)", fontFamily: "var(--font-mono)" }}
        >
          {notice}
        </div>
      )}

      {/* Output */}
      <div className="shrink-0 border-t" style={{ borderColor: "var(--border-subtle)" }}>
        <div
          className="px-4 py-2 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--bg-elevated)" }}
        >
          <span className="text-xs text-prose-faint" style={{ fontFamily: "var(--font-mono)" }}>
            output
          </span>
          {result?.time && (
            <span className="text-xs text-prose-faint" style={{ fontFamily: "var(--font-mono)" }}>
              {result.time}s
            </span>
          )}
        </div>
        <div className="px-4 py-3 h-32 overflow-y-auto" style={{ fontFamily: "var(--font-mono)" }}>
          {output !== null ? (
            <pre className={`text-xs whitespace-pre-wrap leading-relaxed ${isError ? "text-fail" : "text-prose-muted"}`}>
              {output || <span className="text-prose-faint italic">no output</span>}
            </pre>
          ) : (
            <p className="text-xs text-prose-faint italic">
              {running ? "Running…" : "Click Run to execute your code."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

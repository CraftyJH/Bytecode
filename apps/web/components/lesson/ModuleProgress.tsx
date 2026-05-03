"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, X } from "lucide-react";
import type { LessonMeta } from "@/lib/curriculum";

interface ModuleProgressProps {
  lessons: LessonMeta[];
  trackSlug: string;
  moduleSlug: string;
}

export function ModuleProgress({ lessons, trackSlug, moduleSlug }: ModuleProgressProps) {
  const storageKey = `bytecode:progress:${trackSlug}:${moduleSlug}`;
  const [completed, setCompleted] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function load() {
      try {
        const val = localStorage.getItem(storageKey);
        setCompleted(val ? (JSON.parse(val) as string[]) : []);
      } catch {
        setCompleted([]);
      }
    }
    load();
    function onStorage(e: StorageEvent) {
      if (e.key === storageKey) load();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [storageKey]);

  const total = lessons.length;
  const count = completed.length;
  const pct = total > 0 ? count / total : 0;

  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Expanded lesson list */}
      {open && (
        <div
          className="rounded-lg border shadow-lg w-64 overflow-hidden"
          style={{
            backgroundColor: "var(--color-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div
            className="px-4 py-3 border-b flex items-center justify-between"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <span className="text-xs font-medium text-prose" style={{ fontFamily: "var(--font-mono)" }}>
              module progress
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-prose-faint hover:text-prose transition-colors cursor-pointer"
            >
              <X size={13} />
            </button>
          </div>
          <ul className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
            {lessons.map((lesson) => {
              const done = completed.includes(lesson.slug);
              return (
                <li key={lesson.slug}>
                  <a
                    href={`/curriculum/${trackSlug}/${moduleSlug}/lesson/${lesson.slug}`}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-subtle transition-colors duration-100"
                  >
                    {done ? (
                      <CheckCircle size={13} className="text-ok shrink-0" />
                    ) : (
                      <Circle size={13} className="text-prose-faint shrink-0" />
                    )}
                    <span
                      className={`text-xs truncate ${done ? "text-prose-muted" : "text-prose-faint"}`}
                    >
                      {String(lesson.order).padStart(2, "0")} {lesson.title}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div
            className="px-4 py-2.5 border-t text-xs text-prose-faint text-center"
            style={{ borderColor: "var(--border-subtle)", fontFamily: "var(--font-mono)" }}
          >
            {count}/{total} complete
          </div>
        </div>
      )}

      {/* Circular progress button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title={`${count}/${total} lessons complete`}
        className="w-12 h-12 rounded-full border flex items-center justify-center relative cursor-pointer hover:border-accent transition-colors duration-100"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderColor: open ? "var(--color-accent)" : "var(--border-emphasis)",
        }}
      >
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          className="absolute inset-0 -rotate-90"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx="22"
            cy="22"
            r={r}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth="2.5"
          />
          {/* Progress arc */}
          {pct > 0 && (
            <circle
              cx="22"
              cy="22"
              r={r}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeLinecap="round"
            />
          )}
        </svg>
        <span
          className="relative text-[10px] font-medium text-prose-muted"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {count}/{total}
        </span>
      </button>
    </div>
  );
}

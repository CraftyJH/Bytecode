"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, X } from "lucide-react";
import type { LessonMeta } from "@/lib/curriculum";

interface ModuleProgressProps {
  lessons: LessonMeta[];
  trackSlug: string;
  moduleSlug: string;
  initialCompletedSlugs?: string[];
}

export function ModuleProgress({
  lessons,
  trackSlug,
  moduleSlug,
  initialCompletedSlugs = [],
}: ModuleProgressProps) {
  const storageKey = `bytecode:progress:${trackSlug}:${moduleSlug}`;
  const [completed, setCompleted] = useState<string[]>(initialCompletedSlugs);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function loadFromLocal() {
      try {
        const val = localStorage.getItem(storageKey);
        setCompleted(val ? (JSON.parse(val) as string[]) : initialCompletedSlugs);
      } catch {
        setCompleted(initialCompletedSlugs);
      }
    }

    let active = true;
    async function loadFromRemote() {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as { completedLessonSlugs?: string[] };
        if (!active) return;
        const remote = data.completedLessonSlugs ?? [];
        setCompleted(remote);
        localStorage.setItem(storageKey, JSON.stringify(remote));
      } catch {
        if (active) loadFromLocal();
      }
    }

    loadFromRemote();

    function onStorage(e: StorageEvent) {
      if (e.key === storageKey) loadFromLocal();
    }
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
    };
  }, [initialCompletedSlugs, storageKey]);

  const total = lessons.length;
  const count = completed.length;
  const pct = total > 0 ? count / total : 0;

  const SIZE = 64;
  const STROKE = 4;
  const CENTER = SIZE / 2;
  const r = CENTER - STROKE;
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
        className="rounded-full border flex items-center justify-center cursor-pointer transition-all duration-150 ease-out hover:scale-110 hover:shadow-lg"
        style={{
          width: SIZE,
          height: SIZE,
          backgroundColor: "var(--color-elevated)",
          borderColor: open ? "var(--color-accent)" : "var(--border-emphasis)",
          boxShadow: open ? "0 0 0 2px rgba(199, 123, 58, 0.25)" : undefined,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--color-accent)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = open
            ? "var(--color-accent)"
            : "var(--border-emphasis)";
        }}
      >
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {/* Track */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={r}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={STROKE}
          />
          {/* Progress arc — rotated only on this circle so text stays upright */}
          {pct > 0 && (
            <circle
              cx={CENTER}
              cy={CENTER}
              r={r}
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth={STROKE}
              strokeDasharray={`${dash} ${circ - dash}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${CENTER} ${CENTER})`}
            />
          )}
          {/* Centered label */}
          <text
            x={CENTER}
            y={CENTER}
            textAnchor="middle"
            dominantBaseline="central"
            fill="var(--color-prose-muted)"
            fontSize="13"
            fontWeight="500"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {count}/{total}
          </text>
        </svg>
      </button>
    </div>
  );
}

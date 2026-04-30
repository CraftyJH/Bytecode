"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

interface MarkCompleteProps {
  lessonSlug: string;
  storageKey: string; // namespaced key
}

export function MarkComplete({ lessonSlug, storageKey }: MarkCompleteProps) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as string[];
      setDone(stored.includes(lessonSlug));
    } catch {
      // ignore
    }
  }, [lessonSlug, storageKey]);

  function toggle() {
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? "[]") as string[];
      const next = done
        ? stored.filter((s) => s !== lessonSlug)
        : [...stored, lessonSlug];
      localStorage.setItem(storageKey, JSON.stringify(next));
      setDone(!done);
    } catch {
      // ignore
    }
  }

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium border transition-colors duration-100 cursor-pointer ${
        done
          ? "text-ok border-[rgba(111,168,111,0.3)] bg-[rgba(111,168,111,0.08)] hover:bg-[rgba(199,123,123,0.08)] hover:text-fail hover:border-[rgba(199,123,123,0.3)]"
          : "text-prose-muted border-[var(--border-emphasis)] hover:text-prose hover:bg-subtle"
      }`}
      aria-pressed={done}
    >
      <CheckCircle size={15} />
      {done ? "Completed — mark incomplete" : "Mark as complete"}
    </button>
  );
}

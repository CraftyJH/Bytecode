"use client";

import { useState } from "react";
import { BookOpen, Code2 } from "lucide-react";

interface LessonColumnsProps {
  children: React.ReactNode;
  codePanel: React.ReactNode;
  hasCode: boolean;
}

export function LessonColumns({ children, codePanel, hasCode }: LessonColumnsProps) {
  const [tab, setTab] = useState<"lesson" | "code">("lesson");

  return (
    <>
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">
        {/* Lesson prose */}
        <div
          className={`flex-1 min-w-0 flex flex-col ${
            hasCode && tab === "code" ? "hidden lg:flex" : "flex"
          }`}
        >
          {children}
        </div>

        {/* Code panel */}
        {codePanel && (
          <div
            className={`${
              tab === "code" ? "flex" : "hidden lg:flex"
            } flex-col w-full lg:w-[42%] shrink-0 pb-14 lg:pb-0`}
          >
            {codePanel}
          </div>
        )}
      </div>

      {/* Mobile tab bar — only when lesson has a code exercise */}
      {hasCode && (
        <nav
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex h-14 border-t"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)",
          }}
          aria-label="Lesson view"
        >
          <button
            onClick={() => setTab("lesson")}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-100 ${
              tab === "lesson" ? "text-accent" : "text-prose-muted"
            }`}
          >
            <BookOpen size={16} />
            Lesson
          </button>

          <div
            className="w-px self-stretch my-3"
            style={{ backgroundColor: "var(--border-subtle)" }}
          />

          <button
            onClick={() => setTab("code")}
            className={`flex-1 flex items-center justify-center gap-2 text-sm font-medium transition-colors duration-100 ${
              tab === "code" ? "text-accent" : "text-prose-muted"
            }`}
          >
            <Code2 size={16} />
            Code
          </button>
        </nav>
      )}
    </>
  );
}

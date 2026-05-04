"use client";

import { useState, useEffect } from "react";
import type { ModuleMeta } from "@/lib/curriculum";
import { CheckCircle, Circle, Lock, Menu, X } from "lucide-react";

interface LessonSidebarProps {
  trackSlug: string;
  moduleSlug: string;
  module: ModuleMeta;
  currentSlug: string;
  completedSlugs: string[];
}

function LessonLink({
  href,
  title,
  order,
  isPremium,
  isCurrent,
  isCompleted,
}: {
  href: string;
  title: string;
  order: number;
  isPremium: boolean;
  isCurrent: boolean;
  isCompleted: boolean;
}) {
  return (
    <a
      href={href}
      aria-current={isCurrent ? "page" : undefined}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors duration-100 ${
        isCurrent
          ? "bg-subtle text-prose font-medium"
          : "text-prose-muted hover:text-prose hover:bg-subtle"
      }`}
    >
      <span className="shrink-0">
        {isCompleted ? (
          <CheckCircle size={14} className="text-ok" />
        ) : isPremium ? (
          <Lock size={14} className="text-prose-faint" />
        ) : (
          <Circle size={14} className="text-prose-faint" />
        )}
      </span>
      <span
        className="text-xs text-prose-faint w-4 shrink-0"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {String(order).padStart(2, "0")}
      </span>
      <span className="flex-1 truncate">{title}</span>
    </a>
  );
}

export function LessonSidebar({
  trackSlug,
  moduleSlug,
  module,
  currentSlug,
  completedSlugs: initialCompleted,
}: LessonSidebarProps) {
  const [open, setOpen] = useState(false);
  const [completedSlugs, setCompletedSlugs] = useState<string[]>(initialCompleted);

  useEffect(() => {
    const storageKey = `bytecode:progress:${trackSlug}:${moduleSlug}`;
    let active = true;

    const loadFromLocal = () => {
      try {
        const raw = localStorage.getItem(storageKey);
        setCompletedSlugs(raw ? (JSON.parse(raw) as string[]) : initialCompleted);
      } catch {
        setCompletedSlugs(initialCompleted);
      }
    };

    const loadFromRemote = async () => {
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) throw new Error("failed");
        const data = (await res.json()) as { completedLessonSlugs?: string[] };
        if (!active) return;
        const remote = data.completedLessonSlugs ?? [];
        setCompletedSlugs(remote);
        localStorage.setItem(storageKey, JSON.stringify(remote));
      } catch {
        if (active) loadFromLocal();
      }
    };

    loadFromRemote();

    const handler = (e: StorageEvent) => {
      if (e.key === storageKey) {
        loadFromLocal();
      }
    };
    window.addEventListener("storage", handler);
    return () => {
      active = false;
      window.removeEventListener("storage", handler);
    };
  }, [initialCompleted, moduleSlug, trackSlug]);

  const nav = (
    <nav aria-label="Lesson navigation" className="py-4 px-3">
      <p
        className="text-xs text-prose-faint px-3 mb-2"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // {module.title.toLowerCase()}
      </p>
      <div className="space-y-0.5">
        {module.lessons.map((lesson) => (
          <LessonLink
            key={lesson.slug}
            href={`/curriculum/${trackSlug}/${module.slug}/lesson/${lesson.slug}`}
            title={lesson.title}
            order={lesson.order}
            isPremium={lesson.isPremium}
            isCurrent={lesson.slug === currentSlug}
            isCompleted={completedSlugs.includes(lesson.slug)}
          />
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed bottom-5 left-5 z-40 flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-elevated border text-prose-muted cursor-pointer"
        style={{ borderColor: "var(--border-default)" }}
        onClick={() => setOpen(true)}
        aria-label="Open lesson list"
      >
        <Menu size={14} /> Lessons
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div
            className="relative w-72 h-full overflow-y-auto"
            style={{ backgroundColor: "var(--color-elevated)" }}
          >
            <div className="flex justify-end p-3">
              <button onClick={() => setOpen(false)} aria-label="Close">
                <X size={18} className="text-prose-muted" />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block w-60 shrink-0 border-r overflow-y-auto"
        style={{
          borderColor: "var(--border-subtle)",
          position: "sticky",
          top: "56px",
          maxHeight: "calc(100vh - 56px)",
        }}
      >
        {nav}
      </aside>
    </>
  );
}

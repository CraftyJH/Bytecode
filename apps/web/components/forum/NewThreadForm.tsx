"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { createThread } from "@/app/forum/actions";
import { CATEGORIES } from "@/lib/forum";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BookOpen } from "lucide-react";

export function NewThreadForm() {
  const sp = useSearchParams();

  // Pre-fill from lesson context query params
  const lessonSlug   = sp.get("lesson") ?? "";
  const lessonTitle  = sp.get("lessonTitle") ?? "";
  const lessonTrack  = sp.get("track") ?? "";
  const lessonModule = sp.get("module") ?? "";
  const initialCat   = sp.get("category") ?? "beginner-java";

  const [category, setCategory] = useState(initialCat);
  const [body, setBody] = useState(
    lessonSlug
      ? `> Posting from: **${lessonTitle}**\n\n**My code so far:**\n\`\`\`java\n\n\`\`\`\n\n**What I tried:** \n\n**What's happening:** `
      : ""
  );

  const hasLessonCtx = Boolean(lessonSlug);

  return (
    <form action={createThread} className="space-y-5">
      {/* Hidden lesson context fields */}
      {hasLessonCtx && (
        <>
          <input type="hidden" name="lesson_slug"   value={lessonSlug} />
          <input type="hidden" name="lesson_title"  value={lessonTitle} />
          <input type="hidden" name="lesson_track"  value={lessonTrack} />
          <input type="hidden" name="lesson_module" value={lessonModule} />

          <div
            className="flex items-start gap-3 px-4 py-3 rounded-md border text-sm"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}
          >
            <BookOpen size={14} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-prose-faint mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                // lesson context attached
              </p>
              <p className="text-sm text-prose">
                <strong>{lessonTitle}</strong>
                {lessonTrack && <span className="text-prose-muted"> · {lessonTrack}</span>}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-prose mb-2">Category</label>
        <select
          name="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full px-3 py-2.5 rounded-md border text-sm text-prose-muted focus:outline-none transition-colors"
          style={{ backgroundColor: "var(--color-elevated)", borderColor: "var(--border-subtle)" }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.title}{cat.premium_post_only ? " (Premium)" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Title */}
      <Input
        label="Title"
        name="title"
        placeholder="What's your question? (10–140 characters)"
        required
        minLength={10}
        maxLength={140}
        hint="Be specific. Good: 'Why does my for-each loop throw ConcurrentModificationException?' Bad: 'Help with loops'"
      />

      {/* Body */}
      <div>
        <label className="block text-sm font-medium text-prose mb-2">
          Body <span className="text-prose-faint font-normal text-xs">(Markdown supported — wrap code in ``` blocks)</span>
        </label>
        <textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Describe your question or share what you built…"
          rows={12}
          required
          minLength={10}
          className="w-full px-4 py-3 rounded-md border text-sm text-prose-muted leading-relaxed resize-y focus:outline-none transition-colors"
          style={{
            backgroundColor: "var(--color-elevated)",
            borderColor: "var(--border-subtle)",
            fontFamily: "var(--font-mono)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-emphasis)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
        />
      </div>

      {/* Tags */}
      <Input
        label="Tags"
        name="tags"
        placeholder="oop, streams, arrays  (comma-separated, up to 5)"
        hint="Optional. Tags help others find your thread."
      />

      <div className="flex items-center justify-between pt-1">
        <a href="/forum/rules" className="text-xs text-prose-faint hover:text-prose transition-colors">
          Read the house rules →
        </a>
        <Button variant="primary" size="sm" type="submit">
          Post thread
        </Button>
      </div>
    </form>
  );
}

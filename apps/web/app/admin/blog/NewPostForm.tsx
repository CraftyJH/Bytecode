"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

function toSlug(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function NewPostForm() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [author, setAuthor] = useState("Bytecode");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(toSlug(value));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, author, excerpt, content }),
      });
      const data = await res.json() as { slug?: string; error?: string };
      if (!res.ok || data.error) {
        setError(data.error ?? "Failed to create post.");
        return;
      }
      router.push(`/blog/${data.slug}`);
      router.refresh();
    });
  }

  const fieldClass =
    "w-full px-3 py-2 rounded-md border text-sm text-prose placeholder:text-prose-faint bg-transparent focus:outline-none focus:ring-1";
  const fieldStyle = {
    borderColor: "var(--border-emphasis)",
  };
  const labelClass = "block text-xs text-prose-muted mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input
            className={fieldClass}
            style={fieldStyle}
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Post title"
            required
          />
        </div>
        <div>
          <label className={labelClass}>Slug</label>
          <input
            className={fieldClass}
            style={fieldStyle}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="post-slug"
            required
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Author</label>
        <input
          className={fieldClass}
          style={fieldStyle}
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Bytecode"
          required
        />
      </div>

      <div>
        <label className={labelClass}>Excerpt</label>
        <textarea
          className={`${fieldClass} resize-none`}
          style={fieldStyle}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary shown on the blog list…"
          rows={2}
        />
      </div>

      <div>
        <label className={labelClass}>Content (Markdown)</label>
        <textarea
          className={`${fieldClass} resize-y`}
          style={{ ...fieldStyle, fontFamily: "var(--font-mono)", fontSize: "0.8125rem" }}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post in Markdown…"
          rows={18}
          required
        />
      </div>

      {error && (
        <p className="text-xs text-fail">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" size="sm" disabled={pending}>
          {pending && <Loader2 size={12} className="animate-spin mr-1.5" />}
          Publish post
        </Button>
        <span className="text-xs text-prose-faint">Markdown is supported.</span>
      </div>
    </form>
  );
}

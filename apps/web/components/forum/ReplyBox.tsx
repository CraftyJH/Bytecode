"use client";

import { useState, useTransition, useRef } from "react";
import { createReply } from "@/app/forum/actions";
import { Button } from "@/components/ui/Button";
import { Send } from "lucide-react";

interface Props {
  threadId: number;
  isLocked: boolean;
  isSignedIn: boolean;
}

export function ReplyBox({ threadId, isLocked, isSignedIn }: Props) {
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLTextAreaElement>(null);

  if (isLocked) {
    return (
      <p className="text-sm text-prose-faint text-center py-4">
        This thread is locked and no longer accepting replies.
      </p>
    );
  }

  if (!isSignedIn) {
    return (
      <p className="text-sm text-prose-muted text-center py-4">
        <a href="/signin" className="text-accent hover:underline">Sign in</a> to reply.
      </p>
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("thread_id", String(threadId));
      fd.set("body", body);
      const result = await createReply(fd);
      if (result?.error) {
        setError(result.error);
      } else {
        setBody("");
        ref.current?.blur();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p
        className="text-xs text-prose-faint"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // your reply — markdown + code blocks supported
      </p>
      <textarea
        ref={ref}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your reply…"
        rows={5}
        required
        minLength={10}
        className="w-full px-4 py-3 rounded-md border text-sm text-prose-muted leading-relaxed resize-y focus:outline-none transition-colors duration-100"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderColor: "var(--border-subtle)",
          fontFamily: "var(--font-mono)",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-emphasis)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-subtle)")}
      />
      {error && (
        <p className="text-xs text-fail">{error}</p>
      )}
      <div className="flex justify-end">
        <Button variant="primary" size="sm" disabled={pending || body.length < 10} className="gap-1.5">
          <Send size={12} />
          {pending ? "Posting…" : "Post reply"}
        </Button>
      </div>
    </form>
  );
}

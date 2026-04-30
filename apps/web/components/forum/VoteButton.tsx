"use client";

import { useState, useTransition } from "react";
import { ChevronUp } from "lucide-react";
import { toggleVote } from "@/app/forum/actions";

interface Props {
  threadId?: number;
  replyId?: number;
  initialCount: number;
  initialVoted: boolean;
}

export function VoteButton({ threadId, replyId, initialCount, initialVoted }: Props) {
  const [voted, setVoted]   = useState(initialVoted);
  const [count, setCount]   = useState(initialCount);
  const [pending, startTransition] = useTransition();

  function handleVote() {
    // Optimistic update
    setVoted((v) => !v);
    setCount((c) => voted ? c - 1 : c + 1);

    startTransition(async () => {
      const fd = new FormData();
      if (threadId) fd.set("thread_id", String(threadId));
      if (replyId)  fd.set("reply_id",  String(replyId));
      const result = await toggleVote(fd);
      if (result?.error) {
        // Roll back
        setVoted((v) => !v);
        setCount((c) => voted ? c + 1 : c - 1);
      }
    });
  }

  return (
    <button
      onClick={handleVote}
      disabled={pending}
      className="flex flex-col items-center gap-0.5 px-2 py-1 rounded transition-colors duration-100 group/vote"
      style={{ color: voted ? "var(--color-accent)" : "var(--color-prose-faint)" }}
      aria-label={voted ? "Remove upvote" : "Upvote"}
    >
      <ChevronUp
        size={16}
        className="transition-transform duration-100 group-hover/vote:scale-110"
        style={{ color: voted ? "var(--color-accent)" : undefined }}
      />
      <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-mono)" }}>
        {count}
      </span>
    </button>
  );
}

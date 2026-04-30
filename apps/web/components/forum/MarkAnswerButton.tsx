"use client";

import { useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { markAnswer } from "@/app/forum/actions";

interface Props {
  threadId: number;
  replyId: number;
  isAnswer: boolean;
  isThreadAuthor: boolean;
}

export function MarkAnswerButton({ threadId, replyId, isAnswer, isThreadAuthor }: Props) {
  const [pending, startTransition] = useTransition();

  if (!isThreadAuthor) {
    if (!isAnswer) return null;
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-ok">
        <CheckCircle2 size={13} /> Answer
      </span>
    );
  }

  function handleClick() {
    startTransition(async () => {
      const fd = new FormData();
      fd.set("thread_id", String(threadId));
      fd.set("reply_id",  String(replyId));
      await markAnswer(fd);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-1 text-xs transition-colors duration-100"
      style={{ color: isAnswer ? "var(--color-ok)" : "var(--color-prose-faint)" }}
      title={isAnswer ? "Unmark as answer" : "Mark as answer"}
    >
      <CheckCircle2 size={13} />
      {isAnswer ? "Answer" : "Mark answer"}
    </button>
  );
}

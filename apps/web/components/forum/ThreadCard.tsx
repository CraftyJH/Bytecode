import { MessageSquare, ChevronUp, CheckCircle2, BookOpen } from "lucide-react";
import { type ForumThread, getCategoryBySlug, displayName, relativeTime, threadHref } from "@/lib/forum";

interface Props {
  thread: ForumThread;
  showCategory?: boolean;
}

export function ThreadCard({ thread, showCategory = true }: Props) {
  const category = getCategoryBySlug(thread.category_slug);

  return (
    <a
      href={threadHref(thread.id, thread.slug)}
      className="flex gap-4 px-5 py-4 rounded-lg border transition-colors duration-100 hover:border-[var(--border-default)] group"
      style={{ backgroundColor: "var(--color-elevated)", borderColor: "var(--border-subtle)" }}
    >
      {/* Vote count */}
      <div className="shrink-0 flex flex-col items-center gap-0.5 pt-0.5 w-8 text-center">
        <ChevronUp size={14} className="text-prose-faint" />
        <span className="text-xs font-semibold text-prose-muted" style={{ fontFamily: "var(--font-mono)" }}>
          {thread.vote_count}
        </span>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          {thread.is_answered && (
            <span className="flex items-center gap-1 text-xs text-ok font-medium">
              <CheckCircle2 size={11} /> Answered
            </span>
          )}
          {showCategory && category && (
            <span
              className="text-xs text-prose-faint px-1.5 py-0.5 rounded"
              style={{ backgroundColor: "var(--color-subtle)", fontFamily: "var(--font-mono)" }}
            >
              {category.title}
            </span>
          )}
          {thread.lesson_title && (
            <span className="flex items-center gap-1 text-xs text-prose-faint">
              <BookOpen size={10} /> {thread.lesson_title}
            </span>
          )}
        </div>

        <p className="text-sm font-medium text-prose-muted group-hover:text-prose transition-colors duration-100 line-clamp-2 mb-1.5">
          {thread.title}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-prose-faint">
          <span>{displayName(thread.author)}</span>
          <span>{relativeTime(thread.created_at)}</span>
          <span className="flex items-center gap-1">
            <MessageSquare size={10} /> {thread.reply_count}
          </span>
          {thread.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded text-prose-faint"
              style={{ backgroundColor: "var(--color-subtle)", fontFamily: "var(--font-mono)", fontSize: "10px" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

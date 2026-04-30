import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategoryBySlug, displayName, relativeTime, threadHref, type ForumThread, type ForumReply } from "@/lib/forum";
import { VoteButton } from "@/components/forum/VoteButton";
import { MarkAnswerButton } from "@/components/forum/MarkAnswerButton";
import { ReplyBox } from "@/components/forum/ReplyBox";
import { CheckCircle2, BookOpen, Lock, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ id: string; slug: string }>;
}

async function getData(id: number) {
  const supabase = await createClient();

  const [{ data: thread }, { data: replies }, { data: { user } }, votesRes] = await Promise.all([
    supabase
      .from("forum_threads")
      .select("*, author:profiles(id, name, avatar_url)")
      .eq("id", id)
      .single(),
    supabase
      .from("forum_replies")
      .select("*, author:profiles(id, name, avatar_url)")
      .eq("thread_id", id)
      .order("is_answer", { ascending: false })
      .order("vote_count",  { ascending: false })
      .order("created_at",  { ascending: true }),
    supabase.auth.getUser(),
    supabase
      .from("forum_votes")
      .select("thread_id, reply_id")
      .eq("user_id", (await supabase.auth.getUser()).data.user?.id ?? "00000000-0000-0000-0000-000000000000"),
  ]);

  return {
    thread: thread as ForumThread | null,
    replies: (replies as ForumReply[]) ?? [],
    user: user ?? null,
    userVotes: (votesRes.data ?? []) as { thread_id: number | null; reply_id: number | null }[],
  };
}

export default async function ThreadPage({ params }: Props) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (isNaN(id)) notFound();

  let thread: ForumThread | null = null;
  let replies: ForumReply[] = [];
  let user = null;
  let userVotes: { thread_id: number | null; reply_id: number | null }[] = [];

  try {
    const data = await getData(id);
    thread = data.thread;
    replies = data.replies;
    user = data.user;
    userVotes = data.userVotes;
  } catch {
    notFound();
  }

  if (!thread) notFound();

  const category = getCategoryBySlug(thread.category_slug);
  const isThreadAuthor = user?.id === thread.author_id;
  const votedThread = userVotes.some((v) => v.thread_id === thread!.id);
  const votedReplyIds = new Set(userVotes.filter((v) => v.reply_id).map((v) => v.reply_id));

  // Separate pinned answer from regular replies
  const answerReply = replies.find((r) => r.is_answer) ?? null;
  const otherReplies = replies.filter((r) => !r.is_answer);

  function renderBody(body: string) {
    // Very basic Markdown-to-HTML: code blocks + line breaks
    const escaped = body
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const withCode = escaped.replace(
      /```(?:\w+)?\n([\s\S]*?)```/g,
      (_, code) =>
        `<pre class="my-3 p-4 rounded-md text-xs overflow-x-auto border" style="font-family:var(--font-mono);background:var(--color-subtle);border-color:var(--border-subtle);color:var(--color-prose-muted)">${code.trimEnd()}</pre>`
    );
    const withInlineCode = withCode.replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 rounded text-xs" style="font-family:var(--font-mono);background:var(--color-subtle);color:var(--color-prose-muted)">$1</code>'
    );
    const withBold = withInlineCode.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return withBold.replace(/\n/g, "<br />");
  }

  function AuthorLine({ author, date }: { author: ForumReply["author"]; date: string }) {
    return (
      <div className="flex items-center gap-2 text-xs text-prose-faint mb-3">
        <span
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{ backgroundColor: "var(--color-subtle)", color: "var(--color-prose-muted)" }}
        >
          {(displayName(author, "?")[0] ?? "?").toUpperCase()}
        </span>
        <span className="font-medium text-prose-muted">{displayName(author)}</span>
        <span>·</span>
        <span>{relativeTime(date)}</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      {/* Breadcrumb */}
      <nav
        className="mb-5 flex items-center gap-1.5 text-xs text-prose-faint"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <a href="/forum" className="hover:text-prose-muted transition-colors flex items-center gap-1">
          <ArrowLeft size={11} /> forum
        </a>
        {category && (
          <>
            <span>/</span>
            <a href={`/forum/${category.slug}`} className="hover:text-prose-muted transition-colors">
              {category.title}
            </a>
          </>
        )}
      </nav>

      {/* ── Original post ── */}
      <div
        className="rounded-lg border p-6 mb-6"
        style={{ backgroundColor: "var(--color-elevated)", borderColor: "var(--border-subtle)" }}
      >
        {/* Status + tags row */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {thread.is_answered && (
            <span className="flex items-center gap-1 text-xs font-medium text-ok">
              <CheckCircle2 size={12} /> Answered
            </span>
          )}
          {thread.is_locked && (
            <span className="flex items-center gap-1 text-xs text-prose-faint">
              <Lock size={12} /> Locked
            </span>
          )}
          {thread.lesson_title && (
            <span className="flex items-center gap-1 text-xs text-prose-faint px-2 py-0.5 rounded"
              style={{ backgroundColor: "var(--color-subtle)" }}>
              <BookOpen size={10} /> {thread.lesson_title}
            </span>
          )}
          {thread.tags.map((tag) => (
            <a
              key={tag}
              href={`/forum/${thread!.category_slug}?tag=${encodeURIComponent(tag)}`}
              className="text-xs px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
              style={{ backgroundColor: "var(--color-subtle)", fontFamily: "var(--font-mono)", color: "var(--color-prose-faint)" }}
            >
              {tag}
            </a>
          ))}
        </div>

        <h1 className="text-xl font-semibold text-prose tracking-tight mb-4">{thread.title}</h1>
        <AuthorLine author={thread.author} date={thread.created_at} />

        <div
          className="text-sm text-prose-muted leading-relaxed"
          dangerouslySetInnerHTML={{ __html: renderBody(thread.body) }}
        />

        <div className="mt-4 pt-4 border-t flex items-center gap-3" style={{ borderColor: "var(--border-subtle)" }}>
          <VoteButton
            threadId={thread.id}
            initialCount={thread.vote_count}
            initialVoted={votedThread}
          />
          <span className="text-xs text-prose-faint">{thread.reply_count} {thread.reply_count === 1 ? "reply" : "replies"}</span>
        </div>
      </div>

      {/* ── Accepted answer (pinned) ── */}
      {answerReply && (
        <div
          className="rounded-lg border-l-2 border p-6 mb-6"
          style={{
            backgroundColor: "rgba(111,168,111,0.04)",
            borderLeftColor: "var(--color-ok)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={14} className="text-ok" />
            <span className="text-xs font-semibold text-ok">Accepted answer</span>
          </div>
          <AuthorLine author={answerReply.author} date={answerReply.created_at} />
          <div
            className="text-sm text-prose-muted leading-relaxed"
            dangerouslySetInnerHTML={{ __html: renderBody(answerReply.body) }}
          />
          <div className="mt-4 pt-4 border-t flex items-center gap-3" style={{ borderColor: "var(--border-subtle)" }}>
            <VoteButton
              replyId={answerReply.id}
              initialCount={answerReply.vote_count}
              initialVoted={votedReplyIds.has(answerReply.id)}
            />
            <MarkAnswerButton
              threadId={thread.id}
              replyId={answerReply.id}
              isAnswer={true}
              isThreadAuthor={isThreadAuthor}
            />
          </div>
        </div>
      )}

      {/* ── Other replies ── */}
      {otherReplies.length > 0 && (
        <div className="space-y-4 mb-8">
          <p className="text-xs text-prose-faint" style={{ fontFamily: "var(--font-mono)" }}>
            // {otherReplies.length} {otherReplies.length === 1 ? "reply" : "replies"}
          </p>
          {otherReplies.map((reply) => (
            <div
              key={reply.id}
              id={`reply-${reply.id}`}
              className="rounded-lg border p-5"
              style={{ backgroundColor: "var(--color-elevated)", borderColor: "var(--border-subtle)" }}
            >
              <AuthorLine author={reply.author} date={reply.created_at} />
              <div
                className="text-sm text-prose-muted leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderBody(reply.body) }}
              />
              <div className="mt-3 pt-3 border-t flex items-center gap-3" style={{ borderColor: "var(--border-subtle)" }}>
                <VoteButton
                  replyId={reply.id}
                  initialCount={reply.vote_count}
                  initialVoted={votedReplyIds.has(reply.id)}
                />
                <MarkAnswerButton
                  threadId={thread.id}
                  replyId={reply.id}
                  isAnswer={false}
                  isThreadAuthor={isThreadAuthor}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Reply box ── */}
      <div
        className="rounded-lg border p-6"
        style={{ backgroundColor: "var(--color-elevated)", borderColor: "var(--border-subtle)" }}
      >
        <p className="text-sm font-semibold text-prose mb-4 tracking-tight">
          {replies.length === 0 ? "Be the first to reply" : "Add a reply"}
        </p>
        <ReplyBox threadId={thread.id} isLocked={thread.is_locked} isSignedIn={!!user} />
      </div>
    </div>
  );
}

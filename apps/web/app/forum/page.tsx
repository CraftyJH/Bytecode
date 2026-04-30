import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, type ForumThread, relativeTime } from "@/lib/forum";
import { ThreadCard } from "@/components/forum/ThreadCard";
import { MessageSquare, ChevronRight } from "lucide-react";

async function getRecentThreads(): Promise<ForumThread[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("forum_threads")
      .select("*, author:profiles(id, name, avatar_url)")
      .order("updated_at", { ascending: false })
      .limit(10);
    return (data as ForumThread[]) ?? [];
  } catch {
    return [];
  }
}

export default async function ForumPage() {
  const threads = await getRecentThreads();

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <div className="grid lg:grid-cols-3 gap-8">

        {/* Main: recent threads */}
        <div className="lg:col-span-2">
          <p
            className="text-prose-faint text-xs mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // recent activity
          </p>

          {threads.length === 0 ? (
            <div
              className="rounded-lg border px-6 py-12 text-center"
              style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}
            >
              <MessageSquare size={28} className="text-prose-faint mx-auto mb-3" />
              <p className="text-sm font-medium text-prose mb-1">No threads yet</p>
              <p className="text-sm text-prose-muted mb-4">
                Be the first to start a conversation.
              </p>
              <a
                href="/forum/new"
                className="text-sm text-accent hover:underline"
              >
                Post the first thread →
              </a>
            </div>
          ) : (
            <div className="space-y-2">
              {threads.map((t) => (
                <ThreadCard key={t.id} thread={t} showCategory />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar: categories */}
        <aside>
          <p
            className="text-prose-faint text-xs mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // categories
          </p>
          <div className="space-y-1.5">
            {CATEGORIES.map((cat) => (
              <a
                key={cat.slug}
                href={`/forum/${cat.slug}`}
                className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border transition-colors duration-100 hover:border-[var(--border-default)] group"
                style={{ backgroundColor: "var(--color-elevated)", borderColor: "var(--border-subtle)" }}
              >
                <div className="min-w-0">
                  <p className="text-sm text-prose-muted group-hover:text-prose transition-colors duration-100 truncate">
                    {cat.title}
                  </p>
                  {cat.description && (
                    <p className="text-xs text-prose-faint mt-0.5 truncate">{cat.description}</p>
                  )}
                </div>
                <ChevronRight size={13} className="shrink-0 text-prose-faint group-hover:text-prose-muted transition-colors" />
              </a>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--border-subtle)" }}>
            <p
              className="text-prose-faint text-xs mb-3"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // helpful links
            </p>
            <div className="space-y-2 text-sm">
              <a href="/forum/rules" className="block text-prose-muted hover:text-prose transition-colors">House rules →</a>
              <a href="/curriculum/java-beginner/module-1/lesson/hello-java" className="block text-prose-muted hover:text-prose transition-colors">Read a sample lesson →</a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

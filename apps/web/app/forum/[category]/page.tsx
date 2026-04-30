import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCategoryBySlug, type ForumThread, type ThreadSort } from "@/lib/forum";
import { ThreadCard } from "@/components/forum/ThreadCard";
import { Button } from "@/components/ui/Button";
import { MessageSquare } from "lucide-react";

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string; tag?: string; q?: string }>;
}

async function getThreads(categorySlug: string, sort: ThreadSort, tag?: string, q?: string): Promise<ForumThread[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("forum_threads")
      .select("*, author:profiles(id, name, avatar_url)")
      .eq("category_slug", categorySlug);

    if (tag) query = query.contains("tags", [tag]);

    if (q) {
      // Simple ilike search — full-text via Postgres FTS would be ideal but requires a function call
      query = query.ilike("title", `%${q}%`);
    }

    if (sort === "new")         query = query.order("created_at",  { ascending: false });
    else if (sort === "top")    query = query.order("vote_count",  { ascending: false });
    else if (sort === "unanswered") query = query.eq("reply_count", 0).order("created_at", { ascending: false });
    else                        query = query.order("updated_at",  { ascending: false }); // "active" default

    const { data } = await query.limit(50);
    return (data as ForumThread[]) ?? [];
  } catch {
    return [];
  }
}

const SORT_TABS: { id: ThreadSort; label: string }[] = [
  { id: "active",      label: "Active" },
  { id: "new",         label: "New" },
  { id: "top",         label: "Top" },
  { id: "unanswered",  label: "Unanswered" },
];

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category: categorySlug } = await params;
  const { sort = "active", tag, q } = await searchParams;

  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const threads = await getThreads(categorySlug, sort as ThreadSort, tag, q);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      {/* Header */}
      <div className="mb-6">
        <nav
          className="mb-2 flex items-center gap-1.5 text-xs text-prose-faint"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          <a href="/forum" className="hover:text-prose-muted transition-colors">forum</a>
          <span>/</span>
          <span className="text-prose-muted">{category.title}</span>
        </nav>
        <h1 className="text-xl font-semibold text-prose tracking-tight">{category.title}</h1>
        {category.description && (
          <p className="text-sm text-prose-muted mt-1">{category.description}</p>
        )}
      </div>

      {/* Sort tabs + New Thread */}
      <div
        className="flex items-center justify-between border-b mb-5"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="flex gap-1">
          {SORT_TABS.map(({ id, label }) => (
            <a
              key={id}
              href={`/forum/${categorySlug}?sort=${id}${tag ? `&tag=${tag}` : ""}`}
              className={`px-3 py-2 text-sm border-b-2 -mb-px transition-colors duration-100 ${
                sort === id
                  ? "border-accent text-prose font-medium"
                  : "border-transparent text-prose-muted hover:text-prose"
              }`}
            >
              {label}
            </a>
          ))}
        </div>
        <Button as="a" href={`/forum/new?category=${categorySlug}`} variant="primary" size="sm" className="mb-1">
          New thread
        </Button>
      </div>

      {/* Active tag filter pill */}
      {tag && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-prose-faint">Filtered by tag:</span>
          <span
            className="px-2 py-0.5 rounded text-xs text-prose-muted"
            style={{ backgroundColor: "var(--color-subtle)", fontFamily: "var(--font-mono)" }}
          >
            {tag}
          </span>
          <a href={`/forum/${categorySlug}`} className="text-xs text-prose-faint hover:text-prose transition-colors">
            × clear
          </a>
        </div>
      )}

      {/* Thread list */}
      {threads.length === 0 ? (
        <div
          className="rounded-lg border px-6 py-12 text-center"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--color-elevated)" }}
        >
          <MessageSquare size={28} className="text-prose-faint mx-auto mb-3" />
          <p className="text-sm font-medium text-prose mb-1">No threads yet</p>
          <p className="text-sm text-prose-muted mb-4">
            {sort === "unanswered" ? "All threads have been answered — nice work." : "Start the conversation."}
          </p>
          <a href={`/forum/new?category=${categorySlug}`} className="text-sm text-accent hover:underline">
            Post the first thread →
          </a>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((t) => (
            <ThreadCard key={t.id} thread={t} showCategory={false} />
          ))}
        </div>
      )}
    </div>
  );
}

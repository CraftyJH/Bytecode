import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";

export const metadata = { title: "Blog — Bytecode" };

interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  author: string;
  published_at: string;
}

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, title, excerpt, author, published_at")
    .order("published_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-12">
        <p
          className="text-prose-faint text-xs mb-2"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // blog
        </p>
        <h1 className="text-3xl font-semibold text-prose tracking-tight mb-3">
          Writing
        </h1>
        <p className="text-prose-muted text-sm">
          Guides, deep dives, and updates from the Bytecode team.
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <p className="text-sm text-prose-faint italic">No posts yet — check back soon.</p>
      ) : (
        <ul className="space-y-6 list-none m-0 p-0">
          {(posts as Post[]).map((post) => (
            <li key={post.slug}>
              <a
                href={`/blog/${post.slug}`}
                className="group block rounded-xl border p-6 hover:border-accent/40 transition-colors duration-150"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-prose-faint">
                    {new Date(post.published_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className="text-prose-faint text-xs">·</span>
                  <span className="text-xs text-prose-faint">{post.author}</span>
                </div>
                <h2 className="text-lg font-semibold text-prose tracking-tight mb-2 group-hover:text-accent transition-colors duration-100">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-prose-muted leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                )}
                <span className="inline-flex items-center gap-1 text-xs text-accent">
                  Read more <ArrowRight size={12} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

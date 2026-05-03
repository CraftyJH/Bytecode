import { createAdminClient } from "@/lib/supabase/admin";
import { NewPostForm } from "./NewPostForm";
import { ExternalLink } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  author: string;
  published_at: string;
}

export default async function AdminBlogPage() {
  const admin = createAdminClient();
  const { data: posts } = await admin
    .from("posts")
    .select("slug, title, author, published_at")
    .order("published_at", { ascending: false });

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-10">
      <div className="mb-8">
        <p
          className="text-prose-faint text-xs mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // blog
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Blog
        </h1>
      </div>

      {/* Existing posts */}
      {posts && posts.length > 0 && (
        <div className="mb-10">
          <p
            className="text-prose-faint text-xs mb-4"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // published posts
          </p>
          <div
            className="rounded-xl border overflow-x-auto"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <table className="w-full min-w-[480px]">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                  }}
                >
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint">Title</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint hidden sm:table-cell">Author</th>
                  <th className="text-left px-4 py-2.5 text-xs font-medium text-prose-faint hidden md:table-cell">Published</th>
                  <th className="text-right px-4 py-2.5 text-xs font-medium text-prose-faint">View</th>
                </tr>
              </thead>
              <tbody>
                {(posts as Post[]).map((post) => (
                  <tr
                    key={post.slug}
                    className="border-b last:border-0"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <td className="px-4 py-3 text-sm text-prose">{post.title}</td>
                    <td className="px-4 py-3 text-sm text-prose-muted hidden sm:table-cell">{post.author}</td>
                    <td className="px-4 py-3 text-xs text-prose-faint hidden md:table-cell">
                      {new Date(post.published_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-prose-faint hover:text-prose transition-colors duration-100"
                      >
                        <ExternalLink size={11} />
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* New post form */}
      <div>
        <p
          className="text-prose-faint text-xs mb-6"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // new post
        </p>
        <div
          className="rounded-xl border p-6"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)",
          }}
        >
          <NewPostForm />
        </div>
      </div>
    </div>
  );
}

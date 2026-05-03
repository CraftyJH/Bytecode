import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ArrowLeft } from "lucide-react";
import type React from "react";

interface Props {
  params: Promise<{ slug: string }>;
}

interface Post {
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  author: string;
  published_at: string;
}

function Code({ children }: { children?: React.ReactNode }) {
  return (
    <code
      className="text-sm px-1.5 py-0.5 rounded-sm bg-subtle text-prose-muted"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {children}
    </code>
  );
}

function Pre({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      {...props}
      className="my-5 p-4 rounded-md text-sm overflow-x-auto leading-relaxed border"
      style={{
        fontFamily: "var(--font-mono)",
        backgroundColor: "var(--bg-elevated)",
        borderColor: "var(--border-subtle)",
      }}
    >
      {children}
    </pre>
  );
}

const components = {
  code: Code,
  pre: Pre,
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-prose tracking-tight mt-10 mb-4">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-lg font-semibold text-prose tracking-tight mt-7 mb-3">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-prose-muted leading-relaxed mb-4">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-outside pl-5 mb-4 space-y-1.5 text-prose-muted">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-outside pl-5 mb-4 space-y-1.5 text-prose-muted">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="text-sm leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-prose">{children}</strong>
  ),
  em: ({ children }: { children?: React.ReactNode }) => (
    <em className="italic text-prose-muted">{children}</em>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a
      href={href}
      className="text-accent underline underline-offset-2 hover:text-accent-warm transition-colors duration-100"
    >
      {children}
    </a>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote
      className="border-l-2 pl-4 my-5 text-prose-faint italic"
      style={{ borderColor: "var(--accent)" }}
    >
      {children}
    </blockquote>
  ),
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-sm border-collapse">{children}</table>
    </div>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th
      className="text-left px-3 py-2 text-xs font-medium text-prose-faint border-b"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td
      className="px-3 py-2 text-xs text-prose-muted border-b"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      {children}
    </td>
  ),
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("title, excerpt")
    .eq("slug", slug)
    .single();
  if (!data) return {};
  return { title: `${data.title} — Bytecode`, description: data.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!post) notFound();

  const p = post as Post;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {/* Back link */}
      <a
        href="/blog"
        className="inline-flex items-center gap-1.5 text-xs text-prose-faint hover:text-prose-muted transition-colors duration-100 mb-10"
      >
        <ArrowLeft size={12} />
        All posts
      </a>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-prose-faint">
            {new Date(p.published_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="text-prose-faint text-xs">·</span>
          <span className="text-xs text-prose-faint">{p.author}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-prose tracking-tight mb-4">
          {p.title}
        </h1>
        {p.excerpt && (
          <p className="text-prose-muted leading-relaxed border-l-2 pl-4" style={{ borderColor: "var(--border-emphasis)" }}>
            {p.excerpt}
          </p>
        )}
      </header>

      {/* Content */}
      <article>
        <MDXRemote
          source={p.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeHighlight],
            },
          }}
          components={components}
        />
      </article>
    </div>
  );
}

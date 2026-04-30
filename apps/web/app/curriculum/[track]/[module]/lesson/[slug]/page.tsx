import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import path from "path";
import fs from "fs";
import { getLesson, getModule, getTrack, getPrevNext } from "@/lib/curriculum";
import { buildMdxComponents } from "@/components/mdx/MdxComponents";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import { MarkComplete } from "@/components/lesson/MarkComplete";
import { Pill } from "@/components/ui/Pill";
import { createClient } from "@/lib/supabase/server";
import { Clock, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";

interface LessonPageProps {
  params: Promise<{ track: string; module: string; slug: string }>;
}

export async function generateStaticParams() {
  const { curriculum } = await import("@/lib/curriculum");
  const params: { track: string; module: string; slug: string }[] = [];
  for (const track of curriculum) {
    for (const mod of track.modules) {
      for (const lesson of mod.lessons) {
        params.push({ track: track.slug, module: mod.slug, slug: lesson.slug });
      }
    }
  }
  return params;
}

async function getLessonSource(trackSlug: string, moduleSlug: string, lessonSlug: string) {
  const filePath = path.join(
    process.cwd(),
    "content/lessons",
    trackSlug,
    moduleSlug,
    `${lessonSlug}.mdx`,
  );
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { track: trackSlug, module: moduleSlug, slug: lessonSlug } = await params;

  const track  = getTrack(trackSlug);
  const mod    = getModule(trackSlug, moduleSlug);
  const lesson = getLesson(trackSlug, moduleSlug, lessonSlug);
  if (!track || !mod || !lesson) notFound();

  const source = await getLessonSource(trackSlug, moduleSlug, lessonSlug);
  if (!source) notFound();

  const { prev, next } = getPrevNext(trackSlug, moduleSlug, lessonSlug);

  // Optional auth — show progress if signed in
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const components = buildMdxComponents();
  const progressKey = `bytecode:progress:${trackSlug}:${moduleSlug}`;

  return (
    <div className="flex min-h-screen" style={{ paddingTop: "56px" }}>
      <LessonSidebar
        trackSlug={trackSlug}
        moduleSlug={moduleSlug}
        module={mod}
        currentSlug={lessonSlug}
        completedSlugs={[]}
      />

      {/* ── Main two-column area ── */}
      <div className="flex-1 flex flex-col lg:flex-row min-w-0">

        {/* Left — lesson prose (60%) */}
        <article className="flex-1 min-w-0 px-6 lg:px-10 py-10 lg:max-w-[65%]">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-prose-faint flex-wrap"
            style={{ fontFamily: "var(--font-mono)" }}>
            <a href="/curriculum" className="hover:text-prose-muted transition-colors">curriculum</a>
            <span>/</span>
            <a href={`/curriculum/${trackSlug}`} className="hover:text-prose-muted transition-colors">{track.title}</a>
            <span>/</span>
            <span className="text-prose-muted">{mod.title}</span>
          </nav>

          {/* Lesson header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Pill variant={lesson.isPremium ? "premium" : "free"} />
              <span className="flex items-center gap-1 text-xs text-prose-faint"
                style={{ fontFamily: "var(--font-mono)" }}>
                <Clock size={11} />
                ~{lesson.duration} min
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-semibold text-prose tracking-tight">
              {lesson.title}
            </h1>
          </div>

          {/* MDX content */}
          <div className="lesson-prose">
            <MDXRemote
              source={source}
              components={components}
              options={{
                mdxOptions: {
                  rehypePlugins: [rehypeHighlight],
                },
              }}
            />
          </div>

          {/* Bottom actions */}
          <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ borderColor: "var(--border-subtle)" }}>
            <MarkComplete lessonSlug={lessonSlug} storageKey={progressKey} />

            {/* Prev / Next nav */}
            <div className="flex items-center gap-3 ml-auto">
              {prev && (
                <a
                  href={`/curriculum/${trackSlug}/${moduleSlug}/lesson/${prev.slug}`}
                  className="flex items-center gap-1.5 text-sm text-prose-muted hover:text-prose transition-colors duration-100"
                >
                  <ChevronLeft size={14} /> {prev.title}
                </a>
              )}
              {next && (
                <a
                  href={`/curriculum/${trackSlug}/${moduleSlug}/lesson/${next.slug}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-warm transition-colors duration-100"
                >
                  {next.title} <ChevronRight size={14} />
                </a>
              )}
            </div>
          </div>
        </article>

        {/* Right — editor panel (40%) */}
        <aside
          className="hidden lg:flex flex-col border-l w-[38%] shrink-0"
          style={{
            borderColor: "var(--border-subtle)",
            position: "sticky",
            top: "56px",
            height: "calc(100vh - 56px)",
          }}
        >
          {/* Editor placeholder — replaced by Monaco in Sprint 4 */}
          <div className="flex-1 flex flex-col">
            <div
              className="px-4 py-3 border-b flex items-center justify-between"
              style={{ borderColor: "var(--border-subtle)" }}
            >
              <span
                className="text-xs text-prose-faint"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                // code editor
              </span>
              <span
                className="text-xs text-prose-faint px-2 py-0.5 rounded-sm bg-subtle"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                java
              </span>
            </div>

            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <p
                  className="text-xs text-prose-faint mb-1"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  // coming in sprint 4
                </p>
                <p className="text-sm text-prose-muted">
                  Interactive code editor
                </p>
                <p className="text-xs text-prose-faint mt-1">
                  Run Java in your browser — no install needed.
                </p>
              </div>
            </div>
          </div>

          {/* Ask in forum */}
          <div
            className="p-4 border-t"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <a
              href={`/forum/new?lesson=${lessonSlug}&track=${trackSlug}`}
              className="flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-md text-sm text-prose-muted border hover:text-prose hover:bg-subtle transition-colors duration-100"
              style={{ borderColor: "var(--border-emphasis)" }}
            >
              <MessageSquare size={14} />
              Ask in the forum
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}

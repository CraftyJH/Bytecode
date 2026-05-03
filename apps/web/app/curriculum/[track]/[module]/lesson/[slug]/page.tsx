import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import path from "path";
import fs from "fs";
import { getLesson, getModule, getTrack, getPrevNext } from "@/lib/curriculum";
import { buildMdxComponents } from "@/components/mdx/MdxComponents";
import { LessonSidebar } from "@/components/lesson/LessonSidebar";
import { CodePanel } from "@/components/lesson/CodePanel";
import { ModuleProgress } from "@/components/lesson/ModuleProgress";
import { Pill } from "@/components/ui/Pill";
import { Clock, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { askFromLessonHref } from "@/lib/forum";

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

  const components = buildMdxComponents();

  return (
    <div className="flex min-h-screen">
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
                  useDynamicImport: true,
                  remarkPlugins: [remarkGfm],
                  rehypePlugins: [rehypeHighlight],
                },
                blockJS: false,
              }}
            />
          </div>

          {/* Bottom actions */}
          <div className="mt-10 pt-8 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={askFromLessonHref({
                  lessonSlug,
                  lessonTitle: lesson.title,
                  trackSlug,
                  moduleSlug,
                })}
                className="flex items-center gap-1.5 text-xs text-prose-faint hover:text-prose transition-colors duration-100"
              >
                <MessageSquare size={12} /> Stuck? Ask the forum
              </a>
            </div>

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

        <CodePanel
          lessonSlug={lessonSlug}
          trackSlug={trackSlug}
          moduleSlug={moduleSlug}
          starterCode={lesson.starterCode ?? "public class Main {\n    public static void main(String[] args) {\n        // write your code here\n    }\n}"}
          expectedOutput={lesson.expectedOutput}
        />
      </div>

      <ModuleProgress lessons={mod.lessons} trackSlug={trackSlug} moduleSlug={moduleSlug} />
    </div>
  );
}

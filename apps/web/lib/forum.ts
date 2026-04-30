export interface ForumCategory {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  order: number;
  premium_post_only: boolean;
}

export interface ForumAuthor {
  id: string;
  name: string | null;
  avatar_url: string | null;
}

export interface ForumThread {
  id: number;
  author_id: string | null;
  author: ForumAuthor | null;
  category_slug: string;
  title: string;
  body: string;
  slug: string;
  tags: string[];
  lesson_slug: string | null;
  lesson_title: string | null;
  lesson_track: string | null;
  lesson_module: string | null;
  is_answered: boolean;
  answer_reply_id: number | null;
  vote_count: number;
  reply_count: number;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

export interface ForumReply {
  id: number;
  thread_id: number;
  author_id: string | null;
  author: ForumAuthor | null;
  body: string;
  vote_count: number;
  is_answer: boolean;
  created_at: string;
  updated_at: string;
}

export type ThreadSort = "active" | "new" | "top" | "unanswered";

// Client-side category metadata (titles, colours, descriptions)
export const CATEGORIES: ForumCategory[] = [
  { id: 1, slug: "beginner-java",     title: "Help — Beginner Java",               description: "Questions tied to Beginner track lessons",      order: 1, premium_post_only: false },
  { id: 2, slug: "intermediate-java", title: "Help — Intermediate / Advanced Java", description: "OOP, concurrency, JVM internals",               order: 2, premium_post_only: false },
  { id: 3, slug: "help-kotlin",       title: "Help — Kotlin",                      description: "Kotlin Bridge + Kotlin Advanced",               order: 3, premium_post_only: false },
  { id: 4, slug: "help-projects",     title: "Help — Projects",                    description: "Spring Boot, Android, project-specific issues", order: 4, premium_post_only: false },
  { id: 5, slug: "show-and-tell",     title: "Show & Tell",                        description: "Share what you built, get feedback",            order: 5, premium_post_only: false },
  { id: 6, slug: "career",            title: "Career",                             description: "Job hunt, interview prep, resume reviews",      order: 6, premium_post_only: true  },
  { id: 7, slug: "meta",              title: "Meta",                               description: "Feedback on Bytecode, feature requests",        order: 7, premium_post_only: false },
];

export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/** Convert a thread title to a URL-safe slug */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .slice(0, 80);
}

/** Format a date as a human-friendly relative time */
export function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Display name fallback */
export function displayName(author: ForumAuthor | null, fallback = "Anonymous"): string {
  return author?.name ?? fallback;
}

/** Build the thread permalink */
export function threadHref(id: number, slug: string) {
  return `/forum/t/${id}/${slug}`;
}

/** Build the new-thread URL pre-filled with lesson context */
export function askFromLessonHref(params: {
  lessonSlug: string;
  lessonTitle: string;
  trackSlug: string;
  moduleSlug: string;
}) {
  const qs = new URLSearchParams({
    lesson: params.lessonSlug,
    lessonTitle: params.lessonTitle,
    track: params.trackSlug,
    module: params.moduleSlug,
    category: "beginner-java",
  });
  return `/forum/new?${qs}`;
}

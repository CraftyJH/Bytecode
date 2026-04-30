export interface LessonMeta {
  slug: string;
  title: string;
  order: number;
  duration: number; // minutes
  isPremium: boolean;
}

export interface ModuleMeta {
  slug: string;
  title: string;
  order: number;
  isPremium: boolean;
  lessons: LessonMeta[];
}

export interface TrackMeta {
  slug: string;
  title: string;
  order: number;
  isPremium: boolean;
  tagline: string;
  modules: ModuleMeta[];
}

export const curriculum: TrackMeta[] = [
  {
    slug: "java-beginner",
    title: "Java Beginner",
    order: 1,
    isPremium: false,
    tagline: "From Hello World to arrays and strings.",
    modules: [
      {
        slug: "module-1",
        title: "Java Foundations",
        order: 1,
        isPremium: false,
        lessons: [
          { slug: "hello-java",           title: "Hello, Java",               order: 1, duration: 10, isPremium: false },
          { slug: "variables-primitives", title: "Variables and Primitives",   order: 2, duration: 12, isPremium: false },
          { slug: "operators-expressions",title: "Operators and Expressions",  order: 3, duration: 12, isPremium: false },
          { slug: "control-flow",         title: "Control Flow",               order: 4, duration: 14, isPremium: false },
          { slug: "loops",                title: "Loops",                      order: 5, duration: 14, isPremium: false },
          { slug: "methods-scope",        title: "Methods and Scope",          order: 6, duration: 14, isPremium: false },
          { slug: "arrays",               title: "Arrays",                     order: 7, duration: 13, isPremium: false },
          { slug: "strings",              title: "Strings",                    order: 8, duration: 13, isPremium: false },
        ],
      },
    ],
  },
  {
    slug: "java-intermediate",
    title: "Java Intermediate",
    order: 2,
    isPremium: false,
    tagline: "Classes, OOP, generics, and collections.",
    modules: [],
  },
  {
    slug: "java-advanced",
    title: "Java Advanced",
    order: 3,
    isPremium: true,
    tagline: "Lambdas, streams, concurrency, JVM internals.",
    modules: [],
  },
  {
    slug: "kotlin-bridge",
    title: "Kotlin Bridge",
    order: 4,
    isPremium: true,
    tagline: "Java → Kotlin for experienced developers.",
    modules: [],
  },
  {
    slug: "kotlin-advanced",
    title: "Kotlin Advanced",
    order: 5,
    isPremium: true,
    tagline: "Coroutines, DSLs, extension functions.",
    modules: [],
  },
  {
    slug: "projects",
    title: "Projects",
    order: 6,
    isPremium: false,
    tagline: "Spring Boot, Android, multi-threaded applications.",
    modules: [],
  },
];

// ── Lookup helpers ──────────────────────────────────────────────────────────

export function getTrack(trackSlug: string) {
  return curriculum.find((t) => t.slug === trackSlug) ?? null;
}

export function getModule(trackSlug: string, moduleSlug: string) {
  const track = getTrack(trackSlug);
  return track?.modules.find((m) => m.slug === moduleSlug) ?? null;
}

export function getLesson(trackSlug: string, moduleSlug: string, lessonSlug: string) {
  const mod = getModule(trackSlug, moduleSlug);
  return mod?.lessons.find((l) => l.slug === lessonSlug) ?? null;
}

export function getPrevNext(trackSlug: string, moduleSlug: string, lessonSlug: string) {
  const mod = getModule(trackSlug, moduleSlug);
  if (!mod) return { prev: null, next: null };
  const idx = mod.lessons.findIndex((l) => l.slug === lessonSlug);
  return {
    prev: idx > 0 ? mod.lessons[idx - 1] : null,
    next: idx < mod.lessons.length - 1 ? mod.lessons[idx + 1] : null,
  };
}

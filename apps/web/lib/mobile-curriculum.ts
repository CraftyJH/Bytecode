import { promises as fs } from "fs";
import path from "path";

import { curriculum, getLesson, getModule, getTrack } from "@/lib/curriculum";
import { fetchBillingStatus } from "@/lib/user-state";

export interface MobileLessonSummary {
  slug: string;
  title: string;
  order: number;
  duration: number;
  isPremium: boolean;
  isLocked: boolean;
}

export interface MobileModuleSummary {
  slug: string;
  title: string;
  order: number;
  isPremium: boolean;
  isLocked: boolean;
  lessons: MobileLessonSummary[];
}

export interface MobileTrackSummary {
  slug: string;
  title: string;
  order: number;
  tagline: string;
  isPremium: boolean;
  isLocked: boolean;
  modules: MobileModuleSummary[];
}

export interface MobileCurriculumResponse {
  isPremiumUser: boolean;
  tracks: MobileTrackSummary[];
}

interface EntitlementSnapshot {
  isPremium: boolean;
}

export interface MobileLessonResponse {
  track: {
    slug: string;
    title: string;
  };
  module: {
    slug: string;
    title: string;
  };
  lesson: {
    slug: string;
    title: string;
    duration: number;
    isPremium: boolean;
  };
  content: string;
}

export interface MobileLessonErrorResponse {
  status: number;
  body: { error: string; message: string };
}

function parseBearerToken(headers: Headers): string | undefined {
  const authorization = headers.get("authorization");
  if (!authorization) return undefined;
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || undefined;
}

function isPremiumEntitlement(role: string | null | undefined, plan: string | null | undefined, premiumUntil: string | null | undefined) {
  const normalizedRole = role ?? "user";
  const normalizedPlan = plan ?? "free";
  const premiumUntilMs = premiumUntil ? Date.parse(premiumUntil) : Number.NaN;
  const premiumByExpiry = Number.isFinite(premiumUntilMs) && premiumUntilMs > Date.now();
  const premiumByRole = normalizedRole === "premium" || normalizedRole === "staff" || normalizedRole === "author";
  return premiumByExpiry || premiumByRole || normalizedPlan === "premium";
}

async function resolveEntitlement(headers: Headers): Promise<EntitlementSnapshot> {
  const accessToken = parseBearerToken(headers);
  if (!accessToken) {
    return { isPremium: false };
  }

  const billing = await fetchBillingStatus(accessToken);
  if (!billing) {
    return { isPremium: false };
  }

  return {
    isPremium: isPremiumEntitlement(billing.role, billing.plan, billing.premiumUntil),
  };
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

function toMobileCurriculum(isPremiumUser: boolean): MobileTrackSummary[] {
  return sortByOrder(curriculum).map((track) => ({
    slug: track.slug,
    title: track.title,
    order: track.order,
    tagline: track.tagline,
    isPremium: track.isPremium,
    isLocked: track.isPremium && !isPremiumUser,
    modules: sortByOrder(track.modules).map((module) => ({
      slug: module.slug,
      title: module.title,
      order: module.order,
      isPremium: module.isPremium,
      isLocked: (track.isPremium || module.isPremium) && !isPremiumUser,
      lessons: sortByOrder(module.lessons).map((lesson) => ({
        slug: lesson.slug,
        title: lesson.title,
        order: lesson.order,
        duration: lesson.duration,
        isPremium: lesson.isPremium,
        isLocked: (track.isPremium || module.isPremium || lesson.isPremium) && !isPremiumUser,
      })),
    })),
  }));
}

function stripLessonExports(source: string): string {
  return source
    .replace(/^export const meta\s*=\s*\{[\s\S]*?^};\s*/m, "")
    .replace(/^export const quizzes\s*=\s*\{[\s\S]*?^};\s*/m, "");
}

function cleanLessonMarkdown(source: string): string {
  return stripLessonExports(source)
    .replace(/<Quiz[^>]*\/>\s*/g, "")
    .replace(/<\/?Note>/g, "")
    .replace(/<\/?Exercise>/g, "")
    .trim();
}

async function readLessonSource(trackSlug: string, moduleSlug: string, lessonSlug: string): Promise<string | null> {
  const lessonPath = path.join(
    process.cwd(),
    "content/lessons",
    trackSlug,
    moduleSlug,
    `${lessonSlug}.mdx`,
  );
  try {
    return await fs.readFile(lessonPath, "utf-8");
  } catch {
    return null;
  }
}

export async function buildMobileCurriculumResponse(headers: Headers): Promise<MobileCurriculumResponse> {
  const entitlement = await resolveEntitlement(headers);
  return {
    isPremiumUser: entitlement.isPremium,
    tracks: toMobileCurriculum(entitlement.isPremium),
  };
}

export async function buildMobileLessonResponse(
  trackSlug: string,
  moduleSlug: string,
  lessonSlug: string,
  headers: Headers,
): Promise<MobileLessonResponse | MobileLessonErrorResponse> {
  const track = getTrack(trackSlug);
  const module = getModule(trackSlug, moduleSlug);
  const lesson = getLesson(trackSlug, moduleSlug, lessonSlug);
  if (!track || !module || !lesson) {
    return {
      status: 404,
      body: { error: "lesson_not_found", message: "Track, module, or lesson not found." },
    };
  }

  const entitlement = await resolveEntitlement(headers);
  const requiresPremium = track.isPremium || module.isPremium || lesson.isPremium;
  if (requiresPremium && !entitlement.isPremium) {
    return {
      status: 403,
      body: { error: "premium_required", message: "This lesson requires a premium plan." },
    };
  }

  const source = await readLessonSource(trackSlug, moduleSlug, lessonSlug);
  if (!source) {
    return {
      status: 404,
      body: { error: "lesson_content_missing", message: "Lesson content is not available." },
    };
  }

  return {
    track: {
      slug: track.slug,
      title: track.title,
    },
    module: {
      slug: module.slug,
      title: module.title,
    },
    lesson: {
      slug: lesson.slug,
      title: lesson.title,
      duration: lesson.duration,
      isPremium: lesson.isPremium,
    },
    content: cleanLessonMarkdown(source),
  };
}

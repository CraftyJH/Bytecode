"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { slugify, threadHref } from "@/lib/forum";

// ── Create a new thread ──────────────────────────────────────

export async function createThread(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/signin?next=/forum/new");

  const title        = (formData.get("title") as string).trim();
  const body         = (formData.get("body") as string).trim();
  const categorySlug = formData.get("category") as string;
  const tagsRaw      = (formData.get("tags") as string ?? "").trim();
  const lessonSlug   = formData.get("lesson_slug") as string | null;
  const lessonTitle  = formData.get("lesson_title") as string | null;
  const lessonTrack  = formData.get("lesson_track") as string | null;
  const lessonModule = formData.get("lesson_module") as string | null;

  const tags = tagsRaw
    ? tagsRaw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean).slice(0, 5)
    : [];

  // Auto-add lesson tag if posting from a lesson
  if (lessonSlug && !tags.includes(`lesson:${lessonSlug}`)) {
    tags.push(`lesson:${lessonSlug}`);
  }

  const { data, error } = await supabase
    .from("forum_threads")
    .insert({
      author_id:     user.id,
      category_slug: categorySlug,
      title,
      body,
      slug:          slugify(title),
      tags,
      lesson_slug:   lessonSlug || null,
      lesson_title:  lessonTitle || null,
      lesson_track:  lessonTrack || null,
      lesson_module: lessonModule || null,
    })
    .select("id, slug")
    .single();

  if (error || !data) {
    redirect(`/forum/new?error=${encodeURIComponent(error?.message ?? "Failed to post")}`);
  }

  revalidatePath("/forum");
  revalidatePath(`/forum/${categorySlug}`);
  redirect(threadHref(data.id, data.slug));
}

// ── Create a reply ───────────────────────────────────────────

export async function createReply(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to reply." };

  const threadId = Number(formData.get("thread_id"));
  const body     = (formData.get("body") as string).trim();

  if (!body || body.length < 10) return { error: "Reply must be at least 10 characters." };

  const { error } = await supabase
    .from("forum_replies")
    .insert({ thread_id: threadId, author_id: user.id, body });

  if (error) return { error: error.message };

  revalidatePath(`/forum/t/${threadId}/[slug]`, "page");
  return { success: true };
}

// ── Toggle an upvote ─────────────────────────────────────────

export async function toggleVote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to vote." };

  const threadId = formData.get("thread_id") ? Number(formData.get("thread_id")) : null;
  const replyId  = formData.get("reply_id")  ? Number(formData.get("reply_id"))  : null;

  // Check if vote exists
  let query = supabase.from("forum_votes").select("user_id").eq("user_id", user.id);
  if (threadId) query = query.eq("thread_id", threadId);
  if (replyId)  query = query.eq("reply_id",  replyId);
  const { data: existing } = await query.maybeSingle();

  if (existing) {
    // Remove vote
    let del = supabase.from("forum_votes").delete().eq("user_id", user.id);
    if (threadId) del = del.eq("thread_id", threadId);
    if (replyId)  del = del.eq("reply_id",  replyId);
    await del;
  } else {
    // Add vote
    await supabase.from("forum_votes").insert({
      user_id:   user.id,
      thread_id: threadId,
      reply_id:  replyId,
    });
  }

  if (threadId) revalidatePath(`/forum/t/${threadId}/[slug]`, "page");
  return { success: true };
}

// ── Mark a reply as the accepted answer ─────────────────────

export async function markAnswer(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authorised." };

  const threadId = Number(formData.get("thread_id"));
  const replyId  = Number(formData.get("reply_id"));

  // Verify the current user owns the thread
  const { data: thread } = await supabase
    .from("forum_threads")
    .select("author_id, answer_reply_id")
    .eq("id", threadId)
    .single();

  if (!thread || thread.author_id !== user.id) return { error: "Only the thread author can mark an answer." };

  const isUnsetting = thread.answer_reply_id === replyId;

  // Clear any previous answer on replies
  await supabase.from("forum_replies").update({ is_answer: false }).eq("thread_id", threadId);

  if (isUnsetting) {
    await supabase.from("forum_threads").update({ is_answered: false, answer_reply_id: null }).eq("id", threadId);
  } else {
    await supabase.from("forum_replies").update({ is_answer: true }).eq("id", replyId);
    await supabase.from("forum_threads").update({ is_answered: true, answer_reply_id: replyId }).eq("id", threadId);
  }

  revalidatePath(`/forum/t/${threadId}/[slug]`, "page");
  return { success: true };
}

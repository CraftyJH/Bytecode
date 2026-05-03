import type { User } from "@supabase/supabase-js";

/**
 * Returns true if the user should have full (premium) access.
 * Admins always have full access; otherwise checks app_metadata.plan.
 * We read from app_metadata (server-only, not user-editable) — never user_metadata.
 */
export function hasFullAccess(user: User | null): boolean {
  if (!user) return false;
  const meta = user.app_metadata ?? {};
  return meta.role === "admin" || meta.plan === "premium";
}

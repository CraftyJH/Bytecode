import { createAdminClient } from "@/lib/supabase/admin";

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const db = createAdminClient();
    const { data, error } = await db
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();
    if (error || data == null) return fallback;
    return data.value as T;
  } catch {
    return fallback;
  }
}

export async function setSiteSetting(key: string, value: unknown): Promise<void> {
  const db = createAdminClient();
  await db
    .from("site_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() });
}

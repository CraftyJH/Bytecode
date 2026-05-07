import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "site-config";
const FILE = "settings.json";

type SettingsMap = Record<string, unknown>;

async function readSettings(): Promise<SettingsMap> {
  try {
    const db = createAdminClient();
    const { data, error } = await db.storage.from(BUCKET).download(FILE);
    if (error || !data) return {};
    return JSON.parse(await data.text()) as SettingsMap;
  } catch {
    return {};
  }
}

async function writeSettings(settings: SettingsMap): Promise<void> {
  const db = createAdminClient();
  // createBucket is idempotent — safe to call even if bucket already exists
  await db.storage.createBucket(BUCKET, { public: false }).catch(() => {});
  const { error } = await db.storage.from(BUCKET).upload(
    FILE,
    JSON.stringify(settings),
    { contentType: "application/json", upsert: true },
  );
  if (error) throw new Error(`site-settings write failed: ${error.message}`);
}

export async function getSiteSetting<T>(key: string, fallback: T): Promise<T> {
  try {
    const settings = await readSettings();
    return key in settings ? (settings[key] as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function setSiteSetting(key: string, value: unknown): Promise<void> {
  const settings = await readSettings();
  settings[key] = value;
  await writeSettings(settings);
}

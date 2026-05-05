const GITHUB_RELEASE_API_URL =
  "https://api.github.com/repos/CraftyJH/Bytecode/releases/tags/android-latest";

export interface AndroidReleaseMeta {
  version: string;
  builtAt: string;
  apkUrl: string | null;
  releaseUrl: string | null;
}

function formatDate(isoDate: string): string {
  const parsed = Date.parse(isoDate);
  if (!Number.isFinite(parsed)) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(parsed));
}

function parseVersionFromFilename(filename: string): string | null {
  const match = filename.match(/[_\-v](\d+\.\d+(?:\.\d+)?)/i);
  return match ? match[1] : null;
}

export async function fetchAndroidReleaseMeta(): Promise<AndroidReleaseMeta | null> {
  try {
    const res = await fetch(GITHUB_RELEASE_API_URL, {
      next: { revalidate: 300 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;

    const release = await res.json();

    const apkAsset = (release.assets as Array<{
      name?: string;
      browser_download_url?: string;
      updated_at?: string;
    }> | undefined)?.find((a) => a.name?.toLowerCase().endsWith(".apk"));

    // Use the APK asset's own upload time — not the release's published_at,
    // which changes whenever CI touches the release object for any reason.
    const builtAt = apkAsset?.updated_at ? formatDate(apkAsset.updated_at) : null;

    // Try to extract a semver from the APK filename; fall back to the
    // release name or tag, stripping any "android-" prefix.
    const version =
      (apkAsset?.name ? parseVersionFromFilename(apkAsset.name) : null) ??
      (release.name as string | undefined)?.replace(/^android-/i, "") ??
      (release.tag_name as string | undefined)?.replace(/^android-/i, "") ??
      "unknown";

    if (!builtAt) return null;

    return {
      version,
      builtAt,
      apkUrl: apkAsset?.browser_download_url ?? null,
      releaseUrl: (release.html_url as string | undefined) ?? null,
    };
  } catch {
    return null;
  }
}

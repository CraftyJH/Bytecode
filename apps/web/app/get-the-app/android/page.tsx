import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const GITHUB_RELEASE_API_URL =
  "https://api.github.com/repos/CraftyJH/Bytecode/releases/tags/android-latest";

export const metadata = { title: "Android Download — Bytecode" };

interface GitHubReleaseResponse {
  tag_name?: string;
  name?: string;
  published_at?: string;
  html_url?: string;
  assets?: Array<{
    name?: string;
    browser_download_url?: string;
  }>;
}

function formatReleaseDate(isoDate: string): string {
  const parsed = Date.parse(isoDate);
  if (!Number.isFinite(parsed)) return isoDate;
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(parsed));
}

interface AndroidReleaseMeta {
  label: string;
  updated: string;
  apkUrl: string | null;
  releaseUrl: string | null;
}

async function fetchAndroidReleaseMeta(): Promise<AndroidReleaseMeta | null> {
  try {
    const response = await fetch(GITHUB_RELEASE_API_URL, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/vnd.github+json",
      },
    });
    if (!response.ok) return null;

    const release = (await response.json()) as GitHubReleaseResponse;
    const label = release.name ?? release.tag_name ?? "android-latest";
    const updated = release.published_at ? formatReleaseDate(release.published_at) : "Unknown";
    const apkAsset = release.assets?.find((asset) => {
      const name = asset.name?.toLowerCase() ?? "";
      return name.endsWith(".apk");
    });
    return {
      label,
      updated,
      apkUrl: apkAsset?.browser_download_url ?? null,
      releaseUrl: release.html_url ?? null,
    };
  } catch {
    return null;
  }
}

export default async function AndroidDownloadPage() {
  const releaseMeta = await fetchAndroidReleaseMeta();

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <section className="border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
            <p
              className="text-prose-faint text-sm mb-4"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // android release
            </p>
            <h1
              className="text-3xl lg:text-4xl font-semibold text-prose tracking-tight mb-4"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              Download Bytecode for Android
            </h1>
            <p className="text-base lg:text-lg text-prose-muted max-w-2xl mb-8">
              Install the latest Bytecode Android APK directly to your phone, then sign in with your
              Bytecode account.
            </p>

            <div
              className="mb-8 p-4 rounded-md border text-sm text-prose-muted"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              <p className="text-prose font-medium mb-1">Latest build info</p>
              {releaseMeta ? (
                <p>
                  Version: <span className="text-prose">{releaseMeta.label}</span> • Last updated:{" "}
                  <span className="text-prose">{releaseMeta.updated}</span>
                </p>
              ) : (
                <p>Version metadata currently unavailable. APK publishing may still be in progress.</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              {releaseMeta?.apkUrl ? (
                <a
                  href={releaseMeta.apkUrl}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium bg-accent text-inverse hover:bg-accent-warm transition-colors duration-100"
                >
                  Download Android APK
                </a>
              ) : (
                <span
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium border text-prose-faint"
                  style={{ borderColor: "var(--border-emphasis)" }}
                >
                  APK not published yet
                </span>
              )}
              <a
                href="/get-the-app"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border text-sm font-medium text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100"
                style={{ borderColor: "var(--border-emphasis)" }}
              >
                Back to Get the app
              </a>
              {releaseMeta?.releaseUrl ? (
                <a
                  href={releaseMeta.releaseUrl}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md border text-sm font-medium text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100"
                  style={{ borderColor: "var(--border-emphasis)" }}
                >
                  View release details
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-4xl px-6 py-12 lg:py-14">
            <h2
              className="text-xl lg:text-2xl font-semibold text-prose mb-5"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Installation instructions
            </h2>
            <ol className="space-y-4 list-decimal pl-5 text-prose-muted">
              <li>Tap the download button above from your Android phone.</li>
              <li>
                When Android blocks the install, open the prompt and allow installs from your browser
                (or file manager) for this one-time install.
              </li>
              <li>Open the downloaded APK file and tap Install.</li>
              <li>Launch Bytecode and sign in with your account.</li>
            </ol>

            <div
              className="mt-8 p-4 rounded-md border text-sm text-prose-muted"
              style={{
                borderColor: "var(--border-subtle)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              <p className="font-medium text-prose mb-1">Important</p>
              <p>
                This direct APK is for early access/testing. Once Google Play distribution is live,
                we recommend installing from Play for automatic updates and smoother installs.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

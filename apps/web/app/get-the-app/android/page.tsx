import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { fetchAndroidReleaseMeta } from "@/lib/android-release";

export const metadata = { title: "Android Download — Bytecode" };

export default async function AndroidDownloadPage() {
  const release = await fetchAndroidReleaseMeta();

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

            <div className="flex flex-wrap gap-3 items-start">
              {release?.apkUrl ? (
                <div className="flex flex-col gap-1.5">
                  <a
                    href={release.apkUrl}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium bg-accent text-inverse hover:bg-accent-warm transition-colors duration-100"
                  >
                    Download Android APK
                  </a>
                  <p
                    className="text-xs text-prose-faint pl-1"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    v{release.version} · built {release.builtAt}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <span
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-sm font-medium border text-prose-faint"
                    style={{ borderColor: "var(--border-emphasis)" }}
                  >
                    APK not published yet
                  </span>
                  <p
                    className="text-xs text-prose-faint pl-1"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Build may be in progress — check back shortly.
                  </p>
                </div>
              )}
              <a
                href="/get-the-app"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border text-sm font-medium text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100"
                style={{ borderColor: "var(--border-emphasis)" }}
              >
                Back to Get the app
              </a>
              {release?.releaseUrl ? (
                <a
                  href={release.releaseUrl}
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
              <li>Open the downloaded APK file and tap Install.</li>
              <li>
                If Android blocks the install, open the prompt and allow installs from your browser
                (or file manager) for this one-time install.
              </li>
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

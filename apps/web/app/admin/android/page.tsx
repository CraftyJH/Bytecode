import { getSiteSetting } from "@/lib/site-settings";
import { fetchAndroidReleaseMeta } from "@/lib/android-release";
import { setAndroidDownloadDisabled } from "./actions";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Android — Admin · Bytecode" };

export default async function AdminAndroidPage() {
  const [disabled, release] = await Promise.all([
    getSiteSetting<boolean>("android_download_disabled", false),
    fetchAndroidReleaseMeta(),
  ]);

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-10">
      <div className="mb-8">
        <p
          className="text-prose-faint text-xs mb-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // android
        </p>
        <h1 className="text-2xl font-semibold text-prose tracking-tight">
          Android Release
        </h1>
      </div>

      {/* Current release info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card padding="md">
          <p className="text-xs text-prose-muted mb-1">Version</p>
          <p className="text-lg font-semibold text-prose">
            {release ? `v${release.version}` : "—"}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-prose-muted mb-1">Built</p>
          <p className="text-lg font-semibold text-prose">
            {release?.builtAt ?? "—"}
          </p>
        </Card>
        <Card padding="md">
          <p className="text-xs text-prose-muted mb-1">APK available</p>
          <p className="text-lg font-semibold text-prose">
            {release?.apkUrl ? "Yes" : "No"}
          </p>
        </Card>
      </div>

      {/* Download toggle */}
      <Card padding="md">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-medium text-prose mb-1">
              Download button
            </p>
            <p className="text-xs text-prose-muted max-w-sm">
              When disabled, the download button on the Android page is replaced
              with a &quot;Temporarily disabled&quot; notice. Use this during a
              broken build or active CI deployment.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                disabled
                  ? "bg-red-500/10 text-red-400"
                  : "bg-green-500/10 text-green-400"
              }`}
            >
              {disabled ? "Disabled" : "Enabled"}
            </span>
            <form
              action={async () => {
                "use server";
                await setAndroidDownloadDisabled(!disabled);
              }}
            >
              <button
                type="submit"
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-100 ${
                  disabled
                    ? "bg-accent text-inverse hover:bg-accent-warm"
                    : "border text-prose-muted hover:text-prose hover:bg-subtle"
                }`}
                style={disabled ? undefined : { borderColor: "var(--border-emphasis)" }}
              >
                {disabled ? "Re-enable download" : "Disable download"}
              </button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}

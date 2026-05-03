import { Smartphone, QrCode } from "lucide-react";

export function AppDownload() {
  return (
    <section className="border-t" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — copy */}
          <div>
            <p
              className="text-prose-faint text-sm mb-5"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // learn anywhere
            </p>
            <h2
              className="text-3xl lg:text-4xl font-semibold text-prose tracking-tight mb-5"
              style={{ fontFamily: "var(--font-display)", letterSpacing: "-0.02em" }}
            >
              Take Bytecode
              <br />
              <span className="text-accent">with you.</span>
            </h2>
            <p className="text-lg text-prose-muted leading-relaxed mb-8 max-w-md">
              Study on the bus, code on your lunch break. The Bytecode mobile app gives you the full
              learning experience — lessons, quizzes, and a touch-optimised code editor — right in
              your pocket.
            </p>

            <div className="flex flex-wrap gap-3">
              {/* Placeholder download buttons */}
              <a
                href="#"
                aria-label="Download on the App Store (coming soon)"
                className="flex items-center gap-2.5 px-5 py-3 rounded-md border text-sm font-medium text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100"
                style={{ borderColor: "var(--border-emphasis)" }}
              >
                <Smartphone size={16} />
                App Store
                <span className="text-xs text-prose-faint">(soon)</span>
              </a>
              <a
                href="#"
                aria-label="Get it on Google Play (coming soon)"
                className="flex items-center gap-2.5 px-5 py-3 rounded-md border text-sm font-medium text-prose-muted hover:text-prose hover:bg-subtle transition-colors duration-100"
                style={{ borderColor: "var(--border-emphasis)" }}
              >
                <Smartphone size={16} />
                Google Play
                <span className="text-xs text-prose-faint">(soon)</span>
              </a>
            </div>
          </div>

          {/* Right — QR code placeholder */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="flex flex-col items-center gap-4 p-8 rounded-xl border"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-subtle)",
              }}
            >
              {/* QR placeholder */}
              <div
                className="w-40 h-40 rounded-lg flex items-center justify-center border-2 border-dashed"
                style={{ borderColor: "var(--border-emphasis)" }}
                aria-label="QR code placeholder — coming soon"
              >
                <div className="flex flex-col items-center gap-2 text-prose-faint">
                  <QrCode size={40} />
                  <span className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>
                    coming soon
                  </span>
                </div>
              </div>
              <p className="text-xs text-prose-faint text-center max-w-[160px]" style={{ fontFamily: "var(--font-mono)" }}>
                // scan to download<br />when available
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

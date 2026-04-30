import { notFound } from "next/navigation";
import { getTrack, getModule } from "@/lib/curriculum";
import { Button } from "@/components/ui/Button";
import { PrintButton } from "@/components/capstone/PrintButton";
import { Trophy, ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ track: string; module: string }>;
}

export default async function CertificatePage({ params }: Props) {
  const { track: trackSlug, module: moduleSlug } = await params;

  const track = getTrack(trackSlug);
  const mod = getModule(trackSlug, moduleSlug);
  if (!track || !mod) notFound();

  if (trackSlug !== "java-beginner" || moduleSlug !== "module-1") notFound();

  const issuedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16" style={{ paddingTop: "72px" }}>
      <div className="w-full max-w-2xl">
        {/* Back link */}
        <a
          href={`/curriculum/${trackSlug}/${moduleSlug}/capstone`}
          className="inline-flex items-center gap-1.5 text-sm text-prose-faint hover:text-prose transition-colors mb-8"
        >
          <ArrowLeft size={14} /> Back to capstone
        </a>

        {/* Certificate card */}
        <div
          id="certificate"
          className="relative rounded-2xl border p-10 text-center overflow-hidden"
          style={{
            backgroundColor: "var(--color-elevated)",
            borderColor: "var(--border-default)",
          }}
        >
          {/* Decorative corner glows */}
          <div
            className="absolute top-0 left-0 w-32 h-32 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle at 0% 0%, var(--color-accent), transparent)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
            style={{ background: "radial-gradient(circle at 100% 100%, var(--color-accent), transparent)" }}
          />

          {/* Trophy badge */}
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border-2"
            style={{ borderColor: "var(--color-accent)", backgroundColor: "rgba(111,168,111,0.08)" }}
          >
            <Trophy size={28} className="text-accent" />
          </div>

          <p
            className="text-xs tracking-widest uppercase text-prose-faint mb-3"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Certificate of Completion
          </p>

          <h1 className="text-2xl font-semibold text-prose tracking-tight mb-2">
            Java Beginner — Module 1 Mastery
          </h1>
          <p className="text-sm text-prose-muted mb-8 leading-relaxed">
            Successfully completed all 14 auto-graded tests for the{" "}
            <strong className="text-prose">Number Guessing Game</strong> capstone challenge.
          </p>

          <div className="h-px mx-auto w-32 mb-8" style={{ backgroundColor: "var(--border-subtle)" }} />

          <div className="flex justify-center gap-12 mb-8 flex-wrap">
            {[
              { label: "track", value: track.title },
              { label: "module", value: mod.title },
              { label: "issued", value: issuedDate },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-prose-faint mb-1" style={{ fontFamily: "var(--font-mono)" }}>{label}</p>
                <p className="text-sm font-medium text-prose">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-prose-faint" style={{ fontFamily: "var(--font-mono)" }}>
            bytecode.dev — the JVM specialist learning platform
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <PrintButton />
          <Button as="a" href={`/curriculum/${trackSlug}`} variant="secondary" size="sm">
            Continue learning
          </Button>
        </div>

        <p className="text-center text-xs text-prose-faint mt-4">
          Use your browser&apos;s <strong>Print → Save as PDF</strong> to download a copy.
        </p>
      </div>
    </div>
  );
}

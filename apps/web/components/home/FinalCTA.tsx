import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 lg:py-32 text-center">
      <p
        className="text-prose-faint text-sm mb-4"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // final cta
      </p>
      <h2
        className="text-3xl lg:text-4xl font-semibold text-prose mb-6 tracking-tight leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        One language family.{" "}
        <span className="text-accent">Done right.</span>
      </h2>
      <p className="text-prose-muted mb-10 max-w-md mx-auto">
        Join thousands of developers learning Java and Kotlin the right way —
        deeply, deliberately, without anxiety mechanics.
      </p>
      <Button as="a" href="/signup" variant="primary" size="lg">
        Create your account — it&apos;s free
      </Button>
    </section>
  );
}

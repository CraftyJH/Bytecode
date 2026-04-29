import { SectionHeader } from "@/components/ui/SectionHeader";

const steps = [
  {
    step: "01",
    verb: "Read",
    description:
      "A focused, well-written explanation of one concept — no padding, no fluff. Long enough to actually teach, short enough to finish in a session.",
  },
  {
    step: "02",
    verb: "Quiz",
    description:
      "Five question formats: multiple choice, fill-in-blank, predict output, find the bug, order the steps. Interleaved through every lesson.",
  },
  {
    step: "03",
    verb: "Run",
    description:
      "Real Java in your browser — no install, no setup. The editor is there from lesson one. Change it, break it, fix it.",
  },
  {
    step: "04",
    verb: "Build",
    description:
      "The capstone challenge at the end of each module proves you actually learned it. Free users see the brief; Premium users can submit and earn the certificate.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 lg:py-28">
      <SectionHeader
        label="how it works"
        heading="Read. Quiz. Run. Build."
        className="mb-12"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map(({ step, verb, description }) => (
          <div key={step} className="flex flex-col">
            <div className="flex items-baseline gap-3 mb-3">
              <span
                className="text-xs text-prose-faint"
                style={{ fontFamily: "var(--font-mono)" }}
                aria-hidden="true"
              >
                {step}
              </span>
              <h3
                className="text-xl font-semibold text-accent tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {verb}
              </h3>
            </div>
            <p className="text-sm text-prose-muted leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

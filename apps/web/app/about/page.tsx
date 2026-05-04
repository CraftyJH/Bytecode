import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "About — Bytecode" };

const principles = [
  {
    title: "Depth over breadth",
    body: "We focus on Java and Kotlin because mastery compounds. Shared runtime, shared ecosystem, and transferable patterns make this pairing practical for real jobs.",
  },
  {
    title: "No anxiety mechanics",
    body: "No hearts, no mistake limits, no streak shame. Learning requires trial and error, so the platform is designed to reward consistency, not perfection theater.",
  },
  {
    title: "Proof, not just progress bars",
    body: "Lessons teach the concept, quizzes reinforce it in multiple formats, and projects prove it. The goal is confidence you can demonstrate in interviews and on the job.",
  },
];

const whatYouGet = [
  "Structured paths from first syntax to production-grade backend and mobile projects",
  "Quiz formats that test understanding, not memorization",
  "Runnable Java in-browser from lesson one",
  "Capstone challenges that reflect how real code gets built",
  "A forum where questions are answered by developers, not just bots",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-16 lg:py-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="mx-auto max-w-4xl px-6">
            <SectionHeader
              label="about bytecode"
              heading="One language family. Done right."
              subheading="Bytecode exists for learners who want deep, practical JVM skills without noise. We teach Java and Kotlin deliberately, from foundations to production-ready work."
              align="center"
            />
          </div>
        </section>

        <section className="py-16 lg:py-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeader
              label="our principles"
              heading="How we design the learning experience"
              className="mb-10"
            />
            <div className="grid gap-4 md:grid-cols-3">
              {principles.map((principle) => (
                <Card key={principle.title} padding="md">
                  <h3 className="text-base font-semibold text-prose mb-2">{principle.title}</h3>
                  <p className="text-sm text-prose-muted leading-relaxed">{principle.body}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="mx-auto max-w-5xl px-6">
            <SectionHeader
              label="what learners get"
              heading="Built for outcomes, not vanity metrics"
              className="mb-8"
            />
            <ul className="space-y-4">
              {whatYouGet.map((item) => (
                <li key={item} className="flex items-start gap-3 text-prose-muted">
                  <span className="text-ok mt-0.5 shrink-0">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-sm text-prose-faint mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              {"// start here"}
            </p>
            <h2 className="text-3xl font-semibold text-prose tracking-tight mb-4">
              Ready to build real JVM skills?
            </h2>
            <p className="text-prose-muted mb-8">
              Start with Java Beginner for free, then move into advanced Java, Kotlin, and project tracks when you are ready.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button as="a" href="/signup" variant="primary" size="md">
                Create free account
              </Button>
              <Button as="a" href="/curriculum" variant="secondary" size="md">
                View curriculum
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

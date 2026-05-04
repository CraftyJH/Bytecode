import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Pricing } from "@/components/home/Pricing";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Pricing — Bytecode" };

const faqItems = [
  {
    question: "Is there really a free plan?",
    answer:
      "Yes. Free includes the full Java Beginner and Java Intermediate tracks, all quizzes, one full project, forum access, and preview access to the code playground. Capstone submissions on all tracks are Premium-only.",
  },
  {
    question: "How does billing work on Premium?",
    answer:
      "Premium is available monthly or yearly. There is no trial at the moment. You can cancel from settings, and access remains active through the current billing period.",
  },
  {
    question: "Do you have multiple paid tiers?",
    answer:
      'No. Bytecode keeps pricing intentionally simple: Free and Premium. No "Pro vs Max", no gated streak mechanics, and no ad-supported upsell funnel.',
  },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-16 lg:py-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="mx-auto max-w-4xl px-6">
            <SectionHeader
              label="pricing"
              heading="Pick your pace, keep your progress."
              subheading="Start free in minutes, upgrade when you want deeper tracks, capstones, and certificates. One curriculum, one clear upgrade path."
              align="center"
            />
          </div>
        </section>

        <Pricing />

        <section className="py-16 lg:py-24 border-y" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="mx-auto max-w-6xl px-6">
            <SectionHeader
              label="billing faq"
              heading="Questions before you upgrade?"
              subheading="The common billing and plan questions we get from learners."
              className="mb-10"
            />

            <div className="grid gap-4 md:grid-cols-3">
              {faqItems.map((item) => (
                <Card key={item.question} padding="md">
                  <h3 className="text-base font-semibold text-prose mb-2">{item.question}</h3>
                  <p className="text-sm text-prose-muted leading-relaxed">{item.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="text-sm text-prose-faint mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              {"// ready to go deeper"}
            </p>
            <h2 className="text-3xl font-semibold text-prose tracking-tight mb-4">
              Learn Java and Kotlin end-to-end.
            </h2>
            <p className="text-prose-muted mb-8">
              Upgrade when you are ready for advanced tracks, capstone submissions, and portfolio-grade projects.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button as="a" href="/signup?plan=premium" variant="primary" size="md">
                Go Premium
              </Button>
              <Button as="a" href="/curriculum" variant="secondary" size="md">
                Explore curriculum
              </Button>
            </div>
            <p className="mt-3 text-xs text-prose-faint">You need an account to access the curriculum.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

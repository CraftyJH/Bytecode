import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Terms of Service — Bytecode" };

const updatedAt = "May 4, 2026";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-16 lg:py-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="mx-auto max-w-4xl px-6">
            <SectionHeader
              label="terms of service"
              heading="Rules for using Bytecode"
              subheading="This is a starter terms page for the current product. Replace with attorney-reviewed terms before broad commercial rollout."
              align="center"
            />
            <p className="text-sm text-prose-faint mt-6">Last updated: {updatedAt}</p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-6 space-y-4">
            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">1) Agreement to terms</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                By accessing or using Bytecode, you agree to these Terms. If you do not agree, do not use the service.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">2) Eligibility and accounts</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                You are responsible for your account credentials and activity under your account. Provide accurate information and keep your login secure. You must meet the minimum legal age in your jurisdiction to create an account.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">3) Subscription and billing</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                Bytecode offers Free and Premium plans. Premium billing is charged on the selected cycle (monthly or yearly) and may auto-renew unless canceled. Prices may change in the future with notice where required.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">4) Cancellation and refunds</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                You may cancel paid subscriptions at any time through account settings. Access remains available through the active billing period unless stated otherwise. Refunds are handled according to applicable law and payment provider requirements.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">5) Acceptable use</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                Do not misuse Bytecode. Prohibited behavior includes harassment, unlawful conduct, spam, abusive automation, attempts to compromise service security, or posting content that infringes rights or violates law.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">6) Forum and community content</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                You retain ownership of content you post, but grant Bytecode a non-exclusive license to host, display, and distribute that content as needed to operate the service. We may remove content that violates these Terms or community rules.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">7) Intellectual property</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                Bytecode content, branding, curriculum structure, and platform software are protected by intellectual property laws. Except where explicitly permitted, you may not copy, redistribute, or reverse engineer protected materials.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">8) Service availability</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                We aim for reliable service but do not guarantee uninterrupted availability. Bytecode may change, suspend, or discontinue features at any time.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">9) Disclaimer and limitation of liability</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                Bytecode is provided &quot;as is&quot; to the extent permitted by law. To the maximum extent permitted, Bytecode is not liable for indirect, incidental, special, consequential, or punitive damages, or loss of data, revenue, or profits.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">10) Termination</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                We may suspend or terminate access for violations of these Terms, misuse, legal risk, or security reasons. You may stop using Bytecode at any time.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">11) Changes to these terms</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                We may update these Terms periodically. Continued use after changes take effect means you accept the revised Terms.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">12) Contact</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                Questions about these Terms can be sent to <a href="mailto:legal@bytecode.dev" className="text-accent hover:underline">legal@bytecode.dev</a>.
              </p>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

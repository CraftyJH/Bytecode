import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Privacy Policy — Bytecode" };

const updatedAt = "May 4, 2026";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="py-16 lg:py-24 border-b" style={{ borderColor: "var(--border-subtle)" }}>
          <div className="mx-auto max-w-4xl px-6">
            <SectionHeader
              label="privacy policy"
              heading="How Bytecode handles your data"
              subheading="This is a starter policy for the current product. Replace with attorney-reviewed language before launch to production scale."
              align="center"
            />
            <p className="text-sm text-prose-faint mt-6">Last updated: {updatedAt}</p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-4xl px-6 space-y-4">
            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">1) Information we collect</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                We collect information you provide directly, such as account details (name, email), profile data, forum posts and comments, and support requests. We also collect product usage data like lesson progress, quiz attempts, and playground activity to operate and improve the service.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">2) How we use information</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                We use data to run Bytecode, personalize your learning path, show course progress, moderate community content, process subscriptions, prevent abuse, and communicate service updates. We do not sell your personal information.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">3) Payments and billing data</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                Payment processing is handled by third-party providers. Bytecode does not store full card numbers or complete payment credentials on our servers. We may store billing status, plan, and transaction references needed for subscription management.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">4) Community and user-generated content</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                Forum posts, comments, and profile display information may be visible to other users. Please avoid posting sensitive personal data in public areas. We may remove content that violates platform rules.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">5) Data sharing</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                We share information only with service providers needed to run Bytecode (such as hosting, authentication, analytics, and payments), legal authorities when required, or as part of a business transfer. Providers are expected to use data only for contracted purposes.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">6) Data retention</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                We retain data while your account is active and as needed for legitimate business, legal, tax, fraud-prevention, or record-keeping obligations. Retention periods vary by data type.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">7) Your choices</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                You can update profile details in account settings. You can request account deletion by contacting support. Where legally required, you may have rights to access, correct, export, restrict, or delete personal data.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">8) Security</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                We use reasonable technical and organizational safeguards to protect data. No internet service is completely secure, so we cannot guarantee absolute security.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">9) Children&apos;s privacy</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                Bytecode is not intended for children under 13 (or the applicable minimum age in your jurisdiction). If you believe a child provided personal data, contact us so we can review and remove it where appropriate.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">10) Changes to this policy</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                We may update this Privacy Policy from time to time. When updates are material, we will revise the &quot;Last updated&quot; date and provide additional notice where appropriate.
              </p>
            </Card>

            <Card padding="md">
              <h2 className="text-lg font-semibold text-prose mb-3">11) Contact</h2>
              <p className="text-sm text-prose-muted leading-relaxed">
                For privacy questions or requests, contact us at <a href="mailto:privacy@bytecode.dev" className="text-accent hover:underline">privacy@bytecode.dev</a>.
              </p>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import Link from "next/link"

const lastUpdated = "March 15, 2026"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-24">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
          Back to home
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-bold text-zinc-100 mt-6 mb-4">Privacy Policy</h1>
        <p className="text-sm text-zinc-500 mb-10">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-zinc-300">
          <section>
            <h2 className="font-heading text-xl font-semibold text-zinc-100 mb-3">Data we collect</h2>
            <p className="text-zinc-400 leading-relaxed">
              We collect the email address you submit through the waitlist form so we can contact you about product
              updates, early access, and launch notifications.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-zinc-100 mb-3">How we use your data</h2>
            <p className="text-zinc-400 leading-relaxed">
              Your email is used only for Forticlaw communications related to early access and service updates. We do
              not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-zinc-100 mb-3">Data sharing</h2>
            <p className="text-zinc-400 leading-relaxed">
              We may use selected service providers to deliver emails and operate the website. They process data only on
              our behalf and under confidentiality obligations.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-zinc-100 mb-3">Your rights</h2>
            <p className="text-zinc-400 leading-relaxed">
              You can request access, correction, or deletion of your data at any time. You can also unsubscribe from
              emails using the unsubscribe link included in each message.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-xl font-semibold text-zinc-100 mb-3">Contact</h2>
            <p className="text-zinc-400 leading-relaxed">
              For privacy questions, contact us at{" "}
              <a href="mailto:hello@forticlaw.com" className="text-zinc-200 hover:text-white transition-colors">
                hello@forticlaw.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

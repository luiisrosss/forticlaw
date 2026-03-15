import Link from "next/link"
import { Logo } from "@/components/logo"

const lastUpdated = "March 15, 2026"

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <Logo size="sm" />
          <Link href="/" className="text-sm text-zinc-500 transition-colors hover:text-zinc-300">
            Back to home
          </Link>
        </div>

        <h1 className="mb-4 mt-6 font-display text-4xl font-bold text-zinc-100 md:text-5xl">Privacy Policy</h1>
        <p className="mb-10 text-sm text-zinc-500">Last updated: {lastUpdated}</p>

        <div className="space-y-8 text-zinc-300">
          <section>
            <h2 className="mb-3 font-heading text-xl font-semibold text-zinc-100">Data we collect</h2>
            <p className="leading-relaxed text-zinc-400">
              We collect the email address you submit through the waitlist form so we can contact you about product
              updates, early access, and launch notifications.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-xl font-semibold text-zinc-100">How we use your data</h2>
            <p className="leading-relaxed text-zinc-400">
              Your email is used only for Forticlaw communications related to early access and service updates. We do
              not sell your personal data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-xl font-semibold text-zinc-100">Data sharing</h2>
            <p className="leading-relaxed text-zinc-400">
              We may use selected service providers to deliver emails and operate the website. They process data only on
              our behalf and under confidentiality obligations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-xl font-semibold text-zinc-100">Your rights</h2>
            <p className="leading-relaxed text-zinc-400">
              You can request access, correction, or deletion of your data at any time. You can also unsubscribe from
              emails using the unsubscribe link included in each message.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-heading text-xl font-semibold text-zinc-100">Contact</h2>
            <p className="leading-relaxed text-zinc-400">
              For privacy questions, contact us at{" "}
              <a href="mailto:hello@forticlaw.com" className="text-zinc-200 transition-colors hover:text-white">
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

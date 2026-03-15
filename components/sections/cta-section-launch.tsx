import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { LiquidCtaButton } from "@/components/buttons/liquid-cta-button"

export function CtaSectionLaunch() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 font-display text-4xl font-bold text-zinc-100 md:text-5xl">
          Ready to launch better ads?
        </h2>
        <p className="mb-10 text-balance text-lg text-zinc-500">
          Create your account and start turning product URLs into launch-ready ad batches today.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/sign-up">
            <LiquidCtaButton>Get started free</LiquidCtaButton>
          </Link>
          <Link
            href="#features"
            className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <span>See features</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}

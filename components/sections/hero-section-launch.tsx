"use client"

import Link from "next/link"
import { Logo } from "@/components/logo"
import { LiquidCtaButton } from "@/components/buttons/liquid-cta-button"
import { ArrowRight } from "lucide-react"

const proofPoints = [
  { title: "Shopify or any product URL", copy: "No manual intake" },
  { title: "Draft first, batch after", copy: "Approve before scaling" },
  { title: "4 export ratios in one ZIP", copy: "Paid-social ready" },
]

export function HeroSectionLaunch() {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-24"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950/80 px-4 py-2">
          <Logo size="sm" showWordmark={false} href={null} />
          <span className="text-sm text-zinc-300">Now available for ecommerce operators</span>
        </div>

        <h1 className="mb-6 font-display text-5xl font-bold tracking-tight md:text-7xl">
          <span className="block text-zinc-100">From product URL to</span>
          <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
            launch-ready ads.
          </span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-balance text-lg leading-relaxed text-zinc-400 md:text-xl">
          Paste a Shopify or product URL. Forticlaw builds the draft, applies your brand kit, and exports the batch
          your paid campaigns need in every key ratio.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link href="/sign-up">
            <LiquidCtaButton>Get started free</LiquidCtaButton>
          </Link>
          <Link
            href="#features"
            className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
          >
            <span>See how it works</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-16 grid gap-3 text-left sm:grid-cols-3">
          {proofPoints.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/10 bg-zinc-950/60 px-5 py-4 backdrop-blur-sm"
            >
              <p className="mb-1 text-sm font-medium text-zinc-100">{item.title}</p>
              <p className="text-sm text-zinc-500">{item.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

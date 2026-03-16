"use client"

import { type FormEvent, useState } from "react"
import { Logo } from "@/components/logo"
import { Loader2 } from "lucide-react"

const proofPoints = [
  { title: "Shopify or any product URL", copy: "No manual intake" },
  { title: "Draft first, batch after", copy: "Approve before scaling" },
  { title: "4 export ratios in one ZIP", copy: "Paid-social ready" },
]

export function HeroSection() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || status === "loading") return

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? "Something went wrong")
      }

      setStatus("success")
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong")
      setStatus("error")
    }
  }

  return (
    <section id="waitlist" className="relative flex min-h-screen flex-col items-center justify-center px-6 pb-20 pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950/80 px-4 py-2">
          <Logo size="sm" showWordmark={false} href={null} />
          <span className="text-sm text-zinc-300">Early access for ecommerce operators</span>
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

        {status === "success" ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <p className="mb-1 font-medium text-zinc-100">You&apos;re on the list.</p>
            <p className="text-sm text-zinc-500">
              Check your inbox — we&apos;ve sent you a confirmation with your early access details.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-md">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                disabled={status === "loading"}
                className="flex-1 rounded-full border border-white/10 bg-zinc-950 px-5 py-3 text-sm text-zinc-100 transition-colors placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white px-6 py-3 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  "Request early access"
                )}
              </button>
            </div>

            {status === "error" && (
              <p className="mt-3 text-xs text-red-400">{errorMsg}</p>
            )}

            <p className="mt-4 text-xs text-zinc-600">
              Join the first operators testing Forticlaw before public launch.
            </p>
          </form>
        )}

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

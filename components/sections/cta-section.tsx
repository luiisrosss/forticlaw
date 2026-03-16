"use client"

import { type FormEvent, useState } from "react"
import { Loader2 } from "lucide-react"

export function CtaSection() {
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
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="mb-6 font-display text-4xl font-bold text-zinc-100 md:text-5xl">
          Ready to launch better ads?
        </h2>
        <p className="mb-10 text-balance text-lg text-zinc-500">
          Join the waitlist. The first 50 people get&nbsp;<strong className="text-zinc-300">20% off for life</strong> when we launch.
        </p>

        {status === "success" ? (
          <div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-zinc-950/70 p-6">
            <p className="mb-1 font-medium text-zinc-100">You&apos;re on the list.</p>
            <p className="text-sm text-zinc-500">
              Check your inbox — details on your early access are on the way.
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
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white px-6 py-3 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Joining...</span>
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </button>
            </div>

            {status === "error" && (
              <p className="mt-3 text-xs text-red-400">{errorMsg}</p>
            )}
          </form>
        )}
      </div>
    </section>
  )
}

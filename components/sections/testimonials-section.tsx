"use client"

import { motion } from "motion/react"
import { BriefcaseBusiness, Rocket, Store } from "lucide-react"

const audiences = [
  {
    icon: Rocket,
    title: "Solo dropshippers",
    copy: "You need angle testing and output speed without living in Canva or briefing a designer for every product.",
  },
  {
    icon: Store,
    title: "DTC brand operators",
    copy: "You need your brand kit, product positioning, and export ratios to stay consistent across every SKU.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Lean growth teams",
    copy: "You need a repeatable creative loop: import, approve, batch, export, and launch without handoffs.",
  },
]

export function TestimonialsSection() {
  return (
    <section id="fit" className="bg-zinc-900/20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mx-auto mb-12 flex max-w-2xl flex-col items-center justify-center"
        >
          <div className="rounded-full border border-white/10 px-4 py-1.5 text-sm text-zinc-400">Who It&apos;s For</div>

          <h2 className="mt-6 text-center font-display text-4xl font-bold tracking-tight text-zinc-100 md:text-5xl">
            Built for the operator behind the store
          </h2>
          <p className="mt-4 text-center text-lg text-zinc-500 text-balance">
            Forticlaw is tuned for teams who need speed, angle testing, and brand consistency across every export.
          </p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {audiences.map((audience, index) => {
            const Icon = audience.icon

            return (
              <motion.div
                key={audience.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-white/10 bg-zinc-950/65 p-7"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900">
                  <Icon className="h-5 w-5 text-zinc-200" />
                </div>
                <h3 className="mb-3 font-heading text-xl font-semibold text-zinc-100">{audience.title}</h3>
                <p className="leading-relaxed text-zinc-400">{audience.copy}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

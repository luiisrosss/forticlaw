"use client"

import { motion } from "motion/react"
import { Layers, Palette, RectangleHorizontal, ScanSearch } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">Features</p>
          <h2 className="mb-4 font-display text-3xl font-bold text-zinc-100 md:text-4xl">The core Forticlaw loop</h2>
          <p className="mx-auto max-w-xl text-balance text-zinc-500">
            Intake, brand application, variation generation, and export-ready outputs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3"
          >
            <Card className="group h-full overflow-hidden rounded-2xl border-zinc-800/50 bg-zinc-900/50 transition-all duration-300 hover:border-zinc-700/50">
              <CardContent className="p-6">
                <div className="mb-3 flex items-center gap-3">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <ScanSearch className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-200" />
                  </motion.div>
                  <p className="font-heading font-semibold text-zinc-100">AI reads your product</p>
                </div>
                <p className="mb-5 text-sm text-zinc-500">
                  Paste any Shopify or public product URL. Forticlaw extracts the product story, images, and angle inputs automatically.
                </p>
                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                      <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                      <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                    </div>
                    <span className="text-xs text-zinc-600">forticlaw.com/import</span>
                  </div>
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5">
                    <ScanSearch className="h-4 w-4 shrink-0 text-zinc-600" />
                    <motion.span
                      className="text-sm text-zinc-400"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 }}
                    >
                      mystore.myshopify.com/products/glow-serum
                    </motion.span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Product", value: "Glow Serum" },
                      { label: "Hook", value: "Glass skin in 7 days" },
                      { label: "Images", value: "4 found" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="rounded-lg bg-zinc-900/50 p-2.5"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.15 }}
                      >
                        <p className="mb-1 text-xs text-zinc-500">{item.label}</p>
                        <span className="text-sm font-semibold text-zinc-100">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className="mt-3 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card className="group h-full overflow-hidden rounded-2xl border-zinc-800/50 bg-zinc-900/50 transition-all duration-300 hover:border-zinc-700/50">
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-3 flex items-center gap-3">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <Palette className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-200" />
                  </motion.div>
                  <p className="font-heading font-semibold text-zinc-100">Instant brand kit</p>
                </div>
                <p className="mb-5 text-sm text-zinc-500">
                  Logo, typography, tone, and layout preferences stay consistent across every export.
                </p>
                <div className="mt-auto">
                  <div className="mb-4 flex gap-2">
                    {["#0a0a0a", "#fafafa", "#52525b", "#18181b"].map((color, i) => (
                      <motion.div
                        key={color}
                        className="aspect-square flex-1 rounded-xl border border-zinc-800"
                        style={{ backgroundColor: color }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        whileHover={{ scale: 1.1, y: -4 }}
                      />
                    ))}
                  </div>
                  <div className="flex items-baseline gap-2">
                    <motion.span
                      className="font-display text-2xl font-bold text-zinc-100"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      Brand
                    </motion.span>
                    <span className="text-sm text-zinc-500">locked in</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="group h-full overflow-hidden rounded-2xl border-zinc-800/50 bg-zinc-900/50 transition-all duration-300 hover:border-zinc-700/50">
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-3 flex items-center gap-3">
                  <motion.div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800" whileHover={{ y: -2 }}>
                    <Layers className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-200" />
                  </motion.div>
                  <p className="font-heading font-semibold text-zinc-100">Batch generation</p>
                </div>
                <p className="mb-5 text-sm text-zinc-500">
                  Generate 8 variations in one click so testing starts with a real spread of angles.
                </p>
                <div className="mt-auto grid grid-cols-4 gap-1.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square rounded-lg border border-zinc-700/30 bg-zinc-800/80"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-mono text-xs text-zinc-600">{"v" + (i + 1)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-3"
          >
            <Card className="group h-full overflow-hidden rounded-2xl border-zinc-800/50 bg-zinc-900/50 transition-all duration-300 hover:border-zinc-700/50">
              <CardContent className="flex h-full flex-col p-6">
                <div className="mb-3 flex items-center gap-3">
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    <RectangleHorizontal className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-zinc-200" />
                  </motion.div>
                  <p className="font-heading font-semibold text-zinc-100">Every format</p>
                </div>
                <p className="mb-5 text-sm text-zinc-500">
                  1:1, 4:5, 9:16, 1.91:1 - exported together so launch friction stays low.
                </p>
                <div className="mt-auto flex items-end justify-center gap-3">
                  {[
                    { ratio: "1:1", w: "w-16", h: "h-16" },
                    { ratio: "4:5", w: "w-14", h: "h-[70px]" },
                    { ratio: "9:16", w: "w-10", h: "h-[72px]" },
                    { ratio: "1.91:1", w: "w-24", h: "h-[50px]" },
                  ].map((format, i) => (
                    <motion.div
                      key={format.ratio}
                      className={`${format.w} ${format.h} flex items-center justify-center rounded-lg border border-zinc-700/50 bg-zinc-800/50`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                    >
                      <span className="font-mono text-xs text-zinc-500">{format.ratio}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

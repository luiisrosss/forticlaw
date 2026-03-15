"use client"

import { motion } from "framer-motion"
import { ScanSearch, Palette, Layers, RectangleHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-4">Features</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-zinc-100 mb-4">
            Everything your ads need
          </h2>
          <p className="text-zinc-500 max-w-xl mx-auto text-balance">
            Built specifically for dropshippers and ecommerce sellers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Card 1 - AI reads your product (wider - 3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3"
          >
            <Card className="group h-full overflow-hidden border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <ScanSearch className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  </motion.div>
                  <p className="font-heading font-semibold text-zinc-100">AI reads your product</p>
                </div>
                <p className="text-zinc-500 text-sm mb-5">
                  Paste any Shopify or AliExpress URL. Forticlaw extracts name, price, benefits and images automatically.
                </p>
                {/* URL Input Mockup */}
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
                    </div>
                    <span className="text-xs text-zinc-600">forticlaw.com/import</span>
                  </div>
                  {/* URL Input */}
                  <div className="flex items-center gap-2 bg-zinc-900/50 rounded-lg px-3 py-2.5 border border-zinc-800 mb-4">
                    <ScanSearch className="w-4 h-4 text-zinc-600 shrink-0" />
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
                  {/* Extracted data cards */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Product", value: "Glow Serum" },
                      { label: "Price", value: "$29.99" },
                      { label: "Benefits", value: "3 found" },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        className="bg-zinc-900/50 rounded-lg p-2.5"
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.15 }}
                      >
                        <p className="text-zinc-500 text-xs mb-1">{item.label}</p>
                        <span className="text-zinc-100 font-semibold text-sm">{item.value}</span>
                      </motion.div>
                    ))}
                  </div>
                  {/* Animated line */}
                  <motion.div
                    className="h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent mt-3"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 2 - Instant brand kit (narrower - 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <Card className="group h-full overflow-hidden border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300 rounded-2xl">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <Palette className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  </motion.div>
                  <p className="font-heading font-semibold text-zinc-100">Instant brand kit</p>
                </div>
                <p className="text-zinc-500 text-sm mb-5">Your colors, fonts and logo applied to every creative automatically.</p>
                <div className="mt-auto">
                  {/* Color palette mockup */}
                  <div className="flex gap-2 mb-4">
                    {["#ffffff", "#3b82f6", "#0a0a0a", "#f97316"].map((color, i) => (
                      <motion.div
                        key={color}
                        className="flex-1 aspect-square rounded-xl border border-zinc-800"
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
                      className="text-2xl font-display font-bold text-zinc-100"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      Auto
                    </motion.span>
                    <span className="text-zinc-500 text-sm">applied</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 3 - Batch generation (narrower - 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="group h-full overflow-hidden border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300 rounded-2xl">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center"
                    whileHover={{ y: -2 }}
                  >
                    <Layers className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  </motion.div>
                  <p className="font-heading font-semibold text-zinc-100">Batch generation</p>
                </div>
                <p className="text-zinc-500 text-sm mb-5">Generate 8 ad variations in one click. Ready for A/B testing.</p>
                {/* Grid of variation cards */}
                <div className="grid grid-cols-4 gap-1.5 mt-auto">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="aspect-square rounded-lg bg-zinc-800/80 border border-zinc-700/30"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs text-zinc-600 font-mono">{'v' + (i + 1)}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Card 4 - Every format (wider - 3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-3"
          >
            <Card className="group h-full overflow-hidden border-zinc-800/50 bg-zinc-900/50 hover:border-zinc-700/50 transition-all duration-300 rounded-2xl">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center"
                    whileHover={{ rotate: 180 }}
                    transition={{ duration: 0.4 }}
                  >
                    <RectangleHorizontal className="w-5 h-5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  </motion.div>
                  <p className="font-heading font-semibold text-zinc-100">Every format</p>
                </div>
                <p className="text-zinc-500 text-sm mb-5">{'1:1, 4:5, 9:16, 1.91:1 \u2014 all exported in one ZIP.'}</p>
                {/* Format preview mockups */}
                <div className="flex items-end justify-center gap-3 mt-auto">
                  {[
                    { ratio: "1:1", w: "w-16", h: "h-16" },
                    { ratio: "4:5", w: "w-14", h: "h-[70px]" },
                    { ratio: "9:16", w: "w-10", h: "h-[72px]" },
                    { ratio: "1.91:1", w: "w-24", h: "h-[50px]" },
                  ].map((format, i) => (
                    <motion.div
                      key={format.ratio}
                      className={`${format.w} ${format.h} rounded-lg border border-zinc-700/50 bg-zinc-800/50 flex items-center justify-center`}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                      whileHover={{ scale: 1.05, y: -4 }}
                    >
                      <span className="text-xs text-zinc-500 font-mono">{format.ratio}</span>
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

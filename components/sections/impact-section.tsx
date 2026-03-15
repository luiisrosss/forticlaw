const metrics = [
  { value: "1 URL", label: "Input", description: "Shopify or product page" },
  { value: "<15s", label: "Draft ready", description: "First concept to review" },
  { value: "8", label: "Variations", description: "Batch-ready testing" },
  { value: "4", label: "Ratios", description: "1:1, 4:5, 9:16, 1.91:1" },
]

export function ImpactSection() {
  return (
    <section id="how-it-works" className="bg-zinc-900/20 px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm font-medium uppercase tracking-wider text-zinc-500">Why Forticlaw</p>
          <h2 className="mb-4 font-display text-3xl font-bold text-zinc-100 md:text-4xl">A workflow built for ad output</h2>
          <p className="mx-auto max-w-lg text-balance text-zinc-500">
            One input, one draft, one approved batch, and every key paid-social ratio already covered.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="group relative overflow-hidden rounded-2xl border border-zinc-800/50 bg-zinc-900/50 p-6 text-center transition-all duration-300 hover:border-zinc-700/50 hover:bg-zinc-900/80"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative">
                <p className="mb-1 font-display text-3xl font-bold text-zinc-100 transition-colors group-hover:text-white md:text-4xl">
                  {metric.value}
                </p>
                <p className="mb-1 text-sm font-medium text-zinc-400">{metric.label}</p>
                <p className="text-xs text-zinc-600">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

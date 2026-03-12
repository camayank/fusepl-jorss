'use client'

import { motion } from 'framer-motion'

const CREDENTIALS = [
  { label: 'IBBI Registered', detail: 'Insolvency Professional' },
  { label: 'SFA Licensed', detail: 'Registered Valuer' },
  { label: 'IVS 105', detail: 'Valuation Standards' },
  { label: 'Rule 11UA', detail: 'Income Tax Act' },
  { label: 'FEMA NDI', detail: 'Cross-Border Compliance' },
  { label: 'Damodaran India', detail: 'Jan 2026 Benchmarks' },
  { label: '10 Methods', detail: '4 Approaches' },
  { label: '164 Sectors', detail: 'Indian Startup Taxonomy' },
  { label: 'Monte Carlo', detail: '10,000 Simulations' },
  { label: 'IBC Case Law', detail: '3,952 Outcomes' },
]

export function AuthorityBrands() {
  return (
    <section className="relative py-8 px-6 overflow-hidden bg-[oklch(0.12_0.012_250)] border-y border-[oklch(0.24_0.018_250/0.5)]">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[oklch(0.12_0.012_250)] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[oklch(0.12_0.012_250)] to-transparent z-10 pointer-events-none" />

      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-center text-[10px] font-semibold text-[oklch(0.55_0.01_250)] uppercase tracking-[0.25em] mb-5"
      >
        Standards, data sources &amp; methodology we follow
      </motion.p>

      <div className="relative">
        <motion.div className="flex gap-6 w-max" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 35, ease: 'linear', repeat: Infinity }}>
          {[...CREDENTIALS, ...CREDENTIALS].map((b, i) => (
            <div key={`${b.label}-${i}`} className="flex items-center gap-3 px-5 py-2.5 rounded-xl border border-[oklch(0.28_0.015_250)] bg-[oklch(0.16_0.015_250/0.6)] backdrop-blur-sm shrink-0">
              <span className="text-sm font-semibold text-[oklch(0.88_0.005_250)]">{b.label}</span>
              <span className="text-[10px] text-[oklch(0.55_0.01_250)] uppercase tracking-wider">{b.detail}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

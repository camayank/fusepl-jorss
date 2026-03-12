'use client'

import { motion } from 'framer-motion'

const SIGNALS = [
  {
    label: 'IBBI Registered',
    text: 'Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer',
    metric: 'Registration verified',
  },
  {
    label: 'Damodaran India',
    text: 'Industry benchmarks from Aswath Damodaran — the gold standard in valuation data',
    metric: 'January 2026 data',
  },
  {
    label: 'IVS 105 Aligned',
    text: '3 valuation approaches, 10 methods — aligned with IBBI, IVS, and Rule 11UA standards',
    metric: '10 methods',
  },
  {
    label: 'Monte Carlo',
    text: 'Probabilistic valuation ranges from 10,000-iteration Box-Muller simulation',
    metric: '10K iterations',
  },
  {
    label: 'IBC Case Law',
    text: '190+ IBC landmark cases analyzed for downside recovery benchmarks',
    metric: '3,952 outcomes',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function TrustSignals() {
  return (
    <section className="grain relative py-24 px-6">
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-[oklch(0.78_0.14_80)] uppercase tracking-[0.2em] mb-4">
            Why trust this platform
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl text-[oklch(0.93_0.005_80)]">
            Not a Random Calculator
          </h2>
          <p className="mt-4 text-sm text-[oklch(0.45_0.01_260)] max-w-md mx-auto leading-relaxed">
            Enterprise-grade methodology meets startup speed. Every number is defensible.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SIGNALS.map((signal) => (
            <motion.div
              key={signal.label}
              variants={cardVariants}
              className="group relative p-5 rounded-lg bg-[oklch(0.12_0.008_260)] border border-[oklch(0.20_0.008_260)] transition-all duration-300 hover:border-[oklch(0.78_0.14_80/0.15)] hover:bg-[oklch(0.13_0.008_260)]"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-[oklch(0.78_0.14_80)] uppercase tracking-[0.15em]">
                  {signal.label}
                </span>
                <span className="text-[10px] text-[oklch(0.45_0.01_260)] tabular-nums">
                  {signal.metric}
                </span>
              </div>
              <p className="text-sm text-[oklch(0.60_0.01_260)] leading-relaxed">
                {signal.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

'use client'

import { motion } from 'framer-motion'

const SIGNALS = [
  {
    icon: '\u2696\ufe0f',
    text: 'Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer',
  },
  {
    icon: '\ud83d\udcca',
    text: 'Powered by Damodaran India Industry Benchmarks (January 2026)',
  },
  {
    icon: '\ud83c\udfaf',
    text: '3 Valuation Approaches \u00d7 10 Methods \u2014 aligned with IBBI / IVS / Rule 11UA Standards',
  },
  {
    icon: '\ud83c\udfb2',
    text: 'Monte Carlo Simulation with 10,000 iterations for probabilistic ranges',
  },
  {
    icon: '\ud83d\udcdc',
    text: '190+ IBC landmark cases analyzed | 3,952 corporate debtor outcomes studied',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
}

export function TrustSignals() {
  return (
    <section className="relative py-20 px-6">
      {/* Subtle top divider gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Not a Random Calculator
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-lg mx-auto">
            Enterprise-grade methodology meets startup speed. Every number is defensible.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {SIGNALS.map((signal, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="group relative flex items-start gap-4 p-5 rounded-xl bg-white/[0.03] backdrop-blur-lg border border-white/[0.06] transition-colors hover:bg-white/[0.05] hover:border-white/[0.1]"
            >
              <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
                {signal.icon}
              </span>
              <p className="text-sm text-slate-300 leading-relaxed">
                {signal.text}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

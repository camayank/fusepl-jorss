'use client'

import { motion } from 'framer-motion'
import { APPROACH_LABELS } from '@/types'
import type { ValuationApproach } from '@/types'

const APPROACHES: {
  key: ValuationApproach
  methods: string[]
  accent: string
  accentBg: string
  dotColor: string
}[] = [
  {
    key: 'income',
    methods: ['DCF (Discounted Cash Flow)', 'PWERM (Probability Weighted)'],
    accent: 'border-l-blue-500',
    accentBg: 'bg-blue-500/[0.06]',
    dotColor: 'bg-blue-400',
  },
  {
    key: 'market',
    methods: ['Revenue Multiple', 'EV/EBITDA Multiple', 'Comparable Transactions'],
    accent: 'border-l-green-500',
    accentBg: 'bg-green-500/[0.06]',
    dotColor: 'bg-green-400',
  },
  {
    key: 'asset_cost',
    methods: ['Net Asset Value', 'Replacement Cost'],
    accent: 'border-l-amber-500',
    accentBg: 'bg-amber-500/[0.06]',
    dotColor: 'bg-amber-400',
  },
  {
    key: 'vc_startup',
    methods: ['Scorecard (Bill Payne)', 'Berkus Method', 'Risk Factor Summation'],
    accent: 'border-l-purple-500',
    accentBg: 'bg-purple-500/[0.06]',
    dotColor: 'bg-purple-400',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
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

export function MethodShowcase() {
  return (
    <section className="relative py-20 px-6">
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
            3 Approaches &times; 10 Methods
          </h2>
          <p className="mt-3 text-sm text-slate-500 max-w-lg mx-auto">
            Aligned with IBBI Valuation Standards, IVS 105, and Rule 11UA
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 gap-5"
        >
          {APPROACHES.map((approach) => (
            <motion.div
              key={approach.key}
              variants={cardVariants}
              className={`
                relative rounded-xl border-l-[3px] ${approach.accent}
                bg-white/[0.02] backdrop-blur-sm border border-white/[0.06]
                p-6 transition-colors hover:bg-white/[0.04]
              `}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-2 h-2 rounded-full ${approach.dotColor}`} />
                <h3 className="font-semibold text-white text-base">
                  {APPROACH_LABELS[approach.key]}
                </h3>
              </div>
              <ul className="space-y-2">
                {approach.methods.map((method) => (
                  <li
                    key={method}
                    className="text-sm flex items-center gap-2.5 text-slate-400"
                  >
                    <span className={`w-1 h-1 rounded-full ${approach.dotColor} opacity-60 shrink-0`} />
                    {method}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

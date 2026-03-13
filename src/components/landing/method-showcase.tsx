'use client'

import { motion } from 'framer-motion'
import { APPROACH_LABELS } from '@/types'
import type { ValuationApproach } from '@/types'
import type { ReactNode } from 'react'

const APPROACHES: { key: ValuationApproach; methods: string[]; color: string; icon: ReactNode }[] = [
  {
    key: 'income',
    methods: ['DCF — Future cash flows worth today', 'PWERM — Weighted best/base/worst case'],
    color: 'oklch(0.72 0.17 162)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
  },
  {
    key: 'market',
    methods: ['Revenue Multiple — What similar startups sell for', 'EV/EBITDA — Profitability comparison', 'Comparable Deals — Real acquisition data'],
    color: 'oklch(0.68 0.14 250)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
  },
  {
    key: 'asset_cost',
    methods: ['Net Asset Value — Own minus owe', 'Replacement Cost — Cost to rebuild'],
    color: 'oklch(0.78 0.12 80)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
      </svg>
    ),
  },
  {
    key: 'vc_startup',
    methods: ['Scorecard — Stack up vs. funded startups', 'Berkus — Milestone-based value', 'Risk Factor — 12 investor dimensions'],
    color: 'oklch(0.72 0.16 300)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
  },
]

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } } }

export function MethodShowcase() {
  return (
    <section className="grain relative py-28 px-6 bg-gradient-to-b from-[oklch(0.12_0.012_250)] via-[oklch(0.15_0.018_250)] to-[oklch(0.12_0.012_250)]">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <p className="text-[11px] font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.2em] mb-4">The Rigour Behind the Numbers</p>
          <h2 className="font-heading text-3xl sm:text-[2.75rem] text-[oklch(0.97_0.002_250)] leading-tight">4 Approaches &times; 10 Methods</h2>
          <p className="mt-5 text-base text-[oklch(0.65_0.01_250)] max-w-lg mx-auto leading-relaxed">The same framework that institutional investors and IBBI professionals rely on.</p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} className="grid sm:grid-cols-2 gap-5">
          {APPROACHES.map((a) => (
            <motion.div key={a.key} variants={cardVariants} className="glass-card relative rounded-2xl p-7 overflow-hidden group">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${a.color}, transparent)` }} />
              <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ backgroundColor: `color-mix(in oklch, ${a.color} 15%, transparent)` }} />
              <div className="relative">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ color: a.color, background: `color-mix(in oklch, ${a.color} 12%, transparent)`, border: `1px solid color-mix(in oklch, ${a.color} 25%, transparent)` }}>
                    {a.icon}
                  </div>
                  <h3 className="font-heading text-lg text-[oklch(0.95_0.002_250)]">{APPROACH_LABELS[a.key]}</h3>
                  <span className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ color: a.color, backgroundColor: `color-mix(in oklch, ${a.color} 10%, transparent)` }}>{a.methods.length} methods</span>
                </div>
                <ul className="space-y-3">
                  {a.methods.map((m) => (
                    <li key={m} className="text-sm flex items-start gap-3 text-[oklch(0.68_0.01_250)]">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: a.color }} />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

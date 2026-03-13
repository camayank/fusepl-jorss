'use client'

import { motion } from 'framer-motion'

const SIGNALS = [
  {
    label: 'IBBI Registered',
    text: 'Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer.',
    metric: 'Verified',
    color: 'oklch(0.78 0.14 75)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    label: 'Damodaran Data',
    text: 'Real industry benchmarks from Prof. Aswath Damodaran — updated January 2026.',
    metric: 'Jan 2026',
    color: 'oklch(0.68 0.14 250)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
  },
  {
    label: 'IVS 105 Aligned',
    text: '4 approaches, 10 methods — the same framework used in boardroom-level valuations.',
    metric: '10 methods',
    color: 'oklch(0.72 0.16 300)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
      </svg>
    ),
  },
  {
    label: 'Monte Carlo',
    text: '10,000 simulated scenarios showing the full range of what your startup is worth.',
    metric: '10K runs',
    color: 'oklch(0.78 0.12 80)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
  {
    label: 'IBC Case Law',
    text: '190+ landmark IBC cases analyzed for grounded downside estimates.',
    metric: '3,952 outcomes',
    color: 'oklch(0.72 0.14 25)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
  {
    label: '164 Sectors',
    text: 'Exhaustive Indian startup taxonomy — from Fintech to DeepTech, AgriTech to SpaceTech. Every niche covered with sector-specific benchmarks.',
    metric: '27 verticals',
    color: 'oklch(0.65 0.16 155)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
}

export function TrustSignals() {
  return (
    <section className="grain relative py-28 px-6 bg-gradient-to-b from-[oklch(0.12_0.012_250)] via-[oklch(0.12_0.025_260)] to-[oklch(0.12_0.012_250)]">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <p className="text-[11px] font-semibold text-[oklch(0.78_0.14_75)] uppercase tracking-[0.2em] mb-4">Why founders trust us</p>
          <h2 className="font-heading text-3xl sm:text-[2.75rem] text-[oklch(0.97_0.002_250)] leading-tight">Not a Random Number Generator</h2>
          <p className="mt-5 text-base text-[oklch(0.68_0.01_250)] max-w-lg mx-auto leading-relaxed">
            When an investor asks &ldquo;how did you arrive at this valuation?&rdquo; — you&apos;ll have a real answer.
          </p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNALS.map((s) => (
            <motion.div key={s.label} variants={cardVariants} className="glass-card group relative p-6 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ color: s.color, backgroundColor: `color-mix(in oklch, ${s.color} 12%, transparent)`, border: `1px solid color-mix(in oklch, ${s.color} 20%, transparent)` }}>
                  {s.icon}
                </div>
                <span className="text-xs font-bold text-[oklch(0.88_0.005_250)] uppercase tracking-[0.12em]">{s.label}</span>
                <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ color: s.color, backgroundColor: `color-mix(in oklch, ${s.color} 12%, transparent)` }}>{s.metric}</span>
              </div>
              <p className="text-sm text-[oklch(0.68_0.01_250)] leading-relaxed">{s.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

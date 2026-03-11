'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '1',
    title: 'Answer 6 Quick Steps',
    desc: 'Company profile, team, financials, market, strategy, ESOP \u2014 takes 3\u20135 minutes.',
  },
  {
    num: '2',
    title: 'Get Your Valuation',
    desc: '10 methods across 3 approaches compute your range. Monte Carlo simulation runs 10,000 scenarios.',
  },
  {
    num: '3',
    title: 'Unlock Full Report',
    desc: 'Enter your email for detailed methodology, benchmarks, ESOP valuation, investor matches, and AI insights.',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' as const },
  },
}

export function HowItWorks() {
  return (
    <section className="relative py-20 px-6">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            How It Works
          </h2>
          <p className="mt-3 text-sm text-slate-500">
            Three steps to a defensible, institutional-grade valuation.
          </p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative"
        >
          {/* Connecting line -- desktop: horizontal, mobile: vertical */}
          <div className="hidden md:block absolute top-6 left-[calc(16.67%+12px)] right-[calc(16.67%+12px)] h-[2px] bg-gradient-to-r from-amber-500/30 via-amber-500/20 to-amber-500/30" />
          <div className="md:hidden absolute top-6 bottom-6 left-6 w-[2px] bg-gradient-to-b from-amber-500/30 via-amber-500/20 to-amber-500/30" />

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {STEPS.map((step) => (
              <motion.div
                key={step.num}
                variants={stepVariants}
                className="relative flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center"
              >
                {/* Step number circle */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-slate-950 border-2 border-amber-500/40 shadow-[0_0_16px_rgba(245,158,11,0.15)]">
                  <span className="text-lg font-bold text-amber-400">
                    {step.num}
                  </span>
                </div>

                <div className="md:mt-5">
                  <h3 className="font-semibold text-white text-base">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xs">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

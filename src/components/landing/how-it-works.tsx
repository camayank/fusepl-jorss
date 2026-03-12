'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '01',
    title: 'Paste Your Website',
    desc: 'Drop your startup URL and we auto-detect your sector, team, and key details. Or fill in manually — takes under 2 minutes.',
    time: '30 seconds',
  },
  {
    num: '02',
    title: 'Answer 6 Simple Questions',
    desc: 'Company basics, team strength, revenue, market size, strategy, and equity. No jargon — we translate everything for you.',
    time: '3-5 minutes',
  },
  {
    num: '03',
    title: 'Get Your Valuation',
    desc: '10 methods run simultaneously. Monte Carlo simulates 10,000 scenarios. You get a range that would hold up in a Shark Tank pitch.',
    time: 'Instant',
  },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export function HowItWorks() {
  return (
    <section className="grain relative py-24 px-6">
      <div className="section-divider absolute inset-x-0 top-0" />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-[11px] font-semibold text-[oklch(0.78_0.14_80)] uppercase tracking-[0.2em] mb-4">
            How It Works
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl text-[oklch(0.93_0.005_80)]">
            From Zero to Valuation in 5 Minutes
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="relative"
        >
          {/* Vertical connecting line */}
          <div className="absolute top-0 bottom-0 left-[23px] w-px bg-gradient-to-b from-[oklch(0.78_0.14_80/0.3)] via-[oklch(0.78_0.14_80/0.12)] to-transparent md:hidden" />
          {/* Horizontal connecting line — desktop */}
          <div className="hidden md:block absolute top-[28px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-[oklch(0.78_0.14_80/0.25)] via-[oklch(0.78_0.14_80/0.12)] to-[oklch(0.78_0.14_80/0.25)]" />

          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {STEPS.map((step) => (
              <motion.div
                key={step.num}
                variants={stepVariants}
                className="relative flex md:flex-col items-start md:items-center gap-5 md:gap-0 md:text-center"
              >
                {/* Step number */}
                <div className="relative z-10 flex items-center justify-center w-12 h-12 shrink-0 rounded-full bg-[oklch(0.08_0.008_260)] border border-[oklch(0.78_0.14_80/0.25)] shadow-[0_0_20px_oklch(0.78_0.14_80/0.08)]">
                  <span className="text-sm font-heading text-[oklch(0.78_0.14_80)]">
                    {step.num}
                  </span>
                </div>

                <div className="md:mt-6">
                  <h3 className="font-heading text-lg text-[oklch(0.93_0.005_80)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-[oklch(0.52_0.01_260)] leading-relaxed max-w-xs">
                    {step.desc}
                  </p>
                  <span className="inline-block mt-3 text-[10px] font-semibold text-[oklch(0.78_0.14_80)] uppercase tracking-[0.15em]">
                    {step.time}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

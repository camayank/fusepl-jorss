'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

const STEPS: { num: string; title: string; desc: string; time: string; color: string; icon: ReactNode }[] = [
  {
    num: '01',
    title: 'Paste Your Website',
    desc: 'Drop your startup URL and we auto-detect your sector, team, and key details. Or fill in manually.',
    time: '30 seconds',
    color: 'oklch(0.72 0.17 162)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Answer 6 Simple Questions',
    desc: 'Company basics, team strength, revenue, market size, strategy, and equity. No jargon.',
    time: '3-5 minutes',
    color: 'oklch(0.68 0.14 250)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Get Your Valuation',
    desc: '10 methods run simultaneously. Monte Carlo simulates 10,000 scenarios. You get a defensible range.',
    time: 'Instant',
    color: 'oklch(0.72 0.16 300)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
      </svg>
    ),
  },
]

const containerVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }
const stepVariants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const } } }

export function HowItWorks() {
  return (
    <section className="grain relative py-28 px-6">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-center mb-16">
          <p className="text-[11px] font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.2em] mb-4">How It Works</p>
          <h2 className="font-heading text-3xl sm:text-[2.75rem] text-[oklch(0.97_0.002_250)] leading-tight">From Zero to Valuation in 5 Minutes</h2>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} className="grid md:grid-cols-3 gap-6">
          {STEPS.map((step, idx) => (
            <motion.div key={step.num} variants={stepVariants} className="glass-card relative p-7 rounded-2xl text-center overflow-hidden">
              {/* Connecting arrow between steps */}
              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex absolute top-1/2 -right-3 z-10 w-6 h-6 items-center justify-center rounded-full bg-[oklch(0.20_0.02_250)] border border-[oklch(0.32_0.02_250/0.5)]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.01 250)" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              )}
              {/* Step icon */}
              <div className="flex justify-center mb-5">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ color: step.color, background: `color-mix(in oklch, ${step.color} 12%, transparent)`, border: `1px solid color-mix(in oklch, ${step.color} 25%, transparent)` }}>
                  {step.icon}
                </div>
              </div>
              {/* Step number */}
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block" style={{ color: step.color }}>{step.num}</span>
              <h3 className="font-heading text-xl text-[oklch(0.95_0.002_250)] mb-3">{step.title}</h3>
              <p className="text-sm text-[oklch(0.65_0.01_250)] leading-relaxed mb-4">{step.desc}</p>
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] px-3 py-1 rounded-full" style={{ color: step.color, backgroundColor: `color-mix(in oklch, ${step.color} 10%, transparent)` }}>{step.time}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

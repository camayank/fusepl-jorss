'use client'

import { motion } from 'framer-motion'

const QUALIFICATIONS = [
  { label: 'IBBI Registration', value: 'Insolvency Professional', detail: 'Insolvency and Bankruptcy Board of India — the gold standard for distressed asset valuation and recovery analysis in India.' },
  { label: 'SFA License', value: 'Registered Valuer', detail: 'Securities and Facilities Association licensed valuer — authorized to provide formal valuation opinions for regulatory compliance.' },
  { label: 'IVS 105 Framework', value: 'International Standard', detail: 'Every valuation follows IVS 105 (Valuation Approaches and Methods) — the same framework used in boardroom-level institutional valuations.' },
]

export function FounderAuthority() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      <div className="section-divider absolute inset-x-0 top-0" />
      <div className="absolute top-1/2 right-[-10%] -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[oklch(0.72_0.17_162/0.03)] blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {/* Asymmetric layout — text left, credentials right */}
        <div className="grid md:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-start">
          {/* Left — narrative */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <p className="text-[11px] font-semibold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.2em] mb-4">Who Built This</p>
            <h2 className="font-heading text-3xl sm:text-[2.5rem] text-[oklch(0.97_0.002_250)] leading-tight mb-6">
              Not Another<br />
              <span className="text-gold-gradient">AI Number Generator</span>
            </h2>
            <div className="space-y-4 text-sm text-[oklch(0.68_0.01_250)] leading-relaxed">
              <p>
                Most startup valuation tools give you a number with no methodology behind it. This platform is different — it was built by a practising IBBI-registered insolvency professional who has seen valuations challenged in NCLT proceedings, investor due diligence, and M&A negotiations.
              </p>
              <p>
                Every method, every benchmark, every assumption is documented and defensible. When an investor asks <span className="text-[oklch(0.80_0.14_162)] font-medium">&ldquo;how did you arrive at this number?&rdquo;</span> — you&apos;ll have a real answer.
              </p>
            </div>

            {/* Quick proof points */}
            <div className="mt-8 flex flex-wrap gap-3">
              {['IVS 105 Aligned', 'Rule 11UA Compliant', 'FEMA NDI Ready', 'IBC Case Law'].map(tag => (
                <span key={tag} className="text-[10px] font-bold uppercase tracking-[0.12em] px-3 py-1.5 rounded-full border border-[oklch(0.72_0.17_162/0.15)] bg-[oklch(0.72_0.17_162/0.05)] text-[oklch(0.72_0.17_162)]">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — credential cards, staggered */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-40px' }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }} className="space-y-4">
            {QUALIFICATIONS.map((q) => (
              <motion.div
                key={q.label}
                variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }}
                className="relative rounded-2xl border border-[oklch(0.28_0.02_250/0.6)] bg-[oklch(0.16_0.018_250/0.5)] p-5 backdrop-blur-sm"
              >
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.17_162/0.15)] to-transparent" />
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-[10px] font-bold text-[oklch(0.72_0.17_162)] uppercase tracking-[0.15em]">{q.label}</span>
                  <span className="text-[11px] font-semibold text-[oklch(0.82_0.005_250)]">{q.value}</span>
                </div>
                <p className="text-xs text-[oklch(0.58_0.01_250)] leading-relaxed">{q.detail}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

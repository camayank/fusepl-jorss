'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function CtaSection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-amber-500 to-orange-500" />

      {/* Subtle dot pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.3) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Soft highlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-white/10 rounded-full blur-[100px]" />

      <div className="relative max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight"
        >
          Know your startup&apos;s true worth
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-4 text-base sm:text-lg text-slate-950/70 max-w-xl mx-auto"
        >
          Institutional-grade valuation in under 5 minutes.
          Free, defensible, and powered by real data.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8"
        >
          <Link
            href="/valuation"
            className="inline-flex items-center justify-center rounded-xl h-12 px-8 text-base font-bold bg-slate-950 text-amber-400 transition-all hover:bg-slate-900 hover:shadow-[0_0_32px_rgba(0,0,0,0.3)] active:scale-[0.97]"
          >
            Start Your Valuation
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

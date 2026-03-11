'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// Animated counter hook -- counts from 0 to `end` over `duration` ms
// ---------------------------------------------------------------------------
function useCounter(end: number, duration = 1600) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const tick = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * end))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration])

  return { value, ref }
}

// ---------------------------------------------------------------------------
// Stats data
// ---------------------------------------------------------------------------
const STATS = [
  { end: 10, suffix: '', label: 'Valuation Methods' },
  { end: 3, suffix: '', label: 'Approaches' },
  { end: 25, suffix: '+', label: 'Industry Sectors' },
  { end: 10, suffix: 'K', label: 'Monte Carlo Sims' },
] as const

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' as const },
  }),
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function Hero() {
  return (
    <section className="relative isolate w-full min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
      {/* ---- Gradient mesh background ---- */}
      <div className="absolute inset-0 -z-10">
        {/* Base dark */}
        <div className="absolute inset-0 bg-slate-950" />
        {/* Animated amber glow */}
        <div className="absolute top-[-40%] left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-amber-500/[0.07] blur-[120px] animate-[hero-glow_8s_ease-in-out_infinite_alternate]" />
        {/* Secondary cool glow for depth */}
        <div className="absolute bottom-[-30%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-500/[0.04] blur-[100px] animate-[hero-glow_12s_ease-in-out_infinite_alternate-reverse]" />
        {/* Fine grid for texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* ---- Content ---- */}
      <motion.p
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-xs font-semibold text-amber-400/90 uppercase tracking-[0.2em] mb-5"
      >
        AI-Powered Startup Valuation
      </motion.p>

      <motion.h1
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight max-w-4xl leading-[1.08]"
      >
        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
          India&apos;s Most Comprehensive
        </span>
        <br />
        <span className="text-white">
          Startup Valuation Platform
        </span>
      </motion.h1>

      <motion.p
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6 text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed"
      >
        3 Approaches &times; 10 Methods &mdash; DCF, PWERM, Revenue Multiple,
        EV/EBITDA, Comparable Transactions, NAV, Replacement Cost, Scorecard,
        Berkus, Risk Factor Summation. Powered by Damodaran India data.
        Monte Carlo simulation. Free.
      </motion.p>

      {/* ---- CTAs ---- */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="flex flex-wrap justify-center gap-3 mt-10"
      >
        <Link
          href="/valuation"
          className="group relative inline-flex items-center justify-center rounded-xl h-11 px-6 text-sm font-semibold bg-amber-500 text-slate-950 transition-all hover:bg-amber-400 hover:shadow-[0_0_32px_rgba(245,158,11,0.3)] active:scale-[0.97]"
        >
          <span className="relative z-10">Get Your Valuation</span>
          <span className="absolute inset-0 rounded-xl bg-amber-400/0 group-hover:bg-amber-400/20 transition-colors" />
        </Link>
        <Link
          href="/cap-table"
          className="inline-flex items-center justify-center rounded-xl h-11 px-6 text-sm font-medium border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all"
        >
          Cap Table Simulator
        </Link>
        <Link
          href="/esop-calculator"
          className="inline-flex items-center justify-center rounded-xl h-11 px-6 text-sm font-medium border border-white/10 text-slate-300 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all"
        >
          ESOP Calculator
        </Link>
      </motion.div>

      {/* ---- Stat counters ---- */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-10"
      >
        {STATS.map((stat) => (
          <StatItem key={stat.label} {...stat} />
        ))}
      </motion.div>

      {/* CSS keyframe for background glow pulse */}
      <style jsx global>{`
        @keyframes hero-glow {
          0% { opacity: 0.5; transform: translate(-50%, 0) scale(1); }
          100% { opacity: 1; transform: translate(-50%, 0) scale(1.15); }
        }
      `}</style>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Stat counter sub-component
// ---------------------------------------------------------------------------
function StatItem({ end, suffix, label }: (typeof STATS)[number]) {
  const { value, ref } = useCounter(end)

  return (
    <div className="flex flex-col items-center gap-1">
      <span
        ref={ref}
        className="text-3xl sm:text-4xl font-bold tabular-nums bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent"
      >
        {value.toLocaleString()}
        {suffix}
      </span>
      <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  )
}

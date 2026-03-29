'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Article } from '@/lib/content-types'
import { ArticleCard } from '@/components/learn/article-card'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 + i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

interface Props {
  pillarName: string
  pillarSlug: string
  pillarColor: string
  targetPieces: number
  articles: Article[]
}

export function PillarPageClient({ pillarName, pillarSlug, pillarColor, targetPieces, articles }: Props) {
  return (
    <main className="bg-[oklch(0.985 0.002 260)] min-h-screen">
      {/* Hero */}
      <section className="grain relative isolate w-full flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(1 0 0)] via-[oklch(0.985 0.002 260)] to-[oklch(0.98 0.002 260)]" />
          <div
            className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-[160px] animate-[hero-glow_12s_ease-in-out_infinite_alternate]"
            style={{ backgroundColor: `color-mix(in oklch, ${pillarColor} 8%, transparent)` }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(oklch(0.25 0 0 / 0.3) 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />
        </div>

        {/* Breadcrumb */}
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
          <div className="flex items-center gap-2 text-[11px] text-[oklch(0.50 0.01 260)]">
            <Link href="/learn" className="hover:text-[oklch(0.25 0.02 260)] transition-colors">
              Learn
            </Link>
            <span>/</span>
            <span style={{ color: pillarColor }} className="font-semibold">
              {pillarName}
            </span>
          </div>
        </motion.div>

        {/* Badge */}
        <motion.div custom={0.5} variants={fadeUp} initial="hidden" animate="visible" className="mb-6">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{
              color: pillarColor,
              backgroundColor: `color-mix(in oklch, ${pillarColor} 10%, transparent)`,
              border: `1px solid color-mix(in oklch, ${pillarColor} 25%, transparent)`,
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pillarColor }} />
            {articles.length > 0 ? `${articles.length} articles` : `${targetPieces} planned`}
          </span>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-heading text-[clamp(2.2rem,5vw,4rem)] leading-[1.1] tracking-tight max-w-3xl text-[oklch(0.15 0.02 260)]"
        >
          {pillarName}
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-5 text-base text-[oklch(0.40 0.01 260)] max-w-xl leading-relaxed"
        >
          Data-backed guides written by practitioners. No fluff, no filler — every article adds real value.
        </motion.p>
      </section>

      <div className="section-divider" />

      {/* Articles */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        {articles.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.frontmatter.slug} article={article} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto"
          >
            <div
              className="w-14 h-14 mx-auto mb-5 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: `color-mix(in oklch, ${pillarColor} 12%, transparent)`,
                border: `1px solid color-mix(in oklch, ${pillarColor} 20%, transparent)`,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke={pillarColor}
                strokeWidth={1.5}
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                />
              </svg>
            </div>
            <h2 className="font-heading text-xl text-[oklch(0.15 0.02 260)] mb-2">Coming Soon</h2>
            <p className="text-sm text-[oklch(0.45 0.01 260)] leading-relaxed mb-6">
              {targetPieces} {pillarName.toLowerCase()} guides are being written. Check back soon.
            </p>
            <Link
              href="/learn"
              className="btn-press inline-flex items-center justify-center h-10 px-5 text-sm font-semibold tracking-wide rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024]"
            >
              Browse All Content
            </Link>
          </motion.div>
        )}
      </section>
    </main>
  )
}

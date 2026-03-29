import Link from 'next/link'
import type { Article } from '@/lib/content-types'
import { getPillar } from '@/lib/pillars'

export function ArticleCard({ article }: { article: Article }) {
  const pillar = getPillar(article.frontmatter.pillar)
  const color = pillar?.color || 'oklch(0.62 0.22 330)'

  return (
    <Link
      href={`/learn/${article.frontmatter.pillar}/${article.frontmatter.slug}`}
      className="glass-card card-hover group relative rounded-2xl overflow-hidden block"
    >
      {/* Accent top line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <div className="p-6">
        {/* Pillar badge */}
        <span
          className="inline-block text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-4"
          style={{
            color,
            backgroundColor: `color-mix(in oklch, ${color} 10%, transparent)`,
          }}
        >
          {pillar?.name || article.frontmatter.pillar}
        </span>

        {/* Title */}
        <h3 className="font-heading text-lg text-[oklch(0.15 0.02 260)] leading-snug mb-3 line-clamp-2 group-hover:text-[oklch(0.62 0.22 330)] transition-colors">
          {article.frontmatter.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-[oklch(0.45 0.01 260)] leading-relaxed line-clamp-2 mb-5">
          {article.frontmatter.excerpt}
        </p>

        {/* Meta strip */}
        <div className="flex items-center gap-3 text-[10px] font-bold text-[oklch(0.50 0.01 260)] uppercase tracking-[0.15em]">
          <span>{article.readingTime} min read</span>
          <span className="w-1 h-1 rounded-full bg-[oklch(0.80 0.01 260)]" />
          <span>{article.wordCount.toLocaleString()} words</span>
        </div>
      </div>
    </Link>
  )
}

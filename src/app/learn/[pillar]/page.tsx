import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PILLARS, getArticlesByPillar, getPillar } from '@/lib/content'
import { PillarPageClient } from './pillar-page-client'

export function generateStaticParams() {
  return PILLARS.map((p) => ({ pillar: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ pillar: string }> }): Promise<Metadata> {
  const { pillar: pillarSlug } = await params
  const pillar = getPillar(pillarSlug)
  if (!pillar) return {}

  return {
    title: `${pillar.name} — Learn`,
    description: `Deep-dive guides on ${pillar.name.toLowerCase()} for Indian startup founders. Data-backed, practitioner-written, AEO-optimized.`,
    other: { robots: 'max-image-preview:large' },
  }
}

export default async function PillarPage({ params }: { params: Promise<{ pillar: string }> }) {
  const { pillar: pillarSlug } = await params
  const pillar = getPillar(pillarSlug)
  if (!pillar) notFound()

  const articles = getArticlesByPillar(pillarSlug)

  return (
    <PillarPageClient
      pillarName={pillar.name}
      pillarSlug={pillar.slug}
      pillarColor={pillar.color}
      targetPieces={pillar.pieces}
      articles={articles}
    />
  )
}

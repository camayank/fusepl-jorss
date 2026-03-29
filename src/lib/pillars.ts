export const PILLARS = [
  { slug: 'valuation-finance', name: 'Startup Valuation & Finance', color: 'oklch(0.62 0.22 330)', pieces: 150 },
  { slug: 'fundraising', name: 'Fundraising & Investor Readiness', color: 'oklch(0.68 0.14 250)', pieces: 120 },
  { slug: 'founder-playbooks', name: 'Founder Playbooks', color: 'oklch(0.75 0.18 162)', pieces: 150 },
  { slug: 'startup-stories', name: 'Startup Stories & Case Studies', color: 'oklch(0.78 0.12 80)', pieces: 100 },
  { slug: 'equity', name: 'Cap Table, ESOP & Equity', color: 'oklch(0.72 0.16 300)', pieces: 80 },
  { slug: 'investor-intelligence', name: 'Investor Intelligence', color: 'oklch(0.65 0.16 155)', pieces: 80 },
  { slug: 'sectors', name: 'Sector Deep-Dives', color: 'oklch(0.72 0.14 25)', pieces: 120 },
  { slug: 'startup-india', name: 'Startup India, Grants & Government', color: 'oklch(0.60 0.18 280)', pieces: 60 },
  { slug: 'awards', name: 'Startup Awards & Recognition', color: 'oklch(0.70 0.20 340)', pieces: 40 },
  { slug: 'tools-frameworks', name: 'Interactive Tools & Frameworks', color: 'oklch(0.68 0.16 200)', pieces: 100 },
] as const

export type PillarSlug = (typeof PILLARS)[number]['slug']

export function getPillar(slug: string) {
  return PILLARS.find((p) => p.slug === slug)
}

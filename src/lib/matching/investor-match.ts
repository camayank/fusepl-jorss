import type { Investor, InvestorMatch, StartupCategory, Stage } from '@/types'
import { INVESTORS } from '@/lib/data/investors'
import { getAdjacentSectors } from '@/lib/data/sector-mapping'

/**
 * Investor Matching Algorithm
 * Spec: Investor Matching section
 *
 * Scoring:
 * - Exact sector match: +3
 * - Adjacent sector match: +1
 * - Stage sweet spot: +2
 * - Geographic proximity: +1
 * - Recent sector activity: +1
 */

interface MatchQuery {
  sector: StartupCategory
  stage: Stage
  city: string
  target_raise_cr: number
}

export function matchInvestors(query: MatchQuery): InvestorMatch[] {
  const adjacentSectors = getAdjacentSectors(query.sector)
  const cityNormalized = query.city.toLowerCase().trim()
  const currentYear = new Date().getFullYear()

  // Step 1-3: Pre-filter per spec (stage, sector/adjacent, check size)
  const candidates = INVESTORS.filter(investor => {
    const stageMatch = investor.stages.includes(query.stage)
    const sectorMatch = investor.sectors.includes(query.sector) ||
      adjacentSectors.some(adj => investor.sectors.includes(adj as StartupCategory))
    const sizeMatch = query.target_raise_cr >= investor.check_size_min_cr * 0.5 &&
      query.target_raise_cr <= investor.check_size_max_cr * 2
    return stageMatch && sectorMatch && sizeMatch
  })

  // Step 4: Score filtered candidates
  const scored: InvestorMatch[] = []

  for (const investor of candidates) {
    let score = 0
    const reasons: string[] = []

    // Exact sector match: +3
    if (investor.sectors.includes(query.sector)) {
      score += 3
      reasons.push(`Invests in ${query.sector} sector`)
    }

    // Adjacent sector match: +1 (only if no exact match)
    const hasAdjacent = adjacentSectors.some(adj => investor.sectors.includes(adj as StartupCategory))
    if (hasAdjacent && !investor.sectors.includes(query.sector)) {
      score += 1
      reasons.push('Active in adjacent sector')
    }

    // Stage sweet spot: +2
    if (investor.stages.includes(query.stage)) {
      score += 2
      reasons.push(`Active at ${query.stage.replace('_', ' ')} stage`)
    }

    // Geographic proximity: +1
    const investorCity = investor.city.toLowerCase().trim()
    if (investorCity === cityNormalized ||
        (cityNormalized.includes('bengaluru') && investorCity.includes('bangalore')) ||
        (cityNormalized.includes('bangalore') && investorCity.includes('bengaluru')) ||
        (cityNormalized.includes('gurgaon') && investorCity.includes('gurugram')) ||
        (cityNormalized.includes('gurugram') && investorCity.includes('gurgaon')) ||
        (cityNormalized.includes('delhi') && investorCity.includes('gurgaon')) ||
        (cityNormalized.includes('delhi') && investorCity.includes('gurugram')) ||
        (cityNormalized.includes('delhi') && investorCity.includes('noida'))) {
      score += 1
      reasons.push(`Based in ${investor.city}`)
    }

    // Recent activity in sector: +1 (per spec)
    if (investor.last_active_year >= currentYear - 1 &&
        investor.sectors.includes(query.sector)) {
      score += 1
      reasons.push('Recently active in sector')
    }

    // Check size sweet spot: +1 if raise is within ideal range
    if (query.target_raise_cr >= investor.check_size_min_cr &&
        query.target_raise_cr <= investor.check_size_max_cr) {
      score += 1
      reasons.push(`Check size fits (${investor.check_size_min_cr}-${investor.check_size_max_cr} Cr)`)
    }

    if (score > 0 && reasons.length > 0) {
      scored.push({ investor, score, reasons })
    }
  }

  // Sort by score descending, return top 5
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 5)
}

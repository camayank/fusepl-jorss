import type { DealCheckInput, DealCheckResult, DealVerdict, ComparableCompany } from '@/types'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { COMPARABLE_COMPANIES } from '@/lib/data/comparable-companies'
import { formatINR } from '@/lib/utils'

function computeVerdict(
  askCr: number,
  fairValueCr: number,
): { verdict: DealVerdict; label: string; explanation: string } {
  if (fairValueCr <= 0) {
    return {
      verdict: 'blue',
      label: 'Insufficient Data',
      explanation: 'Cannot compute fair value with provided inputs.',
    }
  }

  const ratio = askCr / fairValueCr

  if (ratio <= 1.1) {
    return {
      verdict: 'green',
      label: 'Fair Price',
      explanation: `Ask of ${formatINR(askCr * 10000000)} is within 10% of computed fair value ${formatINR(fairValueCr * 10000000)}.`,
    }
  }
  if (ratio <= 1.5) {
    return {
      verdict: 'yellow',
      label: 'Slight Premium',
      explanation: `Ask is ${Math.round((ratio - 1) * 100)}% above fair value. Common in competitive rounds.`,
    }
  }
  if (ratio <= 2.5) {
    return {
      verdict: 'red',
      label: 'Significant Premium',
      explanation: `Ask is ${Math.round((ratio - 1) * 100)}% above fair value. Negotiate or seek justification.`,
    }
  }
  return {
    verdict: 'blue',
    label: 'Aspirational',
    explanation: `Ask is ${Math.round((ratio - 1) * 100)}% above fair value. Not supported by fundamentals.`,
  }
}

function findComparables(input: DealCheckInput): ComparableCompany[] {
  // Score each comparable by relevance
  const scored = COMPARABLE_COMPANIES.map((c) => {
    let score = 0
    if (c.sector === input.sector) score += 3
    if (c.stage_at_round === input.stage) score += 2
    if (c.revenue_cr !== null && input.revenue_cr > 0) {
      const revRatio = c.revenue_cr / input.revenue_cr
      if (revRatio >= 0.2 && revRatio <= 5) score += 1
    }
    return { company: c, score }
  })

  return scored
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((s) => s.company)
}

export function computeDealCheck(input: DealCheckInput): DealCheckResult {
  const benchmark = getDamodaranBenchmark(input.sector)
  const sectorMedianMultiple = benchmark?.ev_revenue ?? 5

  // Apply growth premium/discount: >50% growth gets 1.5x multiple, <10% gets 0.7x
  let growthFactor = 1.0
  if (input.growth_pct > 100) growthFactor = 1.8
  else if (input.growth_pct > 50) growthFactor = 1.5
  else if (input.growth_pct > 20) growthFactor = 1.2
  else if (input.growth_pct < 10) growthFactor = 0.7

  const adjustedMultiple = sectorMedianMultiple * growthFactor
  const fairValueCr = input.revenue_cr * adjustedMultiple

  const impliedMultiple = input.revenue_cr > 0
    ? input.ask_cr / input.revenue_cr
    : 0

  const dilutionPct = input.ask_cr > 0
    ? (input.raise_cr / (input.ask_cr + input.raise_cr)) * 100
    : 0

  const { verdict, label, explanation } = computeVerdict(input.ask_cr, fairValueCr)

  const comparables = findComparables(input)

  // Negotiation insight
  let negotiationInsight = ''
  if (verdict === 'green') {
    negotiationInsight = `This valuation is reasonable. At ${impliedMultiple.toFixed(1)}x revenue, it\'s in line with ${input.sector} benchmarks. Proceed with standard diligence.`
  } else if (verdict === 'yellow') {
    negotiationInsight = `Consider negotiating to ${formatINR(fairValueCr * 10000000)} (${sectorMedianMultiple.toFixed(1)}x revenue with growth premium). The ${Math.round(dilutionPct)}% dilution is within normal range.`
  } else if (verdict === 'red') {
    negotiationInsight = `Counter at ${formatINR(fairValueCr * 10000000)}. The implied ${impliedMultiple.toFixed(1)}x revenue multiple is ${Math.round((impliedMultiple / sectorMedianMultiple - 1) * 100)}% above sector median. Ask for milestones or tranched funding.`
  } else {
    negotiationInsight = `This valuation requires significant justification. Sector median for ${input.sector} is ${sectorMedianMultiple.toFixed(1)}x revenue. Consider if strategic value justifies the premium.`
  }

  return {
    verdict,
    label,
    explanation,
    fairValue: fairValueCr * 10000000, // Convert Cr to Rs
    impliedMultiple,
    sectorMedianMultiple,
    dilutionPct,
    comparables,
    negotiationInsight,
  }
}

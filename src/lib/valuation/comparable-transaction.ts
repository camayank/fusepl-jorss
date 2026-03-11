import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { findComparables } from '@/lib/data/comparable-companies'
import { STAGE_BENCHMARKS } from '@/lib/data/sector-benchmarks'

/**
 * Method 5: Comparable Transaction Method
 * Market Approach — IVS 105 precedent transactions
 */
export function calculateComparableTransaction(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const revenueCr = inputs.annual_revenue / 10_000_000
  const comparables = findComparables(inputs.sector, inputs.stage, revenueCr > 0 ? revenueCr : null, 5)

  if (comparables.length === 0) {
    return {
      method: 'comparable_txn', approach: 'market',
      value: 0, confidence: 0,
      details: { reason: 'No comparable companies found' },
      applicable: false,
    }
  }

  const impliedMultiples: number[] = []
  for (const comp of comparables) {
    if (comp.revenue_cr && comp.revenue_cr > 0) {
      impliedMultiples.push(comp.valuation_cr / comp.revenue_cr)
    } else if (comp.last_round_size_cr > 0) {
      impliedMultiples.push(comp.valuation_cr / comp.last_round_size_cr)
    }
  }

  if (impliedMultiples.length === 0) {
    return {
      method: 'comparable_txn', approach: 'market',
      value: STAGE_BENCHMARKS[inputs.stage].typical, confidence: 0.3,
      details: { reason: 'No revenue data in comparables, using stage benchmark', comparables_used: comparables },
      applicable: true,
    }
  }

  impliedMultiples.sort((a, b) => a - b)
  const medianMultiple = impliedMultiples[Math.floor(impliedMultiples.length / 2)]

  let baseValueCr: number
  if (inputs.annual_revenue > 0) {
    baseValueCr = revenueCr * medianMultiple
  } else {
    baseValueCr = STAGE_BENCHMARKS[inputs.stage].typical / 10_000_000
  }

  const comparableMedianRevenue = comparables
    .filter(c => c.revenue_cr && c.revenue_cr > 0)
    .map(c => c.revenue_cr!)
  const medianCompRevenue = comparableMedianRevenue.length > 0
    ? comparableMedianRevenue.sort((a, b) => a - b)[Math.floor(comparableMedianRevenue.length / 2)]
    : 0
  const sizeDiscountApplied = medianCompRevenue > 0 && revenueCr < medianCompRevenue * 0.1
  const sizeDiscount = sizeDiscountApplied ? 0.7 : 1.0

  const valueCr = baseValueCr * sizeDiscount
  const value = valueCr * 10_000_000

  const sectorMatches = comparables.filter(c => c.sector === inputs.sector).length
  let confidence: number
  if (sectorMatches >= 3) confidence = 0.75
  else if (sectorMatches >= 1) confidence = 0.5
  else confidence = 0.3

  return {
    method: 'comparable_txn', approach: 'market',
    value, confidence,
    details: {
      comparables_used: comparables.map(c => ({ name: c.name, sector: c.sector, valuation_cr: c.valuation_cr, revenue_cr: c.revenue_cr })),
      implied_multiples: impliedMultiples,
      median_multiple: medianMultiple,
      size_discount_applied: sizeDiscountApplied,
      size_discount: sizeDiscount,
      sector_matches: sectorMatches,
    },
    applicable: true,
  }
}

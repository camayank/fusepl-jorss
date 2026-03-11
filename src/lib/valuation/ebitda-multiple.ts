import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

const STAGE_DISCOUNT: Record<string, number> = {
  idea: 0.5, pre_seed: 0.5, seed: 0.7, pre_series_a: 0.85,
  series_a: 1.0, series_b: 1.0, series_c_plus: 1.0,
}

/**
 * Method 4: Comparable Company Multiple (EV/EBITDA)
 * Market Approach — Rule 11UA aligned
 */
export function calculateEBITDAMultiple(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  if (inputs.annual_revenue <= 0 || inputs.gross_margin_pct <= 0) {
    return {
      method: 'ebitda_multiple', approach: 'market',
      value: 0, confidence: 0,
      details: { reason: 'Requires revenue and gross margin' },
      applicable: false,
    }
  }

  const benchmark = getDamodaranBenchmark(inputs.sector)
  const estimatedEBITDA = inputs.annual_revenue * (inputs.gross_margin_pct / 100) * MARKET_CONSTANTS.OPERATING_MARGIN_PROXY

  let multiple = benchmark.ev_ebitda ?? 18.0

  // Growth premium
  if (inputs.revenue_growth_pct > 200) multiple += 3.0
  else if (inputs.revenue_growth_pct > 100) multiple += 2.0
  else if (inputs.revenue_growth_pct > 50) multiple += 1.0

  // Stage discount
  multiple *= STAGE_DISCOUNT[inputs.stage] ?? 1.0

  const value = estimatedEBITDA * multiple

  let confidence: number
  if (inputs.annual_revenue > 50_000_000) confidence = 0.8
  else if (inputs.annual_revenue >= 10_000_000) confidence = 0.6
  else confidence = 0.3

  return {
    method: 'ebitda_multiple', approach: 'market',
    value, confidence,
    details: {
      estimated_ebitda: estimatedEBITDA,
      base_multiple: benchmark.ev_ebitda,
      growth_premium: inputs.revenue_growth_pct > 200 ? 3 : inputs.revenue_growth_pct > 100 ? 2 : inputs.revenue_growth_pct > 50 ? 1 : 0,
      stage_discount: STAGE_DISCOUNT[inputs.stage] ?? 1.0,
      final_multiple: multiple,
    },
    applicable: true,
  }
}

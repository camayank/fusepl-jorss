import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

/**
 * Method 3: Revenue Multiple
 * IVS/Rule 11UA alignment: Market Approach
 */
export function calculateRevenueMultiple(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  if (inputs.annual_revenue <= 0) {
    return {
      method: 'revenue_multiple', approach: 'market',
      value: 0, confidence: 0,
      details: { reason: 'Pre-revenue — method not applicable' },
      applicable: false,
    }
  }

  const benchmark = getDamodaranBenchmark(inputs.sector)
  let multiple = benchmark.ev_revenue

  // Growth adjustment
  if (inputs.revenue_growth_pct > 200) multiple += 2.0
  else if (inputs.revenue_growth_pct > 100) multiple += 1.0
  else if (inputs.revenue_growth_pct > 50) multiple += 0.5

  // Business model premium
  const MODEL_PREMIUMS: Record<string, number> = {
    saas_subscription: 1.5,
    marketplace_commission: 1.0,
    transaction_based: 0.5,
  }
  multiple += MODEL_PREMIUMS[inputs.business_model] ?? 0

  // Unit economics bonus
  if (derived.ltv_cac_ratio !== null && derived.ltv_cac_ratio > 5) {
    multiple += 1.0
  }

  const value = inputs.annual_revenue * multiple

  let confidence: number
  if (inputs.annual_revenue > 10_000_000) confidence = 0.9
  else if (inputs.annual_revenue >= 1_000_000) confidence = 0.7
  else confidence = 0.4

  return {
    method: 'revenue_multiple', approach: 'market',
    value, confidence,
    details: {
      base_multiple: benchmark.ev_revenue,
      growth_adjustment: inputs.revenue_growth_pct > 200 ? 2.0 : inputs.revenue_growth_pct > 100 ? 1.0 : inputs.revenue_growth_pct > 50 ? 0.5 : 0,
      model_premium: MODEL_PREMIUMS[inputs.business_model] ?? 0,
      ltv_cac_bonus: derived.ltv_cac_ratio !== null && derived.ltv_cac_ratio > 5 ? 1.0 : 0,
      final_multiple: multiple,
      revenue: inputs.annual_revenue,
    },
    applicable: true,
  }
}

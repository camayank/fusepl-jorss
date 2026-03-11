import type { WizardInputs, MethodResult } from '@/types'

/**
 * Valuation Confidence Score (0-100)
 * Spec: Valuation Methods → Valuation Confidence Score
 *
 * Components:
 * - Data completeness: 0-30 points (+3 per optional field filled)
 * - Method agreement: 0-40 points (based on CV of applicable methods)
 * - Revenue maturity: 0-20 points
 * - Data quality: 0-10 points
 */
export function calculateConfidenceScore(
  inputs: WizardInputs,
  methods: MethodResult[]
): number {
  let score = 0

  // 1. Data completeness: 0-30 points (each optional field = +3, max 30)
  const optionalFields: Array<keyof WizardInputs> = [
    'cac', 'ltv', 'last_round_size', 'last_round_valuation',
    'revenue_concentration_pct', 'international_revenue_pct',
    'esop_pool_pct', 'time_to_liquidity_years', 'target_raise', 'expected_dilution_pct',
  ]
  let filledCount = 0
  for (const field of optionalFields) {
    const val = inputs[field]
    if (val !== null && val !== undefined && val !== 0) {
      filledCount++
    }
  }
  score += Math.min(filledCount * 3, 30)

  // 2. Method agreement: 0-40 points (CV-based)
  const applicableMethods = methods.filter(m => m.applicable && m.value > 0)
  if (applicableMethods.length >= 2) {
    const values = applicableMethods.map(m => m.value)
    const mean = values.reduce((s, v) => s + v, 0) / values.length
    const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length
    const std = Math.sqrt(variance)
    const cv = mean > 0 ? std / mean : 1.0

    if (cv < 0.20) score += 40
    else if (cv < 0.40) score += 25
    else score += 10
  }

  // 3. Revenue maturity: 0-20 points
  if (inputs.annual_revenue > 50_000_000) score += 20        // > Rs 5 Cr
  else if (inputs.annual_revenue >= 10_000_000) score += 15   // Rs 1-5 Cr
  else if (inputs.annual_revenue >= 1_000_000) score += 10    // Rs 10L-1Cr
  else if (inputs.annual_revenue > 0) score += 5              // < Rs 10L
  // Pre-revenue: 0

  // 4. Data quality: 0-10 points (realistic ranges, internal consistency)
  let qualityPoints = 0
  // Gross margin in realistic range (0-95%)
  if (inputs.gross_margin_pct > 0 && inputs.gross_margin_pct <= 95) qualityPoints += 3
  // Revenue growth not impossibly high (< 500%)
  if (inputs.revenue_growth_pct >= 0 && inputs.revenue_growth_pct < 500) qualityPoints += 3
  // TAM in a reasonable range (> Rs 10 Cr)
  if (inputs.tam > 10) qualityPoints += 2
  // Team size > 0
  if (inputs.team_size > 0) qualityPoints += 2
  score += Math.min(qualityPoints, 10)

  return Math.min(score, 100)
}

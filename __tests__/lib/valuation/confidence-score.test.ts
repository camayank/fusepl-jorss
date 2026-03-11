import { describe, it, expect } from 'vitest'
import { calculateConfidenceScore } from '@/lib/valuation/confidence-score'
import type { WizardInputs, MethodResult } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 50_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000,
    cac: 1000, ltv: 5000,
    last_round_size: 20_000_000, last_round_valuation: 100_000_000,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['proprietary_tech'], patents_count: 1,
    strategic_partnerships: 'one', regulatory_risk: 3,
    revenue_concentration_pct: 30, international_revenue_pct: 10,
    esop_pool_pct: 12, time_to_liquidity_years: 4,
    current_cap_table: null, target_raise: 50_000_000, expected_dilution_pct: 20,
    ...overrides,
  } as WizardInputs
}

function makeMethodResults(values: number[], confidences: number[]): MethodResult[] {
  const methods: Array<{ name: MethodResult['method']; approach: MethodResult['approach'] }> = [
    { name: 'revenue_multiple', approach: 'market' },
    { name: 'dcf', approach: 'income' },
    { name: 'scorecard', approach: 'vc_startup' },
    { name: 'berkus', approach: 'vc_startup' },
    { name: 'risk_factor', approach: 'vc_startup' },
  ]
  return values.map((v, i) => ({
    method: methods[i].name,
    approach: methods[i].approach,
    value: v,
    confidence: confidences[i],
    details: {},
    applicable: v > 0,
  }))
}

describe('calculateConfidenceScore', () => {
  it('returns score 0-100', () => {
    const methods = makeMethodResults(
      [100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    )
    const score = calculateConfidenceScore(makeInputs(), methods)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('awards data completeness points for optional fields', () => {
    const allFilled = calculateConfidenceScore(makeInputs(), makeMethodResults(
      [100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    ))
    const sparseInputs = makeInputs({
      cac: null, ltv: null, last_round_size: null, last_round_valuation: null,
      revenue_concentration_pct: null, esop_pool_pct: null,
      time_to_liquidity_years: null, target_raise: null, expected_dilution_pct: null,
    })
    const sparse = calculateConfidenceScore(sparseInputs, makeMethodResults(
      [100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    ))
    expect(allFilled).toBeGreaterThan(sparse)
  })

  it('awards method agreement points for low CV', () => {
    const tight = calculateConfidenceScore(makeInputs(), makeMethodResults(
      [100_000_000, 102_000_000, 98_000_000, 101_000_000, 99_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    ))
    const wide = calculateConfidenceScore(makeInputs(), makeMethodResults(
      [50_000_000, 200_000_000, 80_000_000, 30_000_000, 150_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    ))
    expect(tight).toBeGreaterThan(wide)
  })

  it('awards revenue maturity points', () => {
    const highRev = calculateConfidenceScore(
      makeInputs({ annual_revenue: 60_000_000 }),
      makeMethodResults([100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000], [0.9, 0.85, 0.6, 0.6, 0.65])
    )
    const noRev = calculateConfidenceScore(
      makeInputs({ annual_revenue: 0 }),
      makeMethodResults([100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000], [0.9, 0.85, 0.6, 0.6, 0.65])
    )
    expect(highRev).toBeGreaterThan(noRev)
  })
})

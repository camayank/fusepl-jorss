import { describe, it, expect } from 'vitest'
import { calculateRiskFactor } from '@/lib/valuation/risk-factor'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas_horizontal', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 5000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['brand'], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 10,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateRiskFactor', () => {
  it('returns applicable for all stages', () => {
    const result = calculateRiskFactor(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('risk_factor')
  })

  it('computes 12 risk dimensions', () => {
    const result = calculateRiskFactor(makeInputs(), makeDerived())
    const details = result.details as Record<string, unknown>
    const risks = details.risk_scores as Record<string, number>
    expect(Object.keys(risks)).toHaveLength(12)
    for (const score of Object.values(risks)) {
      expect(score).toBeGreaterThanOrEqual(-2)
      expect(score).toBeLessThanOrEqual(2)
    }
  })

  it('uses stage-based pre-money as base', () => {
    const seed = calculateRiskFactor(makeInputs({ stage: 'seed' }), makeDerived())
    const seriesA = calculateRiskFactor(makeInputs({ stage: 'series_a' }), makeDerived())
    expect(seriesA.value).not.toBe(seed.value)
  })

  it('adjusts by sum × per_factor_adjustment', () => {
    const result = calculateRiskFactor(makeInputs({ stage: 'seed' }), makeDerived())
    const details = result.details as Record<string, unknown>
    const riskSum = details.risk_sum as number
    const adjustment = details.total_adjustment as number
    // Seed per-factor = Rs 40L = 4M
    expect(adjustment).toBe(riskSum * 4_000_000)
  })

  it('floors at VALUATION_FLOOR (Rs 10 L)', () => {
    const result = calculateRiskFactor(makeInputs({
      stage: 'idea', founder_experience: 1, domain_expertise: 1,
      dev_stage: 'idea', regulatory_risk: 5, revenue_growth_pct: 0,
      competition_level: 5, tam: 50, annual_revenue: 0,
      competitive_advantages: ['none'], patents_count: 0,
    }), makeDerived({ runway_months: 1, has_patents: false }))
    expect(result.value).toBeGreaterThanOrEqual(1_000_000) // Rs 10 L
  })

  it('gives positive scores for strong factors', () => {
    const result = calculateRiskFactor(makeInputs({
      founder_experience: 5, domain_expertise: 5, previous_exits: true,
      dev_stage: 'scaling', regulatory_risk: 1, revenue_growth_pct: 300,
      competition_level: 1, tam: 50000, business_model: 'saas_subscription',
    }), makeDerived({ runway_months: 24, has_patents: true }))
    const details = result.details as Record<string, unknown>
    const riskSum = details.risk_sum as number
    expect(riskSum).toBeGreaterThan(0)
  })

  it('sets confidence 0.65 for all stages', () => {
    const idea = calculateRiskFactor(makeInputs({ stage: 'idea' }), makeDerived())
    const seriesB = calculateRiskFactor(makeInputs({ stage: 'series_b' }), makeDerived())
    expect(idea.confidence).toBe(0.65)
    expect(seriesB.confidence).toBe(0.65)
  })

  it('gives software sectors auto +1 for manufacturing risk', () => {
    const saas = calculateRiskFactor(makeInputs({ sector: 'saas_horizontal' }), makeDerived())
    const details = saas.details as Record<string, unknown>
    const risks = details.risk_scores as Record<string, number>
    expect(risks.manufacturing).toBe(1)
  })

  it('gives brand advantage +1 for reputation risk', () => {
    const withBrand = calculateRiskFactor(
      makeInputs({ competitive_advantages: ['brand'] }),
      makeDerived()
    )
    const withoutBrand = calculateRiskFactor(
      makeInputs({ competitive_advantages: [] }),
      makeDerived()
    )
    const brandRisks = (withBrand.details as Record<string, unknown>).risk_scores as Record<string, number>
    const noBrandRisks = (withoutBrand.details as Record<string, unknown>).risk_scores as Record<string, number>
    expect(brandRisks.reputation).toBe(1)
    expect(noBrandRisks.reputation).toBe(0)
  })
})

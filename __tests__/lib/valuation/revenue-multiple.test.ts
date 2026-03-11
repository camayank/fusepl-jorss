import { describe, it, expect } from 'vitest'
import { calculateRevenueMultiple } from '@/lib/valuation/revenue-multiple'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 100, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return { runway_months: 12, ltv_cac_ratio: null, has_patents: false, default_esop_pct: 12, startup_volatility: 0.50, ...overrides }
}

describe('calculateRevenueMultiple', () => {
  it('returns not applicable for pre-revenue', () => {
    const result = calculateRevenueMultiple(makeInputs({ annual_revenue: 0 }), makeDerived())
    expect(result.applicable).toBe(false)
    expect(result.value).toBe(0)
  })

  it('calculates valuation for SaaS with >100% growth', () => {
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 10_000_000, revenue_growth_pct: 120, business_model: 'saas_subscription' }),
      makeDerived()
    )
    expect(result.applicable).toBe(true)
    expect(result.value).toBeCloseTo(107_000_000, -5)
  })

  it('adds growth adjustment +2x for >200% growth', () => {
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 10_000_000, revenue_growth_pct: 250, business_model: 'saas_subscription' }),
      makeDerived()
    )
    expect(result.value).toBeCloseTo(117_000_000, -5)
  })

  it('adds LTV/CAC bonus when ratio > 5', () => {
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 10_000_000, revenue_growth_pct: 60, business_model: 'saas_subscription' }),
      makeDerived({ ltv_cac_ratio: 6 })
    )
    expect(result.value).toBeCloseTo(112_000_000, -5)
  })

  it('sets high confidence for revenue > Rs 1 Cr', () => {
    const result = calculateRevenueMultiple(makeInputs({ annual_revenue: 20_000_000 }), makeDerived())
    expect(result.confidence).toBe(0.9)
  })

  it('sets medium confidence for revenue Rs 10L-1Cr', () => {
    const result = calculateRevenueMultiple(makeInputs({ annual_revenue: 5_000_000 }), makeDerived())
    expect(result.confidence).toBe(0.7)
  })

  it('sets low confidence for revenue < Rs 10L', () => {
    const result = calculateRevenueMultiple(makeInputs({ annual_revenue: 500_000 }), makeDerived())
    expect(result.confidence).toBe(0.4)
  })

  it('adds marketplace premium +1x', () => {
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 10_000_000, revenue_growth_pct: 0, business_model: 'marketplace_commission', sector: 'marketplace' }),
      makeDerived()
    )
    expect(result.value).toBeCloseTo(75_000_000, -5)
  })
})

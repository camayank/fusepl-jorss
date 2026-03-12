import { describe, it, expect } from 'vitest'
import { calculateEBITDAMultiple } from '@/lib/valuation/ebitda-multiple'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas_horizontal', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 50_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
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

describe('calculateEBITDAMultiple', () => {
  it('returns not applicable for pre-revenue', () => {
    expect(calculateEBITDAMultiple(makeInputs({ annual_revenue: 0 }), makeDerived()).applicable).toBe(false)
  })

  it('returns not applicable when gross margin is 0', () => {
    expect(calculateEBITDAMultiple(makeInputs({ gross_margin_pct: 0 }), makeDerived()).applicable).toBe(false)
  })

  it('calculates EV from estimated EBITDA × Damodaran multiple', () => {
    const result = calculateEBITDAMultiple(
      makeInputs({ annual_revenue: 50_000_000, gross_margin_pct: 70, revenue_growth_pct: 0, stage: 'series_a' }),
      makeDerived()
    )
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('ebitda_multiple')
    expect(result.value).toBeGreaterThan(0)
  })

  it('adds growth premium for high-growth companies', () => {
    const noGrowth = calculateEBITDAMultiple(makeInputs({ revenue_growth_pct: 0, stage: 'series_a' }), makeDerived())
    const highGrowth = calculateEBITDAMultiple(makeInputs({ revenue_growth_pct: 150, stage: 'series_a' }), makeDerived())
    expect(highGrowth.value).toBeGreaterThan(noGrowth.value)
  })

  it('applies stage discount for early-stage', () => {
    const seed = calculateEBITDAMultiple(makeInputs({ stage: 'seed' }), makeDerived())
    const seriesA = calculateEBITDAMultiple(makeInputs({ stage: 'series_a' }), makeDerived())
    expect(seriesA.value).toBeGreaterThan(seed.value)
  })

  it('sets confidence based on revenue', () => {
    expect(calculateEBITDAMultiple(makeInputs({ annual_revenue: 60_000_000 }), makeDerived()).confidence).toBe(0.8)
    expect(calculateEBITDAMultiple(makeInputs({ annual_revenue: 5_000_000 }), makeDerived()).confidence).toBe(0.3)
  })
})

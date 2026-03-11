import { describe, it, expect } from 'vitest'
import { calculateDCF } from '@/lib/valuation/dcf'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
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
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateDCF', () => {
  it('returns applicable result for revenue companies', () => {
    const result = calculateDCF(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('dcf')
    expect(result.value).toBeGreaterThan(0)
  })

  it('uses sector median as proxy for pre-revenue with low confidence', () => {
    const result = calculateDCF(makeInputs({ annual_revenue: 0 }), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.confidence).toBe(0.3)
    expect(result.value).toBeGreaterThan(0)
  })

  it('projects 5 years of revenue with decaying growth', () => {
    const result = calculateDCF(makeInputs({ annual_revenue: 50_000_000, revenue_growth_pct: 80 }), makeDerived())
    const details = result.details as Record<string, unknown>
    expect(details.projected_revenues).toBeDefined()
    const revenues = details.projected_revenues as number[]
    expect(revenues).toHaveLength(5)
    expect(revenues[0]).toBeCloseTo(90_000_000, -5)
    expect(revenues[1]).toBeGreaterThan(revenues[0])
  })

  it('computes FCF from revenue × margin × 0.75 × (1-tax)', () => {
    const result = calculateDCF(
      makeInputs({ annual_revenue: 100_000_000, revenue_growth_pct: 50, gross_margin_pct: 60 }),
      makeDerived()
    )
    const details = result.details as Record<string, unknown>
    const fcfs = details.projected_fcfs as number[]
    expect(fcfs[0]).toBeCloseTo(50_625_000, -4)
  })

  it('caps terminal growth at GDP_GROWTH_CAP (5.5%)', () => {
    const result = calculateDCF(makeInputs(), makeDerived())
    const details = result.details as Record<string, unknown>
    expect(details.terminal_growth).toBe(0.055)
  })

  it('prevents WACC <= terminal growth', () => {
    const result = calculateDCF(makeInputs(), makeDerived())
    expect(result.value).toBeGreaterThan(0)
    expect(isFinite(result.value)).toBe(true)
  })

  it('sets confidence 0.85 for revenue > Rs 5 Cr', () => {
    const result = calculateDCF(makeInputs({ annual_revenue: 60_000_000 }), makeDerived())
    expect(result.confidence).toBe(0.85)
  })

  it('sets confidence 0.6 for revenue Rs 1-5 Cr', () => {
    const result = calculateDCF(makeInputs({ annual_revenue: 30_000_000 }), makeDerived())
    expect(result.confidence).toBe(0.6)
  })
})

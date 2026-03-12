import { describe, it, expect } from 'vitest'
import { calculateComparableTransaction } from '@/lib/valuation/comparable-transaction'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas_horizontal', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 30_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
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

describe('calculateComparableTransaction', () => {
  it('returns applicable result', () => {
    const result = calculateComparableTransaction(makeInputs({ sector: 'saas_horizontal' }), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('comparable_txn')
    expect(result.approach).toBe('market')
    expect(result.value).toBeGreaterThan(0)
  })

  it('uses comparables from database', () => {
    const result = calculateComparableTransaction(makeInputs({ sector: 'saas_horizontal' }), makeDerived())
    const details = result.details as Record<string, unknown>
    expect(details.comparables_used).toBeDefined()
    expect((details.comparables_used as Array<unknown>).length).toBeGreaterThanOrEqual(1)
  })

  it('applies size discount for much smaller companies', () => {
    const result = calculateComparableTransaction(makeInputs({ annual_revenue: 30_000_000, sector: 'saas_horizontal' }), makeDerived())
    const details = result.details as Record<string, unknown>
    expect(details.size_discount_applied).toBe(true)
  })

  it('sets higher confidence with more sector matches', () => {
    const saas = calculateComparableTransaction(makeInputs({ sector: 'saas_horizontal' }), makeDerived())
    expect(saas.confidence).toBeGreaterThanOrEqual(0.5)
  })

  it('falls back to cross-sector when no sector match', () => {
    const result = calculateComparableTransaction(makeInputs({ sector: 'social_impact' }), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.confidence).toBeLessThanOrEqual(0.5)
  })
})

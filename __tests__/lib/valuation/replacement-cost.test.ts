import { describe, it, expect } from 'vitest'
import { calculateReplacementCost } from '@/lib/valuation/replacement-cost'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 10, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: 5000, ltv: null,
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

describe('calculateReplacementCost', () => {
  it('returns applicable for all stages', () => {
    const result = calculateReplacementCost(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('replacement_cost')
    expect(result.approach).toBe('asset_cost')
  })

  it('includes team replacement cost based on team_size × years × avg_cost', () => {
    const small = calculateReplacementCost(makeInputs({ team_size: 5, founding_year: 2024, annual_revenue: 0 }), makeDerived())
    const large = calculateReplacementCost(makeInputs({ team_size: 20, founding_year: 2024, annual_revenue: 0 }), makeDerived())
    expect(large.value).toBeGreaterThan(small.value)
  })

  it('accounts for years of operation', () => {
    const young = calculateReplacementCost(makeInputs({ founding_year: 2025 }), makeDerived())
    const old = calculateReplacementCost(makeInputs({ founding_year: 2020 }), makeDerived())
    expect(old.value).toBeGreaterThan(young.value)
  })

  it('includes technology development cost based on dev_stage', () => {
    const idea = calculateReplacementCost(makeInputs({ dev_stage: 'idea' }), makeDerived())
    const scaling = calculateReplacementCost(makeInputs({ dev_stage: 'scaling' }), makeDerived())
    expect(scaling.value).toBeGreaterThan(idea.value)
  })

  it('uses provided CAC for customer acquisition cost', () => {
    const withCAC = calculateReplacementCost(makeInputs({ cac: 5000, annual_revenue: 10_000_000 }), makeDerived())
    const noCAC = calculateReplacementCost(makeInputs({ cac: null, annual_revenue: 10_000_000 }), makeDerived())
    expect(withCAC.value).toBeGreaterThan(0)
    expect(noCAC.value).toBeGreaterThan(0)
  })

  it('sets confidence 0.5 for early stage, 0.3 for later', () => {
    const seed = calculateReplacementCost(makeInputs({ stage: 'seed' }), makeDerived())
    const seriesB = calculateReplacementCost(makeInputs({ stage: 'series_b' }), makeDerived())
    expect(seed.confidence).toBe(0.5)
    expect(seriesB.confidence).toBe(0.3)
  })
})

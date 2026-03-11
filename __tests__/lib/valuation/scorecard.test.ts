import { describe, it, expect } from 'vitest'
import { calculateScorecard } from '@/lib/valuation/scorecard'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 5000, dev_stage: 'mvp', competition_level: 3,
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

describe('calculateScorecard', () => {
  it('returns applicable for all stages', () => {
    const result = calculateScorecard(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('scorecard')
  })

  it('uses stage-based pre-money as base', () => {
    const resultSeed = calculateScorecard(makeInputs({ stage: 'seed' }), makeDerived())
    const resultA = calculateScorecard(makeInputs({ stage: 'series_a' }), makeDerived())
    expect(resultA.value).toBeGreaterThan(resultSeed.value)
  })

  it('clamps each factor score to 50-150% range', () => {
    const result = calculateScorecard(makeInputs({
      founder_experience: 5, domain_expertise: 5, previous_exits: true,
      technical_cofounder: true, tam: 50000, dev_stage: 'scaling',
      competition_level: 1, revenue_growth_pct: 300, city: 'Bangalore',
    }), makeDerived({ runway_months: 24 }))

    const details = result.details as Record<string, unknown>
    const factors = details.factor_scores as Record<string, number>
    for (const score of Object.values(factors)) {
      expect(score).toBeLessThanOrEqual(1.5)
      expect(score).toBeGreaterThanOrEqual(0.5)
    }
  })

  it('gives exits bonus to management team score', () => {
    const withoutExits = calculateScorecard(makeInputs({ previous_exits: false }), makeDerived())
    const withExits = calculateScorecard(makeInputs({ previous_exits: true }), makeDerived())
    expect(withExits.value).toBeGreaterThan(withoutExits.value)
  })

  it('maps TAM to market opportunity score', () => {
    const lowTAM = calculateScorecard(makeInputs({ tam: 50 }), makeDerived())
    const highTAM = calculateScorecard(makeInputs({ tam: 20000 }), makeDerived())
    expect(highTAM.value).toBeGreaterThan(lowTAM.value)
  })

  it('maps dev_stage to product/technology score', () => {
    const idea = calculateScorecard(makeInputs({ dev_stage: 'idea' }), makeDerived())
    const scaling = calculateScorecard(makeInputs({ dev_stage: 'scaling' }), makeDerived())
    expect(scaling.value).toBeGreaterThan(idea.value)
  })

  it('sets confidence 0.7 for pre-revenue', () => {
    const result = calculateScorecard(makeInputs({ annual_revenue: 0 }), makeDerived())
    expect(result.confidence).toBe(0.7)
  })

  it('sets confidence 0.5 for idea stage', () => {
    const result = calculateScorecard(
      makeInputs({ stage: 'idea', dev_stage: 'idea', annual_revenue: 0 }),
      makeDerived()
    )
    expect(result.confidence).toBe(0.5)
  })

  it('sets confidence 0.6 for revenue companies', () => {
    const result = calculateScorecard(makeInputs({ annual_revenue: 10_000_000, stage: 'seed' }), makeDerived())
    expect(result.confidence).toBe(0.6)
  })

  it('gives metro city bonus', () => {
    const metro = calculateScorecard(makeInputs({ city: 'Bangalore' }), makeDerived())
    const nonMetro = calculateScorecard(makeInputs({ city: 'Jaipur' }), makeDerived())
    expect(metro.value).toBeGreaterThan(nonMetro.value)
  })
})

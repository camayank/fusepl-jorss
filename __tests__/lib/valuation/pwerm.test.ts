import { describe, it, expect } from 'vitest'
import { calculatePWERM } from '@/lib/valuation/pwerm'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas_horizontal', stage: 'seed',
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
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculatePWERM', () => {
  it('returns applicable for all stages', () => {
    const result = calculatePWERM(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('pwerm')
    expect(result.approach).toBe('income')
  })

  it('computes 4 scenarios: bull, base, bear, failure', () => {
    const result = calculatePWERM(makeInputs(), makeDerived())
    const details = result.details as Record<string, unknown>
    const scenarios = details.scenarios as Array<{ name: string; probability: number; exit_value: number }>
    expect(scenarios).toHaveLength(4)
    expect(scenarios.map(s => s.name)).toEqual(['bull', 'base', 'bear', 'failure'])
  })

  it('failure scenario always has value 0', () => {
    const result = calculatePWERM(makeInputs(), makeDerived())
    const details = result.details as Record<string, unknown>
    const scenarios = details.scenarios as Array<{ name: string; exit_value: number }>
    const failure = scenarios.find(s => s.name === 'failure')!
    expect(failure.exit_value).toBe(0)
  })

  it('probabilities sum to 100%', () => {
    for (const stage of ['idea', 'seed', 'series_a', 'series_c_plus'] as const) {
      const result = calculatePWERM(makeInputs({ stage }), makeDerived())
      const details = result.details as Record<string, unknown>
      const scenarios = details.scenarios as Array<{ probability: number }>
      const total = scenarios.reduce((sum, s) => sum + s.probability, 0)
      expect(total).toBeCloseTo(1.0, 1)
    }
  })

  it('idea stage has highest failure probability', () => {
    const idea = calculatePWERM(makeInputs({ stage: 'idea', annual_revenue: 0 }), makeDerived())
    const seriesA = calculatePWERM(makeInputs({ stage: 'series_a' }), makeDerived())
    const ideaScenarios = (idea.details as Record<string, unknown>).scenarios as Array<{ name: string; probability: number }>
    const saScenarios = (seriesA.details as Record<string, unknown>).scenarios as Array<{ name: string; probability: number }>
    expect(ideaScenarios.find(s => s.name === 'failure')!.probability).toBeGreaterThan(saScenarios.find(s => s.name === 'failure')!.probability)
  })

  it('later stages have higher bull probability', () => {
    const seed = calculatePWERM(makeInputs({ stage: 'seed' }), makeDerived())
    const seriesB = calculatePWERM(makeInputs({ stage: 'series_b' }), makeDerived())
    const seedBull = ((seed.details as Record<string, unknown>).scenarios as Array<{ name: string; probability: number }>).find(s => s.name === 'bull')!.probability
    const sbBull = ((seriesB.details as Record<string, unknown>).scenarios as Array<{ name: string; probability: number }>).find(s => s.name === 'bull')!.probability
    expect(sbBull).toBeGreaterThan(seedBull)
  })

  it('value > 0 for revenue companies', () => {
    const result = calculatePWERM(makeInputs({ annual_revenue: 50_000_000 }), makeDerived())
    expect(result.value).toBeGreaterThan(0)
  })

  it('sets confidence 0.7 for revenue > Rs 1 Cr', () => {
    const result = calculatePWERM(makeInputs({ annual_revenue: 20_000_000 }), makeDerived())
    expect(result.confidence).toBe(0.7)
  })

  it('sets confidence 0.4 for idea stage', () => {
    const result = calculatePWERM(makeInputs({ stage: 'idea', annual_revenue: 0 }), makeDerived())
    expect(result.confidence).toBe(0.4)
  })
})

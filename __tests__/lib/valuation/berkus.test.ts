import { describe, it, expect } from 'vitest'
import { calculateBerkus } from '@/lib/valuation/berkus'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 4, domain_expertise: 4,
    previous_exits: true, technical_cofounder: true, key_hires: ['cto'],
    annual_revenue: 0, revenue_growth_pct: 0, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 5000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['proprietary_tech'], patents_count: 1,
    strategic_partnerships: 'one', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: true,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateBerkus', () => {
  it('calculates 5 milestones with max Rs 1 Cr each', () => {
    const result = calculateBerkus(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('berkus')
    const details = result.details as Record<string, unknown>
    const milestones = details.milestones as Record<string, number>
    expect(Object.keys(milestones)).toHaveLength(5)
    for (const val of Object.values(milestones)) {
      expect(val).toBeLessThanOrEqual(10_000_000)
      expect(val).toBeGreaterThanOrEqual(0)
    }
  })

  it('caps pre-revenue valuation at Rs 5 Cr', () => {
    const result = calculateBerkus(makeInputs({
      annual_revenue: 0, tam: 50000, dev_stage: 'scaling',
      founder_experience: 5, domain_expertise: 5, previous_exits: true,
      technical_cofounder: true, patents_count: 3,
      strategic_partnerships: 'multiple', key_hires: ['cto', 'cfo', 'sales_lead'],
    }), makeDerived({ has_patents: true }))
    expect(result.value).toBeLessThanOrEqual(50_000_000) // Rs 5 Cr
  })

  it('maps TAM to sound idea score', () => {
    const lowTAM = calculateBerkus(makeInputs({ tam: 50 }), makeDerived())
    const highTAM = calculateBerkus(makeInputs({ tam: 50000 }), makeDerived())
    expect(highTAM.value).toBeGreaterThan(lowTAM.value)
  })

  it('maps dev_stage to prototype/technology score', () => {
    const idea = calculateBerkus(makeInputs({ dev_stage: 'idea' }), makeDerived())
    const production = calculateBerkus(makeInputs({ dev_stage: 'production' }), makeDerived())
    expect(production.value).toBeGreaterThan(idea.value)
  })

  it('adds patent bonus: 1 patent = +15%, 2+ = +20%', () => {
    const noPat = calculateBerkus(makeInputs({ patents_count: 0 }), makeDerived({ has_patents: false }))
    const onePat = calculateBerkus(makeInputs({ patents_count: 1 }), makeDerived({ has_patents: true }))
    const twoPat = calculateBerkus(makeInputs({ patents_count: 2 }), makeDerived({ has_patents: true }))
    expect(onePat.value).toBeGreaterThan(noPat.value)
    expect(twoPat.value).toBeGreaterThan(onePat.value)
  })

  it('maps revenue to product rollout/sales milestone', () => {
    const noRev = calculateBerkus(makeInputs({ annual_revenue: 0 }), makeDerived())
    const goodRev = calculateBerkus(makeInputs({ annual_revenue: 20_000_000, revenue_growth_pct: 150 }), makeDerived())
    expect(goodRev.value).toBeGreaterThan(noRev.value)
  })

  it('sets confidence 0.8 for Idea/Pre-seed stages', () => {
    const result = calculateBerkus(makeInputs({ stage: 'idea' }), makeDerived())
    expect(result.confidence).toBe(0.8)
  })

  it('sets confidence 0.6 for Seed stage', () => {
    const result = calculateBerkus(makeInputs({ stage: 'seed' }), makeDerived())
    expect(result.confidence).toBe(0.6)
  })

  it('sets confidence 0.3 for later stages', () => {
    const result = calculateBerkus(makeInputs({ stage: 'series_a' }), makeDerived())
    expect(result.confidence).toBe(0.3)
  })
})

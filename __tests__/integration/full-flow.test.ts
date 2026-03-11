import { describe, it, expect } from 'vitest'
import { calculateValuation } from '@/lib/valuation'
import { calculateESOPValue } from '@/lib/calculators/esop-valuation'
import { simulateRound } from '@/lib/calculators/cap-table'
import { matchInvestors } from '@/lib/matching/investor-match'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'
import { formatINR } from '@/lib/utils'
import type { WizardInputs, StartupCategory } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'TestCo', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 4, domain_expertise: 4,
    previous_exits: false, technical_cofounder: true, key_hires: ['cto'],
    annual_revenue: 10_000_000, revenue_growth_pct: 100, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000,
    cac: 5000, ltv: 50000, last_round_size: null, last_round_valuation: null,
    tam: 5000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['proprietary_tech'], patents_count: 1,
    strategic_partnerships: 'one', regulatory_risk: 2,
    revenue_concentration_pct: null, international_revenue_pct: 10,
    esop_pool_pct: 12, time_to_liquidity_years: 4,
    current_cap_table: null, target_raise: 50_000_000, expected_dilution_pct: 20,
    ...overrides,
  }
}

describe('Full Valuation Flow', () => {
  it('computes valuation for a seed SaaS startup', () => {
    const inputs = makeInputs()
    const result = calculateValuation(inputs)

    // Should have multiple methods
    expect(result.methods.length).toBeGreaterThan(0)
    expect(result.methods.some(m => m.applicable)).toBe(true)

    // Composite should be positive
    expect(result.composite_value).toBeGreaterThan(0)
    expect(result.composite_low).toBeGreaterThan(0)
    expect(result.composite_high).toBeGreaterThanOrEqual(result.composite_low)

    // Confidence score 0-100
    expect(result.confidence_score).toBeGreaterThanOrEqual(0)
    expect(result.confidence_score).toBeLessThanOrEqual(100)

    // IBC recovery present
    expect(result.ibc_recovery_range).toBeDefined()
  })

  it('computes valuation for a pre-revenue idea-stage startup', () => {
    const inputs = makeInputs({
      stage: 'idea', annual_revenue: 0, revenue_growth_pct: 0,
      gross_margin_pct: 0, dev_stage: 'idea',
    })
    const result = calculateValuation(inputs)

    expect(result.composite_value).toBeGreaterThan(0)
    // Pre-revenue should still produce applicable methods
    const applicable = result.methods.filter(m => m.applicable)
    expect(applicable.length).toBeGreaterThanOrEqual(3) // At least NAV + Scorecard + Berkus
  })

  it('ESOP calculation produces valid sensitivity', () => {
    const benchmark = getDamodaranBenchmark('saas')
    const volatility = Math.min(0.80, Math.max(0.40, benchmark.beta * 0.25))

    const esop = calculateESOPValue({
      valuation: 100_000_000,
      total_shares: 1_000_000,
      esop_pool_pct: 10,
      exercise_price: 10,
      time_to_liquidity: 4,
      volatility,
      risk_free_rate: 0.07,
    })

    expect(esop.value_per_share).toBeGreaterThan(0)
    expect(esop.return_multiple).toBeGreaterThan(1)
    // Black-Scholes: higher volatility + longer time = higher option value
    // So conservative (higher vol, longer time) may exceed optimistic (lower vol, shorter time)
    // We just verify all three scenarios produce positive values
    expect(esop.sensitivity.conservative.value).toBeGreaterThan(0)
    expect(esop.sensitivity.base.value).toBeGreaterThan(0)
    expect(esop.sensitivity.optimistic.value).toBeGreaterThan(0)
  })

  it('cap table simulation preserves total ownership', () => {
    const capTable = [
      { name: 'Founders', percentage: 70, share_class: 'common' as const },
      { name: 'ESOP', percentage: 10, share_class: 'esop' as const },
      { name: 'Angels', percentage: 20, share_class: 'preference' as const },
    ]

    const result = simulateRound(capTable, {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 5,
      esop_timing: 'pre_round',
    })
    const total = result.shareholders.reduce((sum, e) => sum + e.percentage, 0)
    expect(Math.abs(total - 100)).toBeLessThan(0.01)
  })

  it('investor matching returns sorted results', () => {
    const matches = matchInvestors({
      sector: 'saas',
      stage: 'seed',
      city: 'Bangalore',
      target_raise_cr: 5,
    })
    expect(matches.length).toBeGreaterThan(0)
    expect(matches.length).toBeLessThanOrEqual(5)

    // Should be sorted by score descending
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].score).toBeGreaterThanOrEqual(matches[i].score)
    }
  })

  it('Damodaran benchmark lookup works for all sectors', () => {
    const sectors: StartupCategory[] = ['saas', 'fintech_payments', 'healthtech_products', 'd2c', 'edtech']
    for (const sector of sectors) {
      const benchmark = getDamodaranBenchmark(sector)
      expect(benchmark).toBeDefined()
      expect(benchmark.beta).toBeGreaterThan(0)
      expect(benchmark.wacc).toBeGreaterThan(0)
    }
  })

  it('IBC recovery data exists for key sectors', () => {
    const sectors: StartupCategory[] = ['saas', 'fintech_payments', 'd2c', 'edtech']
    for (const sector of sectors) {
      const recovery = getIBCRecovery(sector)
      expect(recovery).toBeDefined()
      expect(recovery.p25).toBeGreaterThanOrEqual(0)
      expect(recovery.p75).toBeLessThanOrEqual(100)
    }
  })

  it('formatINR handles edge cases', () => {
    expect(formatINR(0)).toBe('Rs 0')
    expect(formatINR(500_000)).toBe('Rs 5 L')
    expect(formatINR(10_000_000)).toBe('Rs 1.0 Cr')
    expect(formatINR(1_250_000_000)).toBe('Rs 125.0 Cr')
  })
})

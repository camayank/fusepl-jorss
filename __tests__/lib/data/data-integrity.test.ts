import { describe, it, expect } from 'vitest'
import { STAGE_BENCHMARKS, RISK_FACTOR_ADJUSTMENT, BERKUS_MILESTONE_MAX, VALUATION_FLOOR } from '@/lib/data/sector-benchmarks'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'
import { findComparables, COMPARABLE_COMPANIES } from '@/lib/data/comparable-companies'
import { INVESTORS } from '@/lib/data/investors'
import { STAGES, STARTUP_CATEGORIES } from '@/types'

describe('sector-benchmarks', () => {
  it('has benchmarks for all 7 stages', () => {
    for (const stage of STAGES) {
      expect(STAGE_BENCHMARKS[stage]).toBeDefined()
      expect(STAGE_BENCHMARKS[stage].typical).toBeGreaterThan(0)
      expect(STAGE_BENCHMARKS[stage].low).toBeLessThan(STAGE_BENCHMARKS[stage].typical)
      expect(STAGE_BENCHMARKS[stage].high).toBeGreaterThan(STAGE_BENCHMARKS[stage].typical)
    }
  })

  it('has risk factor adjustments for all 7 stages', () => {
    for (const stage of STAGES) {
      expect(RISK_FACTOR_ADJUSTMENT[stage]).toBeDefined()
      expect(RISK_FACTOR_ADJUSTMENT[stage]).toBeGreaterThan(0)
    }
  })

  it('Berkus max is Rs 1 Cr', () => {
    expect(BERKUS_MILESTONE_MAX).toBe(10_000_000)
  })
})

describe('ibc-recovery', () => {
  it('returns recovery data for all startup categories', () => {
    for (const cat of STARTUP_CATEGORIES) {
      const recovery = getIBCRecovery(cat)
      expect(recovery).toBeDefined()
      expect(recovery.avg_low).toBeGreaterThanOrEqual(0)
      expect(recovery.avg_high).toBeGreaterThan(recovery.avg_low)
    }
  })
})

describe('comparable-companies', () => {
  it('has at least 25 companies', () => {
    expect(COMPARABLE_COMPANIES.length).toBeGreaterThanOrEqual(25)
  })

  it('findComparables returns up to 5 results', () => {
    const results = findComparables('saas_horizontal', 'series_a', 300)
    expect(results.length).toBeLessThanOrEqual(5)
    expect(results.length).toBeGreaterThan(0)
  })

  it('findComparables prefers same sector', () => {
    const results = findComparables('fintech_payments', 'series_b', null)
    const sameSector = results.filter(r => r.sector === 'fintech_payments')
    expect(sameSector.length).toBeGreaterThan(0)
  })
})

describe('investors', () => {
  it('has at least 15 investors', () => {
    expect(INVESTORS.length).toBeGreaterThanOrEqual(15)
  })

  it('each investor has required fields', () => {
    for (const inv of INVESTORS) {
      expect(inv.name).toBeTruthy()
      expect(inv.sectors.length).toBeGreaterThan(0)
      expect(inv.stages.length).toBeGreaterThan(0)
      expect(inv.check_size_max_cr).toBeGreaterThan(inv.check_size_min_cr)
    }
  })
})

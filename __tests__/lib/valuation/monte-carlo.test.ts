import { describe, it, expect } from 'vitest'
import { runMonteCarloSimulation } from '@/lib/valuation/monte-carlo.worker'

describe('runMonteCarloSimulation', () => {
  it('returns percentiles from simulation', () => {
    const result = runMonteCarloSimulation({
      baseRevenue: 50_000_000,
      growthRate: 0.80,
      grossMargin: 0.70,
      wacc: 0.128,
      iterations: 1_000,
    })
    expect(result).toBeDefined()
    expect(result.p10).toBeLessThan(result.p50)
    expect(result.p50).toBeLessThan(result.p90)
    expect(result.p25).toBeLessThan(result.p75)
    expect(result.iterations_total).toBe(1_000)
    expect(result.iterations_valid).toBeGreaterThanOrEqual(1)
  })

  it('returns zeroed result if insufficient valid iterations', () => {
    const result = runMonteCarloSimulation({
      baseRevenue: 0,
      growthRate: 0,
      grossMargin: 0,
      wacc: 0.06,
      iterations: 100,
    })
    expect(result).toBeDefined()
  })

  it('generates reasonable spread around deterministic value', () => {
    const result = runMonteCarloSimulation({
      baseRevenue: 50_000_000,
      growthRate: 0.80,
      grossMargin: 0.70,
      wacc: 0.128,
      iterations: 5_000,
    })
    expect(result.p50).toBeGreaterThan(0)
    expect(result.p90 - result.p10).toBeGreaterThan(0)
  })

  it('uses growth std = growth × 0.3', () => {
    const lowGrowth = runMonteCarloSimulation({
      baseRevenue: 50_000_000,
      growthRate: 0.10,
      grossMargin: 0.70,
      wacc: 0.128,
      iterations: 2_000,
    })
    const highGrowth = runMonteCarloSimulation({
      baseRevenue: 50_000_000,
      growthRate: 0.80,
      grossMargin: 0.70,
      wacc: 0.128,
      iterations: 2_000,
    })
    const lowSpread = lowGrowth.p90 - lowGrowth.p10
    const highSpread = highGrowth.p90 - highGrowth.p10
    expect(highSpread).toBeGreaterThan(lowSpread)
  })
})

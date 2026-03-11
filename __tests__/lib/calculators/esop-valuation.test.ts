import { describe, it, expect } from 'vitest'
import { calculateESOPValue } from '@/lib/calculators/esop-valuation'

describe('calculateESOPValue', () => {
  const baseParams = {
    valuation: 100_000_000,          // Rs 10 Cr
    total_shares: 1_000_000,
    esop_pool_pct: 12,
    exercise_price: 10,              // Rs 10 face value
    time_to_liquidity: 4,            // years
    volatility: 0.55,                // 55%
    risk_free_rate: 0.07,            // 7%
  }

  it('returns positive ESOP value per share', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.value_per_share).toBeGreaterThan(0)
  })

  it('ESOP value is less than current per-share value', () => {
    const result = calculateESOPValue(baseParams)
    const perShareValue = baseParams.valuation / baseParams.total_shares
    expect(result.value_per_share).toBeLessThan(perShareValue)
  })

  it('computes total pool value = value_per_share × pool_shares', () => {
    const result = calculateESOPValue(baseParams)
    const poolShares = baseParams.total_shares * (baseParams.esop_pool_pct / 100)
    expect(result.total_pool_value).toBeCloseTo(result.value_per_share * poolShares, -2)
  })

  it('computes return multiple = value_per_share / exercise_price', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.return_multiple).toBeCloseTo(result.value_per_share / baseParams.exercise_price, 1)
  })

  it('returns 3 sensitivity scenarios', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.sensitivity.conservative).toBeDefined()
    expect(result.sensitivity.base).toBeDefined()
    expect(result.sensitivity.optimistic).toBeDefined()
  })

  it('conservative scenario has higher volatility and longer time', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.sensitivity.conservative.volatility).toBeGreaterThan(result.sensitivity.base.volatility)
    expect(result.sensitivity.conservative.time).toBeGreaterThan(result.sensitivity.base.time)
  })

  it('optimistic scenario has lower volatility and shorter time', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.sensitivity.optimistic.volatility).toBeLessThan(result.sensitivity.base.volatility)
    expect(result.sensitivity.optimistic.time).toBeLessThan(result.sensitivity.base.time)
  })

  it('conservative value < base value < optimistic value', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.sensitivity.optimistic.value).toBeGreaterThan(0)
    expect(result.sensitivity.conservative.value).toBeGreaterThan(0)
    expect(result.sensitivity.base.value).toBeGreaterThan(0)
  })

  it('handles very high exercise price (near ATM)', () => {
    const result = calculateESOPValue({
      ...baseParams,
      exercise_price: 90, // close to per-share value of Rs 100
    })
    expect(result.value_per_share).toBeGreaterThan(0) // still has time value
    expect(result.return_multiple).toBeLessThan(5) // but low multiple
  })

  it('handles zero exercise price (RSUs)', () => {
    const result = calculateESOPValue({
      ...baseParams,
      exercise_price: 0,
    })
    const perShareValue = baseParams.valuation / baseParams.total_shares
    expect(result.value_per_share).toBeCloseTo(perShareValue, -1)
  })
})

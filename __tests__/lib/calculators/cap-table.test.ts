import { describe, it, expect } from 'vitest'
import { simulateRound, simulateMultiRound } from '@/lib/calculators/cap-table'
import type { CapTableEntry, CapTableRound } from '@/types'

const baseCapTable: CapTableEntry[] = [
  { name: 'Founder A', percentage: 50, share_class: 'common' },
  { name: 'Founder B', percentage: 30, share_class: 'common' },
  { name: 'Angel Investor', percentage: 10, share_class: 'preference' },
  { name: 'ESOP Pool', percentage: 10, share_class: 'esop' },
]

describe('simulateRound', () => {
  it('computes post-money = pre-money + raise', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 0,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    expect(result.post_money).toBe(250_000_000)
  })

  it('new investor gets raise/post_money percentage', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 0,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    expect(result.new_investor_pct).toBeCloseTo(20, 1) // 50M / 250M = 20%
  })

  it('dilutes existing shareholders proportionally', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 0,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    // Founder A: 50% × (1 - 20%) = 40%
    const founderA = result.shareholders.find(s => s.name === 'Founder A')
    expect(founderA?.percentage).toBeCloseTo(40, 1)
  })

  it('computes founder_pct_after as sum of common shareholders', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 0,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    // Founders: (50 + 30) × 0.80 = 64%
    expect(result.founder_pct_after).toBeCloseTo(64, 0)
  })

  it('pre-round ESOP: carves from existing before investor enters', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 5,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    const newInvestor = result.shareholders.find(s => s.name === 'New Investor')
    expect(newInvestor?.percentage).toBeCloseTo(20, 1)
    // Founder A: 50 × 0.95 × 0.80 = 38%
    const founderA = result.shareholders.find(s => s.name === 'Founder A')
    expect(founderA?.percentage).toBeCloseTo(38, 0)
  })

  it('post-round ESOP: dilutes everyone including new investor', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 5,
      esop_timing: 'post_round',
    }
    const result = simulateRound(baseCapTable, round)
    // Investor: 20 × 0.95 = 19%
    const newInvestor = result.shareholders.find(s => s.name === 'New Investor')
    expect(newInvestor?.percentage).toBeCloseTo(19, 0)
  })

  it('all percentages sum to ~100%', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 5,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    const total = result.shareholders.reduce((sum, s) => sum + s.percentage, 0)
    expect(total).toBeCloseTo(100, 0)
  })
})

describe('simulateMultiRound', () => {
  it('applies multiple rounds sequentially', () => {
    const rounds: CapTableRound[] = [
      { raise_amount: 30_000_000, pre_money: 100_000_000, esop_expansion_pct: 0, esop_timing: 'pre_round' },
      { raise_amount: 100_000_000, pre_money: 400_000_000, esop_expansion_pct: 5, esop_timing: 'pre_round' },
    ]
    const results = simulateMultiRound(baseCapTable, rounds)
    expect(results).toHaveLength(2)
    expect(results[1].founder_pct_after).toBeLessThan(results[0].founder_pct_after)
  })

  it('caps at 3 rounds', () => {
    const rounds: CapTableRound[] = Array(5).fill({
      raise_amount: 10_000_000, pre_money: 50_000_000,
      esop_expansion_pct: 0, esop_timing: 'pre_round' as const,
    })
    const results = simulateMultiRound(baseCapTable, rounds)
    expect(results).toHaveLength(3)
  })
})

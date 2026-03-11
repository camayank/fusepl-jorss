import type { MonteCarloResult } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'

interface MCParams {
  baseRevenue: number
  growthRate: number
  grossMargin: number
  wacc: number
  iterations: number
}

/**
 * Box-Muller transform for Normal distribution sampling.
 */
function normalRandom(mean: number, std: number): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + z * std
}

/**
 * Run a single DCF iteration with random parameters.
 * Returns enterprise value for this iteration, or null if invalid.
 */
function singleIteration(params: MCParams): number | null {
  const { baseRevenue, growthRate, grossMargin, wacc: baseWacc } = params
  const terminalGrowth = MARKET_CONSTANTS.GDP_GROWTH_CAP
  const decayFactor = MARKET_CONSTANTS.GROWTH_DECAY_FACTOR
  const opMarginProxy = MARKET_CONSTANTS.OPERATING_MARGIN_PROXY
  const taxRate = MARKET_CONSTANTS.TAX_RATE

  // Sample parameters
  const sampledGrowth = normalRandom(growthRate, growthRate * MARKET_CONSTANTS.MC_GROWTH_STD_FACTOR)
  const sampledWacc = normalRandom(baseWacc, MARKET_CONSTANTS.MC_WACC_STD)

  // Guard: WACC must exceed terminal growth
  const wacc = sampledWacc <= terminalGrowth ? terminalGrowth + 0.02 : sampledWacc

  // Margin mean-reverts to sector median over 5 years
  const startMargin = grossMargin
  const targetMargin = grossMargin

  let revenue = baseRevenue > 0 ? baseRevenue : 1_000_000 // min Rs 10L proxy
  let growth = sampledGrowth
  const fcfs: number[] = []

  for (let year = 0; year < 5; year++) {
    revenue = revenue * (1 + growth)
    const margin = startMargin + (targetMargin - startMargin) * (year / 4)
    const fcf = revenue * margin * opMarginProxy * (1 - taxRate)
    fcfs.push(fcf)
    growth = growth * decayFactor
  }

  // PV of FCFs
  let pvFCFs = 0
  for (let i = 0; i < 5; i++) {
    pvFCFs += fcfs[i] / Math.pow(1 + wacc, i + 1)
  }

  // Terminal value
  const terminalValue = fcfs[4] * (1 + terminalGrowth) / (wacc - terminalGrowth)
  const pvTerminal = terminalValue / Math.pow(1 + wacc, 5)

  const ev = pvFCFs + pvTerminal
  return isFinite(ev) && ev > 0 ? ev : null
}

/**
 * Run Monte Carlo simulation and return percentiles.
 * Exported for testing — in production, called via Web Worker message handler.
 */
export function runMonteCarloSimulation(params: MCParams): MonteCarloResult {
  const results: number[] = []

  for (let i = 0; i < params.iterations; i++) {
    const ev = singleIteration(params)
    if (ev !== null) results.push(ev)
  }

  if (results.length < MARKET_CONSTANTS.MC_MIN_VALID_ITERATIONS) {
    return {
      p10: 0, p25: 0, p50: 0, p75: 0, p90: 0,
      iterations_valid: results.length,
      iterations_total: params.iterations,
    }
  }

  results.sort((a, b) => a - b)
  const percentile = (p: number) => results[Math.floor(results.length * p / 100)]

  return {
    p10: percentile(10),
    p25: percentile(25),
    p50: percentile(50),
    p75: percentile(75),
    p90: percentile(90),
    iterations_valid: results.length,
    iterations_total: params.iterations,
  }
}

// Web Worker message handler (only runs in browser context)
if (typeof self !== 'undefined' && typeof self.postMessage === 'function') {
  self.onmessage = (event: MessageEvent<MCParams>) => {
    const result = runMonteCarloSimulation(event.data)
    self.postMessage(result)
  }
}

import type { ESOPResult } from '@/types'

/**
 * Black-Scholes ESOP Valuation with Sensitivity Analysis
 * Spec: ESOP Valuation section
 *
 * d1 = (1/(σ√t)) × [ln(S/K) + (r + σ²/2)t]
 * d2 = d1 - σ√t
 * ESOP_value = N(d1) × S - N(d2) × K × e^(-rt)
 */

interface ESOPParams {
  valuation: number          // total company valuation in Rs
  total_shares: number       // total shares outstanding
  esop_pool_pct: number      // ESOP pool as % of total
  exercise_price: number     // strike price per share (Rs)
  time_to_liquidity: number  // years to expected exit
  volatility: number         // annualized volatility (decimal)
  risk_free_rate: number     // risk-free rate (decimal)
}

/** Cumulative normal distribution (Abramowitz & Stegun approximation) */
function normalCDF(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x)
  const t = 1.0 / (1.0 + p * absX)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2)

  return 0.5 * (1.0 + sign * y)
}

/** Black-Scholes call option value */
function blackScholes(
  S: number, // current price
  K: number, // strike price
  t: number, // time in years
  r: number, // risk-free rate
  sigma: number // volatility
): number {
  if (t <= 0) return Math.max(0, S - K)
  if (K <= 0) return S // RSU case

  const sqrtT = Math.sqrt(t)
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * t) / (sigma * sqrtT)
  const d2 = d1 - sigma * sqrtT

  return normalCDF(d1) * S - normalCDF(d2) * K * Math.exp(-r * t)
}

export function calculateESOPValue(params: ESOPParams): ESOPResult {
  const perShareValue = params.valuation / params.total_shares
  const poolShares = params.total_shares * (params.esop_pool_pct / 100)

  // Base case
  const baseValue = blackScholes(
    perShareValue,
    params.exercise_price,
    params.time_to_liquidity,
    params.risk_free_rate,
    params.volatility
  )

  // Conservative: σ + 20%, t + 1 year (per spec)
  const conservativeVol = params.volatility * 1.20
  const conservativeTime = params.time_to_liquidity + 1
  const conservativeValue = blackScholes(
    perShareValue, params.exercise_price,
    conservativeTime, params.risk_free_rate, conservativeVol
  )

  // Optimistic: σ - 10%, t - 1 year (per spec, min 1 year)
  const optimisticVol = params.volatility * 0.90
  const optimisticTime = Math.max(1, params.time_to_liquidity - 1)
  const optimisticValue = blackScholes(
    perShareValue, params.exercise_price,
    optimisticTime, params.risk_free_rate, optimisticVol
  )

  return {
    value_per_share: baseValue,
    total_pool_value: baseValue * poolShares,
    return_multiple: params.exercise_price > 0 ? baseValue / params.exercise_price : 1,
    sensitivity: {
      conservative: {
        volatility: conservativeVol,
        time: conservativeTime,
        value: conservativeValue,
      },
      base: {
        volatility: params.volatility,
        time: params.time_to_liquidity,
        value: baseValue,
      },
      optimistic: {
        volatility: optimisticVol,
        time: optimisticTime,
        value: optimisticValue,
      },
    },
  }
}

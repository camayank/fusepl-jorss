import type { Stage } from '@/types'

/** Pre-money valuation benchmarks by stage (in Rs) */
export const STAGE_BENCHMARKS: Record<Stage, { typical: number; low: number; high: number }> = {
  idea:           { typical: 5_000_000,    low: 2_000_000,     high: 10_000_000 },     // Rs 50L
  pre_seed:       { typical: 20_000_000,   low: 5_000_000,     high: 50_000_000 },     // Rs 2 Cr
  seed:           { typical: 80_000_000,   low: 30_000_000,    high: 150_000_000 },    // Rs 8 Cr
  pre_series_a:   { typical: 200_000_000,  low: 100_000_000,   high: 400_000_000 },   // Rs 20 Cr
  series_a:       { typical: 500_000_000,  low: 250_000_000,   high: 1_000_000_000 }, // Rs 50 Cr
  series_b:       { typical: 2_000_000_000, low: 800_000_000,  high: 5_000_000_000 }, // Rs 200 Cr
  series_c_plus:  { typical: 5_000_000_000, low: 2_000_000_000, high: 20_000_000_000 }, // Rs 500 Cr
}

/** Berkus milestone max values (in Rs) */
export const BERKUS_MILESTONE_MAX = 10_000_000 // Rs 1 Cr per milestone
export const BERKUS_PRE_REVENUE_CAP = 50_000_000 // Rs 5 Cr total

/** Risk Factor per-adjustment amount by stage (in Rs) */
export const RISK_FACTOR_ADJUSTMENT: Record<Stage, number> = {
  idea:          500_000,       // Rs 5 L
  pre_seed:      1_500_000,     // Rs 15 L
  seed:          4_000_000,     // Rs 40 L
  pre_series_a:  10_000_000,    // Rs 1 Cr
  series_a:      25_000_000,    // Rs 2.5 Cr
  series_b:      100_000_000,   // Rs 10 Cr
  series_c_plus: 250_000_000,   // Rs 25 Cr
}

/** Minimum valuation floor (Rs 10 L) */
export const VALUATION_FLOOR = 1_000_000

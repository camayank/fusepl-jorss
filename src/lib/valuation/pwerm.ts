import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'
import { STAGE_BENCHMARKS } from '@/lib/data/sector-benchmarks'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

const SCENARIO_PROBABILITIES: Record<string, { bull: number; base: number; bear: number; failure: number }> = {
  idea:          { bull: 0.05, base: 0.20, bear: 0.25, failure: 0.50 },
  pre_seed:      { bull: 0.08, base: 0.25, bear: 0.30, failure: 0.37 },
  seed:          { bull: 0.12, base: 0.35, bear: 0.28, failure: 0.25 },
  pre_series_a:  { bull: 0.18, base: 0.40, bear: 0.25, failure: 0.17 },
  series_a:      { bull: 0.25, base: 0.42, bear: 0.23, failure: 0.10 },
  series_b:      { bull: 0.30, base: 0.45, bear: 0.18, failure: 0.07 },
  series_c_plus: { bull: 0.35, base: 0.45, bear: 0.15, failure: 0.05 },
}

const TIME_TO_EXIT: Record<string, number> = {
  idea: 7, pre_seed: 6, seed: 5, pre_series_a: 4, series_a: 4, series_b: 3, series_c_plus: 2,
}

export function calculatePWERM(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const benchmark = getDamodaranBenchmark(inputs.sector)
  const probs = SCENARIO_PROBABILITIES[inputs.stage] ?? SCENARIO_PROBABILITIES.seed
  const timeToExit = TIME_TO_EXIT[inputs.stage] ?? 5
  const wacc = benchmark.wacc

  const isPreRevenue = inputs.annual_revenue <= 0
  const baseRevenue = isPreRevenue
    ? STAGE_BENCHMARKS[inputs.stage].typical / benchmark.ev_revenue
    : inputs.annual_revenue

  const baseMultiple = benchmark.ev_revenue
  const bullMultiple = baseMultiple * 1.5
  const bearMultiple = baseMultiple * 0.3

  let projectedRevenue = baseRevenue
  let growth = inputs.revenue_growth_pct / 100
  for (let y = 0; y < timeToExit; y++) {
    projectedRevenue *= (1 + growth)
    growth *= MARKET_CONSTANTS.GROWTH_DECAY_FACTOR
  }

  const bullExit = projectedRevenue * bullMultiple
  const baseExit = projectedRevenue * baseMultiple
  const bearExit = projectedRevenue * bearMultiple

  const pvFactor = Math.pow(1 + wacc, timeToExit)
  const pvBull = bullExit / pvFactor
  const pvBase = baseExit / pvFactor
  const pvBear = bearExit / pvFactor

  const weightedValue = probs.bull * pvBull + probs.base * pvBase + probs.bear * pvBear

  let confidence: number
  if (inputs.stage === 'idea') confidence = 0.4
  else if (isPreRevenue) confidence = 0.5
  else if (inputs.annual_revenue > 10_000_000) confidence = 0.7
  else confidence = 0.5

  return {
    method: 'pwerm',
    approach: 'income',
    value: Math.max(0, weightedValue),
    confidence,
    details: {
      scenarios: [
        { name: 'bull', probability: probs.bull, exit_value: bullExit, pv: pvBull, multiple: bullMultiple },
        { name: 'base', probability: probs.base, exit_value: baseExit, pv: pvBase, multiple: baseMultiple },
        { name: 'bear', probability: probs.bear, exit_value: bearExit, pv: pvBear, multiple: bearMultiple },
        { name: 'failure', probability: probs.failure, exit_value: 0, pv: 0, multiple: 0 },
      ],
      projected_revenue_at_exit: projectedRevenue,
      time_to_exit: timeToExit,
      wacc,
    },
    applicable: true,
  }
}

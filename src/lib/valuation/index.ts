import type { WizardInputs, ValuationResult, MethodResult, CrossMethodWarning } from '@/types'
import { METHOD_APPROACH, APPROACH_LABELS } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'
import { computeDerivedFields } from '@/lib/calculators/burn-rate'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { runMonteCarloSimulation } from './monte-carlo.worker'
import { calculateDCF } from './dcf'
import { calculatePWERM } from './pwerm'
import { calculateRevenueMultiple } from './revenue-multiple'
import { calculateEBITDAMultiple } from './ebitda-multiple'
import { calculateComparableTransaction } from './comparable-transaction'
import { calculateNAV } from './nav'
import { calculateReplacementCost } from './replacement-cost'
import { calculateScorecard } from './scorecard'
import { calculateBerkus } from './berkus'
import { calculateRiskFactor } from './risk-factor'
import { calculateConfidenceScore } from './confidence-score'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'

/**
 * Main valuation orchestrator.
 * Runs all 10 methods across 3 approaches + VC methods,
 * computes weighted composite, confidence score, and Monte Carlo simulation.
 */
export function calculateValuation(inputs: WizardInputs): ValuationResult {
  const derived = computeDerivedFields({
    monthly_burn: inputs.monthly_burn,
    cash_in_bank: inputs.cash_in_bank,
    cac: inputs.cac,
    ltv: inputs.ltv,
    patents_count: inputs.patents_count,
    stage: inputs.stage,
    sector: inputs.sector,
  })

  // Run all 10 methods across 4 approach categories
  const methods: MethodResult[] = [
    // Income Approach
    calculateDCF(inputs, derived),
    calculatePWERM(inputs, derived),
    // Market Approach
    calculateRevenueMultiple(inputs, derived),
    calculateEBITDAMultiple(inputs, derived),
    calculateComparableTransaction(inputs, derived),
    // Asset/Cost Approach
    calculateNAV(inputs, derived),
    calculateReplacementCost(inputs, derived),
    // VC/Startup Methods
    calculateScorecard(inputs, derived),
    calculateBerkus(inputs, derived),
    calculateRiskFactor(inputs, derived),
  ]

  // Weighted composite: weight by confidence, exclude confidence < 0.3
  const qualifying = methods.filter(m => m.applicable && m.confidence >= 0.3)
  let compositeValue = 0
  if (qualifying.length > 0) {
    const totalWeight = qualifying.reduce((sum, m) => sum + m.confidence, 0)
    compositeValue = qualifying.reduce((sum, m) => sum + m.value * m.confidence, 0) / totalWeight
  }

  // Monte Carlo simulation (synchronous — ~50-100ms for 10K iterations)
  const benchmark = getDamodaranBenchmark(inputs.sector)
  const terminalGrowth = MARKET_CONSTANTS.GDP_GROWTH_CAP
  const rawWacc = benchmark.wacc ?? 0.12
  const mcWacc = rawWacc <= terminalGrowth ? terminalGrowth + 0.02 : rawWacc
  const mcGrossMargin = inputs.gross_margin_pct > 0 ? inputs.gross_margin_pct / 100 : 0.10
  const mcResult = runMonteCarloSimulation({
    baseRevenue: inputs.annual_revenue > 0 ? inputs.annual_revenue : 1_000_000,
    growthRate: inputs.revenue_growth_pct / 100,
    grossMargin: mcGrossMargin,
    wacc: mcWacc,
    iterations: 10000,
  })

  // Confidence score
  const confidenceScore = calculateConfidenceScore(inputs, methods)

  // IBC recovery
  const ibcRecovery = getIBCRecovery(inputs.sector)

  // Cross-method validation: flag methods deviating >5x from median
  const warnings = validateCrossMethod(qualifying, compositeValue)

  return {
    methods,
    composite_value: compositeValue,
    composite_low: mcResult.p10,
    composite_high: mcResult.p90,
    confidence_score: confidenceScore,
    monte_carlo: mcResult,
    ibc_recovery_range: {
      low: ibcRecovery.p25,
      high: ibcRecovery.p75,
      sector: inputs.sector,
    },
    warnings,
  }
}

/**
 * Flag methods that deviate significantly from the median.
 * >5x = warning, >2x = info.
 */
function validateCrossMethod(
  qualifying: MethodResult[],
  compositeValue: number,
): CrossMethodWarning[] {
  if (qualifying.length < 2 || compositeValue <= 0) return []

  const values = qualifying.map(m => m.value).sort((a, b) => a - b)
  const median = values[Math.floor(values.length / 2)]
  if (median <= 0) return []

  const warnings: CrossMethodWarning[] = []

  for (const m of qualifying) {
    const ratio = m.value / median
    const approach = APPROACH_LABELS[METHOD_APPROACH[m.method]]

    if (ratio > 5 || ratio < 0.2) {
      warnings.push({
        method: m.method,
        message: `${m.method} (${approach}) deviates >5x from median — review assumptions`,
        severity: 'warning',
      })
    } else if (ratio > 2 || ratio < 0.5) {
      warnings.push({
        method: m.method,
        message: `${m.method} (${approach}) deviates >2x from median`,
        severity: 'info',
      })
    }
  }

  return warnings
}

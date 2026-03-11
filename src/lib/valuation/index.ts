import type { WizardInputs, ValuationResult, MethodResult } from '@/types'
import { computeDerivedFields } from '@/lib/calculators/burn-rate'
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
 * computes weighted composite, confidence score.
 *
 * Income: DCF, PWERM
 * Market: Revenue Multiple, EV/EBITDA Multiple, Comparable Transaction
 * Asset/Cost: NAV, Replacement Cost
 * VC/Startup: Scorecard, Berkus, Risk Factor
 *
 * Monte Carlo is NOT run here (it runs async in a Web Worker).
 * The caller should trigger MC separately and attach results.
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

  // Confidence score
  const confidenceScore = calculateConfidenceScore(inputs, methods)

  // IBC recovery
  const ibcRecovery = getIBCRecovery(inputs.sector)

  return {
    methods,
    composite_value: compositeValue,
    composite_low: compositeValue * 0.7,  // placeholder — MC will replace
    composite_high: compositeValue * 1.3, // placeholder — MC will replace
    confidence_score: confidenceScore,
    monte_carlo: null, // runs async in browser
    ibc_recovery_range: {
      low: ibcRecovery.p25,
      high: ibcRecovery.p75,
      sector: inputs.sector,
    },
  }
}

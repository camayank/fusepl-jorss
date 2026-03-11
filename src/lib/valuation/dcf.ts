import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

/**
 * Method 1: DCF (Discounted Cash Flow) — Deterministic
 * IVS/Rule 11UA alignment: Income Approach
 */
export function calculateDCF(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const benchmark = getDamodaranBenchmark(inputs.sector)
  let wacc = benchmark.wacc
  const terminalGrowth = MARKET_CONSTANTS.GDP_GROWTH_CAP

  if (wacc <= terminalGrowth) {
    wacc = terminalGrowth + 0.02
  }

  const isPreRevenue = inputs.annual_revenue <= 0
  const baseRevenue = isPreRevenue
    ? (benchmark.ev_revenue * 10_000_000)
    : inputs.annual_revenue

  const grossMargin = inputs.gross_margin_pct / 100
  const decayFactor = MARKET_CONSTANTS.GROWTH_DECAY_FACTOR
  const opMarginProxy = MARKET_CONSTANTS.OPERATING_MARGIN_PROXY
  const taxRate = MARKET_CONSTANTS.TAX_RATE

  const revenues: number[] = []
  const fcfs: number[] = []
  let growth = inputs.revenue_growth_pct / 100
  let revenue = baseRevenue

  for (let year = 0; year < 5; year++) {
    revenue = revenue * (1 + growth)
    revenues.push(revenue)
    const fcf = revenue * grossMargin * opMarginProxy * (1 - taxRate)
    fcfs.push(fcf)
    growth = growth * decayFactor
  }

  let pvFCFs = 0
  for (let i = 0; i < 5; i++) {
    pvFCFs += fcfs[i] / Math.pow(1 + wacc, i + 1)
  }

  const terminalValue = fcfs[4] * (1 + terminalGrowth) / (wacc - terminalGrowth)
  const pvTerminal = terminalValue / Math.pow(1 + wacc, 5)
  const enterpriseValue = pvFCFs + pvTerminal

  let confidence: number
  if (isPreRevenue) confidence = 0.3
  else if (inputs.annual_revenue > 50_000_000) confidence = 0.85
  else if (inputs.annual_revenue >= 10_000_000) confidence = 0.6
  else confidence = 0.3

  return {
    method: 'dcf',
    approach: 'income',
    value: Math.max(0, enterpriseValue),
    confidence,
    details: {
      base_revenue: baseRevenue,
      is_pre_revenue: isPreRevenue,
      wacc,
      terminal_growth: terminalGrowth,
      gross_margin: grossMargin,
      projected_revenues: revenues,
      projected_fcfs: fcfs,
      pv_fcfs: pvFCFs,
      terminal_value: terminalValue,
      pv_terminal: pvTerminal,
    },
    applicable: true,
  }
}

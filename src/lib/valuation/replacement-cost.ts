import type { WizardInputs, DerivedFields, MethodResult } from '@/types'

const AVG_ANNUAL_COST_PER_EMPLOYEE = 1_500_000 // Rs 15L (blended)

const DEV_STAGE_COST: Record<string, number> = {
  idea: 500_000,         // Rs 5L
  prototype: 2_500_000,  // Rs 25L
  mvp: 7_500_000,        // Rs 75L
  beta: 15_000_000,      // Rs 1.5 Cr
  production: 30_000_000, // Rs 3 Cr
  scaling: 50_000_000,   // Rs 5 Cr
}

// Sector-specific proxy CAC when user doesn't provide
const SECTOR_PROXY_CAC: Record<string, number> = {
  saas: 5000, d2c: 2000, marketplace: 3000, ecommerce_general: 2500,
  ecommerce_grocery: 2000, fintech_payments: 4000, edtech: 3000,
}
const DEFAULT_PROXY_CAC = 3000

const CURRENT_YEAR = 2026

/**
 * Method 7: Replacement Cost
 * Asset/Cost Approach — Rule 11UA, IVS 105
 *
 * What would it cost to recreate this startup from scratch?
 */
export function calculateReplacementCost(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const yearsOperating = Math.max(1, CURRENT_YEAR - inputs.founding_year)

  // 1. Team replacement cost
  const teamCost = inputs.team_size * AVG_ANNUAL_COST_PER_EMPLOYEE * yearsOperating

  // 2. Technology development cost
  const techCost = DEV_STAGE_COST[inputs.dev_stage] ?? 500_000

  // 3. Customer acquisition cost
  let customerCost = 0
  if (inputs.annual_revenue > 0) {
    const cac = inputs.cac ?? SECTOR_PROXY_CAC[inputs.sector] ?? DEFAULT_PROXY_CAC
    // Estimate customers: annual_revenue / (team_size × 50)
    const estimatedCustomers = Math.max(1, inputs.annual_revenue / (inputs.team_size * 50))
    customerCost = estimatedCustomers * cac
  }

  const total = teamCost + techCost + customerCost

  // Confidence: 0.5 early stage, 0.3 later (replacement cost undervalues network effects/brand)
  const earlyStages = ['idea', 'pre_seed', 'seed', 'pre_series_a']
  const confidence = earlyStages.includes(inputs.stage) ? 0.5 : 0.3

  return {
    method: 'replacement_cost', approach: 'asset_cost',
    value: total, confidence,
    details: {
      team_cost: teamCost,
      tech_cost: techCost,
      customer_cost: customerCost,
      years_operating: yearsOperating,
      team_size: inputs.team_size,
      cac_used: inputs.cac ?? SECTOR_PROXY_CAC[inputs.sector] ?? DEFAULT_PROXY_CAC,
    },
    applicable: true,
  }
}

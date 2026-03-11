import type { WizardInputs, DerivedFields, MethodResult } from '@/types'

const SOFTWARE_SECTORS = [
  'saas', 'fintech_payments', 'fintech_insurance', 'fintech_banking',
  'edtech', 'deeptech', 'gaming', 'media_advertising', 'marketplace',
  'healthtech_services', 'ecommerce_general', 'ecommerce_grocery',
  'b2b_services', 'social_impact',
]

const HARDWARE_SECTORS = [
  'healthtech_products', 'auto_mobility', 'manufacturing', 'cleantech',
]

const DEV_STAGE_TECH_VALUE: Record<string, number> = {
  idea: 0,
  prototype: 1_000_000,
  mvp: 3_000_000,
  beta: 5_000_000,
  production: 10_000_000,
  scaling: 20_000_000,
}

const PATENT_VALUE = 2_500_000

/**
 * Method 6: Net Asset Value (NAV)
 * Asset/Cost Approach — Rule 11UA, IVS 105
 */
export function calculateNAV(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const tangibleAssets = inputs.cash_in_bank

  const baseTechValue = DEV_STAGE_TECH_VALUE[inputs.dev_stage] ?? 0
  let techMultiplier = 1.0
  if (SOFTWARE_SECTORS.includes(inputs.sector)) techMultiplier = 1.5
  else if (HARDWARE_SECTORS.includes(inputs.sector)) techMultiplier = 2.0
  const technologyAssets = baseTechValue * techMultiplier

  const ipAssets = inputs.patents_count * PATENT_VALUE
  const customerAssets = inputs.annual_revenue * 0.3

  const totalNAV = tangibleAssets + technologyAssets + ipAssets + customerAssets

  return {
    method: 'nav', approach: 'asset_cost',
    value: totalNAV,
    confidence: 0.5,
    details: {
      tangible_assets: tangibleAssets,
      technology_assets: technologyAssets,
      ip_assets: ipAssets,
      customer_assets: customerAssets,
      tech_multiplier: techMultiplier,
    },
    applicable: true,
  }
}

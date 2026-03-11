import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { STAGE_BENCHMARKS, RISK_FACTOR_ADJUSTMENT, VALUATION_FLOOR } from '@/lib/data/sector-benchmarks'
import { clamp } from '@/lib/utils'

const SOFTWARE_SECTORS = [
  'saas', 'fintech_payments', 'fintech_insurance', 'fintech_banking',
  'edtech', 'deeptech', 'gaming', 'media_advertising', 'marketplace',
  'healthtech_services', 'ecommerce_general', 'ecommerce_grocery',
  'b2b_services', 'social_impact',
]

/**
 * Method 10: Risk Factor Summation
 * IVS/Rule 11UA alignment: VC/Startup Method
 *
 * 12 risk dimensions, each scored -2 to +2. Sum × per-factor adjustment.
 */
export function calculateRiskFactor(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const base = STAGE_BENCHMARKS[inputs.stage].typical
  const perFactor = RISK_FACTOR_ADJUSTMENT[inputs.stage]
  const isSoftware = SOFTWARE_SECTORS.includes(inputs.sector)

  // 1. Management risk
  const mgmtNorm = (inputs.founder_experience + inputs.domain_expertise) / 10
  let management: number
  if (mgmtNorm < 0.3) management = -2
  else if (mgmtNorm < 0.5) management = -1
  else if (mgmtNorm < 0.7) management = 0
  else if (mgmtNorm < 0.9) management = 1
  else management = 2
  if (inputs.previous_exits) management = Math.min(management + 1, 2)

  // 2. Stage of business
  const stageRisk: Record<string, number> = {
    idea: -2, prototype: -1, mvp: 0, beta: 1, production: 2, scaling: 2,
  }
  const stage = stageRisk[inputs.dev_stage] ?? 0

  // 3. Legislation/political risk (inverse of regulatory_risk)
  const legRiskMap: Record<number, number> = { 5: -2, 4: -1, 3: 0, 2: 1, 1: 2 }
  const legislation = legRiskMap[inputs.regulatory_risk] ?? 0

  // 4. Manufacturing risk
  const manufacturing = isSoftware ? 1 : -(inputs.competition_level - 3) as number
  const mfgClamped = clamp(manufacturing, -2, 2)

  // 5. Sales/marketing risk
  let salesRisk: number
  if (inputs.revenue_growth_pct <= 0) salesRisk = -2
  else if (inputs.revenue_growth_pct < 50) salesRisk = -1
  else if (inputs.revenue_growth_pct < 100) salesRisk = 0
  else if (inputs.revenue_growth_pct < 200) salesRisk = 1
  else salesRisk = 2

  // 6. Funding/capital risk
  let fundingRisk: number
  if (derived.runway_months < 3) fundingRisk = -2
  else if (derived.runway_months < 6) fundingRisk = -1
  else if (derived.runway_months < 12) fundingRisk = 0
  else if (derived.runway_months < 18) fundingRisk = 1
  else fundingRisk = 2

  // 7. Competition risk
  const compRiskMap: Record<number, number> = { 5: -2, 4: -1, 3: 0, 2: 1, 1: 2 }
  const competitionRisk = compRiskMap[inputs.competition_level] ?? 0

  // 8. Technology risk
  let techRisk = 0
  if (derived.has_patents) techRisk += 1
  const lateTech = ['production', 'scaling']
  const earlyTech = ['idea', 'prototype']
  if (lateTech.includes(inputs.dev_stage)) techRisk += 1
  else if (earlyTech.includes(inputs.dev_stage)) techRisk -= 1
  techRisk = clamp(techRisk, -2, 2)

  // 9. Litigation risk
  let litigationRisk = 0
  if (['fintech_payments', 'fintech_insurance', 'fintech_banking'].includes(inputs.sector)) {
    litigationRisk = -1
  }

  // 10. International risk
  let internationalRisk = 0
  if (inputs.international_revenue_pct > 0) {
    internationalRisk = 1
  }

  // 11. Reputation risk
  const hasReputation = inputs.competitive_advantages.includes('brand')
  const reputationRisk = hasReputation ? 1 : 0

  // 12. Lucrative exit potential
  let exitRisk: number
  if (inputs.tam < 100) exitRisk = -2
  else if (inputs.tam < 1000) exitRisk = -1
  else if (inputs.tam < 10000) exitRisk = 1
  else exitRisk = 2
  if (['saas_subscription', 'marketplace_commission'].includes(inputs.business_model)) {
    exitRisk = Math.min(exitRisk + 1, 2)
  }

  const riskScores = {
    management,
    stage,
    legislation,
    manufacturing: mfgClamped,
    sales: salesRisk,
    funding: fundingRisk,
    competition: competitionRisk,
    technology: techRisk,
    litigation: litigationRisk,
    international: internationalRisk,
    reputation: reputationRisk,
    exit: exitRisk,
  }

  const riskSum = Object.values(riskScores).reduce((sum, v) => sum + v, 0)
  const totalAdjustment = riskSum * perFactor
  const value = Math.max(base + totalAdjustment, VALUATION_FLOOR)

  return {
    method: 'risk_factor',
    approach: 'vc_startup',
    value,
    confidence: 0.65,
    details: {
      base,
      per_factor_adjustment: perFactor,
      risk_scores: riskScores,
      risk_sum: riskSum,
      total_adjustment: totalAdjustment,
    },
    applicable: true,
  }
}

import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { BERKUS_MILESTONE_MAX, BERKUS_PRE_REVENUE_CAP } from '@/lib/data/sector-benchmarks'

/**
 * Method 9: Berkus Method
 * IVS/Rule 11UA alignment: VC/Startup Method
 *
 * 5 milestones, each up to Rs 1 Cr. Cap at Rs 5 Cr for pre-revenue.
 */
export function calculateBerkus(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const max = BERKUS_MILESTONE_MAX // Rs 1 Cr per milestone

  // Milestone 1: Sound idea (TAM + competitive advantages)
  let ideaScore: number
  if (inputs.tam < 100) ideaScore = 0.20
  else if (inputs.tam < 1000) ideaScore = 0.50
  else if (inputs.tam < 10000) ideaScore = 0.80
  else ideaScore = 1.0
  // Competitive advantage bonus: +10% each, capped
  const advantageBonus = Math.min(
    inputs.competitive_advantages.filter(a => a !== 'none').length * 0.10,
    0.20
  )
  ideaScore = Math.min(ideaScore + advantageBonus, 1.0)

  // Milestone 2: Prototype/technology (dev_stage + patents)
  const devStageScores: Record<string, number> = {
    idea: 0, prototype: 0.40, mvp: 0.70, beta: 0.90, production: 1.0, scaling: 1.0,
  }
  let protoScore = devStageScores[inputs.dev_stage] ?? 0
  // Patent bonus: 1 patent = +15%, 2+ = +20%
  if (inputs.patents_count >= 2) protoScore += 0.20
  else if (inputs.patents_count === 1) protoScore += 0.15
  protoScore = Math.min(protoScore, 1.0)

  // Milestone 3: Quality management
  let mgmtScore = ((inputs.founder_experience + inputs.domain_expertise) / 10)
  if (inputs.previous_exits) mgmtScore += 0.25
  if (inputs.technical_cofounder) mgmtScore += 0.15
  mgmtScore = Math.min(mgmtScore, 1.0)

  // Milestone 4: Strategic relationships
  const partnerMap: Record<string, number> = { none: 0, one: 0.50, multiple: 1.0 }
  let stratScore = partnerMap[inputs.strategic_partnerships] ?? 0
  // Key hires bonus: +10% each for CTO/CFO/sales
  const keyHireBonus = Math.min(inputs.key_hires.length * 0.10, 0.30)
  stratScore = Math.min(stratScore + keyHireBonus, 1.0)

  // Milestone 5: Product rollout/sales
  let salesScore: number
  if (inputs.annual_revenue <= 0) salesScore = 0
  else if (inputs.annual_revenue < 1_000_000) salesScore = 0.20      // < Rs 10L
  else if (inputs.annual_revenue < 5_000_000) salesScore = 0.50      // 10L-50L
  else if (inputs.annual_revenue < 10_000_000) salesScore = 0.75     // 50L-1Cr
  else salesScore = 1.0                                                // > Rs 1 Cr
  // Growth bonus: +20% if >100% growth
  if (inputs.revenue_growth_pct > 100) salesScore = Math.min(salesScore + 0.20, 1.0)

  const milestones = {
    sound_idea: ideaScore * max,
    prototype_technology: protoScore * max,
    quality_management: mgmtScore * max,
    strategic_relationships: stratScore * max,
    product_rollout: salesScore * max,
  }

  let total = Object.values(milestones).reduce((sum, v) => sum + v, 0)

  // Cap at Rs 5 Cr for pre-revenue
  if (inputs.annual_revenue <= 0 && total > BERKUS_PRE_REVENUE_CAP) {
    total = BERKUS_PRE_REVENUE_CAP
  }

  // Confidence
  let confidence: number
  if (inputs.stage === 'idea' || inputs.stage === 'pre_seed') confidence = 0.8
  else if (inputs.stage === 'seed') confidence = 0.6
  else confidence = 0.3

  return {
    method: 'berkus',
    approach: 'vc_startup',
    value: total,
    confidence,
    details: {
      milestones,
      milestone_max: max,
      pre_revenue_cap: BERKUS_PRE_REVENUE_CAP,
      capped: inputs.annual_revenue <= 0 && Object.values(milestones).reduce((s, v) => s + v, 0) > BERKUS_PRE_REVENUE_CAP,
    },
    applicable: true,
  }
}

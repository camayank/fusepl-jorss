import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { STAGE_BENCHMARKS } from '@/lib/data/sector-benchmarks'
import { clamp } from '@/lib/utils'

const METRO_CITIES = ['bangalore', 'bengaluru', 'delhi', 'new delhi', 'mumbai', 'gurgaon', 'gurugram', 'noida', 'hyderabad', 'pune', 'chennai']
const TIER1_CITIES = ['kolkata', 'ahmedabad', 'jaipur', 'lucknow', 'chandigarh', 'kochi', 'indore', 'coimbatore', 'nagpur', 'patna', 'bhopal', 'visakhapatnam', 'thiruvananthapuram']

/**
 * Method 8: Scorecard (Bill Payne)
 * IVS/Rule 11UA alignment: VC/Startup Method
 *
 * 7 factors, each scored 50-150%, weighted. Applied to stage-based pre-money.
 */
export function calculateScorecard(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const base = STAGE_BENCHMARKS[inputs.stage].typical

  // Factor 1: Management team (30%)
  const teamRaw = ((inputs.founder_experience + inputs.domain_expertise) / 10) * 100
    + (inputs.previous_exits ? 25 : 0)
    + (inputs.technical_cofounder ? 10 : 0)
  const management = clamp(teamRaw / 100, 0.5, 1.5)

  // Factor 2: Market opportunity (25%)
  let marketRaw: number
  if (inputs.tam < 100) marketRaw = 0.6
  else if (inputs.tam < 1000) marketRaw = 0.9
  else if (inputs.tam < 10000) marketRaw = 1.2
  else marketRaw = 1.4
  const market = clamp(marketRaw, 0.5, 1.5)

  // Factor 3: Product/technology (15%)
  const devStageMap: Record<string, number> = {
    idea: 0.5, prototype: 0.7, mvp: 0.9, beta: 1.1, production: 1.3, scaling: 1.5,
  }
  const product = clamp(devStageMap[inputs.dev_stage] ?? 0.5, 0.5, 1.5)

  // Factor 4: Competition (10%)
  const compMap: Record<number, number> = { 1: 1.4, 2: 1.2, 3: 1.0, 4: 0.8, 5: 0.6 }
  const competition = clamp(compMap[inputs.competition_level] ?? 1.0, 0.5, 1.5)

  // Factor 5: Sales/marketing (10%)
  let salesRaw: number
  if (inputs.revenue_growth_pct <= 0) salesRaw = 0.6
  else if (inputs.revenue_growth_pct < 50) salesRaw = 0.8
  else if (inputs.revenue_growth_pct < 100) salesRaw = 1.0
  else if (inputs.revenue_growth_pct < 200) salesRaw = 1.2
  else salesRaw = 1.4
  const sales = clamp(salesRaw, 0.5, 1.5)

  // Factor 6: Need for funding (5%)
  let fundingRaw: number
  if (derived.runway_months < 6) fundingRaw = 0.6
  else if (derived.runway_months < 12) fundingRaw = 0.8
  else if (derived.runway_months < 18) fundingRaw = 1.0
  else fundingRaw = 1.3
  const funding = clamp(fundingRaw, 0.5, 1.5)

  // Factor 7: Other factors — city (5%)
  const cityLower = inputs.city.toLowerCase()
  let otherRaw: number
  if (METRO_CITIES.some(c => cityLower.includes(c))) otherRaw = 1.2
  else if (TIER1_CITIES.some(c => cityLower.includes(c))) otherRaw = 1.0
  else otherRaw = 0.8
  const other = clamp(otherRaw, 0.5, 1.5)

  // Weighted sum
  const adjustmentMultiplier =
    management * 0.30 +
    market * 0.25 +
    product * 0.15 +
    competition * 0.10 +
    sales * 0.10 +
    funding * 0.05 +
    other * 0.05

  const value = base * adjustmentMultiplier

  // Confidence
  let confidence: number
  if (inputs.stage === 'idea') confidence = 0.5
  else if (inputs.annual_revenue <= 0) confidence = 0.7
  else confidence = 0.6

  return {
    method: 'scorecard',
    approach: 'vc_startup',
    value,
    confidence,
    details: {
      base,
      adjustment_multiplier: adjustmentMultiplier,
      factor_scores: { management, market, product, competition, sales, funding, other },
      factor_weights: { management: 0.30, market: 0.25, product: 0.15, competition: 0.10, sales: 0.10, funding: 0.05, other: 0.05 },
    },
    applicable: true,
  }
}

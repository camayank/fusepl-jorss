import type { ComparableCompany, StartupCategory, Stage } from '@/types'

export const COMPARABLE_COMPANIES: ComparableCompany[] = [
  { name: 'Razorpay', sector: 'fintech_payments', stage_at_round: 'series_c_plus', last_round_size_cr: 500, valuation_cr: 56000, revenue_cr: 2100, year: 2024, city: 'Bangalore', business_model: 'transaction_based', source: 'public_announcement' },
  { name: 'Zerodha', sector: 'fintech_payments', stage_at_round: 'series_a', last_round_size_cr: 0, valuation_cr: 28000, revenue_cr: 8000, year: 2024, city: 'Bangalore', business_model: 'transaction_based', source: 'media_report' },
  { name: 'Meesho', sector: 'ecommerce_general', stage_at_round: 'series_b', last_round_size_cr: 1900, valuation_cr: 35000, revenue_cr: 500, year: 2023, city: 'Bangalore', business_model: 'marketplace_commission', source: 'Tracxn' },
  { name: 'PhysicsWallah', sector: 'edtech', stage_at_round: 'series_a', last_round_size_cr: 750, valuation_cr: 8100, revenue_cr: 700, year: 2023, city: 'Noida', business_model: 'freemium', source: 'public_announcement' },
  { name: 'Lenskart', sector: 'd2c', stage_at_round: 'series_c_plus', last_round_size_cr: 450, valuation_cr: 37500, revenue_cr: 3200, year: 2024, city: 'Delhi', business_model: 'ecommerce_product', source: 'Tracxn' },
  { name: 'Darwinbox', sector: 'saas', stage_at_round: 'series_b', last_round_size_cr: 225, valuation_cr: 5000, revenue_cr: 350, year: 2024, city: 'Hyderabad', business_model: 'saas_subscription', source: 'Tracxn' },
  { name: 'Zetwerk', sector: 'marketplace', stage_at_round: 'series_b', last_round_size_cr: 380, valuation_cr: 18000, revenue_cr: 12000, year: 2024, city: 'Bangalore', business_model: 'marketplace_commission', source: 'public_announcement' },
  { name: 'DeHaat', sector: 'agritech', stage_at_round: 'series_b', last_round_size_cr: 150, valuation_cr: 2200, revenue_cr: 400, year: 2023, city: 'Patna', business_model: 'marketplace_commission', source: 'Tracxn' },
  { name: 'Delhivery', sector: 'logistics', stage_at_round: 'series_c_plus', last_round_size_cr: 800, valuation_cr: 22000, revenue_cr: 5500, year: 2023, city: 'Gurgaon', business_model: 'services', source: 'public_announcement' },
  { name: 'Healthifyme', sector: 'healthtech_services', stage_at_round: 'series_b', last_round_size_cr: 120, valuation_cr: 1500, revenue_cr: 200, year: 2023, city: 'Bangalore', business_model: 'freemium', source: 'Tracxn' },
  { name: 'Freshworks', sector: 'saas', stage_at_round: 'series_c_plus', last_round_size_cr: 1000, valuation_cr: 85000, revenue_cr: 5000, year: 2024, city: 'Chennai', business_model: 'saas_subscription', source: 'public_announcement' },
  { name: 'BrowserStack', sector: 'saas', stage_at_round: 'series_b', last_round_size_cr: 1500, valuation_cr: 32000, revenue_cr: 2500, year: 2023, city: 'Mumbai', business_model: 'saas_subscription', source: 'Tracxn' },
  { name: 'CRED', sector: 'fintech_payments', stage_at_round: 'series_b', last_round_size_cr: 600, valuation_cr: 48000, revenue_cr: 1300, year: 2024, city: 'Bangalore', business_model: 'freemium', source: 'media_report' },
  { name: 'Unacademy', sector: 'edtech', stage_at_round: 'series_b', last_round_size_cr: 440, valuation_cr: 24000, revenue_cr: 850, year: 2023, city: 'Bangalore', business_model: 'freemium', source: 'Tracxn' },
  { name: 'Nykaa', sector: 'd2c', stage_at_round: 'series_c_plus', last_round_size_cr: 200, valuation_cr: 55000, revenue_cr: 5300, year: 2024, city: 'Mumbai', business_model: 'ecommerce_product', source: 'public_announcement' },
  { name: 'Pharmeasy', sector: 'healthtech_services', stage_at_round: 'series_c_plus', last_round_size_cr: 1200, valuation_cr: 45000, revenue_cr: 2800, year: 2023, city: 'Mumbai', business_model: 'ecommerce_product', source: 'Tracxn' },
  { name: 'Swiggy', sector: 'ecommerce_grocery', stage_at_round: 'series_c_plus', last_round_size_cr: 700, valuation_cr: 80000, revenue_cr: 8500, year: 2024, city: 'Bangalore', business_model: 'marketplace_commission', source: 'public_announcement' },
  { name: 'Urban Company', sector: 'marketplace', stage_at_round: 'series_b', last_round_size_cr: 250, valuation_cr: 16000, revenue_cr: 600, year: 2023, city: 'Gurgaon', business_model: 'marketplace_commission', source: 'Tracxn' },
  { name: 'Groww', sector: 'fintech_insurance', stage_at_round: 'series_b', last_round_size_cr: 500, valuation_cr: 25000, revenue_cr: 1200, year: 2024, city: 'Bangalore', business_model: 'transaction_based', source: 'media_report' },
  { name: 'Jupiter', sector: 'fintech_banking', stage_at_round: 'series_a', last_round_size_cr: 250, valuation_cr: 3500, revenue_cr: 150, year: 2023, city: 'Bangalore', business_model: 'freemium', source: 'Tracxn' },
  { name: 'Tracxn', sector: 'saas', stage_at_round: 'series_c_plus', last_round_size_cr: 100, valuation_cr: 2000, revenue_cr: 250, year: 2023, city: 'Bangalore', business_model: 'saas_subscription', source: 'public_announcement' },
  { name: 'Ather Energy', sector: 'auto_mobility', stage_at_round: 'series_b', last_round_size_cr: 400, valuation_cr: 8500, revenue_cr: 1800, year: 2024, city: 'Bangalore', business_model: 'hardware_software', source: 'public_announcement' },
  { name: 'Rivigo', sector: 'logistics', stage_at_round: 'series_b', last_round_size_cr: 100, valuation_cr: 7500, revenue_cr: 1000, year: 2023, city: 'Gurgaon', business_model: 'services', source: 'Tracxn' },
  { name: 'OYO Rooms', sector: 'travel_hospitality', stage_at_round: 'series_c_plus', last_round_size_cr: 1500, valuation_cr: 70000, revenue_cr: 5000, year: 2024, city: 'Gurgaon', business_model: 'marketplace_commission', source: 'public_announcement' },
  { name: 'Leadsquared', sector: 'saas', stage_at_round: 'series_a', last_round_size_cr: 120, valuation_cr: 2500, revenue_cr: 300, year: 2023, city: 'Bangalore', business_model: 'saas_subscription', source: 'Tracxn' },
]

const STAGE_ORDER: Stage[] = ['idea', 'pre_seed', 'seed', 'pre_series_a', 'series_a', 'series_b', 'series_c_plus']

/**
 * Find top N comparable companies for given sector and stage.
 * 1. Filter: same sector, stage within ±1
 * 2. Sort by revenue proximity (if revenue), else stage proximity + recency
 * 3. Return top N
 */
export function findComparables(
  sector: StartupCategory,
  stage: Stage,
  revenue_cr: number | null,
  topN: number = 5
): ComparableCompany[] {
  const stageIdx = STAGE_ORDER.indexOf(stage)
  const minStageIdx = Math.max(0, stageIdx - 1)
  const maxStageIdx = Math.min(STAGE_ORDER.length - 1, stageIdx + 1)
  const validStages = STAGE_ORDER.slice(minStageIdx, maxStageIdx + 1)

  let candidates = COMPARABLE_COMPANIES.filter(c =>
    c.sector === sector && validStages.includes(c.stage_at_round)
  )

  // If not enough from same sector + stage range, widen stage range
  if (candidates.length < topN) {
    const widerCandidates = COMPARABLE_COMPANIES.filter(c =>
      c.sector === sector && !validStages.includes(c.stage_at_round)
    )
    candidates = [...candidates, ...widerCandidates]
  }

  // If still not enough, include cross-sector
  if (candidates.length < topN) {
    const remaining = COMPARABLE_COMPANIES.filter(c =>
      c.sector !== sector
    )
    candidates = [...candidates, ...remaining]
  }

  // Sort
  if (revenue_cr !== null && revenue_cr > 0) {
    candidates.sort((a, b) => {
      const aDiff = a.revenue_cr !== null ? Math.abs(a.revenue_cr - revenue_cr) : Infinity
      const bDiff = b.revenue_cr !== null ? Math.abs(b.revenue_cr - revenue_cr) : Infinity
      return aDiff - bDiff
    })
  } else {
    candidates.sort((a, b) => {
      const aStageProximity = Math.abs(STAGE_ORDER.indexOf(a.stage_at_round) - stageIdx)
      const bStageProximity = Math.abs(STAGE_ORDER.indexOf(b.stage_at_round) - stageIdx)
      if (aStageProximity !== bStageProximity) return aStageProximity - bStageProximity
      return b.year - a.year // newer first
    })
  }

  return candidates.slice(0, topN)
}

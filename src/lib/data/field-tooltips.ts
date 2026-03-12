import type { StartupCategory } from '@/types'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

export interface TooltipContent {
  definition: string
  benchmark: string | null
  guidance: string
}

interface TooltipContext {
  sector: StartupCategory
}

function getSectorBenchmark(sector: StartupCategory) {
  const b = getDamodaranBenchmark(sector)
  return {
    grossMargin: b?.gross_margin ? `${(b.gross_margin * 100).toFixed(0)}%` : 'N/A',
    evRevenue: b?.ev_revenue ? `${b.ev_revenue.toFixed(1)}x` : 'N/A',
    wacc: b?.wacc ? `${(b.wacc * 100).toFixed(1)}%` : 'N/A',
    beta: b?.beta ? b.beta.toFixed(2) : 'N/A',
  }
}

type TooltipFn = (ctx: TooltipContext) => TooltipContent

export const FIELD_TOOLTIPS: Record<string, TooltipFn> = {
  annual_revenue: (ctx) => ({
    definition: 'Total revenue earned in the last 12 months (trailing twelve months). Use 0 if pre-revenue.',
    benchmark: `${ctx.sector} median EV/Revenue: ${getSectorBenchmark(ctx.sector).evRevenue} (Damodaran India)`,
    guidance: 'Use audited financials if available. For early-stage, use MIS or bank statements. Include all revenue streams.',
  }),

  revenue_growth_pct: () => ({
    definition: 'Year-over-year revenue growth rate as a percentage.',
    benchmark: null,
    guidance: 'If less than 12 months old, annualize current run rate. Growth > 100% is common for early-stage.',
  }),

  gross_margin_pct: (ctx) => ({
    definition: 'Revenue minus direct costs (COGS), divided by revenue, as a percentage.',
    benchmark: `${ctx.sector} average: ${getSectorBenchmark(ctx.sector).grossMargin} (Damodaran India)`,
    guidance: 'Include only costs directly tied to delivering your product (hosting, APIs, direct labor). Exclude sales, marketing, and admin costs.',
  }),

  monthly_burn: () => ({
    definition: 'Total monthly cash outflow including salaries, rent, AWS, marketing — everything.',
    benchmark: null,
    guidance: 'Check last 3 months of bank statements. Include founder salaries. Exclude one-time capital expenses.',
  }),

  cash_in_bank: () => ({
    definition: 'Current cash and cash equivalents available. Includes FDs and liquid mutual funds.',
    benchmark: null,
    guidance: 'Use today\'s bank balance. Do not include receivables or committed funding that hasn\'t been disbursed.',
  }),

  tam: (ctx) => ({
    definition: 'Total Addressable Market — the total revenue opportunity available if you captured 100% of your target market, in Rs Crores.',
    benchmark: `${ctx.sector} companies typically cite TAM of Rs 1,000-50,000 Cr`,
    guidance: 'Use bottom-up (customers × deal size) or top-down (market report × India share). Cite your source.',
  }),

  team_size: () => ({
    definition: 'Total full-time employees including founders. Exclude contractors and interns.',
    benchmark: null,
    guidance: 'Count only people on payroll. Include full-time remote employees.',
  }),

  founder_experience: () => ({
    definition: 'Average years of relevant industry experience across founding team (1-5 scale).',
    benchmark: null,
    guidance: '1 = fresh graduate, 2 = 2-5 years, 3 = 5-10 years, 4 = 10-15 years with leadership, 5 = 15+ years with domain exits.',
  }),

  competition_level: () => ({
    definition: 'How crowded is your market? (1-5 scale)',
    benchmark: null,
    guidance: '1 = no direct competitors, 2 = 1-2 competitors, 3 = 3-5 competitors, 4 = 6-10 established players, 5 = highly commoditized market.',
  }),

  esop_pool_pct: () => ({
    definition: 'Percentage of total shares reserved for employee stock options.',
    benchmark: 'Indian startups typically reserve 10-15% pre-Series A, 15-20% post-Series A.',
    guidance: 'Check your SHA or cap table. If not set up yet, 10% is a common starting point.',
  }),

  target_raise: () => ({
    definition: 'How much capital you plan to raise in your next round, in Rs.',
    benchmark: null,
    guidance: 'Typically 18-24 months of runway at planned burn rate. Round to clean numbers (Rs 5 Cr, Rs 10 Cr).',
  }),
}

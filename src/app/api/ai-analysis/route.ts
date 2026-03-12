import { NextRequest, NextResponse } from 'next/server'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import type { StartupCategory, ValuationPurpose, DamodaranBenchmark } from '@/types'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  const { createClient } = require('@supabase/supabase-js')
  return createClient(url, key)
}

function getAnthropic() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return null
  const Anthropic = require('@anthropic-ai/sdk').default
  return new Anthropic({ apiKey })
}

const PURPOSE_FRAMING: Record<ValuationPurpose, string> = {
  indicative: 'Quick directional estimate for internal decision-making.',
  fundraising: 'Valuation for fundraising discussions with VCs and angel investors. Frame from investor perspective.',
  esop: 'ESOP fair market value determination under Section 17(2) of Income Tax Act. Frame for compensation committee and board approval.',
  rule_11ua: 'Valuation under Rule 11UA for share premium justification and Section 56(2)(viib) compliance. Cite regulatory requirements.',
  fema: 'Valuation under FEMA NDI Rules for foreign investment pricing. DCF is mandatory method. Reference RBI pricing guidelines.',
  ma: 'Valuation for M&A advisory. Include fairness opinion context, IBC downside, and negotiation range analysis.',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildPrompt(existing: Record<string, any>, purpose: ValuationPurpose, damodaranBenchmark: DamodaranBenchmark | null): string {
  const runway = (existing.monthly_burn as number) > 0
    ? Math.round((existing.cash_in_bank as number) / (existing.monthly_burn as number))
    : 'N/A'

  const recovery = existing.ibc_recovery_range
    ? `${(existing.ibc_recovery_range as { low: number; high: number }).low}-${(existing.ibc_recovery_range as { low: number; high: number }).high}%`
    : 'N/A'

  return `You are a senior Indian startup valuation professional writing a report section.

CONTEXT:
- Company: ${existing.company_name}, ${existing.sector}, ${existing.stage}
- Purpose: ${PURPOSE_FRAMING[purpose]}

DATA (do not recompute — use these exact numbers):
- Revenue: Rs ${existing.annual_revenue}, Growth: ${existing.revenue_growth_pct}%, Gross Margin: ${existing.gross_margin_pct}%
- Burn: Rs ${existing.monthly_burn}/month, Runway: ${runway} months
- Team: ${existing.founder_experience}/5 experience, ${existing.domain_expertise}/5 domain expertise, Previous exits: ${existing.previous_exits}
- Product: ${existing.dev_stage}, Competition: ${existing.competition_level}/5
- TAM: Rs ${existing.tam} Cr
- Competitive advantages: ${existing.competitive_advantages}
- Valuation range: Rs ${existing.valuation_low}–${existing.valuation_high}
- Composite value: Rs ${existing.valuation_mid}
- Confidence score: ${existing.confidence_score}/100
- Damodaran India multiples: ${existing.sector} trades at ${damodaranBenchmark ? `${(damodaranBenchmark.ev_revenue as number).toFixed(1)}x EV/Revenue` : 'N/A'}
- IBC context: Companies in ${existing.sector} recover ${recovery} in insolvency scenarios

${existing.method_results ? `METHOD RESULTS: ${JSON.stringify(existing.method_results)}` : ''}

WRITE the following sections in professional valuer tone:

1. EXECUTIVE SUMMARY (2-3 paragraphs): Company overview, valuation conclusion, key drivers.

2. METHOD RATIONALE: For each applied method, 2-3 sentences explaining why it was used and what it reveals. Reference IVS 105 methodology standards.

3. RECONCILIATION: Explain the weight assignments across methods. Why was this weighting scheme appropriate for a ${existing.stage}-stage ${existing.sector} company?

4. KEY RISKS (3-5 bullet points): Specific risks an investor would flag. Reference actual numbers.

5. RECOMMENDATIONS (3-5 actionable items): Purpose-specific. Be tactical, not generic.

6. PURPOSE CONTEXT: ${PURPOSE_FRAMING[purpose]}

STYLE: Active voice, cite specific numbers, explain causation. Write for a board presentation audience.
Do NOT use generic phrases like "Based on the inputs provided" or "The calculated value is."
Use INR. Reference Indian market context. Be direct, not diplomatic.`
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase()
    const anthropic = getAnthropic()

    if (!supabase) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    if (!anthropic) {
      return NextResponse.json({ error: 'AI service not configured' }, { status: 503 })
    }

    const { valuation_id } = await req.json()
    if (!valuation_id) {
      return NextResponse.json({ error: 'Missing valuation_id' }, { status: 400 })
    }

    // Check cache first — fetch all needed fields including purpose and method_results
    const { data: existing } = await supabase
      .from('valuations')
      .select('ai_narrative, company_name, sector, stage, annual_revenue, revenue_growth_pct, gross_margin_pct, monthly_burn, cash_in_bank, founder_experience, domain_expertise, previous_exits, dev_stage, competition_level, tam, competitive_advantages, valuation_low, valuation_mid, valuation_high, confidence_score, ibc_recovery_range, method_results, purpose, paid_purpose')
      .eq('id', valuation_id)
      .single()

    if (!existing) {
      return NextResponse.json({ error: 'Valuation not found' }, { status: 404 })
    }

    // Return cached if available
    if (existing.ai_narrative) {
      return NextResponse.json({ narrative: existing.ai_narrative })
    }

    // Rate limit: 100 AI calls per day
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const { count: dailyCount } = await supabase
      .from('valuations')
      .select('id', { count: 'exact', head: true })
      .not('ai_narrative', 'is', null)
      .gte('created_at', todayStart.toISOString())

    if ((dailyCount ?? 0) >= 100) {
      return NextResponse.json({ error: 'Daily AI analysis limit reached. Try again tomorrow.' }, { status: 429 })
    }

    const purpose: ValuationPurpose = existing.purpose || existing.paid_purpose || 'indicative'
    const damodaranBenchmark = getDamodaranBenchmark(existing.sector as StartupCategory)
    const prompt = buildPrompt(existing, purpose, damodaranBenchmark)

    // Use Sonnet for paid purposes, Haiku for free
    const model = purpose === 'indicative'
      ? 'claude-haiku-4-5-20251001'
      : 'claude-sonnet-4-5-20241022'

    const message = await anthropic.messages.create({
      model,
      max_tokens: purpose === 'indicative' ? 500 : 1500,
      messages: [{ role: 'user', content: prompt }],
    })

    const narrative = message.content[0].type === 'text' ? message.content[0].text : ''

    // Cache in Supabase
    await supabase
      .from('valuations')
      .update({ ai_narrative: narrative })
      .eq('id', valuation_id)

    return NextResponse.json({ narrative })
  } catch (err) {
    console.error('AI analysis error:', err)
    return NextResponse.json({ error: 'AI analysis unavailable' }, { status: 500 })
  }
}

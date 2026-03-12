import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendValuationEmail } from '@/lib/email'
import { formatINR } from '@/lib/utils'
import type { CaptureRequest } from '@/types'
import { EMAIL_REGEX } from '@/lib/utils'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as CaptureRequest & { purpose?: string }
    const { email, valuation_inputs: inputs, valuation_result: result, purpose } = body

    // Validate required fields
    if (!email || !inputs.company_name || !inputs.sector || !inputs.stage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const sanitize = (s: string | null | undefined) =>
      s ? s.replace(/<[^>]*>/g, '').trim() : s

    let reportId = 'local'

    // Try Supabase save
    const supabase = getSupabase()
    if (supabase) {
      const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
      const { count } = await supabase
        .from('valuations')
        .select('id', { count: 'exact', head: true })
        .eq('ip_address', ip)
        .gte('created_at', oneHourAgo)

      if ((count ?? 0) >= 10) {
        return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 })
      }

      const { data: user } = await supabase
        .from('users')
        .upsert({ email }, { onConflict: 'email' })
        .select('id')
        .single()

      const { data: valuation, error } = await supabase
        .from('valuations')
        .insert({
          user_id: user?.id,
          ip_address: ip,
          email,
          company_name: sanitize(inputs.company_name),
          sector: inputs.sector,
          stage: inputs.stage,
          annual_revenue: inputs.annual_revenue,
          revenue_growth_pct: inputs.revenue_growth_pct,
          gross_margin_pct: inputs.gross_margin_pct,
          monthly_burn: inputs.monthly_burn,
          cash_in_bank: inputs.cash_in_bank,
          tam: inputs.tam,
          team_size: inputs.team_size,
          founder_experience: inputs.founder_experience,
          domain_expertise: inputs.domain_expertise,
          previous_exits: inputs.previous_exits,
          dev_stage: inputs.dev_stage,
          competitive_advantages: sanitize(inputs.competitive_advantages?.join(', ')),
          competition_level: inputs.competition_level,
          esop_pool_pct: inputs.esop_pool_pct,
          time_to_liquidity_years: inputs.time_to_liquidity_years,
          target_raise: inputs.target_raise,
          current_cap_table: inputs.current_cap_table,
          valuation_low: result.composite_low,
          valuation_mid: result.composite_value,
          valuation_high: result.composite_high,
          confidence_score: result.confidence_score,
          method_results: result.methods,
          monte_carlo_percentiles: result.monte_carlo,
          ibc_recovery_range: result.ibc_recovery_range,
          purpose: purpose || 'indicative',
        })
        .select('id')
        .single()

      if (!error && valuation) {
        reportId = valuation.id
      }
    }

    // Send email (non-blocking — don't fail the request if email fails)
    const applicableMethods = result.methods.filter((m: { applicable: boolean }) => m.applicable).length
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://firstunicornstartup.com'

    sendValuationEmail({
      to: email,
      companyName: inputs.company_name,
      compositeValue: formatINR(result.composite_value),
      compositeRange: `${formatINR(result.composite_low)} — ${formatINR(result.composite_high)}`,
      confidenceScore: result.confidence_score,
      methodCount: applicableMethods,
      reportUrl: reportId !== 'local' ? `${baseUrl}/report/${reportId}` : undefined,
    }).catch(err => console.error('[capture] Email send failed:', err))

    return NextResponse.json({ report_id: reportId })
  } catch (err) {
    console.error('Capture error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

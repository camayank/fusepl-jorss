import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { EMAIL_REGEX } from '@/lib/utils'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key || url.includes('placeholder')) return null
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  try {
    const { email, source_article, source_pillar, lead_magnet } = await req.json()

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = getSupabase()

    if (supabase) {
      // Upsert into content_subscribers
      const { error } = await supabase
        .from('content_subscribers')
        .upsert(
          {
            email,
            source_article: source_article || null,
            source_pillar: source_pillar || null,
            lead_magnet: lead_magnet || null,
            subscribed_at: new Date().toISOString(),
          },
          { onConflict: 'email' },
        )

      if (error) {
        console.error('[content-subscribe] Supabase error:', error)
      }

      // Also upsert into users table for unified lead tracking
      try {
        await supabase
          .from('users')
          .upsert({ email }, { onConflict: 'email' })
      } catch {
        // Non-critical — continue
      }
    }

    // TODO: Send welcome email via Resend when configured
    // await sendContentWelcomeEmail({ to: email, pillar: source_pillar })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[content-subscribe] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

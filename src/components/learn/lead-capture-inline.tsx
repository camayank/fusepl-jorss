'use client'

import { useState } from 'react'
import { Loader2, ArrowRight, CheckCircle, Gift } from 'lucide-react'
import { getLeadMagnet } from '@/lib/lead-magnets'

interface Props {
  pillar: string
  articleSlug?: string
  variant?: 'inline' | 'footer'
}

export function LeadCaptureInline({ pillar, articleSlug, variant = 'inline' }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [captured, setCaptured] = useState(false)
  const [error, setError] = useState('')

  const magnet = getLeadMagnet(pillar)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/content-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source_article: articleSlug || null,
          source_pillar: pillar,
          lead_magnet: magnet.title,
        }),
      })

      if (res.ok) {
        setCaptured(true)
      } else {
        setError('Something went wrong. Try again.')
      }
    } catch {
      setError('Something went wrong. Try again.')
    }

    setLoading(false)
  }

  if (captured) {
    return (
      <div className={`rounded-2xl p-8 text-center ${variant === 'footer' ? 'bg-[oklch(0.62_0.22_330/0.04)] border border-[oklch(0.62_0.22_330/0.15)]' : 'glass-card'}`}>
        <CheckCircle className="w-10 h-10 mx-auto mb-4 text-[oklch(0.65 0.16 155)]" />
        <p className="font-heading text-xl text-[oklch(0.15 0.02 260)] mb-2">You&apos;re In</p>
        <p className="text-sm text-[oklch(0.45 0.01 260)]">
          Check your inbox for {magnet.title.toLowerCase()}. We&apos;ll send you weekly founder insights — no spam, ever.
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl overflow-hidden ${variant === 'footer' ? '' : 'my-10'}`}>
      <div
        className="relative p-8 border border-[oklch(0.62_0.22_330/0.15)]"
        style={{
          background: 'linear-gradient(135deg, oklch(0.62 0.22 330 / 0.04), oklch(0.75 0.18 162 / 0.04))',
          borderRadius: '1rem',
        }}
      >
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[oklch(0.62_0.22_330)] to-transparent" />

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Left — copy */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[oklch(0.62_0.22_330/0.12)] flex items-center justify-center">
                <Gift className="w-4 h-4 text-[oklch(0.62 0.22 330)]" />
              </div>
              <span className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em]">
                Free Resource
              </span>
            </div>
            <h3 className="font-heading text-xl text-[oklch(0.15 0.02 260)] mb-2">
              {magnet.title}
            </h3>
            <p className="text-sm text-[oklch(0.45 0.01 260)] leading-relaxed">
              {magnet.description}
            </p>
          </div>

          {/* Right — form */}
          <div className="w-full sm:w-[280px] shrink-0">
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="founder@startup.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 text-sm rounded-xl bg-[oklch(0.985 0.002 260)] border border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.55_0.01_250)] focus:outline-none focus:border-[oklch(0.62_0.22_330/0.4)] focus:shadow-[0_0_0_3px_oklch(0.62_0.22_330/0.06)] transition-all"
              />
              <button
                type="submit"
                disabled={!email || loading}
                className="group w-full h-12 text-sm font-semibold rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_4px_16px_oklch(0_0_0/0.15)] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-press"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {magnet.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            <p className="text-[10px] text-[oklch(0.55 0.01 260)] text-center mt-2">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

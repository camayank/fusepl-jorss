'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader2, ArrowRight, CheckCircle, X, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getLeadMagnet } from '@/lib/lead-magnets'

const DISMISS_KEY = 'fus_email_popup_dismissed'
const DISMISS_DAYS = 7

interface Props {
  pillar: string
  articleSlug?: string
}

export function ContentEmailPopup({ pillar, articleSlug }: Props) {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [captured, setCaptured] = useState(false)

  const magnet = getLeadMagnet(pillar)

  const dismiss = useCallback(() => {
    setShow(false)
    localStorage.setItem(DISMISS_KEY, Date.now().toString())
  }, [])

  useEffect(() => {
    // Check if dismissed recently
    const dismissed = localStorage.getItem(DISMISS_KEY)
    if (dismissed) {
      const elapsed = Date.now() - parseInt(dismissed)
      if (elapsed < DISMISS_DAYS * 24 * 60 * 60 * 1000) return
    }

    // Check if already subscribed
    if (localStorage.getItem('fus_subscribed')) return

    let triggered = false
    const trigger = () => {
      if (triggered) return
      triggered = true
      setShow(true)
    }

    // Trigger 1: Exit intent (mouse leaves viewport top)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger()
    }

    // Trigger 2: 60% scroll depth
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      if (scrollPercent >= 60) trigger()
    }

    // Trigger 3: 45 seconds on page
    const timer = setTimeout(trigger, 45000)

    document.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return
    setLoading(true)

    try {
      await fetch('/api/content-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source_article: articleSlug || null,
          source_pillar: pillar,
          lead_magnet: magnet.title,
        }),
      })
      setCaptured(true)
      localStorage.setItem('fus_subscribed', 'true')
    } catch {
      // Still show success — don't block UX on API failure
      setCaptured(true)
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[oklch(0.10_0.02_260/0.5)] backdrop-blur-sm"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[101] inset-0 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-[oklch(0.985_0.002_260)] rounded-2xl border border-[oklch(0.91_0.005_260)] shadow-2xl overflow-hidden">
              {/* Accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[oklch(0.62_0.22_330)] via-[oklch(0.75_0.18_162)] to-[oklch(0.62_0.22_330)]" />

              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-[oklch(0.50_0.01_260)] hover:text-[oklch(0.20_0.02_260)] hover:bg-[oklch(0.96_0.005_260)] transition-colors z-10"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[oklch(0.62_0.22_330/0.06)] blur-[80px] pointer-events-none" />

              <div className="relative p-8">
                {captured ? (
                  <div className="text-center py-4">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-[oklch(0.65 0.16 155)]" />
                    <p className="font-heading text-2xl text-[oklch(0.15 0.02 260)] mb-2">Welcome Aboard</p>
                    <p className="text-sm text-[oklch(0.45 0.01 260)] mb-6">
                      Check your inbox for {magnet.title.toLowerCase()}.
                    </p>
                    <button
                      onClick={dismiss}
                      className="btn-press h-11 px-6 text-sm font-semibold rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024]"
                    >
                      Continue Reading
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-[oklch(0.62_0.22_330/0.1)] flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-[oklch(0.62 0.22 330)]" />
                      </div>
                      <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-2">
                        Before You Go
                      </p>
                      <h2 className="font-heading text-2xl text-[oklch(0.15 0.02 260)] mb-2">
                        {magnet.title}
                      </h2>
                      <p className="text-sm text-[oklch(0.45 0.01 260)] leading-relaxed max-w-sm mx-auto">
                        {magnet.description}
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                      <input
                        type="email"
                        placeholder="founder@startup.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoFocus
                        className="w-full h-12 px-4 text-sm rounded-xl bg-[oklch(0.985 0.002 260)] border border-[oklch(0.91 0.005 260)] text-[oklch(0.20 0.02 260)] placeholder:text-[oklch(0.55_0.01_250)] focus:outline-none focus:border-[oklch(0.62_0.22_330/0.4)] focus:shadow-[0_0_0_3px_oklch(0.62_0.22_330/0.06)] transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!email || loading}
                        className="group w-full h-12 text-sm font-semibold rounded-xl bg-[#32373c] text-white transition-all hover:bg-[#1d2024] hover:shadow-[0_4px_16px_oklch(0_0_0/0.15)] disabled:opacity-40 flex items-center justify-center gap-2 btn-press"
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

                    <p className="text-[10px] text-[oklch(0.55 0.01 260)] text-center mt-3">
                      Join 1,000+ founders. No spam. Unsubscribe anytime.
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

'use client'

import { Lock } from 'lucide-react'
import { PURPOSE_LABELS, PURPOSE_PRICES, type ValuationPurpose } from '@/types'

interface Props {
  purpose: ValuationPurpose
  paidPurpose: ValuationPurpose | null
  children: React.ReactNode
}

function formatPrice(paise: number): string {
  return `Rs ${(paise / 100).toLocaleString('en-IN')}`
}

/**
 * Wraps report sections that require payment to view.
 * If the user has paid (paidPurpose matches or exceeds purpose), shows children.
 * If the purpose is 'indicative', shows children (free tier shows everything unlocked for indicative).
 * Otherwise, renders children behind a CSS blur with lock overlay.
 */
export function GatedSection({ purpose, paidPurpose, children }: Props) {
  // Indicative purpose: all content is free
  if (purpose === 'indicative') return <>{children}</>

  // User has paid for this purpose
  if (paidPurpose && paidPurpose === purpose) return <>{children}</>

  const price = PURPOSE_PRICES[purpose]

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Actual content rendered behind blur */}
      <div className="blur-md opacity-50 pointer-events-none select-none">
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/30">
        <div className="flex flex-col items-center gap-2 bg-slate-950/80 backdrop-blur-sm px-6 py-4 rounded-xl border border-slate-700">
          <Lock className="h-5 w-5 text-amber-400" />
          <span className="text-sm text-white font-medium">
            Unlock with {PURPOSE_LABELS[purpose]}
          </span>
          {price > 0 && (
            <span className="text-xs text-amber-400">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </div>
  )
}

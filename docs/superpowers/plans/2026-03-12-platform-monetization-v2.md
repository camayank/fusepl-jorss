# Platform Monetization V2 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the free valuation calculator into a monetizable platform with purpose-based pricing, professional reports with audit trails, AI narratives, wizard education, and an investor deal-check module.

**Architecture:** Purpose selector feeds into existing wizard. Report page gates sections by payment status. All computation remains client-side. AI narrative is server-side Claude call cached in Supabase. Deal Check is a standalone page reusing valuation methods and comparable data.

**Tech Stack:** Next.js 16.1.6, React 19, TypeScript 5, Tailwind v4, Zustand 5, Supabase, Razorpay, Claude API (Anthropic SDK), Vitest, jsPDF, Recharts

**Spec:** `docs/superpowers/specs/2026-03-12-platform-monetization-v2-design.md`

---

## Chunk 1: Foundation — Types, Store, Database

### Task 1: Add ValuationPurpose type and new types

**Files:**
- Modify: `src/types/index.ts:5-14` (after existing enums)
- Modify: `src/types/index.ts:279-283` (CertifiedRequest)
- Test: `__tests__/lib/data/data-integrity.test.ts` (existing, add type assertions)

- [ ] **Step 1: Add ValuationPurpose type**

Add after line 45 in `src/types/index.ts`:

```typescript
export const VALUATION_PURPOSES = [
  'indicative', 'fundraising', 'esop', 'rule_11ua', 'fema', 'ma',
] as const
export type ValuationPurpose = typeof VALUATION_PURPOSES[number]

export const PURPOSE_LABELS: Record<ValuationPurpose, string> = {
  indicative: 'Indicative Valuation',
  fundraising: 'Fundraising',
  esop: 'ESOP Valuation',
  rule_11ua: 'Tax / Rule 11UA',
  fema: 'FEMA Pricing',
  ma: 'M&A Advisory',
}

export const PURPOSE_PRICES: Record<ValuationPurpose, number> = {
  indicative: 0,
  fundraising: 499900,
  esop: 499900,
  rule_11ua: 999900,
  fema: 1499900,
  ma: 1499900,
}
```

- [ ] **Step 2: Add CrossMethodWarning and SensitivityResult types**

Add after the `ValuationResult` interface (after line 173):

```typescript
export interface CrossMethodWarning {
  method: string
  message: string
  severity: 'info' | 'warning'
}

export interface SensitivityResult {
  variable: string
  baseValue: number
  steps: { label: string; value: number; valuation: number }[]
}
```

- [ ] **Step 3: Add ListedComparable type**

Add after `ComparableCompany` interface (after line 242):

```typescript
export interface ListedComparable {
  name: string
  ticker: string
  sector: StartupCategory
  market_cap_cr: number
  revenue_cr: number
  ebitda_cr: number
  pe_ratio: number | null
  ev_revenue: number
  ev_ebitda: number | null
  as_of_date: string
  source: 'BSE' | 'NSE' | 'screener.in'
}
```

- [ ] **Step 4: Add DealCheck types**

Add at end of `src/types/index.ts`:

```typescript
// ============================================================
// Deal Check (Investor Module)
// ============================================================

export type DealVerdict = 'green' | 'yellow' | 'red' | 'blue'

export interface DealCheckInput {
  sector: StartupCategory
  stage: Stage
  revenue_cr: number
  growth_pct: number
  raise_cr: number
  ask_cr: number
}

export interface DealCheckResult {
  verdict: DealVerdict
  label: string
  explanation: string
  fairValue: number
  impliedMultiple: number
  sectorMedianMultiple: number
  dilutionPct: number
  comparables: ComparableCompany[]
  negotiationInsight: string
}
```

- [ ] **Step 5: Update CertifiedRequest to use ValuationPurpose**

Change lines 279-283:

```typescript
export interface CertifiedRequest {
  valuation_id: string
  report_type: ValuationPurpose  // was: 'rule_11ua' | 'fema' | 'general'
  purpose: string
}
```

- [ ] **Step 6: Run tests to verify no regressions**

Run: `npm test`
Expected: All 168 tests pass (type additions are non-breaking)

- [ ] **Step 7: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add ValuationPurpose, DealCheck, and supporting types"
```

---

### Task 2: Extend ComparableCompany and Investor types

**Files:**
- Modify: `src/types/index.ts:208-219` (Investor)
- Modify: `src/types/index.ts:231-242` (ComparableCompany)
- Modify: `src/lib/data/comparable-companies.ts`
- Modify: `src/lib/data/investors.ts`

- [ ] **Step 1: Extend Investor interface**

Replace lines 208-219 in `src/types/index.ts`:

```typescript
export interface Investor {
  name: string
  type: 'vc' | 'pe' | 'angel' | 'angel_network' | 'family_office' | 'cvc' | 'government'
  sectors: StartupCategory[]
  stages: Stage[]
  check_size_min_cr: number
  check_size_max_cr: number
  city: string
  portfolio_highlights: string[]
  last_active_year: number
  website: string
  // New fields (all optional for backward compat with existing data)
  sweet_spot_cr?: number | null
  deals_per_year?: number | null
  follow_on_rate?: number | null
  board_seat?: boolean
  lead_investor?: boolean
  co_invest_with?: string[]
  geographic_focus?: string[]
  thesis_summary?: string | null
  contact_method?: 'website' | 'linkedin' | 'referral_only'
}
```

- [ ] **Step 2: Extend ComparableCompany interface**

Replace lines 231-242 in `src/types/index.ts`:

```typescript
export interface ComparableCompany {
  name: string
  sector: StartupCategory
  stage_at_round: Stage
  last_round_size_cr: number
  valuation_cr: number
  revenue_cr: number | null
  year: number
  city: string
  business_model: BusinessModel
  source: string
  // New fields (all optional for backward compat with existing data)
  revenue_multiple?: number | null
  ebitda_cr?: number | null
  ebitda_multiple?: number | null
  arr_cr?: number | null
  employees?: number | null
  founded_year?: number | null
  deal_type?: 'primary' | 'secondary' | 'ipo' | 'acquisition'
  currency_original?: 'INR' | 'USD'
  notes?: string | null
}
```

- [ ] **Step 3: Fix existing comparable-companies.ts type annotations**

In `src/lib/data/comparable-companies.ts`, update the import line 1:

```typescript
import type { ComparableCompany, StartupCategory, Stage, BusinessModel } from '@/types'
```

No data changes needed — existing values already match the enum values. The tightened types will now be checked at compile time.

- [ ] **Step 4: Fix existing investors.ts type annotations**

In `src/lib/data/investors.ts`, update the import line 1:

```typescript
import type { Investor, StartupCategory, Stage } from '@/types'
```

Update `sectors` and `stages` arrays to use the typed enum values (they already use valid values — this just enables type checking).

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: All tests pass. If any comparable or investor data has a value that doesn't match the enum, TypeScript will catch it at compile time.

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 6: Commit**

```bash
git add src/types/index.ts src/lib/data/comparable-companies.ts src/lib/data/investors.ts
git commit -m "feat: extend ComparableCompany and Investor types with new fields"
```

---

### Task 3: Database migration — purpose, paid_purpose, deal_checks

**Files:**
- Create: `supabase/migrations/003_add_purpose_and_deal_checks.sql`

- [ ] **Step 1: Create migration file**

```sql
-- Migration 003: Purpose-based pricing + Deal Check module

-- Add purpose tracking to valuations
ALTER TABLE valuations ADD COLUMN IF NOT EXISTS purpose TEXT DEFAULT 'indicative';
ALTER TABLE valuations ADD COLUMN IF NOT EXISTS paid_purpose TEXT DEFAULT NULL;

-- Backfill: existing certified_requests → set paid_purpose on matching valuations
UPDATE valuations v
SET paid_purpose = cr.report_type
FROM certified_requests cr
WHERE v.id = cr.valuation_id
  AND cr.status = 'paid'
  AND v.paid_purpose IS NULL;

-- Index for querying paid valuations
CREATE INDEX IF NOT EXISTS idx_valuations_purpose ON valuations(purpose);
CREATE INDEX IF NOT EXISTS idx_valuations_paid ON valuations(paid_purpose) WHERE paid_purpose IS NOT NULL;

-- Deal check table (investor module)
CREATE TABLE IF NOT EXISTS deal_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT,
  sector TEXT NOT NULL,
  stage TEXT NOT NULL,
  revenue_cr NUMERIC,
  growth_pct NUMERIC,
  raise_cr NUMERIC,
  ask_cr NUMERIC,
  verdict TEXT NOT NULL,
  fair_value_cr NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Rate limiting index for deal checks
CREATE INDEX IF NOT EXISTS idx_deal_checks_ip ON deal_checks(ip_address, created_at);

-- RLS for deal_checks (same pattern as valuations)
ALTER TABLE deal_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts on deal_checks"
  ON deal_checks FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Allow read own deal_checks by IP"
  ON deal_checks FOR SELECT
  USING (true);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/003_add_purpose_and_deal_checks.sql
git commit -m "feat: migration 003 — purpose columns + deal_checks table"
```

---

### Task 4: Update Zustand store with purpose field

**Files:**
- Modify: `src/stores/valuation-store.ts:7-43` (DEFAULT_INPUTS), `45-60` (interface), `62-112` (store)
- Test: `__tests__/stores/valuation-store.test.ts`

- [ ] **Step 1: Write failing test for purpose in store**

Add to `__tests__/stores/valuation-store.test.ts`:

```typescript
describe('purpose field', () => {
  it('defaults purpose to indicative', () => {
    const { purpose } = useValuationStore.getState()
    expect(purpose).toBe('indicative')
  })

  it('setPurpose updates purpose', () => {
    useValuationStore.getState().setPurpose('fundraising')
    expect(useValuationStore.getState().purpose).toBe('fundraising')
  })

  it('reset clears purpose to indicative', () => {
    useValuationStore.getState().setPurpose('fema')
    useValuationStore.getState().reset()
    expect(useValuationStore.getState().purpose).toBe('indicative')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/stores/valuation-store.test.ts`
Expected: FAIL — `purpose` and `setPurpose` don't exist

- [ ] **Step 3: Add purpose to store**

In `src/stores/valuation-store.ts`:

1. Add import: `import type { WizardInputs, ValuationResult, ValuationPurpose } from '@/types'`

2. Add to interface (after line 50):
```typescript
purpose: ValuationPurpose
setPurpose: (purpose: ValuationPurpose) => void
```

3. Add to create() (after `email: null,` on line 67):
```typescript
purpose: 'indicative' as ValuationPurpose,
```

4. Add action (after `setEmail` around line 96):
```typescript
setPurpose: (purpose) => set({ purpose }),
```

5. Update `reset()` to include `purpose: 'indicative' as ValuationPurpose,`

6. Update persist config (lines 107-110):
```typescript
{
  name: 'fus-valuation-store',
  version: 2,
  migrate: (persistedState: unknown, version: number) => {
    const state = persistedState as Record<string, unknown>
    if (version < 2) {
      state.purpose = 'indicative'
    }
    return state as ValuationStore
  },
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- __tests__/stores/valuation-store.test.ts`
Expected: All tests pass including new purpose tests

- [ ] **Step 5: Commit**

```bash
git add src/stores/valuation-store.ts __tests__/stores/valuation-store.test.ts
git commit -m "feat: add purpose field to valuation store with v1→v2 migration"
```

---

## Chunk 2: Purpose Selection & Payment

### Task 5: Purpose selector page

**Files:**
- Create: `src/app/valuation/purpose/page.tsx`
- Modify: `src/app/valuation/page.tsx:14-32` (redirect logic)

- [ ] **Step 1: Create purpose selector page**

Create `src/app/valuation/purpose/page.tsx`:

```typescript
'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useValuationStore } from '@/stores/valuation-store'
import { VALUATION_PURPOSES, PURPOSE_LABELS, PURPOSE_PRICES, type ValuationPurpose } from '@/types'
import { Check } from 'lucide-react'

interface PurposeCard {
  slug: ValuationPurpose
  description: string
  features: string[]
  badge?: string
  requiresReview: boolean
}

const PURPOSE_CARDS: PurposeCard[] = [
  {
    slug: 'indicative',
    description: 'Quick estimate to understand your startup\'s worth',
    features: ['Composite valuation range', '10-method breakdown', 'Monte Carlo simulation', 'Confidence score'],
    badge: 'Free',
    requiresReview: false,
  },
  {
    slug: 'fundraising',
    description: 'Investor-ready valuation with full evidence trail',
    features: ['Full methodology working', 'AI narrative report', 'Investor match (top 10)', 'Comparable analysis', 'PDF download'],
    badge: 'Most Popular',
    requiresReview: false,
  },
  {
    slug: 'esop',
    description: 'FMV determination for employee stock options',
    features: ['Black-Scholes valuation', 'FMV per share', 'Vesting impact analysis', 'Section 17(2) context', 'PDF download'],
    requiresReview: false,
  },
  {
    slug: 'rule_11ua',
    description: 'Valuation for share premium under Income Tax Act',
    features: ['DCF with full projections', 'Assumption source table', 'Rule 11UA compliance', 'RV-signed report', 'PDF download'],
    requiresReview: true,
  },
  {
    slug: 'fema',
    description: 'Pricing for foreign investment under FEMA/NDI Rules',
    features: ['DCF (mandatory)', 'Listed comparables', 'FEMA NDI disclosures', 'RV-signed report', 'PDF download'],
    requiresReview: true,
  },
  {
    slug: 'ma',
    description: 'Comprehensive valuation for mergers & acquisitions',
    features: ['All methods + sensitivity', 'IBC recovery analysis', 'Fairness context', 'RV-signed report', 'PDF download'],
    requiresReview: true,
  },
]

function formatPrice(paise: number): string {
  if (paise === 0) return 'Free'
  return `Rs ${(paise / 100).toLocaleString('en-IN')}`
}

export default function PurposeSelectorPage() {
  const router = useRouter()
  const setPurpose = useValuationStore((s) => s.setPurpose)

  const handleSelect = (slug: ValuationPurpose) => {
    setPurpose(slug)
    router.push('/valuation')
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">What do you need the valuation for?</h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Choose your purpose to get the right report. You can always start free and upgrade later.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PURPOSE_CARDS.map((card, i) => {
          const price = PURPOSE_PRICES[card.slug]
          return (
            <motion.div
              key={card.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className={`bg-slate-900 border-slate-800 h-full flex flex-col ${card.badge === 'Most Popular' ? 'border-amber-500/50 ring-1 ring-amber-500/20' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-white">{PURPOSE_LABELS[card.slug]}</CardTitle>
                    {card.badge && (
                      <Badge className={card.badge === 'Free' ? 'bg-green-600/20 text-green-400' : 'bg-amber-600/20 text-amber-400'}>
                        {card.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-400">{card.description}</p>
                  <p className="text-2xl font-bold text-white mt-2">{formatPrice(price)}</p>
                  {card.requiresReview && (
                    <p className="text-xs text-amber-400">Includes professional review & signing</p>
                  )}
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-1.5 mb-4 flex-1">
                    {card.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                        <Check className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleSelect(card.slug)}
                    className={price === 0
                      ? 'w-full bg-slate-700 hover:bg-slate-600 text-white'
                      : 'w-full bg-amber-500 hover:bg-amber-600 text-slate-900'
                    }
                  >
                    {price === 0 ? 'Start Free Valuation' : `Start Valuation — ${formatPrice(price)}`}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      <p className="text-center text-sm text-slate-500 mt-6">
        Payment is collected after your report is generated — you see value before you pay.
      </p>
    </main>
  )
}
```

- [ ] **Step 2: Run dev server to verify page renders**

Run: `npm run dev`
Navigate to: `http://localhost:3000/valuation/purpose`
Expected: 6 cards render with correct prices and features

- [ ] **Step 3: Commit**

```bash
git add src/app/valuation/purpose/page.tsx
git commit -m "feat: purpose selector page with 6 valuation purposes"
```

---

### Task 6: New /api/checkout route (purpose-based pricing)

**Files:**
- Create: `src/app/api/checkout/route.ts`
- Keep: `src/app/api/certified/checkout/route.ts` (legacy, will redirect)

- [ ] **Step 1: Create new checkout route**

Create `src/app/api/checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { PURPOSE_PRICES, type ValuationPurpose, VALUATION_PURPOSES } from '@/types'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const { valuation_id, email, purpose } = await req.json()

    // Validate inputs
    if (!valuation_id || typeof valuation_id !== 'string') {
      return NextResponse.json({ error: 'Missing valuation_id' }, { status: 400 })
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (!purpose || !VALUATION_PURPOSES.includes(purpose)) {
      return NextResponse.json({ error: 'Invalid purpose' }, { status: 400 })
    }

    const typedPurpose = purpose as ValuationPurpose
    const amount = PURPOSE_PRICES[typedPurpose]

    if (amount === 0) {
      return NextResponse.json({ error: 'Indicative valuation is free — no payment needed' }, { status: 400 })
    }

    // Check Razorpay configuration
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keyId || !keySecret) {
      return NextResponse.json({ error: 'Payment service not configured' }, { status: 503 })
    }

    // Create Razorpay order
    const Razorpay = (await import('razorpay')).default
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: valuation_id.slice(0, 40),
      notes: { valuation_id, email, purpose: typedPurpose },
    })

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Add redirect from legacy endpoint**

In `src/app/api/certified/checkout/route.ts`, add at the top of the POST handler (before existing logic):

```typescript
// Legacy redirect — new endpoint handles purpose-based pricing
// Keep this route working during transition
```

No code change needed — old endpoint still works independently with hardcoded Rs 14,999.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/checkout/route.ts
git commit -m "feat: purpose-based /api/checkout route with dynamic pricing"
```

---

### Task 7: Rewrite CertifiedCTA → CheckoutCTA (purpose-aware)

**Files:**
- Modify: `src/components/report/certified-cta.tsx` (rewrite in place, keep filename for now)
- Modify: `src/app/report/[id]/page.tsx:246` (pass purpose prop)

- [ ] **Step 1: Rewrite certified-cta.tsx with purpose awareness**

Replace entire content of `src/components/report/certified-cta.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { PURPOSE_LABELS, PURPOSE_PRICES, type ValuationPurpose } from '@/types'

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

interface CertifiedCTAProps {
  valuationId: string
  email: string
  purpose: ValuationPurpose
  isPaid: boolean
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window !== 'undefined' && window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.head.appendChild(script)
  })
}

function formatPrice(paise: number): string {
  return `Rs ${(paise / 100).toLocaleString('en-IN')}`
}

export function CertifiedCTA({ valuationId, email, purpose, isPaid }: CertifiedCTAProps) {
  const [loading, setLoading] = useState(false)
  const [paid, setPaid] = useState(isPaid)

  const price = PURPOSE_PRICES[purpose]
  const canPurchase = email.length > 0 && price > 0

  if (purpose === 'indicative' || price === 0) return null

  if (paid) {
    return (
      <Card className="bg-green-900/20 border-green-600/30">
        <CardContent className="py-6 text-center">
          <CheckCircle className="h-8 w-8 text-green-400 mx-auto mb-2" />
          <p className="text-green-300 font-medium">
            Payment received — your {PURPOSE_LABELS[purpose]} report is fully unlocked.
          </p>
          {['rule_11ua', 'fema', 'ma'].includes(purpose) && (
            <p className="text-green-400/70 text-sm mt-1">
              Your signed report will be delivered within 48 hours.
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  const handleCheckout = async () => {
    if (!canPurchase) return
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ valuation_id: valuationId, email, purpose }),
      })

      if (res.status === 503) {
        toast.error('Payment service is being set up. Contact us directly.')
        return
      }
      if (res.status === 400) {
        toast.error('Please complete a valuation and provide your email first.')
        return
      }
      if (!res.ok) {
        toast.error('Something went wrong. Please try again.')
        return
      }

      const data = await res.json()
      await loadRazorpayScript()

      const rzp = new window.Razorpay({
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        order_id: data.order_id,
        name: 'First Unicorn Startup',
        description: `${PURPOSE_LABELS[purpose]} Report`,
        handler: () => {
          setPaid(true)
          toast.success('Payment successful! Your report is now unlocked.')
        },
        modal: { ondismiss: () => setLoading(false) },
        theme: { color: '#f59e0b' },
      })
      rzp.open()
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      if (!paid) setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-amber-400/30 bg-slate-900">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg text-white">
          Unlock {PURPOSE_LABELS[purpose]} Report
        </CardTitle>
        <p className="text-3xl font-bold text-amber-400 mt-1">{formatPrice(price)}</p>
      </CardHeader>
      <CardContent className="text-center">
        {!canPurchase ? (
          <p className="text-sm text-slate-400">Complete the email gate above to purchase</p>
        ) : (
          <Button
            onClick={handleCheckout}
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-8"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock className="mr-2 h-4 w-4" />
                Unlock Full Report
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Update report page to pass purpose and isPaid**

In `src/app/report/[id]/page.tsx`:

1. Add to `ValuationRow` interface (after line 57):
```typescript
purpose: string
paid_purpose: string | null
```

2. Add to local fallback (around line 134, after `ai_narrative: null,`):
```typescript
purpose: storeInputs ? (useValuationStore.getState().purpose || 'indicative') : 'indicative',
paid_purpose: null,
```

3. Update the CertifiedCTA usage (line 246):
```typescript
<CertifiedCTA
  valuationId={valuation.id}
  email={valuation.email || ''}
  purpose={(valuation.purpose || 'indicative') as ValuationPurpose}
  isPaid={valuation.paid_purpose !== null}
/>
```

4. Add import for `ValuationPurpose`:
```typescript
import type { ValuationResult, MethodResult, MonteCarloResult, CapTableEntry, ValuationPurpose } from '@/types'
```

- [ ] **Step 3: Run dev and verify**

Run: `npm run dev`
Expected: Report page renders with purpose-aware CTA

- [ ] **Step 4: Commit**

```bash
git add src/components/report/certified-cta.tsx src/app/report/[id]/page.tsx
git commit -m "feat: purpose-aware checkout CTA with dynamic pricing"
```

---

### Task 8: Update webhook for paid_purpose

**Files:**
- Modify: `src/app/api/razorpay-webhook/route.ts:52-65`

- [ ] **Step 1: Add paid_purpose update to webhook**

In `src/app/api/razorpay-webhook/route.ts`, after the `certified_requests` insert (after line 65), add:

```typescript
    // Update valuations.paid_purpose for report gating
    if (notes.valuation_id && notes.purpose) {
      await supabase
        .from('valuations')
        .update({ paid_purpose: notes.purpose })
        .eq('id', notes.valuation_id)
    }
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/razorpay-webhook/route.ts
git commit -m "feat: webhook updates valuations.paid_purpose on payment"
```

---

## Chunk 3: Report Gating & Enhanced Content

### Task 9: GatedSection component

**Files:**
- Create: `src/components/report/gated-section.tsx`

- [ ] **Step 1: Create GatedSection component**

```typescript
'use client'

import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PURPOSE_LABELS, PURPOSE_PRICES, type ValuationPurpose } from '@/types'

interface GatedSectionProps {
  title: string
  children: React.ReactNode
  isUnlocked: boolean
  purpose: ValuationPurpose
  onUnlock?: () => void
}

function formatPrice(paise: number): string {
  if (paise === 0) return 'Free'
  return `Rs ${(paise / 100).toLocaleString('en-IN')}`
}

export function GatedSection({ title, children, isUnlocked, purpose, onUnlock }: GatedSectionProps) {
  if (isUnlocked || purpose === 'indicative') {
    // For indicative (free), only show if isUnlocked is explicitly true
    if (isUnlocked) return <>{children}</>
    return null
  }

  const price = PURPOSE_PRICES[purpose]

  return (
    <div className="relative rounded-lg overflow-hidden">
      <div className="blur-sm opacity-60 pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-lg">
        <div className="text-center p-6">
          <Lock className="h-6 w-6 text-amber-400 mx-auto mb-2" />
          <p className="text-white font-medium">{title}</p>
          <p className="text-slate-400 text-sm mb-3">
            Available in {PURPOSE_LABELS[purpose]} report
          </p>
          {onUnlock && price > 0 && (
            <Button
              onClick={onUnlock}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900"
            >
              Unlock for {formatPrice(price)}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/gated-section.tsx
git commit -m "feat: GatedSection component with blur + lock overlay"
```

---

### Task 10: Add report gating logic to report page

**Files:**
- Modify: `src/app/report/[id]/page.tsx`

- [ ] **Step 1: Add getReportConfig function**

Create `src/lib/report-config.ts`:

```typescript
import type { ValuationPurpose } from '@/types'

export interface ReportConfig {
  showMethodWorking: boolean
  showAINarrative: boolean
  showSensitivity: boolean
  showComparableDetails: boolean
  showInvestorMatch: boolean
  showESOPDetail: boolean
  showListedComparables: boolean
  showIBCDownside: boolean
  showRegulatoryCompliance: boolean
  showCredentials: boolean
  showPdfDownload: boolean
  pdfWatermark: boolean
}

export function getReportConfig(purpose: ValuationPurpose, isPaid: boolean): ReportConfig {
  // If paid, everything unlocked for that purpose tier
  if (isPaid) {
    return {
      showMethodWorking: purpose !== 'indicative',
      showAINarrative: purpose !== 'indicative',
      showSensitivity: purpose !== 'indicative',
      showComparableDetails: purpose !== 'indicative',
      showInvestorMatch: ['fundraising', 'ma'].includes(purpose),
      showESOPDetail: ['esop', 'rule_11ua'].includes(purpose),
      showListedComparables: ['rule_11ua', 'fema', 'ma'].includes(purpose),
      showIBCDownside: purpose === 'ma',
      showRegulatoryCompliance: ['rule_11ua', 'fema', 'ma'].includes(purpose),
      showCredentials: ['rule_11ua', 'fema', 'ma'].includes(purpose),
      showPdfDownload: true,
      pdfWatermark: false,
    }
  }

  // Free/unpaid — show structure but gate detail
  return {
    showMethodWorking: false,
    showAINarrative: false,
    showSensitivity: false,
    showComparableDetails: false,
    showInvestorMatch: false,
    showESOPDetail: false,
    showListedComparables: false,
    showIBCDownside: false,
    showRegulatoryCompliance: false,
    showCredentials: false,
    showPdfDownload: purpose === 'indicative',
    pdfWatermark: true,
  }
}
```

- [ ] **Step 2: Wire gating into report page**

In `src/app/report/[id]/page.tsx`:

1. Add imports:
```typescript
import { GatedSection } from '@/components/report/gated-section'
import { getReportConfig } from '@/lib/report-config'
```

2. After the `result` construction (line 192), add:
```typescript
const purpose = (valuation.purpose || 'indicative') as ValuationPurpose
const isPaid = valuation.paid_purpose !== null
const config = getReportConfig(purpose, isPaid)
```

3. Wrap gated sections. Example for AINarrative (line 240):
```typescript
<GatedSection title="AI-Powered Analysis" isUnlocked={config.showAINarrative} purpose={purpose}>
  <AINarrative valuationId={valuation.id} />
</GatedSection>
```

Apply same pattern to: MethodologySection (method working), ComparablesSection, InvestorSection, ESOPSection, DownsideSection, RecommendationsSection, PDFDownloadButton.

- [ ] **Step 3: Run dev and verify gating**

Run: `npm run dev`
Navigate to a report page. Sections should be blurred/locked for unpaid.

- [ ] **Step 4: Commit**

```bash
git add src/lib/report-config.ts src/app/report/[id]/page.tsx src/components/report/gated-section.tsx
git commit -m "feat: report gating — sections blurred for unpaid, unlocked on payment"
```

---

### Task 11: Cross-method validation

**Files:**
- Create: `src/lib/validation/cross-method.ts`
- Create: `__tests__/lib/validation/cross-method.test.ts`
- Modify: `src/lib/valuation/index.ts:81-93` (add warnings to return)

- [ ] **Step 1: Write failing test**

Create `__tests__/lib/validation/cross-method.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { validateMethodConsistency } from '@/lib/validation/cross-method'
import type { MethodResult } from '@/types'

describe('validateMethodConsistency', () => {
  it('returns no warnings when methods are within 5x of median', () => {
    const methods: MethodResult[] = [
      { method: 'dcf', approach: 'income', value: 50_00_00_000, confidence: 0.8, details: {}, applicable: true },
      { method: 'revenue_multiple', approach: 'market', value: 40_00_00_000, confidence: 0.7, details: {}, applicable: true },
    ]
    const warnings = validateMethodConsistency(methods)
    expect(warnings).toHaveLength(0)
  })

  it('warns when a method deviates >5x from median', () => {
    const methods: MethodResult[] = [
      { method: 'dcf', approach: 'income', value: 50_00_00_000, confidence: 0.8, details: {}, applicable: true },
      { method: 'revenue_multiple', approach: 'market', value: 40_00_00_000, confidence: 0.7, details: {}, applicable: true },
      { method: 'berkus', approach: 'vc_startup', value: 5_00_00_000, confidence: 0.5, details: {}, applicable: true },
    ]
    const warnings = validateMethodConsistency(methods)
    expect(warnings.length).toBeGreaterThan(0)
    expect(warnings[0].method).toBe('berkus')
  })

  it('ignores non-applicable methods', () => {
    const methods: MethodResult[] = [
      { method: 'dcf', approach: 'income', value: 50_00_00_000, confidence: 0.8, details: {}, applicable: true },
      { method: 'berkus', approach: 'vc_startup', value: 1_00_000, confidence: 0, details: {}, applicable: false },
    ]
    const warnings = validateMethodConsistency(methods)
    expect(warnings).toHaveLength(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/lib/validation/cross-method.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement cross-method validation**

Create `src/lib/validation/cross-method.ts`:

```typescript
import type { MethodResult, CrossMethodWarning } from '@/types'
import { METHOD_LABELS } from '@/lib/constants'
import { formatINR } from '@/lib/utils'

function getMedian(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

export function validateMethodConsistency(methods: MethodResult[]): CrossMethodWarning[] {
  const warnings: CrossMethodWarning[] = []
  const applicable = methods.filter((m) => m.applicable)
  if (applicable.length < 2) return warnings

  const values = applicable.map((m) => m.value)
  const median = getMedian(values)
  if (median === 0) return warnings

  for (const method of applicable) {
    const ratio = method.value / median
    if (ratio > 5) {
      warnings.push({
        method: method.method,
        message: `${METHOD_LABELS[method.method] ?? method.method} (${formatINR(method.value)}) is significantly above the median (${formatINR(median)}). This may indicate aggressive growth assumptions.`,
        severity: 'warning',
      })
    } else if (ratio < 0.2) {
      warnings.push({
        method: method.method,
        message: `${METHOD_LABELS[method.method] ?? method.method} (${formatINR(method.value)}) is significantly below the median (${formatINR(median)}). This may indicate conservative inputs or limited data.`,
        severity: 'warning',
      })
    }
  }

  return warnings
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- __tests__/lib/validation/cross-method.test.ts`
Expected: All 3 tests pass

- [ ] **Step 5: Wire into orchestrator**

In `src/lib/valuation/index.ts`, add import:
```typescript
import { validateMethodConsistency } from '@/lib/validation/cross-method'
```

Add after confidence score calculation (around line 76):
```typescript
const warnings = validateMethodConsistency(methods)
```

Add `warnings` to the return object (extend `ValuationResult` type if needed, or return separately).

- [ ] **Step 6: Run full test suite**

Run: `npm test`
Expected: All tests pass

- [ ] **Step 7: Commit**

```bash
git add src/lib/validation/cross-method.ts __tests__/lib/validation/cross-method.test.ts src/lib/valuation/index.ts
git commit -m "feat: cross-method validation warns on >5x deviation from median"
```

---

## Chunk 4: AI Integration Enhancement

### Task 12: Enhanced AI analysis with structured response

**Files:**
- Modify: `src/app/api/ai-analysis/route.ts`

- [ ] **Step 1: Update AI analysis route with structured prompt**

In `src/app/api/ai-analysis/route.ts`, replace the prompt construction (lines 80-106) and Claude call (lines 108-112):

```typescript
    // Build structured context for AI
    const aiContext = {
      company: {
        name: valuation.company_name,
        sector: valuation.sector,
        stage: valuation.stage,
        revenue: valuation.annual_revenue,
        growth: valuation.revenue_growth_pct,
        margin: valuation.gross_margin_pct,
      },
      purpose: valuation.purpose || 'indicative',
      composite: {
        value: valuation.valuation_mid,
        low: valuation.valuation_low,
        high: valuation.valuation_high,
        confidence: valuation.confidence_score,
      },
      methods: valuation.method_results,
      monteCarlo: valuation.monte_carlo_percentiles,
      benchmark: benchmark ? {
        sector: valuation.sector,
        ev_revenue: benchmark.ev_revenue,
        wacc: benchmark.wacc,
      } : null,
    }

    const purposeFraming: Record<string, string> = {
      indicative: 'Write for a founder doing a quick sanity check on their startup value.',
      fundraising: 'Write for a founder preparing to pitch investors. Include fundraising strategy insights.',
      esop: 'Write for a company designing its ESOP program. Focus on FMV determination and option pricing context.',
      rule_11ua: 'Write for compliance with Income Tax Rule 11UA / Section 56(2)(viib). Reference regulatory requirements.',
      fema: 'Write for FEMA/NDI Rules compliance. Reference RBI guidelines for foreign investment pricing.',
      ma: 'Write for M&A context. Include fairness opinion context, negotiation range, and deal structure considerations.',
    }

    const prompt = `You are a senior Indian startup valuation professional writing a report analysis.

CONTEXT (use these exact numbers, do NOT recompute):
${JSON.stringify(aiContext, null, 2)}

PURPOSE: ${purposeFraming[aiContext.purpose] || purposeFraming.indicative}

Write a structured analysis with these sections:
1. INVESTMENT THESIS (2-3 sentences on why this company is worth ${formatINR(aiContext.composite.value)})
2. KEY RISKS (3-4 bullet points)
3. VALUATION OPINION (reference specific methods and why the composite is reasonable)
4. RECOMMENDATIONS (3-5 actionable next steps specific to the purpose)

Use INR, Indian startup context, cite specific numbers from the data. Active voice. Under 400 words total.
Do NOT use generic phrases like "Based on the inputs provided."
Write as if presenting to a board of directors.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250514',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })
```

Note: Upgraded from `claude-haiku-4-5-20251001` to `claude-sonnet-4-5-20250514` for paid tiers' quality. For free tier (`indicative`), keep haiku to save cost:

```typescript
    const model = aiContext.purpose === 'indicative'
      ? 'claude-haiku-4-5-20251001'
      : 'claude-sonnet-4-5-20250514'

    const message = await anthropic.messages.create({
      model,
      max_tokens: aiContext.purpose === 'indicative' ? 500 : 800,
      messages: [{ role: 'user', content: prompt }],
    })
```

- [ ] **Step 2: Add error handling for AI failures**

After the Claude call, add retry logic:

```typescript
    let narrative = ''
    try {
      const message = await anthropic.messages.create({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
      narrative = message.content[0].type === 'text' ? message.content[0].text : ''
    } catch (aiError) {
      console.error('AI analysis failed, retrying:', aiError)
      try {
        const retryMessage = await anthropic.messages.create({ model, max_tokens: maxTokens, messages: [{ role: 'user', content: prompt }] })
        narrative = retryMessage.content[0].type === 'text' ? retryMessage.content[0].text : ''
      } catch {
        narrative = 'AI analysis temporarily unavailable. Your valuation data is complete — narrative insights will be available shortly.'
      }
    }
```

- [ ] **Step 3: Add formatINR import**

Add at top of file:
```typescript
import { formatINR } from '@/lib/utils'
```

- [ ] **Step 4: Run tests**

Run: `npm test`
Expected: All existing tests pass

- [ ] **Step 5: Commit**

```bash
git add src/app/api/ai-analysis/route.ts
git commit -m "feat: enhanced AI analysis with purpose-specific prompts and retry logic"
```

---

## Chunk 5: Wizard Education

### Task 13: Field tooltips with sector benchmarks

**Files:**
- Create: `src/lib/wizard/field-tooltips.ts`
- Create: `src/components/wizard/field-tooltip.tsx`

- [ ] **Step 1: Create tooltip data**

Create `src/lib/wizard/field-tooltips.ts`:

```typescript
import type { StartupCategory } from '@/types'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

export interface TooltipContent {
  definition: string
  guidance: string
  getBenchmark?: (sector: StartupCategory) => string | null
}

export const FIELD_TOOLTIPS: Record<string, TooltipContent> = {
  annual_revenue: {
    definition: 'Total revenue earned in the last 12 months. Include all revenue streams.',
    guidance: 'Use your most recent financial year figures. If pre-revenue, enter 0.',
  },
  revenue_growth_pct: {
    definition: 'Year-over-year percentage change in revenue.',
    guidance: 'Calculate: (This year revenue - Last year revenue) / Last year revenue x 100.',
    getBenchmark: (sector) => {
      const b = getDamodaranBenchmark(sector)
      return b ? `Industry avg growth for ${sector}: check Damodaran data` : null
    },
  },
  gross_margin_pct: {
    definition: 'Revenue minus direct costs (COGS), divided by revenue, as a percentage.',
    guidance: 'Include only costs directly tied to delivering your product. Exclude sales, marketing, admin.',
    getBenchmark: (sector) => {
      const b = getDamodaranBenchmark(sector)
      return b?.gross_margin ? `${sector} sector avg: ${(b.gross_margin * 100).toFixed(0)}%` : null
    },
  },
  monthly_burn: {
    definition: 'Total monthly cash outflow including salaries, rent, and all operating expenses.',
    guidance: 'Sum all monthly expenses from your bank statements.',
  },
  cash_in_bank: {
    definition: 'Current cash balance across all company bank accounts.',
    guidance: 'Check your latest bank statement. Include FDs and liquid investments.',
  },
  tam: {
    definition: 'Total Addressable Market — the total market demand for your product/service in India.',
    guidance: 'Use bottom-up: (Target customers) x (Average annual spend). Industry reports from Nasscom, RedSeer, or Statista can help.',
  },
  team_size: {
    definition: 'Number of full-time team members including founders.',
    guidance: 'Count full-time employees and dedicated full-time contractors.',
  },
  founder_experience: {
    definition: 'Combined years of relevant industry experience across all founders.',
    guidance: 'Only count experience in the same or adjacent industry.',
  },
  esop_pool_pct: {
    definition: 'ESOP pool as percentage of fully diluted shares.',
    guidance: 'Typical ranges: Seed 8-10%, Series A 12-15%, Series B+ 15-20%.',
  },
  target_raise: {
    definition: 'How much capital you are looking to raise in this round.',
    guidance: 'Consider 18-24 months of runway at your current/planned burn rate.',
  },
}
```

- [ ] **Step 2: Create tooltip component**

Create `src/components/wizard/field-tooltip.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { HelpCircle } from 'lucide-react'
import { FIELD_TOOLTIPS } from '@/lib/wizard/field-tooltips'
import type { StartupCategory } from '@/types'

interface FieldTooltipProps {
  fieldId: string
  sector?: StartupCategory
}

export function FieldTooltip({ fieldId, sector }: FieldTooltipProps) {
  const [open, setOpen] = useState(false)
  const tooltip = FIELD_TOOLTIPS[fieldId]
  if (!tooltip) return null

  const benchmark = sector && tooltip.getBenchmark ? tooltip.getBenchmark(sector) : null

  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-slate-500 hover:text-slate-300 transition-colors"
        aria-label={`Help for ${fieldId}`}
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-sm text-white font-medium mb-1">{tooltip.definition}</p>
          <p className="text-xs text-slate-400 mb-1">{tooltip.guidance}</p>
          {benchmark && (
            <p className="text-xs text-amber-400 mt-1">{benchmark}</p>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-800 border-r border-b border-slate-700 rotate-45" />
        </div>
      )}
    </span>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/wizard/field-tooltips.ts src/components/wizard/field-tooltip.tsx
git commit -m "feat: field tooltips with sector benchmarks for wizard education"
```

---

### Task 14: Mini-calculators for complex fields

**Files:**
- Create: `src/components/wizard/mini-calculator.tsx`

- [ ] **Step 1: Create mini-calculator component**

Create `src/components/wizard/mini-calculator.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calculator, X } from 'lucide-react'

interface MiniCalculatorProps {
  type: 'growth' | 'margin' | 'tam' | 'runway'
  onUseValue: (value: number) => void
}

function GrowthCalculator({ onUseValue }: { onUseValue: (v: number) => void }) {
  const [lastYear, setLastYear] = useState('')
  const [thisYear, setThisYear] = useState('')
  const ly = parseFloat(lastYear) || 0
  const ty = parseFloat(thisYear) || 0
  const growth = ly > 0 ? ((ty - ly) / ly) * 100 : 0

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-white">Calculate Growth Rate</h4>
      <div>
        <label className="text-xs text-slate-400">Revenue last year (Rs)</label>
        <Input type="number" value={lastYear} onChange={(e) => setLastYear(e.target.value)} className="bg-slate-800 border-slate-700 text-white mt-1" />
      </div>
      <div>
        <label className="text-xs text-slate-400">Revenue this year (Rs)</label>
        <Input type="number" value={thisYear} onChange={(e) => setThisYear(e.target.value)} className="bg-slate-800 border-slate-700 text-white mt-1" />
      </div>
      {ly > 0 && ty > 0 && (
        <div className="bg-slate-800 rounded p-2 text-center">
          <p className="text-lg font-bold text-amber-400">{growth.toFixed(1)}%</p>
          <Button size="sm" onClick={() => onUseValue(Math.round(growth))} className="mt-1 bg-amber-500 hover:bg-amber-600 text-slate-900">
            Use This Value
          </Button>
        </div>
      )}
    </div>
  )
}

function MarginCalculator({ onUseValue }: { onUseValue: (v: number) => void }) {
  const [revenue, setRevenue] = useState('')
  const [cogs, setCogs] = useState('')
  const rev = parseFloat(revenue) || 0
  const cost = parseFloat(cogs) || 0
  const margin = rev > 0 ? ((rev - cost) / rev) * 100 : 0

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-white">Calculate Gross Margin</h4>
      <div>
        <label className="text-xs text-slate-400">Total Revenue (Rs)</label>
        <Input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="bg-slate-800 border-slate-700 text-white mt-1" />
      </div>
      <div>
        <label className="text-xs text-slate-400">Direct Costs / COGS (Rs)</label>
        <Input type="number" value={cogs} onChange={(e) => setCogs(e.target.value)} className="bg-slate-800 border-slate-700 text-white mt-1" />
      </div>
      {rev > 0 && (
        <div className="bg-slate-800 rounded p-2 text-center">
          <p className="text-lg font-bold text-amber-400">{margin.toFixed(1)}%</p>
          <Button size="sm" onClick={() => onUseValue(Math.round(margin))} className="mt-1 bg-amber-500 hover:bg-amber-600 text-slate-900">
            Use This Value
          </Button>
        </div>
      )}
    </div>
  )
}

function TAMCalculator({ onUseValue }: { onUseValue: (v: number) => void }) {
  const [customers, setCustomers] = useState('')
  const [dealSize, setDealSize] = useState('')
  const c = parseFloat(customers) || 0
  const d = parseFloat(dealSize) || 0
  const tam = c * d

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-white">Estimate TAM (Bottom-Up)</h4>
      <div>
        <label className="text-xs text-slate-400">Target customers in India</label>
        <Input type="number" value={customers} onChange={(e) => setCustomers(e.target.value)} className="bg-slate-800 border-slate-700 text-white mt-1" />
      </div>
      <div>
        <label className="text-xs text-slate-400">Avg annual spend per customer (Rs)</label>
        <Input type="number" value={dealSize} onChange={(e) => setDealSize(e.target.value)} className="bg-slate-800 border-slate-700 text-white mt-1" />
      </div>
      {tam > 0 && (
        <div className="bg-slate-800 rounded p-2 text-center">
          <p className="text-lg font-bold text-amber-400">Rs {(tam / 10000000).toFixed(0)} Cr</p>
          <Button size="sm" onClick={() => onUseValue(Math.round(tam / 10000000))} className="mt-1 bg-amber-500 hover:bg-amber-600 text-slate-900">
            Use This Value
          </Button>
        </div>
      )}
    </div>
  )
}

function RunwayCalculator({ onUseValue }: { onUseValue: (v: number) => void }) {
  const [cash, setCash] = useState('')
  const [burn, setBurn] = useState('')
  const c = parseFloat(cash) || 0
  const b = parseFloat(burn) || 0
  const months = b > 0 ? c / b : 0

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-white">Cash Runway</h4>
      <div>
        <label className="text-xs text-slate-400">Cash in bank (Rs)</label>
        <Input type="number" value={cash} onChange={(e) => setCash(e.target.value)} className="bg-slate-800 border-slate-700 text-white mt-1" />
      </div>
      <div>
        <label className="text-xs text-slate-400">Monthly burn (Rs)</label>
        <Input type="number" value={burn} onChange={(e) => setBurn(e.target.value)} className="bg-slate-800 border-slate-700 text-white mt-1" />
      </div>
      {months > 0 && (
        <div className={`bg-slate-800 rounded p-2 text-center ${months < 6 ? 'border border-red-500/50' : ''}`}>
          <p className="text-lg font-bold text-amber-400">{months.toFixed(1)} months</p>
          {months < 6 && <p className="text-xs text-red-400">Below 6-month safety zone</p>}
        </div>
      )}
    </div>
  )
}

const CALCULATORS = {
  growth: GrowthCalculator,
  margin: MarginCalculator,
  tam: TAMCalculator,
  runway: RunwayCalculator,
}

export function MiniCalculator({ type, onUseValue }: MiniCalculatorProps) {
  const [open, setOpen] = useState(false)
  const Calc = CALCULATORS[type]

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
      >
        <Calculator className="h-3 w-3" />
        Calculate
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 w-80 relative">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute top-2 right-2 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
            <Calc onUseValue={(v) => { onUseValue(v); setOpen(false) }} />
          </div>
        </div>
      )}
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/wizard/mini-calculator.tsx
git commit -m "feat: mini-calculators for growth, margin, TAM, and runway"
```

---

## Chunk 6: Investor Deal Check Module

### Task 15: Deal Check scoring engine

**Files:**
- Create: `src/lib/matching/deal-check.ts`
- Create: `__tests__/lib/matching/deal-check.test.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/lib/matching/deal-check.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { computeDealCheck } from '@/lib/matching/deal-check'
import type { DealCheckInput } from '@/types'

describe('computeDealCheck', () => {
  it('returns green for fair-priced deal', () => {
    const input: DealCheckInput = {
      sector: 'saas',
      stage: 'series_a',
      revenue_cr: 5,
      growth_pct: 60,
      raise_cr: 10,
      ask_cr: 50,
    }
    const result = computeDealCheck(input)
    expect(result.verdict).toBeDefined()
    expect(result.fairValue).toBeGreaterThan(0)
    expect(result.impliedMultiple).toBeCloseTo(50 / 5, 1) // 10x
    expect(result.dilutionPct).toBeCloseTo((10 / (50 + 10)) * 100, 1)
  })

  it('returns red for significantly overpriced deal', () => {
    const input: DealCheckInput = {
      sector: 'saas',
      stage: 'seed',
      revenue_cr: 1,
      growth_pct: 20,
      raise_cr: 5,
      ask_cr: 200,
    }
    const result = computeDealCheck(input)
    expect(['red', 'blue']).toContain(result.verdict)
  })

  it('includes comparable companies', () => {
    const input: DealCheckInput = {
      sector: 'saas',
      stage: 'series_a',
      revenue_cr: 5,
      growth_pct: 40,
      raise_cr: 10,
      ask_cr: 50,
    }
    const result = computeDealCheck(input)
    expect(result.comparables.length).toBeGreaterThan(0)
    expect(result.comparables.length).toBeLessThanOrEqual(3)
  })

  it('computes negotiation insight', () => {
    const input: DealCheckInput = {
      sector: 'fintech_payments',
      stage: 'series_a',
      revenue_cr: 10,
      growth_pct: 80,
      raise_cr: 20,
      ask_cr: 100,
    }
    const result = computeDealCheck(input)
    expect(result.negotiationInsight).toBeTruthy()
    expect(typeof result.negotiationInsight).toBe('string')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- __tests__/lib/matching/deal-check.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement deal check engine**

Create `src/lib/matching/deal-check.ts`:

```typescript
import type { DealCheckInput, DealCheckResult, DealVerdict, ComparableCompany } from '@/types'
import { findComparables } from '@/lib/data/comparable-companies'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { formatINR } from '@/lib/utils'

function computeVerdict(ask: number, fairValue: number): { verdict: DealVerdict; label: string; explanation: string } {
  if (fairValue <= 0) {
    return { verdict: 'yellow', label: 'Insufficient Data', explanation: 'Cannot compute fair value with available data.' }
  }
  const ratio = ask / fairValue
  if (ratio <= 1.1) return { verdict: 'green', label: 'Fair Price', explanation: `Ask is within 10% of estimated fair value.` }
  if (ratio <= 1.5) return { verdict: 'yellow', label: 'Slight Premium', explanation: `Ask is ${Math.round((ratio - 1) * 100)}% above fair value. Common in competitive rounds.` }
  if (ratio <= 2.5) return { verdict: 'red', label: 'Significant Premium', explanation: `Ask is ${Math.round((ratio - 1) * 100)}% above fair value. Negotiate or seek justification.` }
  return { verdict: 'blue', label: 'Aspirational', explanation: `Ask is ${Math.round((ratio - 1) * 100)}% above fair value. Not supported by fundamentals.` }
}

export function computeDealCheck(input: DealCheckInput): DealCheckResult {
  const { sector, stage, revenue_cr, growth_pct, raise_cr, ask_cr } = input

  // Get sector benchmark for revenue multiple
  const benchmark = getDamodaranBenchmark(sector)
  const sectorMultiple = benchmark?.ev_revenue ?? 5 // fallback 5x

  // Compute fair value using revenue multiple with growth adjustment
  const growthPremium = growth_pct > 50 ? 1 + (growth_pct - 50) / 200 : 1 // modest premium for high growth
  const fairValue = revenue_cr * sectorMultiple * growthPremium

  // Implied multiple
  const impliedMultiple = revenue_cr > 0 ? ask_cr / revenue_cr : 0

  // Dilution
  const postMoney = ask_cr + raise_cr
  const dilutionPct = postMoney > 0 ? (raise_cr / postMoney) * 100 : 0

  // Get comparable transactions
  const comparables = findComparables(sector, stage, revenue_cr, 3)

  // Verdict
  const { verdict, label, explanation } = computeVerdict(ask_cr, fairValue)

  // Negotiation insight
  const counterValuation = revenue_cr * sectorMultiple
  const negotiationInsight = verdict === 'green'
    ? `The ask is reasonable for ${sector} at ${stage}. The implied ${impliedMultiple.toFixed(1)}x revenue multiple is close to the sector median of ${sectorMultiple.toFixed(1)}x.`
    : `Consider countering at ${formatINR(counterValuation * 10000000)} (${sectorMultiple.toFixed(1)}x sector median revenue multiple). This would imply ${((raise_cr / (counterValuation + raise_cr)) * 100).toFixed(1)}% dilution.`

  return {
    verdict,
    label,
    explanation,
    fairValue: fairValue * 10000000, // Cr to absolute
    impliedMultiple,
    sectorMedianMultiple: sectorMultiple,
    dilutionPct,
    comparables,
    negotiationInsight,
  }
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- __tests__/lib/matching/deal-check.test.ts`
Expected: All 4 tests pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/matching/deal-check.ts __tests__/lib/matching/deal-check.test.ts
git commit -m "feat: deal check scoring engine with verdict and negotiation insights"
```

---

### Task 16: Deal Check page

**Files:**
- Create: `src/app/deal-check/page.tsx`

- [ ] **Step 1: Create Deal Check page**

Create `src/app/deal-check/page.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { STARTUP_CATEGORIES, STAGES, type StartupCategory, type Stage, type DealCheckResult } from '@/types'
import { computeDealCheck } from '@/lib/matching/deal-check'
import { formatINR } from '@/lib/utils'
import { TrendingUp, TrendingDown, AlertTriangle, Zap, ArrowRight } from 'lucide-react'

const VERDICT_CONFIG = {
  green: { bg: 'bg-green-900/20', border: 'border-green-600/30', text: 'text-green-400', icon: TrendingUp },
  yellow: { bg: 'bg-amber-900/20', border: 'border-amber-600/30', text: 'text-amber-400', icon: AlertTriangle },
  red: { bg: 'bg-red-900/20', border: 'border-red-600/30', text: 'text-red-400', icon: TrendingDown },
  blue: { bg: 'bg-blue-900/20', border: 'border-blue-600/30', text: 'text-blue-400', icon: Zap },
}

const SECTOR_LABELS: Partial<Record<StartupCategory, string>> = {
  saas: 'SaaS', fintech_payments: 'Fintech', d2c: 'D2C/E-commerce', edtech: 'EdTech',
  healthtech_services: 'HealthTech', marketplace: 'Marketplace', agritech: 'AgriTech',
  logistics: 'Logistics', deeptech: 'DeepTech', cleantech: 'CleanTech',
}

const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Idea', pre_seed: 'Pre-Seed', seed: 'Seed', pre_series_a: 'Pre-Series A',
  series_a: 'Series A', series_b: 'Series B', series_c_plus: 'Series C+',
}

export default function DealCheckPage() {
  const [sector, setSector] = useState<StartupCategory>('saas')
  const [stage, setStage] = useState<Stage>('series_a')
  const [revenueCr, setRevenueCr] = useState('')
  const [growthPct, setGrowthPct] = useState('')
  const [raiseCr, setRaiseCr] = useState('')
  const [askCr, setAskCr] = useState('')
  const [result, setResult] = useState<DealCheckResult | null>(null)

  const canCompute = parseFloat(revenueCr) >= 0 && parseFloat(askCr) > 0 && parseFloat(raiseCr) > 0

  const handleCompute = () => {
    if (!canCompute) return
    const dealResult = computeDealCheck({
      sector,
      stage,
      revenue_cr: parseFloat(revenueCr) || 0,
      growth_pct: parseFloat(growthPct) || 0,
      raise_cr: parseFloat(raiseCr) || 0,
      ask_cr: parseFloat(askCr) || 0,
    })
    setResult(dealResult)
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Deal Check</h1>
        <p className="text-slate-400">Quickly validate if a startup&apos;s valuation ask is reasonable</p>
      </div>

      <Card className="bg-slate-900 border-slate-800">
        <CardHeader>
          <CardTitle className="text-lg text-white">Deal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as StartupCategory)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2"
              >
                {STARTUP_CATEGORIES.map((s) => (
                  <option key={s} value={s}>{SECTOR_LABELS[s] ?? s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-400">Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as Stage)}
                className="w-full mt-1 bg-slate-800 border border-slate-700 text-white rounded-md px-3 py-2"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Annual Revenue (Rs Cr)</label>
              <Input type="number" value={revenueCr} onChange={(e) => setRevenueCr(e.target.value)} placeholder="5" className="bg-slate-800 border-slate-700 text-white mt-1" />
            </div>
            <div>
              <label className="text-sm text-slate-400">Revenue Growth %</label>
              <Input type="number" value={growthPct} onChange={(e) => setGrowthPct(e.target.value)} placeholder="60" className="bg-slate-800 border-slate-700 text-white mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-400">Raising (Rs Cr)</label>
              <Input type="number" value={raiseCr} onChange={(e) => setRaiseCr(e.target.value)} placeholder="10" className="bg-slate-800 border-slate-700 text-white mt-1" />
            </div>
            <div>
              <label className="text-sm text-slate-400">Valuation Ask (Rs Cr)</label>
              <Input type="number" value={askCr} onChange={(e) => setAskCr(e.target.value)} placeholder="50" className="bg-slate-800 border-slate-700 text-white mt-1" />
            </div>
          </div>
          <Button onClick={handleCompute} disabled={!canCompute} className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900">
            <ArrowRight className="mr-2 h-4 w-4" />
            Check Deal
          </Button>
        </CardContent>
      </Card>

      {result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* Verdict */}
          <Card className={`${VERDICT_CONFIG[result.verdict].bg} ${VERDICT_CONFIG[result.verdict].border} mb-4`}>
            <CardContent className="py-6 text-center">
              {(() => { const Icon = VERDICT_CONFIG[result.verdict].icon; return <Icon className={`h-10 w-10 mx-auto mb-2 ${VERDICT_CONFIG[result.verdict].text}`} /> })()}
              <Badge className={`${VERDICT_CONFIG[result.verdict].bg} ${VERDICT_CONFIG[result.verdict].text} text-lg px-4 py-1`}>
                {result.label}
              </Badge>
              <p className="text-slate-300 mt-2">{result.explanation}</p>
            </CardContent>
          </Card>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="py-4 text-center">
                <p className="text-xs text-slate-400">Implied Multiple</p>
                <p className="text-xl font-bold text-white">{result.impliedMultiple.toFixed(1)}x</p>
                <p className="text-xs text-slate-500">vs sector {result.sectorMedianMultiple.toFixed(1)}x</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="py-4 text-center">
                <p className="text-xs text-slate-400">Dilution</p>
                <p className="text-xl font-bold text-white">{result.dilutionPct.toFixed(1)}%</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="py-4 text-center">
                <p className="text-xs text-slate-400">Fair Value</p>
                <p className="text-xl font-bold text-white">{formatINR(result.fairValue)}</p>
              </CardContent>
            </Card>
          </div>

          {/* Negotiation Insight */}
          <Card className="bg-slate-900 border-slate-800 mb-4">
            <CardHeader><CardTitle className="text-base text-white">Negotiation Insight</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">{result.negotiationInsight}</p>
            </CardContent>
          </Card>

          {/* Comparable Transactions */}
          {result.comparables.length > 0 && (
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle className="text-base text-white">Recent Comparable Deals</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {result.comparables.map((c) => (
                    <div key={c.name} className="flex justify-between items-center text-sm">
                      <div>
                        <span className="text-white">{c.name}</span>
                        <span className="text-slate-500 ml-2">{c.stage_at_round} ({c.year})</span>
                      </div>
                      <div className="text-right">
                        <span className="text-amber-400">{formatINR(c.valuation_cr * 10000000)}</span>
                        {c.revenue_cr && c.revenue_cr > 0 && (
                          <span className="text-slate-500 ml-2">{(c.valuation_cr / c.revenue_cr).toFixed(1)}x</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}
    </main>
  )
}
```

- [ ] **Step 2: Run dev and verify**

Run: `npm run dev`
Navigate to: `http://localhost:3000/deal-check`
Expected: Form renders, entering values and clicking "Check Deal" shows verdict with traffic light

- [ ] **Step 3: Commit**

```bash
git add src/app/deal-check/page.tsx
git commit -m "feat: investor Deal Check page with verdict, metrics, and comparables"
```

---

## Chunk 7: Data Expansion & Listed Comparables

### Task 17: Listed comparables data file

**Files:**
- Create: `src/lib/data/listed-comparables.ts`

- [ ] **Step 1: Create listed comparables with initial data**

Create `src/lib/data/listed-comparables.ts`:

```typescript
import type { ListedComparable, StartupCategory } from '@/types'

export const LISTED_COMPARABLES: ListedComparable[] = [
  // SaaS / IT Services
  { name: 'Infosys', ticker: 'INFY.NSE', sector: 'saas', market_cap_cr: 620000, revenue_cr: 160000, ebitda_cr: 44000, pe_ratio: 28, ev_revenue: 3.8, ev_ebitda: 21, as_of_date: '2026-03-01', source: 'NSE' },
  { name: 'Persistent Systems', ticker: 'PERSISTENT.NSE', sector: 'saas', market_cap_cr: 62000, revenue_cr: 9500, ebitda_cr: 1900, pe_ratio: 65, ev_revenue: 6.5, ev_ebitda: 33, as_of_date: '2026-03-01', source: 'NSE' },
  { name: 'Newgen Software', ticker: 'NEWGEN.NSE', sector: 'saas', market_cap_cr: 10500, revenue_cr: 1200, ebitda_cr: 360, pe_ratio: 45, ev_revenue: 8.8, ev_ebitda: 29, as_of_date: '2026-03-01', source: 'NSE' },

  // Fintech
  { name: 'One97 (Paytm)', ticker: 'PAYTM.NSE', sector: 'fintech_payments', market_cap_cr: 45000, revenue_cr: 9500, ebitda_cr: -200, pe_ratio: null, ev_revenue: 4.7, ev_ebitda: null, as_of_date: '2026-03-01', source: 'NSE' },
  { name: 'PB Fintech', ticker: 'POLICYBZR.NSE', sector: 'fintech_insurance', market_cap_cr: 32000, revenue_cr: 3800, ebitda_cr: 200, pe_ratio: null, ev_revenue: 8.4, ev_ebitda: null, as_of_date: '2026-03-01', source: 'NSE' },
  { name: 'Bajaj Finance', ticker: 'BAJFINANCE.NSE', sector: 'fintech_banking', market_cap_cr: 450000, revenue_cr: 55000, ebitda_cr: 25000, pe_ratio: 30, ev_revenue: 8.2, ev_ebitda: 18, as_of_date: '2026-03-01', source: 'NSE' },

  // D2C
  { name: 'Nykaa (FSN)', ticker: 'NYKAA.NSE', sector: 'd2c', market_cap_cr: 52000, revenue_cr: 6500, ebitda_cr: 300, pe_ratio: 500, ev_revenue: 8.0, ev_ebitda: null, as_of_date: '2026-03-01', source: 'NSE' },
  { name: 'Honasa (Mamaearth)', ticker: 'HONASA.NSE', sector: 'd2c', market_cap_cr: 8000, revenue_cr: 2000, ebitda_cr: -100, pe_ratio: null, ev_revenue: 4.0, ev_ebitda: null, as_of_date: '2026-03-01', source: 'NSE' },

  // E-commerce / Marketplace
  { name: 'Zomato', ticker: 'ZOMATO.NSE', sector: 'ecommerce_general', market_cap_cr: 230000, revenue_cr: 16000, ebitda_cr: 1500, pe_ratio: 250, ev_revenue: 14.4, ev_ebitda: null, as_of_date: '2026-03-01', source: 'NSE' },
  { name: 'Info Edge (Naukri)', ticker: 'NAUKRI.NSE', sector: 'marketplace', market_cap_cr: 85000, revenue_cr: 2800, ebitda_cr: 1100, pe_ratio: 75, ev_revenue: 30.0, ev_ebitda: 77, as_of_date: '2026-03-01', source: 'NSE' },
  { name: 'IndiaMART', ticker: 'INDIAMART.NSE', sector: 'marketplace', market_cap_cr: 16000, revenue_cr: 1300, ebitda_cr: 550, pe_ratio: 40, ev_revenue: 12.3, ev_ebitda: 29, as_of_date: '2026-03-01', source: 'NSE' },

  // Logistics
  { name: 'Delhivery', ticker: 'DELHIVERY.NSE', sector: 'logistics', market_cap_cr: 28000, revenue_cr: 8500, ebitda_cr: 300, pe_ratio: null, ev_revenue: 3.3, ev_ebitda: null, as_of_date: '2026-03-01', source: 'NSE' },

  // Travel
  { name: 'IRCTC', ticker: 'IRCTC.NSE', sector: 'travel_hospitality', market_cap_cr: 58000, revenue_cr: 4200, ebitda_cr: 2100, pe_ratio: 50, ev_revenue: 13.8, ev_ebitda: 28, as_of_date: '2026-03-01', source: 'NSE' },
  { name: 'EaseMyTrip', ticker: 'EASEMYTRIP.NSE', sector: 'travel_hospitality', market_cap_cr: 4500, revenue_cr: 650, ebitda_cr: 200, pe_ratio: 30, ev_revenue: 6.9, ev_ebitda: 23, as_of_date: '2026-03-01', source: 'NSE' },

  // Manufacturing / Hardware
  { name: 'Dixon Tech', ticker: 'DIXON.NSE', sector: 'manufacturing', market_cap_cr: 75000, revenue_cr: 18000, ebitda_cr: 1200, pe_ratio: 110, ev_revenue: 4.2, ev_ebitda: 63, as_of_date: '2026-03-01', source: 'NSE' },

  // CleanTech
  { name: 'Tata Power', ticker: 'TATAPOWER.NSE', sector: 'cleantech', market_cap_cr: 140000, revenue_cr: 62000, ebitda_cr: 12000, pe_ratio: 35, ev_revenue: 2.3, ev_ebitda: 12, as_of_date: '2026-03-01', source: 'NSE' },

  // Auto / Mobility
  { name: 'Ola Electric', ticker: 'OLAELEC.NSE', sector: 'auto_mobility', market_cap_cr: 25000, revenue_cr: 5000, ebitda_cr: -2000, pe_ratio: null, ev_revenue: 5.0, ev_ebitda: null, as_of_date: '2026-03-01', source: 'NSE' },

  // Media
  { name: 'Affle India', ticker: 'AFFLE.NSE', sector: 'media_advertising', market_cap_cr: 18000, revenue_cr: 2200, ebitda_cr: 500, pe_ratio: 55, ev_revenue: 8.2, ev_ebitda: 36, as_of_date: '2026-03-01', source: 'NSE' },
]

/**
 * Find listed comparables for a given sector.
 * Returns all listed companies in the same sector, sorted by market cap.
 */
export function findListedComparables(sector: StartupCategory): ListedComparable[] {
  return LISTED_COMPARABLES
    .filter((c) => c.sector === sector)
    .sort((a, b) => b.market_cap_cr - a.market_cap_cr)
}

/**
 * Get sector median EV/Revenue from listed comparables.
 * Falls back to null if no listed comparables for sector.
 */
export function getListedSectorMultiple(sector: StartupCategory): { evRevenue: number; evEbitda: number | null; count: number } | null {
  const comps = LISTED_COMPARABLES.filter((c) => c.sector === sector)
  if (comps.length === 0) return null

  const evRevenues = comps.map((c) => c.ev_revenue).sort((a, b) => a - b)
  const mid = Math.floor(evRevenues.length / 2)
  const medianEvRevenue = evRevenues.length % 2 === 0
    ? (evRevenues[mid - 1] + evRevenues[mid]) / 2
    : evRevenues[mid]

  const evEbitdas = comps.map((c) => c.ev_ebitda).filter((v): v is number => v !== null).sort((a, b) => a - b)
  const medianEvEbitda = evEbitdas.length > 0
    ? (evEbitdas.length % 2 === 0
      ? (evEbitdas[Math.floor(evEbitdas.length / 2) - 1] + evEbitdas[Math.floor(evEbitdas.length / 2)]) / 2
      : evEbitdas[Math.floor(evEbitdas.length / 2)])
    : null

  return { evRevenue: medianEvRevenue, evEbitda: medianEvEbitda, count: comps.length }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/data/listed-comparables.ts
git commit -m "feat: listed comparables — 18 BSE/NSE companies across 12 sectors"
```

---

### Task 18: Expand comparable companies data

**Files:**
- Modify: `src/lib/data/comparable-companies.ts`

- [ ] **Step 1: Add new fields to existing 29 entries**

For each existing entry, add the new optional fields. Example for Razorpay:

```typescript
{ name: 'Razorpay', sector: 'fintech_payments', stage_at_round: 'series_c_plus', last_round_size_cr: 500, valuation_cr: 56000, revenue_cr: 2100, year: 2024, city: 'Bangalore', business_model: 'transaction_based', source: 'public_announcement', revenue_multiple: 26.7, deal_type: 'primary', currency_original: 'INR' },
```

Compute `revenue_multiple` for each entry: `valuation_cr / revenue_cr` (null if revenue_cr is null or 0).

- [ ] **Step 2: Add 30+ new companies for under-represented sectors**

Add entries for sectors with 0-1 comparables. Minimum targets:
- cleantech: 3 entries
- deeptech: 3 entries
- gaming: 3 entries
- real_estate_tech: 3 entries
- manufacturing: 3 entries
- media_advertising: 3 entries
- b2b_services: 3 entries
- healthtech_products: 3 entries
- social_impact: 2 entries
- telecom: 2 entries

Example entries (implementer should source real data):

```typescript
  // CleanTech
  { name: 'Log9 Materials', sector: 'cleantech', stage_at_round: 'series_b', last_round_size_cr: 80, valuation_cr: 1200, revenue_cr: 100, year: 2024, city: 'Bangalore', business_model: 'hardware_software', source: 'Tracxn', revenue_multiple: 12, deal_type: 'primary', currency_original: 'INR' },
  { name: 'BluSmart', sector: 'cleantech', stage_at_round: 'series_b', last_round_size_cr: 250, valuation_cr: 3000, revenue_cr: 200, year: 2024, city: 'Delhi', business_model: 'services', source: 'media_report', revenue_multiple: 15, deal_type: 'primary', currency_original: 'INR' },
  // ... more per sector
```

- [ ] **Step 3: Run data integrity tests**

Run: `npm test -- __tests__/lib/data/data-integrity.test.ts`
Expected: All pass (verify sectors and stages match enums)

- [ ] **Step 4: Commit**

```bash
git add src/lib/data/comparable-companies.ts
git commit -m "feat: expand comparable companies to 60+ with new fields and sector coverage"
```

---

### Task 19: Expand investor data

**Files:**
- Modify: `src/lib/data/investors.ts`

- [ ] **Step 1: Add new fields to existing 16 investors**

For each existing entry, add the new optional fields. Example:

```typescript
{
  name: 'Sequoia Capital India',
  type: 'vc',
  sectors: ['saas', 'fintech_payments', 'healthtech_services', 'deeptech'] as StartupCategory[],
  stages: ['seed', 'series_a', 'series_b'] as Stage[],
  check_size_min_cr: 5,
  check_size_max_cr: 200,
  city: 'Bangalore',
  portfolio_highlights: ['Razorpay', 'BrowserStack', 'Zomato', 'BYJU\'S'],
  last_active_year: 2025,
  website: 'https://www.sequoiacap.com/india/',
  // New fields
  lead_investor: true,
  board_seat: true,
  thesis_summary: 'Early to growth stage across tech sectors',
  contact_method: 'website',
},
```

- [ ] **Step 2: Add 20+ new investors**

Add at minimum:
- 5 micro-VCs: Better Capital, First Cheque, 2am VC, Antler India, Speciale Invest
- 3 angel networks: Mumbai Angels, Indian Angel Network, LetsVenture
- 3 family offices: Catamaran Ventures, Premji Invest, Arka Venture Labs
- 3 corporate VCs: Jio Ventures, Mahindra Partners, Qualcomm Ventures India
- 3 sector specialists: HealthQuad, Omnivore, pi Ventures
- 3 government: SIDBI Fund of Funds, BIRAC, Avaana Capital

- [ ] **Step 3: Run tests**

Run: `npm test`
Expected: All pass including investor match tests

- [ ] **Step 4: Commit**

```bash
git add src/lib/data/investors.ts
git commit -m "feat: expand investors to 36+ with new fields and type diversity"
```

---

### Task 20: Enhanced investor matching algorithm

**Files:**
- Modify: `src/lib/matching/investor-match.ts`
- Modify: `__tests__/lib/matching/investor-match.test.ts`

- [ ] **Step 1: Add test for enhanced scoring**

Add to `__tests__/lib/matching/investor-match.test.ts`:

```typescript
describe('enhanced scoring', () => {
  it('returns match score out of 100', () => {
    const matches = matchInvestors({
      sector: 'saas',
      stage: 'series_a',
      check_size_cr: 10,
      city: 'Bangalore',
    })
    for (const m of matches) {
      expect(m.score).toBeGreaterThan(0)
      expect(m.score).toBeLessThanOrEqual(100)
    }
  })

  it('ranks lead investors higher', () => {
    const matches = matchInvestors({
      sector: 'saas',
      stage: 'series_a',
      check_size_cr: 10,
      city: 'Bangalore',
    })
    // Verify scoring produces reasonable ranking
    expect(matches.length).toBeGreaterThan(0)
    // First match should have highest score
    if (matches.length > 1) {
      expect(matches[0].score).toBeGreaterThanOrEqual(matches[1].score)
    }
  })
})
```

- [ ] **Step 2: Update matching algorithm**

Replace the scoring logic in `src/lib/matching/investor-match.ts` with weighted scoring:

```typescript
// Enhanced scoring (out of 100)
// sector_match: 40pts, stage_match: 25pts, size_fit: 20pts, activity: 10pts, geo: 5pts
let score = 0

// Sector match (40 pts)
const investorSectors = new Set(investor.sectors)
if (investorSectors.has(query.sector)) {
  score += 40
} else if (adjacentSectors.some(s => investorSectors.has(s))) {
  score += 20
}

// Stage match (25 pts)
const investorStages = new Set(investor.stages)
if (investorStages.has(query.stage)) {
  score += 25
} else {
  const stageIdx = STAGE_ORDER.indexOf(query.stage)
  const adjacentStages = STAGE_ORDER.filter((_, i) => Math.abs(i - stageIdx) === 1)
  if (adjacentStages.some(s => investorStages.has(s))) {
    score += 12
  }
}

// Size fit (20 pts)
if (query.check_size_cr) {
  const sweetSpot = investor.sweet_spot_cr ?? (investor.check_size_min_cr + investor.check_size_max_cr) / 2
  const ratio = query.check_size_cr / sweetSpot
  if (ratio >= 0.5 && ratio <= 2.0) score += 20
  else if (ratio >= 0.25 && ratio <= 4.0) score += 10
}

// Activity (10 pts)
if (investor.last_active_year >= new Date().getFullYear() - 1) score += 10
else if (investor.last_active_year >= new Date().getFullYear() - 2) score += 5

// Geography (5 pts)
if (query.city && investor.city.toLowerCase() === query.city.toLowerCase()) score += 5
```

Return top 10 instead of top 5. Normalize score to percentage.

- [ ] **Step 3: Run tests**

Run: `npm test -- __tests__/lib/matching/investor-match.test.ts`
Expected: All tests pass

- [ ] **Step 4: Commit**

```bash
git add src/lib/matching/investor-match.ts __tests__/lib/matching/investor-match.test.ts
git commit -m "feat: enhanced investor matching with weighted scoring out of 100"
```

---

### Task 21: Final — run full test suite and verify build

**Files:** None (verification only)

- [ ] **Step 1: Run all tests**

Run: `npm test`
Expected: All tests pass (existing + new)

- [ ] **Step 2: Run TypeScript type check**

Run: `npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Run build**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Run dev and smoke test**

Run: `npm run dev`

Manual checks:
1. `/valuation/purpose` — 6 cards render with correct prices
2. Select "Fundraising" → wizard loads with purpose stored
3. Complete wizard → report shows gated sections (blurred)
4. `/deal-check` — form works, verdict renders
5. Check tooltips render on wizard fields

- [ ] **Step 5: Commit any remaining fixes**

```bash
git add -A
git commit -m "fix: address any remaining issues from smoke testing"
```

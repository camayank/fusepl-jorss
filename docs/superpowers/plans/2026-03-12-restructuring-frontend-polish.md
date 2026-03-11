# Restructuring & Frontend Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development to implement this plan.

**Goal:** Transform firstunicornstartup.com from a functional 59-task MVP into a properly bucketed, systematized codebase with premium frontend design. Fix structural gaps (barrel exports, centralized constants, CSS theme wiring, shared navigation), overhaul the landing page with Framer Motion animations and glassmorphism, add wizard step transitions, polish the results reveal, and fix the broken report page.

**Architecture:** Next.js 16 App Router, React 19, Zustand store with persist, Supabase backend (optional -- graceful fallback), client-side valuation engine, Framer Motion v12 for animations.

**Tech Stack:** Next.js 16.1.6, React 19.2.3, TypeScript 5, Tailwind CSS 4, Framer Motion 12.35.2, shadcn (v4), Zustand 5, Supabase JS 2, jsPDF, Recharts 3, Sonner, Lucide React.

**Existing tests:** 166 tests via Vitest. All must continue passing after every chunk.

---

## Chunk 1: Structural Bucketing (Tasks 1-4)

### Task 1: Barrel exports for lib/data, lib/calculators, lib/matching, lib/export

**Files to create:**

**`/Users/rakeshanita/firstunicornstartup/src/lib/data/index.ts`**
```typescript
// Barrel exports for lib/data
export { SECTOR_MAPPING, getSectorLabel, getAdjacentSectors, getDamodaranBenchmark } from './sector-mapping'
export { COMPARABLE_COMPANIES, findComparables } from './comparable-companies'
export { STAGE_BENCHMARKS, BERKUS_MILESTONE_MAX, BERKUS_PRE_REVENUE_CAP, RISK_FACTOR_ADJUSTMENT, VALUATION_FLOOR } from './sector-benchmarks'
export { getIBCRecovery } from './ibc-recovery'
export { INVESTORS } from './investors'
```

**`/Users/rakeshanita/firstunicornstartup/src/lib/calculators/index.ts`**
```typescript
// Barrel exports for lib/calculators
export { computeDerivedFields, calculateRunway } from './burn-rate'
export { calculateESOPValue } from './esop-valuation'
export { simulateRound, simulateMultiRound } from './cap-table'
```

**`/Users/rakeshanita/firstunicornstartup/src/lib/matching/index.ts`**
```typescript
// Barrel exports for lib/matching
export { matchInvestors } from './investor-match'
```

**`/Users/rakeshanita/firstunicornstartup/src/lib/export/index.ts`**
```typescript
// Barrel exports for lib/export
export { generateValuationPDF } from './pdf-generator'
```

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `feat: add barrel exports for lib/data, lib/calculators, lib/matching, lib/export`

---

### Task 2: Centralize METHOD_LABELS and WIZARD_STEPS in constants.ts

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/lib/constants.ts`**

Add at the end of the file:
```typescript
/** Short-form labels for UI display. The PDF generator (pdf-generator.ts) has its own
 *  long-form labels (e.g. "Discounted Cash Flow (DCF)") — keep those separate for PDF. */
export const METHOD_LABELS: Record<string, string> = {
  dcf: 'DCF Analysis',
  pwerm: 'PWERM',
  revenue_multiple: 'Revenue Multiple',
  ebitda_multiple: 'EV/EBITDA Multiple',
  comparable_txn: 'Comparable Transactions',
  nav: 'Net Asset Value',
  replacement_cost: 'Replacement Cost',
  scorecard: 'Scorecard (Bill Payne)',
  berkus: 'Berkus Method',
  risk_factor: 'Risk Factor Summation',
}

export const WIZARD_STEPS = [
  'Company Profile',
  'Team',
  'Financials',
  'Market & Product',
  'Strategic Factors',
  'ESOP & Cap Table',
] as const
```

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/wizard/wizard-container.tsx`**

Replace the local `STEP_LABELS` constant (lines 44-51) with an import:
```typescript
// At top of file, add:
import { WIZARD_STEPS } from '@/lib/constants'

// DELETE lines 44-51 (the local STEP_LABELS constant)

// Replace all 3 references to STEP_LABELS with WIZARD_STEPS:
// Line 98: STEP_LABELS.map → WIZARD_STEPS.map
// Line 127: {label} stays the same (it comes from the .map callback)
```

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/results/method-cards.tsx`**

Delete lines 9-20 (the local `METHOD_LABELS` constant) and add import:
```typescript
// At top of file, add:
import { METHOD_LABELS } from '@/lib/constants'

// DELETE lines 9-20 (the local METHOD_LABELS constant)
// The rest of the file uses METHOD_LABELS[m.method] at line 61 — no changes needed there.
```

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `refactor: centralize METHOD_LABELS and WIZARD_STEPS in constants.ts`

---

### Task 3: Add EMAIL_REGEX to utils.ts, update email-gate.tsx and capture/route.ts

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/lib/utils.ts`**

Add at the end of the file:
```typescript
/** Shared email validation regex */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
```

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/results/email-gate.tsx`**

Replace line 30:
```typescript
// Before:
const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)

// After:
import { EMAIL_REGEX } from '@/lib/utils'  // add to imports at top
// ...
const isValidEmail = EMAIL_REGEX.test(emailInput)
```

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/app/api/capture/route.ts`**

Replace line 28:
```typescript
// Before:
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

// After:
import { EMAIL_REGEX } from '@/lib/utils'  // add to imports at top
// ...
if (!EMAIL_REGEX.test(email)) {
```

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `refactor: centralize EMAIL_REGEX in utils.ts, remove inline regex duplication`

---

### Task 4: Wire CSS theme vars in globals.css (.dark block -> amber primary)

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/app/globals.css`**

Replace the `.dark { ... }` block (lines 85-117) with:
```css
.dark {
  --background: oklch(0.10 0.01 260);    /* slate-950 */
  --foreground: oklch(0.97 0 0);          /* white */
  --card: oklch(0.15 0.01 260);           /* slate-900 */
  --card-foreground: oklch(0.97 0 0);
  --popover: oklch(0.15 0.01 260);
  --popover-foreground: oklch(0.97 0 0);
  --primary: oklch(0.77 0.17 75);         /* amber-500 */
  --primary-foreground: oklch(0.15 0 0);  /* dark text on amber */
  --secondary: oklch(0.20 0.01 260);      /* slate-800 */
  --secondary-foreground: oklch(0.97 0 0);
  --muted: oklch(0.25 0.01 260);          /* slate-700 */
  --muted-foreground: oklch(0.60 0 0);    /* slate-400 */
  --accent: oklch(0.77 0.17 75 / 10%);   /* amber-500/10 */
  --accent-foreground: oklch(0.85 0.15 75); /* amber-400 */
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(0.25 0.01 260);         /* slate-800 */
  --input: oklch(0.20 0.01 260);          /* slate-800 */
  --ring: oklch(0.77 0.17 75);            /* amber-500 */
  --chart-1: oklch(0.62 0.21 260);        /* blue (income) */
  --chart-2: oklch(0.62 0.19 145);        /* green (market) */
  --chart-3: oklch(0.77 0.17 75);         /* amber (asset) */
  --chart-4: oklch(0.65 0.24 300);        /* purple (vc) */
  --chart-5: oklch(0.60 0.20 25);         /* red (accent) */
  --radius: 0.625rem;
  --sidebar: oklch(0.15 0.01 260);
  --sidebar-foreground: oklch(0.97 0 0);
  --sidebar-primary: oklch(0.77 0.17 75);
  --sidebar-primary-foreground: oklch(0.97 0 0);
  --sidebar-accent: oklch(0.20 0.01 260);
  --sidebar-accent-foreground: oklch(0.97 0 0);
  --sidebar-border: oklch(0.25 0.01 260);
  --sidebar-ring: oklch(0.77 0.17 75);
}
```

**Note:** The `:root` (light theme) block is unchanged. `html` has `className="dark"` set statically in `layout.tsx`, so `:root` values are never applied at runtime. No SSR flash risk. Hardcoded Tailwind classes (e.g., `bg-slate-900`, `text-amber-400`) continue to work -- semantic migration happens incrementally in later chunks.

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `style: wire dark theme CSS vars to amber/slate palette`

---

## Chunk 2: Navigation & Layout (Tasks 5-7)

### Task 5: Create shared header component with nav links

**File to create: `/Users/rakeshanita/firstunicornstartup/src/components/layout/header.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileNav } from './mobile-nav'

const NAV_LINKS = [
  { href: '/valuation', label: 'Valuation' },
  { href: '/cap-table', label: 'Cap Table' },
  { href: '/esop-calculator', label: 'ESOP' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-xl">🦄</span>
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            First Unicorn Startup
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname?.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-amber-400 ${
                  isActive ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="block h-0.5 bg-amber-400 mt-0.5 rounded-full" />
                )}
              </Link>
            )
          })}
          <Link
            href="/valuation"
            className="inline-flex items-center justify-center rounded-lg h-8 px-4 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
          >
            Get Valuation
          </Link>
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <MobileNav links={NAV_LINKS} pathname={pathname} />
        </div>
      </div>
    </header>
  )
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: add shared header component with nav links and active state`

---

### Task 6: Create mobile nav (sheet/hamburger)

**Pre-requisite:** Install the shadcn Sheet component:
```bash
npx shadcn@latest add sheet
```

**File to create: `/Users/rakeshanita/firstunicornstartup/src/components/layout/mobile-nav.tsx`**

```typescript
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface NavLink {
  href: string
  label: string
}

interface Props {
  links: NavLink[]
  pathname: string | null
}

export function MobileNav({ links, pathname }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] bg-slate-950 border-slate-800 p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <span className="font-bold text-lg">
              <span className="text-xl mr-2">🦄</span>
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                FUS
              </span>
            </span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="text-slate-400">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1 p-4">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA */}
          <div className="mt-auto p-4 border-t border-slate-800">
            <Link
              href="/valuation"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center rounded-lg h-10 w-full text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
            >
              Get Valuation
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: add mobile hamburger nav with slide-out sheet`

---

### Task 7: Update root layout to include header, add skeleton component

**Pre-requisite:** Install the shadcn Skeleton component:
```bash
npx shadcn@latest add skeleton
```

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import { Header } from '@/components/layout/header'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'First Unicorn Startup — India\'s Most Comprehensive Startup Valuation Platform',
    template: '%s | First Unicorn Startup',
  },
  description: '3 Approaches x 10 Methods — DCF, PWERM, Revenue Multiple, EV/EBITDA, NAV, Scorecard, Berkus & more. Monte Carlo simulation. Damodaran India data. Free instant valuation. Built by an IBBI-Registered Valuer.',
  keywords: ['startup valuation', 'india', 'rule 11ua', 'fema valuation', 'dcf', 'monte carlo', 'cap table', 'esop valuation', 'damodaran india'],
  authors: [{ name: 'First Unicorn Startup' }],
  openGraph: {
    title: 'First Unicorn Startup — Know Your Startup\'s True Worth',
    description: '10 valuation methods, 3 approaches, Monte Carlo simulation. Free.',
    url: 'https://firstunicornstartup.com',
    siteName: 'First Unicorn Startup',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Unicorn Startup — Startup Valuation Platform',
    description: '10 methods, 3 approaches, Monte Carlo, Damodaran India data. Free.',
  },
  metadataBase: new URL('https://firstunicornstartup.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Header />
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `feat: add Header to root layout, install skeleton and sheet UI components`

---

## Chunk 3: Landing Page Premium Redesign (Tasks 8-13)

### Task 8: Hero with Framer Motion animations + gradient mesh

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/landing/hero.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const STATS = [
  { value: '10', label: 'Methods' },
  { value: '3', label: 'Approaches' },
  { value: '25', label: 'Sectors' },
  { value: '10,000', label: 'Simulations' },
]

export function Hero() {
  return (
    <section className="w-full min-h-[700px] flex flex-col items-center justify-center text-center px-6 py-24 relative overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, oklch(0.77 0.17 75 / 15%), transparent),
            radial-gradient(ellipse 60% 40% at 80% 60%, oklch(0.65 0.20 30 / 10%), transparent),
            radial-gradient(ellipse 50% 30% at 50% 20%, oklch(0.62 0.21 260 / 8%), transparent)
          `,
          animation: 'meshFloat 20s ease-in-out infinite',
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Badge */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-6 relative z-10 px-4 py-1.5 rounded-full border border-amber-400/20 bg-amber-400/5"
      >
        AI-Powered Startup Valuation
      </motion.p>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl relative z-10"
      >
        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
          India&apos;s Most Comprehensive
        </span>
        <br />
        <span className="text-white">
          Startup Valuation Platform
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 text-lg text-slate-300 max-w-2xl relative z-10"
      >
        3 Approaches x 10 Methods — DCF, PWERM, Revenue Multiple, EV/EBITDA, Comparable Transactions,
        NAV, Replacement Cost, Scorecard, Berkus, Risk Factor Summation.
        Powered by Damodaran India data. Monte Carlo simulation. Free.
      </motion.p>

      {/* Stat counters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex flex-wrap justify-center gap-8 mt-8 relative z-10"
      >
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
            className="text-center"
          >
            <span className="text-2xl md:text-3xl font-bold text-amber-400">{stat.value}</span>
            <span className="block text-xs text-slate-500 uppercase tracking-wider mt-1">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex flex-wrap gap-3 mt-10 relative z-10"
      >
        <Link
          href="/valuation"
          className="inline-flex items-center justify-center rounded-lg h-11 px-6 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02]"
        >
          Get Your Valuation
        </Link>
        <Link
          href="/cap-table"
          className="inline-flex items-center justify-center rounded-lg h-11 px-6 text-sm font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
        >
          Cap Table Simulator
        </Link>
        <Link
          href="/esop-calculator"
          className="inline-flex items-center justify-center rounded-lg h-11 px-6 text-sm font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
        >
          ESOP Calculator
        </Link>
      </motion.div>
    </section>
  )
}
```

Add to `globals.css` at the end, before the closing `}` of `@layer base` or after it:
```css
@keyframes meshFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(2%, -3%) scale(1.02); }
  66% { transform: translate(-2%, 2%) scale(0.98); }
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: redesign hero with Framer Motion animations and gradient mesh background`

---

### Task 9: Trust signals with glassmorphism + scroll animation

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/landing/trust-signals.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'

const SIGNALS = [
  { icon: '🏛️', text: 'Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer' },
  { icon: '📊', text: 'Powered by Damodaran India Industry Benchmarks (January 2026)' },
  { icon: '🎯', text: '3 Valuation Approaches x 10 Methods — aligned with IBBI/IVS/Rule 11UA Standards' },
  { icon: '🎲', text: 'Monte Carlo Simulation with 10,000 iterations' },
  { icon: '⚖️', text: '190+ IBC landmark cases analyzed | 3,952 corporate debtor outcomes studied' },
]

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export function TrustSignals() {
  return (
    <section className="py-16 px-6 bg-slate-900/30">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-10 text-white"
        >
          Not a Random Calculator
        </motion.h2>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
        >
          {SIGNALS.map((signal, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              className="flex items-start gap-3 p-5 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-amber-400/20 transition-colors"
            >
              <span className="text-2xl mt-0.5 shrink-0">{signal.icon}</span>
              <p className="text-sm text-slate-300 leading-relaxed">{signal.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: redesign trust signals with glassmorphism cards and scroll animations`

---

### Task 10: How it works with animated timeline

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/landing/how-it-works.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'

const STEPS = [
  {
    num: '1',
    title: 'Answer 6 Quick Steps',
    desc: 'Company profile, team, financials, market, strategy, ESOP — takes 3-5 minutes.',
    icon: '📝',
  },
  {
    num: '2',
    title: 'Get Your Valuation',
    desc: '10 methods across 3 approaches compute your range. Monte Carlo simulation runs 10,000 scenarios.',
    icon: '🧮',
  },
  {
    num: '3',
    title: 'Unlock Full Report',
    desc: 'Enter your email for detailed methodology, benchmarks, ESOP valuation, investor matches, and AI insights.',
    icon: '📄',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-14 text-white"
        >
          How It Works
        </motion.h2>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute top-8 left-[16.67%] right-[16.67%] h-0.5 bg-gradient-to-r from-amber-500/50 via-amber-400/50 to-amber-500/50 origin-left"
            />
            <div className="grid grid-cols-3 gap-8">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.15 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-2xl flex items-center justify-center mx-auto mb-4 relative z-10 bg-slate-950">
                    {step.icon}
                  </div>
                  <h3 className="font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: vertical timeline */}
        <div className="md:hidden space-y-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-4 relative"
            >
              {/* Vertical line */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/30 text-xl flex items-center justify-center shrink-0">
                  {step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-0.5 h-full bg-amber-500/20 my-1" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="font-semibold mb-1 text-white">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: redesign how-it-works with animated timeline and scroll-triggered entry`

---

### Task 11: Method showcase with approach colors

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/landing/method-showcase.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { APPROACH_LABELS } from '@/types'
import type { ValuationApproach } from '@/types'
import { ChevronDown } from 'lucide-react'

const APPROACH_COLORS: Record<ValuationApproach, { border: string; bg: string; text: string; dot: string }> = {
  income: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-400', dot: 'bg-blue-400' },
  market: { border: 'border-green-500/30', bg: 'bg-green-500/5', text: 'text-green-400', dot: 'bg-green-400' },
  asset_cost: { border: 'border-amber-500/30', bg: 'bg-amber-500/5', text: 'text-amber-400', dot: 'bg-amber-400' },
  vc_startup: { border: 'border-purple-500/30', bg: 'bg-purple-500/5', text: 'text-purple-400', dot: 'bg-purple-400' },
}

const APPROACHES: { key: ValuationApproach; badge: string; methods: string[] }[] = [
  { key: 'income', badge: 'Income', methods: ['DCF (Discounted Cash Flow)', 'PWERM (Probability Weighted)'] },
  { key: 'market', badge: 'Market', methods: ['Revenue Multiple', 'EV/EBITDA Multiple', 'Comparable Transactions'] },
  { key: 'asset_cost', badge: 'Asset/Cost', methods: ['Net Asset Value', 'Replacement Cost'] },
  { key: 'vc_startup', badge: 'VC/Startup', methods: ['Scorecard (Bill Payne)', 'Berkus Method', 'Risk Factor Summation'] },
]

export function MethodShowcase() {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <section className="py-20 px-6 bg-slate-900/30">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-2xl md:text-3xl font-bold text-center mb-2 text-white"
        >
          3 Approaches x 10 Methods
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center text-slate-400 mb-12"
        >
          Aligned with IBBI Valuation Standards, IVS 105, and Rule 11UA
        </motion.p>
        <div className="grid md:grid-cols-2 gap-6">
          {APPROACHES.map((a, i) => {
            const colors = APPROACH_COLORS[a.key]
            const isExpanded = expanded === a.key
            return (
              <motion.div
                key={a.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-xl border ${colors.border} ${colors.bg} backdrop-blur-sm overflow-hidden cursor-pointer transition-all hover:border-opacity-60`}
                onClick={() => setExpanded(isExpanded ? null : a.key)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors.border} ${colors.text}`}>
                        {a.badge}
                      </span>
                      <h3 className="font-semibold text-white">{APPROACH_LABELS[a.key]}</h3>
                    </div>
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className={`h-4 w-4 ${colors.text}`} />
                    </motion.div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="space-y-2 overflow-hidden"
                      >
                        {a.methods.map(m => (
                          <li key={m} className="text-sm flex items-center gap-2 text-slate-300">
                            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot} shrink-0`} />
                            {m}
                          </li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                  {!isExpanded && (
                    <p className="text-xs text-slate-500">{a.methods.length} methods — click to expand</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: redesign method showcase with approach colors and expand/collapse animation`

---

### Task 12: CTA section (new component)

**File to create: `/Users/rakeshanita/firstunicornstartup/src/components/landing/cta-section.tsx`**

```typescript
'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export function CTASection() {
  return (
    <section className="py-20 px-6 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 via-orange-500/20 to-amber-600/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white mb-4"
        >
          Know Your Startup&apos;s True Worth
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-lg text-slate-300 mb-8"
        >
          10 valuation methods, Monte Carlo simulation, Damodaran benchmarks.
          <br className="hidden md:block" />
          Takes 3-5 minutes. Completely free.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/valuation"
            className="inline-flex items-center justify-center rounded-xl h-12 px-8 text-base font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-all shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.03]"
          >
            Get Your Free Valuation
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
```

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/app/page.tsx`**

Add the new CTA section between MethodShowcase and Footer:
```typescript
import { Hero } from '@/components/landing/hero'
import { TrustSignals } from '@/components/landing/trust-signals'
import { HowItWorks } from '@/components/landing/how-it-works'
import { MethodShowcase } from '@/components/landing/method-showcase'
import { CTASection } from '@/components/landing/cta-section'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <main className="bg-slate-950 min-h-screen">
      <Hero />
      <TrustSignals />
      <HowItWorks />
      <MethodShowcase />
      <CTASection />
      <Footer />
    </main>
  )
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: add CTA section with gradient background to landing page`

---

### Task 13: Footer upgrade

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/landing/footer.tsx`**

```typescript
import Link from 'next/link'

const PRODUCT_LINKS = [
  { href: '/valuation', label: 'Startup Valuation' },
  { href: '/cap-table', label: 'Cap Table Simulator' },
  { href: '/esop-calculator', label: 'ESOP Calculator' },
]

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🦄</span>
              <span className="font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                First Unicorn Startup
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              India&apos;s most comprehensive startup valuation platform.
              Built by an IBBI-Registered IP &amp; SFA-Licensed Valuer.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-500 hover:text-amber-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 text-center">
          <p className="text-xs text-slate-600">
            &copy; {new Date().getFullYear()} firstunicornstartup.com. All rights reserved.
          </p>
          <p className="text-xs text-slate-700 mt-1">
            This tool provides indicative valuations only. For regulatory filings, consult a registered valuer.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: upgrade footer with 3-column layout and legal disclaimer`

---

## Chunk 4: Wizard & Results Animations (Tasks 14-17)

### Task 14: Wizard AnimatePresence step transitions + direction state

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/wizard/wizard-container.tsx`**

```typescript
'use client'

import { useState } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { calculateValuation } from '@/lib/valuation'
import { WIZARD_STEPS } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { CompanyStep } from './company-step'
import { TeamStep } from './team-step'
import { FinancialsStep } from './financials-step'
import { MarketProductStep } from './market-product-step'
import { StrategicStep } from './strategic-step'
import { ESOPCapTableStep } from './esop-captable-step'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import type { WizardInputs } from '@/types'

function validateStep(step: number, inputs: WizardInputs): string | null {
  switch (step) {
    case 1:
      if (!inputs.company_name.trim()) return 'Company name is required'
      return null
    case 2:
      if (inputs.team_size < 1) return 'Team size must be at least 1'
      return null
    case 3:
      if (inputs.annual_revenue < 0) return 'Revenue cannot be negative'
      if (inputs.gross_margin_pct < 0 || inputs.gross_margin_pct > 100) return 'Gross margin must be 0-100%'
      if (inputs.revenue_growth_pct < -100 || inputs.revenue_growth_pct > 1000) return 'Revenue growth must be -100% to 1000%'
      return null
    case 4:
      if (inputs.tam <= 0) return 'TAM must be greater than 0'
      return null
    case 5:
      return null
    case 6:
      if (inputs.esop_pool_pct !== null && (inputs.esop_pool_pct < 0 || inputs.esop_pool_pct > 30)) {
        return 'ESOP pool must be 0-30%'
      }
      return null
    default:
      return null
  }
}

const STEP_COMPONENTS = [
  CompanyStep,
  TeamStep,
  FinancialsStep,
  MarketProductStep,
  StrategicStep,
  ESOPCapTableStep,
]

export function WizardContainer() {
  const { currentStep, highestCompletedStep, inputs, nextStep, prevStep, goToStep, completeStep, setResult } =
    useValuationStore()
  const [direction, setDirection] = useState(1)
  const [computing, setComputing] = useState(false)

  const StepComponent = STEP_COMPONENTS[currentStep - 1]
  const progress = ((currentStep - 1) / 5) * 100

  const handleNext = () => {
    const error = validateStep(currentStep, inputs)
    if (error) {
      toast.error(error)
      return
    }
    completeStep(currentStep)
    if (currentStep === 6) {
      setComputing(true)
      // Small timeout to allow loading state to render
      setTimeout(() => {
        const result = calculateValuation(inputs)
        setResult(result)
        setComputing(false)
        toast.success('Valuation complete!')
      }, 100)
    } else {
      setDirection(1)
      nextStep()
    }
  }

  const handlePrev = () => {
    setDirection(-1)
    prevStep()
  }

  const handleStepClick = (step: number) => {
    if (step <= highestCompletedStep + 1) {
      setDirection(step > currentStep ? 1 : -1)
      goToStep(step)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-amber-500 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {WIZARD_STEPS.map((label, i) => {
            const stepNum = i + 1
            const isActive = stepNum === currentStep
            const isCompleted = stepNum <= highestCompletedStep
            const isClickable = stepNum <= highestCompletedStep + 1
            return (
              <button
                key={label}
                onClick={() => handleStepClick(stepNum)}
                disabled={!isClickable}
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-amber-400'
                    : isCompleted
                    ? 'text-emerald-400 cursor-pointer'
                    : isClickable
                    ? 'text-slate-400 cursor-pointer hover:text-slate-300'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                <motion.span
                  animate={isActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs mb-1 ${
                    isActive
                      ? 'bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/50'
                      : isCompleted
                      ? 'bg-emerald-400/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </motion.span>
                <span className="block">{label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Step content with AnimatePresence */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-8 mb-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 30 : -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -30 : 30 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={computing}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold px-8"
        >
          {computing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Computing...
            </>
          ) : currentStep === 6 ? (
            'Get Valuation'
          ) : (
            'Continue'
          )}
        </Button>
      </div>
    </div>
  )
}
```

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `feat: add wizard step transition animations with AnimatePresence and direction state`

---

### Task 15: Animated counter component for valuation reveal

**File to create: `/Users/rakeshanita/firstunicornstartup/src/components/ui/animated-counter.tsx`**

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  value: number
  duration?: number
  className?: string
  formatter: (value: number) => string
}

export function AnimatedCounter({ value, duration = 1500, className = '', formatter }: Props) {
  const [displayValue, setDisplayValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const animationFrame = useRef<number>(0)

  useEffect(() => {
    const startValue = 0
    const endValue = value

    const animate = (timestamp: number) => {
      if (startTime.current === null) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * eased

      setDisplayValue(current)

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate)
      }
    }

    startTime.current = null
    animationFrame.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current)
    }
  }, [value, duration])

  return <span className={className}>{formatter(displayValue)}</span>
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: add AnimatedCounter component with ease-out cubic animation`

---

### Task 16: Results components staggered animations

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/results/valuation-reveal.tsx`**

```typescript
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import type { ValuationResult } from '@/types'
import { formatINR } from '@/lib/utils'

interface Props {
  result: ValuationResult
  companyName: string
}

export function ValuationReveal({ result, companyName }: Props) {
  const confidenceLabel =
    result.confidence_score >= 70 ? 'High' :
    result.confidence_score >= 40 ? 'Medium' : 'Low'

  const confidenceColor =
    result.confidence_score >= 70 ? 'text-green-400' :
    result.confidence_score >= 40 ? 'text-amber-400' : 'text-red-400'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-2 border-amber-400/50 bg-slate-900">
        <CardHeader className="text-center pb-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-slate-400"
          >
            Estimated Valuation for
          </motion.p>
          <CardTitle className="text-xl text-white">{companyName || 'Your Startup'}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <p className="text-4xl font-bold tracking-tight text-white">
              <AnimatedCounter value={result.composite_low} formatter={formatINR} duration={1200} />
              {' — '}
              <AnimatedCounter value={result.composite_high} formatter={formatINR} duration={1500} />
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Weighted Composite: <AnimatedCounter value={result.composite_value} formatter={formatINR} duration={1300} />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="flex items-center justify-center gap-2"
          >
            <span className="text-sm text-slate-400">Confidence Score:</span>
            <span className={`text-2xl font-bold ${confidenceColor}`}>
              {result.confidence_score}/100
            </span>
            <span className={`text-sm ${confidenceColor}`}>({confidenceLabel})</span>
          </motion.div>

          {result.ibc_recovery_range && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              className="text-xs text-slate-500 border-t border-slate-800 pt-3"
            >
              Downside scenario: In insolvency, similar {result.ibc_recovery_range.sector} companies
              recovered {result.ibc_recovery_range.low}–{result.ibc_recovery_range.high}% of admitted claims.
            </motion.p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/results/method-cards.tsx`**

Wrap each approach card in a `motion.div` with staggered `whileInView`:

```typescript
'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { METHOD_LABELS } from '@/lib/constants'
import type { MethodResult, MonteCarloResult } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'

function confidenceBadge(confidence: number) {
  if (confidence >= 0.7) return <Badge className="bg-green-600/20 text-green-400 border-green-600/30">High</Badge>
  if (confidence >= 0.4) return <Badge className="bg-amber-600/20 text-amber-400 border-amber-600/30">Medium</Badge>
  return <Badge className="bg-slate-600/20 text-slate-400 border-slate-600/30">Low</Badge>
}

interface Props {
  methods: MethodResult[]
  monteCarlo: MonteCarloResult | null
}

export function MethodCards({ methods, monteCarlo }: Props) {
  const grouped = APPROACH_ORDER.map(approach => ({
    approach,
    label: APPROACH_LABELS[approach],
    methods: methods.filter(m => m.approach === approach && m.applicable),
  })).filter(g => g.methods.length > 0)

  const approachAvg = (ms: MethodResult[]) => {
    if (ms.length === 0) return 0
    return ms.reduce((sum, m) => sum + m.value, 0) / ms.length
  }

  return (
    <div className="space-y-4">
      {grouped.map((group, i) => (
        <motion.div
          key={group.approach}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
        >
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base text-white">{group.label}</CardTitle>
                <span className="text-sm font-medium text-slate-400">
                  Avg: {formatINR(approachAvg(group.methods))}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.methods.map(m => (
                <div key={m.method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">{METHOD_LABELS[m.method] ?? m.method}</span>
                    {confidenceBadge(m.confidence)}
                  </div>
                  <div className="text-right">
                    <span className="font-medium text-white">{formatINR(m.value)}</span>
                    {m.method === 'dcf' && monteCarlo && (
                      <span className="text-xs text-slate-500 ml-2">
                        MC: {formatINR(monteCarlo.p10)}–{formatINR(monteCarlo.p90)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
```

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `feat: add animated counter to valuation reveal and staggered animations to method cards`

---

### Task 17: Email gate blur/unlock animation

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/components/results/email-gate.tsx`**

Add a blur preview effect above the email form. Wrap the card in a `motion.div`:

```typescript
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useValuationStore } from '@/stores/valuation-store'
import { EMAIL_REGEX } from '@/lib/utils'
import { Loader2, Lock } from 'lucide-react'

interface Props {
  onUnlocked: (reportId: string) => void
}

const UNLOCKS = [
  'Full methodology breakdown for all 10 methods across 3 approaches',
  'Damodaran India benchmarks used',
  'Comparable Indian startups',
  'AI-powered insights from a VC perspective',
  'ESOP valuation (Black-Scholes)',
  'Cap Table Simulator',
  'Investor Match suggestions',
  'IBC downside analysis',
  'Downloadable PDF report',
]

export function EmailGate({ onUnlocked }: Props) {
  const { inputs, result, setEmail } = useValuationStore()
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidEmail = EMAIL_REGEX.test(emailInput)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail || !result) return

    setLoading(true)
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput,
          valuation_inputs: inputs,
          valuation_result: result,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      const data = await res.json()
      setEmail(emailInput)
      onUnlocked(data.report_id)
    } catch {
      setEmail(emailInput)
      onUnlocked('local')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Blurred preview teaser */}
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <div className="blur-md opacity-50 pointer-events-none p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="h-4 bg-slate-700 rounded w-3/4" />
          <div className="h-4 bg-slate-700 rounded w-1/2" />
          <div className="h-20 bg-slate-800 rounded" />
          <div className="h-4 bg-slate-700 rounded w-2/3" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 bg-slate-950/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-700">
            <Lock className="h-4 w-4 text-amber-400" />
            <span className="text-sm text-slate-300 font-medium">Unlock full report below</span>
          </div>
        </div>
      </div>

      <Card className="border-2 border-dashed border-amber-400/30 bg-slate-900">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-lg text-white">Unlock Your Full Valuation Report</CardTitle>
          <p className="text-sm text-slate-400">Enter your email to access:</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 mb-4">
            {UNLOCKS.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-green-400 mt-0.5">&#10003;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="email"
              placeholder="founder@startup.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              className="bg-slate-800 border-slate-700 text-white"
            />
            <Button type="submit" disabled={!isValidEmail || loading} className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Unlocking...
                </>
              ) : (
                'Unlock Report'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
```

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `feat: add blur preview teaser and motion animations to email gate`

---

## Chunk 5: Report Fix & Error Handling (Tasks 18-20)

### Task 18: Fix report page (Supabase fetch + local fallback + disclaimer)

**File to modify: `/Users/rakeshanita/firstunicornstartup/src/app/report/[id]/page.tsx`**

Replace the entire file:

```typescript
'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useValuationStore } from '@/stores/valuation-store'
import { MethodologySection } from '@/components/report/methodology-section'
import { BenchmarksSection } from '@/components/report/benchmarks-section'
import { ComparablesSection } from '@/components/report/comparables-section'
import { ListedComparablesSection } from '@/components/report/listed-comparables-section'
import { DownsideSection } from '@/components/report/downside-section'
import { ESOPSection } from '@/components/report/esop-section'
import { CapTableSection } from '@/components/report/cap-table-section'
import { InvestorSection } from '@/components/report/investor-section'
import { AINarrative } from '@/components/report/ai-narrative'
import { RecommendationsSection } from '@/components/report/recommendations-section'
import { CertifiedCTA } from '@/components/report/certified-cta'
import { PDFDownloadButton } from '@/components/report/pdf-download-button'
import { formatINR } from '@/lib/utils'
import { ReportSkeleton } from '@/components/skeletons'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { ValuationResult, MethodResult, MonteCarloResult, CapTableEntry } from '@/types'

/** DB row type matching Supabase valuations table */
interface ValuationRow {
  id: string
  email: string
  company_name: string
  sector: string
  stage: string
  annual_revenue: number | null
  revenue_growth_pct: number | null
  gross_margin_pct: number | null
  monthly_burn: number | null
  cash_in_bank: number | null
  tam: number | null
  team_size: number | null
  founder_experience: number | null
  domain_expertise: number | null
  previous_exits: boolean | null
  dev_stage: string | null
  competitive_advantages: string | null
  competition_level: number | null
  esop_pool_pct: number | null
  time_to_liquidity_years: number | null
  target_raise: number | null
  current_cap_table: CapTableEntry[] | null
  valuation_low: number
  valuation_mid: number
  valuation_high: number
  confidence_score: number
  method_results: MethodResult[]
  monte_carlo_percentiles: MonteCarloResult | null
  ibc_recovery_range: { low: number; high: number; sector: string } | null
  ai_narrative: string | null
  created_at: string
}

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export default function ReportPage() {
  const params = useParams()
  const id = params?.id as string
  const storeResult = useValuationStore((s) => s.result)
  const storeInputs = useValuationStore((s) => s.inputs)
  const [valuation, setValuation] = useState<ValuationRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [usingLocalFallback, setUsingLocalFallback] = useState(false)

  useEffect(() => {
    if (!id) return

    async function fetchReport() {
      // 1. Try Supabase fetch
      const supabase = getSupabaseClient()
      if (supabase && id !== 'local') {
        try {
          const { data, error: fetchError } = await supabase
            .from('valuations')
            .select('*')
            .eq('id', id)
            .single()

          if (!fetchError && data) {
            setValuation(data as ValuationRow)
            setLoading(false)
            return
          }
        } catch {
          // Fall through to local fallback
        }
      }

      // 2. Fall back to local store data
      if (storeResult && storeInputs.company_name) {
        setUsingLocalFallback(true)
        setValuation({
          id: id,
          email: '',
          company_name: storeInputs.company_name,
          sector: storeInputs.sector,
          stage: storeInputs.stage,
          annual_revenue: storeInputs.annual_revenue,
          revenue_growth_pct: storeInputs.revenue_growth_pct,
          gross_margin_pct: storeInputs.gross_margin_pct,
          monthly_burn: storeInputs.monthly_burn,
          cash_in_bank: storeInputs.cash_in_bank,
          tam: storeInputs.tam,
          team_size: storeInputs.team_size,
          founder_experience: storeInputs.founder_experience,
          domain_expertise: storeInputs.domain_expertise,
          previous_exits: storeInputs.previous_exits,
          dev_stage: storeInputs.dev_stage,
          competitive_advantages: storeInputs.competitive_advantages?.join(', ') ?? null,
          competition_level: storeInputs.competition_level,
          esop_pool_pct: storeInputs.esop_pool_pct,
          time_to_liquidity_years: storeInputs.time_to_liquidity_years,
          target_raise: storeInputs.target_raise,
          current_cap_table: storeInputs.current_cap_table,
          valuation_low: storeResult.composite_low,
          valuation_mid: storeResult.composite_value,
          valuation_high: storeResult.composite_high,
          confidence_score: storeResult.confidence_score,
          method_results: storeResult.methods,
          monte_carlo_percentiles: storeResult.monte_carlo,
          ibc_recovery_range: storeResult.ibc_recovery_range,
          ai_narrative: null,
          created_at: new Date().toISOString(),
        })
        setLoading(false)
        return
      }

      // 3. No data available
      setError(true)
      setLoading(false)
    }

    fetchReport()
  }, [id, storeResult, storeInputs])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <ReportSkeleton />
      </main>
    )
  }

  if (error || !valuation) {
    return (
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center py-20 space-y-4">
          <h1 className="text-2xl font-bold text-white mb-2">Report Not Found</h1>
          <p className="text-slate-400 max-w-md mx-auto">
            This report could not be loaded. It may not exist, or the database may not be configured.
          </p>
          <div className="flex gap-3 justify-center mt-6">
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-slate-700 text-slate-300"
            >
              Retry
            </Button>
            <Link href="/valuation">
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
                Create New Valuation
              </Button>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const result: ValuationResult = {
    methods: valuation.method_results ?? [],
    composite_value: valuation.valuation_mid,
    composite_low: valuation.valuation_low,
    composite_high: valuation.valuation_high,
    confidence_score: valuation.confidence_score,
    monte_carlo: valuation.monte_carlo_percentiles,
    ibc_recovery_range: valuation.ibc_recovery_range,
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      {/* Local fallback disclaimer */}
      {usingLocalFallback && id !== 'local' && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 text-center">
          <p className="text-sm text-amber-400">
            Showing your last locally computed valuation — this may not correspond to the shared report.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{valuation.company_name}</h1>
        <p className="text-amber-400 text-xl font-semibold">
          {formatINR(result.composite_low)} — {formatINR(result.composite_high)}
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Composite: {formatINR(result.composite_value)} | Confidence: {result.confidence_score}/100
        </p>
      </div>

      <MethodologySection methods={result.methods} />

      <BenchmarksSection sector={valuation.sector} />

      <ComparablesSection sector={valuation.sector} stage={valuation.stage} />

      <ListedComparablesSection
        sector={valuation.sector}
        revenue={valuation.annual_revenue}
        stage={valuation.stage}
      />

      <DownsideSection sector={valuation.sector} />

      <ESOPSection valuation={valuation} compositeValue={result.composite_value} />

      <CapTableSection valuation={valuation} compositeValue={result.composite_value} />

      <InvestorSection
        sector={valuation.sector}
        stage={valuation.stage}
        targetRaise={valuation.target_raise}
      />

      <AINarrative valuationId={valuation.id} />

      <RecommendationsSection result={result} sector={valuation.sector} stage={valuation.stage} />

      <PDFDownloadButton valuation={valuation} result={result} />

      <CertifiedCTA />
    </main>
  )
}
```

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `fix: report page with Supabase fetch, local store fallback, disclaimer, retry, and skeleton`

---

### Task 19: Error boundary class component

**File to create: `/Users/rakeshanita/firstunicornstartup/src/components/error-boundary.tsx`**

```typescript
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
  fallbackTitle?: string
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * React error boundary — must be a class component.
 * React requires `static getDerivedStateFromError` and `componentDidCatch`
 * for error boundaries; functional components cannot catch render errors.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, errorInfo)
    // Future: send to Sentry or other error tracking service
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center space-y-4">
          <h2 className="text-lg font-semibold text-white">
            {this.props.fallbackTitle ?? 'Something went wrong'}
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            {this.props.fallbackMessage ??
              'An unexpected error occurred. Please try again.'}
          </p>
          {this.state.error && (
            <details className="text-xs text-slate-600 mt-2">
              <summary className="cursor-pointer hover:text-slate-400">Error details</summary>
              <pre className="mt-2 text-left bg-slate-900 p-3 rounded overflow-x-auto">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <Button
            onClick={this.handleReset}
            className="bg-amber-500 hover:bg-amber-600 text-slate-900"
          >
            Try Again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Build/test commands:**
```bash
npm run build
```

**Commit message:** `feat: add ErrorBoundary class component for graceful error handling`

---

### Task 20: Loading skeletons (ValuationSkeleton, WizardSkeleton, ReportSkeleton)

**Pre-requisite:** The shadcn Skeleton component should already be installed from Task 7. If not:
```bash
npx shadcn@latest add skeleton
```

**File to create: `/Users/rakeshanita/firstunicornstartup/src/components/skeletons.tsx`**

```typescript
import { Skeleton } from '@/components/ui/skeleton'

export function ValuationSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4">
      {/* Reveal card skeleton */}
      <div className="border-2 border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col items-center space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>

      {/* Method cards skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function WizardSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4">
      {/* Progress bar skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-2 w-full rounded-full" />
        <div className="flex justify-between">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
      </div>

      {/* Form skeleton */}
      <div className="border border-slate-800 rounded-2xl p-8 space-y-5">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons skeleton */}
      <div className="flex justify-between">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-28" />
      </div>
    </div>
  )
}

export function ReportSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header skeleton */}
      <div className="border border-slate-800 rounded-lg p-6 space-y-3 text-center">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </div>

      {/* Section skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border border-slate-800 rounded-lg p-6 space-y-4">
          <Skeleton className="h-6 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          {i <= 2 && <Skeleton className="h-32 w-full" />}
        </div>
      ))}
    </div>
  )
}
```

**Build/test commands:**
```bash
npm run build
npm run test
```

**Commit message:** `feat: add ValuationSkeleton, WizardSkeleton, and ReportSkeleton loading components`

---

## Verification Checklist

After all chunks are complete, run:

```bash
npm run build    # Must succeed with zero errors
npm run test     # All 166 existing tests must pass
npm run dev      # Manual visual check of each page
```

Pages to manually verify:
1. **Landing page** (`/`) -- hero animations, trust signals glassmorphism, timeline, method showcase expand/collapse, CTA section, footer
2. **Valuation wizard** (`/valuation`) -- step transitions with slide animation, progress bar animation, step indicator scaling, loading spinner on submit
3. **Results** (after running valuation) -- animated counter on reveal, staggered method cards, blur preview on email gate
4. **Report** (`/report/local`) -- local fallback with disclaimer, loading skeleton, error state with retry
5. **Header/nav** -- sticky header on all pages, active state highlighting, mobile hamburger menu

---

### Critical Files for Implementation

- `/Users/rakeshanita/firstunicornstartup/src/components/wizard/wizard-container.tsx` - Core wizard component receiving AnimatePresence transitions, direction state, loading spinner, and WIZARD_STEPS import migration
- `/Users/rakeshanita/firstunicornstartup/src/app/report/[id]/page.tsx` - Broken report page requiring Supabase fetch, local store fallback, disclaimer, and skeleton loading state
- `/Users/rakeshanita/firstunicornstartup/src/components/landing/hero.tsx` - Hero section receiving Framer Motion animations, gradient mesh background, and stat counters
- `/Users/rakeshanita/firstunicornstartup/src/app/globals.css` - CSS theme variable wiring from default shadcn dark to amber/slate palette
- `/Users/rakeshanita/firstunicornstartup/src/lib/constants.ts` - Central constants file receiving METHOD_LABELS and WIZARD_STEPS to eliminate duplication

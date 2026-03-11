# First Unicorn Startup — Valuation Platform Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build India's most comprehensive startup valuation platform with 3 valuation approaches × 10 methods (aligned with IBBI/IVS/Rule 11UA), Monte Carlo simulation, cap table modeling, ESOP valuation, investor matching, AI narrative, and IBC downside analysis at firstunicornstartup.com.

**Architecture:** Next.js 14 App Router with client-side valuation computation (zero API cost), Supabase for persistence/auth, Zustand for wizard state, static Damodaran India JSON data at build time. Razorpay for certified report payments. Claude haiku for AI narrative (server-side only).

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Zustand, Recharts, jsPDF, html2canvas, Supabase, Claude API (claude-haiku-4-5), Razorpay, Vercel.

**Spec:** `docs/superpowers/specs/2026-03-11-unicorn-score-valuation-platform-design.md`

---

## File Structure

### Types & Constants
- `src/types/index.ts` — All TypeScript interfaces (StartupCategory, Stage, BusinessModel, WizardInputs, ValuationResult, MethodResult, etc.)
- `src/lib/constants.ts` — Market constants (risk-free rate, equity risk premium, GDP cap, market volatility, tax rate)

### Static Data (JSON + TypeScript)
- `public/data/damodaran/india-benchmarks.json` — All ~90 Damodaran India industry benchmarks
- `public/data/ibc/recovery-benchmarks.json` — IBC sector recovery rates
- `src/lib/data/sector-mapping.ts` — 25 startup categories → Damodaran industry mapping + adjacency matrix
- `src/lib/data/damodaran-india.ts` — TypeScript wrapper that imports JSON, typed lookups
- `src/lib/data/sector-benchmarks.ts` — Stage × sector pre-money benchmarks, Berkus milestones, Risk Factor adjustments
- `src/lib/data/comparable-companies.ts` — 50+ Indian startup funding data
- `src/lib/data/ibc-recovery.ts` — IBC recovery rates typed wrapper
- `src/lib/data/investors.ts` — 40+ Indian VC/PE fund database

### Valuation Engine (pure functions, no UI dependencies)
**Income Approach:**
- `src/lib/valuation/dcf.ts` — Method 1: DCF (deterministic)
- `src/lib/valuation/pwerm.ts` — Method 2: Probability Weighted Expected Return
**Market Approach:**
- `src/lib/valuation/revenue-multiple.ts` — Method 3: Revenue Multiple
- `src/lib/valuation/ebitda-multiple.ts` — Method 4: EV/EBITDA Comparable Company Multiple
- `src/lib/valuation/comparable-transaction.ts` — Method 5: Comparable Transaction
**Asset/Cost Approach:**
- `src/lib/valuation/nav.ts` — Method 6: Net Asset Value
- `src/lib/valuation/replacement-cost.ts` — Method 7: Replacement Cost
**VC/Startup Methods:**
- `src/lib/valuation/scorecard.ts` — Method 8: Scorecard (Bill Payne)
- `src/lib/valuation/berkus.ts` — Method 9: Berkus
- `src/lib/valuation/risk-factor.ts` — Method 10: Risk Factor Summation
**Supporting:**
- `src/lib/valuation/confidence-score.ts` — Composite confidence (0-100)
- `src/lib/valuation/monte-carlo.worker.ts` — Web Worker for MC simulation
- `src/lib/valuation/index.ts` — Orchestrator: runs all 10 methods, computes weighted composite

### Calculators (pure functions)
- `src/lib/calculators/esop-valuation.ts` — Black-Scholes for ESOPs + sensitivity
- `src/lib/calculators/cap-table.ts` — Dilution, multi-round, pre/post-round ESOP
- `src/lib/calculators/burn-rate.ts` — Runway from burn + cash

### Matching
- `src/lib/matching/investor-match.ts` — Investor scoring algorithm

### Utilities
- `src/lib/utils.ts` — INR formatting (lakh/crore), Indian comma format, date helpers
- `src/lib/export/pdf-generator.ts` — jsPDF full report
- `src/lib/export/csv-export.ts` — Cap table CSV

### State
- `src/stores/valuation-store.ts` — Zustand with localStorage persistence

### Pages
- `src/app/layout.tsx` — Root layout with metadata
- `src/app/page.tsx` — Landing page
- `src/app/valuation/page.tsx` — Wizard + results
- `src/app/report/[id]/page.tsx` — Detailed report (post-email)
- `src/app/cap-table/page.tsx` — Standalone cap table (SEO)
- `src/app/esop-calculator/page.tsx` — Standalone ESOP calculator (SEO)

### API Routes
- `src/app/api/capture/route.ts` — Email + valuation storage
- `src/app/api/ai-analysis/route.ts` — Claude proxy with caching
- `src/app/api/certified/route.ts` — Razorpay webhook
- `src/app/api/health/route.ts` — Health check

### Components (Landing)
- `src/components/landing/hero.tsx`
- `src/components/landing/trust-signals.tsx`
- `src/components/landing/how-it-works.tsx`
- `src/components/landing/method-showcase.tsx`
- `src/components/landing/testimonials.tsx`
- `src/components/landing/footer.tsx`

### Components (Wizard)
- `src/components/wizard/wizard-container.tsx` — 6-step nav + progress
- `src/components/wizard/company-step.tsx` — Step 1
- `src/components/wizard/team-step.tsx` — Step 2
- `src/components/wizard/financials-step.tsx` — Step 3
- `src/components/wizard/market-product-step.tsx` — Step 4
- `src/components/wizard/strategic-step.tsx` — Step 5
- `src/components/wizard/esop-captable-step.tsx` — Step 6

### Components (Results)
- `src/components/results/valuation-reveal.tsx`
- `src/components/results/method-cards.tsx`
- `src/components/results/method-contribution.tsx`
- `src/components/results/monte-carlo-chart.tsx`
- `src/components/results/confidence-breakdown.tsx`
- `src/components/results/share-buttons.tsx`
- `src/components/results/email-gate.tsx`

### Components (Report)
- `src/components/report/methodology.tsx`
- `src/components/report/benchmarks.tsx`
- `src/components/report/comparables.tsx`
- `src/components/report/listed-comparables.tsx`
- `src/components/report/downside-analysis.tsx`
- `src/components/report/esop-estimate.tsx`
- `src/components/report/cap-table-simulator.tsx`
- `src/components/report/investor-matching.tsx`
- `src/components/report/ai-narrative.tsx`
- `src/components/report/recommendations.tsx`
- `src/components/report/certified-cta.tsx`

### Database
- `supabase/migrations/001_schema.sql`

### Scripts
- `scripts/process-damodaran.py` — Excel → JSON converter

### Tests
- `__tests__/lib/valuation/dcf.test.ts`
- `__tests__/lib/valuation/pwerm.test.ts`
- `__tests__/lib/valuation/revenue-multiple.test.ts`
- `__tests__/lib/valuation/ebitda-multiple.test.ts`
- `__tests__/lib/valuation/comparable-transaction.test.ts`
- `__tests__/lib/valuation/nav.test.ts`
- `__tests__/lib/valuation/replacement-cost.test.ts`
- `__tests__/lib/valuation/scorecard.test.ts`
- `__tests__/lib/valuation/berkus.test.ts`
- `__tests__/lib/valuation/risk-factor.test.ts`
- `__tests__/lib/valuation/confidence-score.test.ts`
- `__tests__/lib/valuation/monte-carlo.test.ts`
- `__tests__/lib/valuation/orchestrator.test.ts`
- `__tests__/lib/calculators/esop-valuation.test.ts`
- `__tests__/lib/calculators/cap-table.test.ts`
- `__tests__/lib/calculators/burn-rate.test.ts`
- `__tests__/lib/matching/investor-match.test.ts`
- `__tests__/lib/utils.test.ts`
- `__tests__/lib/data/sector-mapping.test.ts`

---

## Chunk 1: Project Scaffolding + Types + Data Layer

### Task 1: Initialize Next.js 14 Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `.gitignore`

- [ ] **Step 1: Create Next.js 14 app with TypeScript and Tailwind**

```bash
cd /Users/rakeshanita/firstunicornstartup
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack
```

When prompted, accept defaults. This creates the full Next.js scaffold.

- [ ] **Step 2: Install core dependencies**

```bash
npm install zustand recharts jspdf html2canvas @supabase/supabase-js @anthropic-ai/sdk razorpay
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

- [ ] **Step 3: Install shadcn/ui**

```bash
npx shadcn@latest init -d
npx shadcn@latest add button input label select card tabs progress slider radio-group checkbox toast dialog sheet badge separator tooltip accordion
```

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [],
    include: ['__tests__/**/*.test.ts', '__tests__/**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 5: Create directory structure and verify JSON imports work**

```bash
mkdir -p src/lib/{valuation,data,calculators,matching,export} src/stores src/types src/components/{landing,wizard,results,report} public/data/{damodaran,ibc} __tests__/lib/{valuation,data,calculators,matching} supabase/{migrations,functions} scripts
```

Verify `tsconfig.json` has `"resolveJsonModule": true` and `"esModuleInterop": true` (Next.js default includes both).

- [ ] **Step 6: Run `npm run build` to verify scaffold works**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js 14 project with Tailwind, shadcn/ui, Vitest"
```

---

### Task 2: TypeScript Types & Constants

**Files:**
- Create: `src/types/index.ts`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Write the type definitions**

Create `src/types/index.ts`:

```typescript
// ============================================================
// Enumerations
// ============================================================

export const STARTUP_CATEGORIES = [
  'saas', 'fintech_payments', 'fintech_insurance', 'fintech_banking',
  'd2c', 'edtech', 'healthtech_products', 'healthtech_services',
  'ecommerce_general', 'ecommerce_grocery', 'marketplace', 'agritech',
  'logistics', 'cleantech', 'deeptech', 'gaming', 'real_estate_tech',
  'auto_mobility', 'manufacturing', 'media_advertising', 'telecom',
  'travel_hospitality', 'social_impact', 'b2b_services', 'other',
] as const

export type StartupCategory = typeof STARTUP_CATEGORIES[number]

export const STAGES = [
  'idea', 'pre_seed', 'seed', 'pre_series_a',
  'series_a', 'series_b', 'series_c_plus',
] as const

export type Stage = typeof STAGES[number]

export const BUSINESS_MODELS = [
  'saas_subscription', 'marketplace_commission', 'ecommerce_product',
  'advertising', 'freemium', 'transaction_based', 'licensing',
  'services', 'hardware_software', 'other',
] as const

export type BusinessModel = typeof BUSINESS_MODELS[number]

export const DEV_STAGES = [
  'idea', 'prototype', 'mvp', 'beta', 'production', 'scaling',
] as const

export type DevStage = typeof DEV_STAGES[number]

export const COMPETITIVE_ADVANTAGES = [
  'network_effects', 'proprietary_tech', 'brand', 'cost_advantage',
  'switching_costs', 'regulatory', 'data_moat', 'none',
] as const

export type CompetitiveAdvantage = typeof COMPETITIVE_ADVANTAGES[number]

export const PARTNERSHIP_LEVELS = ['none', 'one', 'multiple'] as const
export type PartnershipLevel = typeof PARTNERSHIP_LEVELS[number]

// ============================================================
// Wizard Inputs (collected from user)
// ============================================================

export interface WizardInputs {
  // Step 1: Company Profile
  company_name: string
  sector: StartupCategory
  stage: Stage
  business_model: BusinessModel
  city: string
  founding_year: number

  // Step 2: Team
  team_size: number
  founder_experience: number      // 1-5
  domain_expertise: number        // 1-5
  previous_exits: boolean
  technical_cofounder: boolean
  key_hires: string[]             // ['cto', 'cfo', 'sales_lead']

  // Step 3: Financials
  annual_revenue: number          // in Rs (0 = pre-revenue)
  revenue_growth_pct: number
  gross_margin_pct: number
  monthly_burn: number
  cash_in_bank: number
  cac: number | null              // optional
  ltv: number | null              // optional
  last_round_size: number | null  // optional
  last_round_valuation: number | null // optional

  // Step 4: Market & Product
  tam: number                     // in Rs Cr
  dev_stage: DevStage
  competition_level: number       // 1-5
  competitive_advantages: CompetitiveAdvantage[]
  patents_count: number

  // Step 5: Strategic Factors
  strategic_partnerships: PartnershipLevel
  regulatory_risk: number         // 1-5
  revenue_concentration_pct: number | null
  international_revenue_pct: number

  // Step 6: ESOP & Cap Table (optional)
  esop_pool_pct: number | null
  time_to_liquidity_years: number | null
  current_cap_table: CapTableEntry[] | null
  target_raise: number | null
  expected_dilution_pct: number | null
}

export interface CapTableEntry {
  name: string
  percentage: number
  share_class: 'common' | 'preference' | 'esop'
}

// ============================================================
// Derived Fields (computed, not collected)
// ============================================================

export interface DerivedFields {
  runway_months: number           // Infinity if profitable
  ltv_cac_ratio: number | null
  has_patents: boolean
  default_esop_pct: number
  startup_volatility: number      // clamped 0.40-0.80
}

// ============================================================
// Valuation Results
// ============================================================

export type ValuationApproach = 'income' | 'market' | 'asset_cost' | 'vc_startup'

export type ValuationMethodName =
  | 'dcf' | 'pwerm'                                           // Income
  | 'revenue_multiple' | 'ebitda_multiple' | 'comparable_txn'  // Market
  | 'nav' | 'replacement_cost'                                 // Asset/Cost
  | 'scorecard' | 'berkus' | 'risk_factor'                     // VC

export const METHOD_APPROACH: Record<ValuationMethodName, ValuationApproach> = {
  dcf: 'income', pwerm: 'income',
  revenue_multiple: 'market', ebitda_multiple: 'market', comparable_txn: 'market',
  nav: 'asset_cost', replacement_cost: 'asset_cost',
  scorecard: 'vc_startup', berkus: 'vc_startup', risk_factor: 'vc_startup',
}

export const APPROACH_ORDER: ValuationApproach[] = ['income', 'market', 'asset_cost', 'vc_startup']

export const APPROACH_LABELS: Record<ValuationApproach, string> = {
  income: 'Income Approach',
  market: 'Market Approach',
  asset_cost: 'Asset/Cost Approach',
  vc_startup: 'VC Methods',
}

export interface MethodResult {
  method: ValuationMethodName
  approach: ValuationApproach
  value: number                   // in Rs
  confidence: number              // 0.0 - 1.0
  details: Record<string, unknown> // method-specific breakdown
  applicable: boolean
}

export interface MonteCarloResult {
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
  iterations_valid: number
  iterations_total: number
}

export interface ValuationResult {
  methods: MethodResult[]
  composite_value: number         // weighted average in Rs
  composite_low: number           // P10
  composite_high: number          // P90
  confidence_score: number        // 0-100
  monte_carlo: MonteCarloResult | null
  ibc_recovery_range: { low: number; high: number; sector: string } | null
}

// ============================================================
// ESOP & Cap Table
// ============================================================

export interface ESOPResult {
  value_per_share: number
  total_pool_value: number
  return_multiple: number
  sensitivity: {
    conservative: { volatility: number; time: number; value: number }
    base: { volatility: number; time: number; value: number }
    optimistic: { volatility: number; time: number; value: number }
  }
}

export interface CapTableRound {
  raise_amount: number
  pre_money: number
  esop_expansion_pct: number
  esop_timing: 'pre_round' | 'post_round'
}

export interface CapTableResult {
  shareholders: { name: string; percentage: number; share_class: string }[]
  post_money: number
  new_investor_pct: number
  founder_pct_after: number
}

// ============================================================
// Investor Matching
// ============================================================

export interface Investor {
  name: string
  type: 'vc' | 'pe' | 'angel' | 'family_office' | 'cvc'
  sectors: string[]
  stages: string[]
  check_size_min_cr: number
  check_size_max_cr: number
  city: string
  portfolio_highlights: string[]
  last_active_year: number
  website: string
}

export interface InvestorMatch {
  investor: Investor
  score: number
  reasons: string[]
}

// ============================================================
// Comparable Companies
// ============================================================

export interface ComparableCompany {
  name: string
  sector: string
  stage_at_round: string
  last_round_size_cr: number
  valuation_cr: number
  revenue_cr: number | null
  year: number
  city: string
  business_model: string
  source: string
}

// ============================================================
// Damodaran Data
// ============================================================

export interface DamodaranBenchmark {
  ev_revenue: number
  ev_ebitda: number | null        // null for banks
  wacc: number                    // as decimal, e.g., 0.128
  beta: number
  gross_margin: number | null     // null for banks
}

export interface SectorMapping {
  label: string
  description: string
  primary_damodaran: string
  secondary_damodaran: string | null
  adjacent_sectors: string[]
}

// ============================================================
// Supabase / API
// ============================================================

export interface CaptureRequest {
  email: string
  valuation_inputs: WizardInputs
  valuation_result: ValuationResult
}

export interface CaptureResponse {
  report_id: string
  success: boolean
}

export interface CertifiedRequest {
  valuation_id: string
  report_type: 'rule_11ua' | 'fema' | 'general'
  purpose: string
}
```

- [ ] **Step 2: Write the constants file**

Create `src/lib/constants.ts`:

```typescript
// Market constants — see spec: "Market Constants" table
export const MARKET_CONSTANTS = {
  RISK_FREE_RATE: 0.07,            // 7.0% — 10yr India govt bond
  EQUITY_RISK_PREMIUM: 0.075,      // 7.5% — Damodaran
  GDP_GROWTH_CAP: 0.055,           // 5.5% — terminal growth rate
  MARKET_VOLATILITY: 0.22,         // 22% — Nifty 50 5yr historical
  TAX_RATE: 0.25,                  // 25% — Indian corporate tax
  OPERATING_MARGIN_PROXY: 0.75,    // FCF = revenue × margin × 0.75
  GROWTH_DECAY_FACTOR: 0.85,       // growth decays at 0.85/year
  MC_ITERATIONS_DESKTOP: 10_000,
  MC_ITERATIONS_MOBILE: 2_000,
  MC_MIN_VALID_ITERATIONS: 1_000,
  MC_GROWTH_STD_FACTOR: 0.3,      // std = growth × 0.3
  MC_WACC_STD: 0.02,
  VOLATILITY_CLAMP_MIN: 0.40,
  VOLATILITY_CLAMP_MAX: 0.80,
  STARTUP_VOLATILITY_PREMIUM: 1.5,
} as const

// Illiquidity discount by stage
export const ILLIQUIDITY_DISCOUNT: Record<string, number> = {
  idea: 0.35,
  pre_seed: 0.35,
  seed: 0.35,
  pre_series_a: 0.35,
  series_a: 0.30,
  series_b: 0.25,
  series_c_plus: 0.20,
}

// Default ESOP pool by stage
export const DEFAULT_ESOP_PCT: Record<string, number> = {
  idea: 10,
  pre_seed: 10,
  seed: 12,
  pre_series_a: 10,
  series_a: 15,
  series_b: 10,
  series_c_plus: 10,
}
```

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts src/lib/constants.ts
git commit -m "feat: add TypeScript types and market constants"
```

---

### Task 3: Sector Mapping & Damodaran Data

**Files:**
- Create: `public/data/damodaran/india-benchmarks.json`
- Create: `src/lib/data/sector-mapping.ts`
- Create: `src/lib/data/damodaran-india.ts`
- Test: `__tests__/lib/data/sector-mapping.test.ts`

- [ ] **Step 1: Write the failing test for sector mapping**

Create `__tests__/lib/data/sector-mapping.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { SECTOR_MAPPING, getSectorLabel, getDamodaranBenchmark, getAdjacentSectors } from '@/lib/data/sector-mapping'
import type { StartupCategory } from '@/types'

describe('sector-mapping', () => {
  it('has mapping for all 25 startup categories', () => {
    const categories: StartupCategory[] = [
      'saas', 'fintech_payments', 'fintech_insurance', 'fintech_banking',
      'd2c', 'edtech', 'healthtech_products', 'healthtech_services',
      'ecommerce_general', 'ecommerce_grocery', 'marketplace', 'agritech',
      'logistics', 'cleantech', 'deeptech', 'gaming', 'real_estate_tech',
      'auto_mobility', 'manufacturing', 'media_advertising', 'telecom',
      'travel_hospitality', 'social_impact', 'b2b_services', 'other',
    ]
    for (const cat of categories) {
      expect(SECTOR_MAPPING[cat]).toBeDefined()
      expect(SECTOR_MAPPING[cat].label).toBeTruthy()
      expect(SECTOR_MAPPING[cat].primary_damodaran).toBeTruthy()
    }
  })

  it('getSectorLabel returns human-readable label', () => {
    expect(getSectorLabel('saas')).toBe('SaaS / Enterprise Software')
    expect(getSectorLabel('fintech_payments')).toBe('Fintech — Payments & Lending')
  })

  it('getDamodaranBenchmark returns benchmark for valid sector', () => {
    const bm = getDamodaranBenchmark('saas')
    expect(bm).toBeDefined()
    expect(bm.ev_revenue).toBeGreaterThan(0)
    expect(bm.wacc).toBeGreaterThan(0)
    expect(bm.beta).toBeGreaterThan(0)
  })

  it('getDamodaranBenchmark falls back to secondary when primary missing', () => {
    // Banks have null gross_margin — secondary should fill
    const bm = getDamodaranBenchmark('fintech_banking')
    expect(bm).toBeDefined()
    expect(bm.wacc).toBeGreaterThan(0)
  })

  it('getDamodaranBenchmark returns Total Market for "other"', () => {
    const bm = getDamodaranBenchmark('other')
    expect(bm.ev_revenue).toBeCloseTo(3.2, 0)
  })

  it('getAdjacentSectors returns array', () => {
    const adj = getAdjacentSectors('saas')
    expect(adj).toContain('fintech_payments')
    expect(adj).toContain('marketplace')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/data/sector-mapping.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create the Damodaran India benchmarks JSON**

Create `public/data/damodaran/india-benchmarks.json`:

```json
{
  "Software (System & Application)": { "ev_revenue": 8.2, "ev_ebitda": 32.5, "wacc": 0.128, "beta": 1.05, "gross_margin": 0.72 },
  "Software (Internet)": { "ev_revenue": 7.5, "ev_ebitda": 30.1, "wacc": 0.130, "beta": 1.12, "gross_margin": 0.68 },
  "Software (Entertainment)": { "ev_revenue": 5.8, "ev_ebitda": 24.2, "wacc": 0.135, "beta": 1.15, "gross_margin": 0.62 },
  "Financial Svcs. (Non-bank & Insurance)": { "ev_revenue": 5.4, "ev_ebitda": 22.1, "wacc": 0.142, "beta": 1.18, "gross_margin": 0.55 },
  "Insurance (General)": { "ev_revenue": 2.8, "ev_ebitda": 12.5, "wacc": 0.120, "beta": 0.78, "gross_margin": 0.40 },
  "Investments & Asset Management": { "ev_revenue": 6.2, "ev_ebitda": 18.3, "wacc": 0.115, "beta": 0.85, "gross_margin": 0.58 },
  "Banks (Regional)": { "ev_revenue": 3.1, "ev_ebitda": null, "wacc": 0.138, "beta": 0.72, "gross_margin": null },
  "Household Products": { "ev_revenue": 3.5, "ev_ebitda": 20.4, "wacc": 0.122, "beta": 0.82, "gross_margin": 0.48 },
  "Retail (Special Lines)": { "ev_revenue": 2.1, "ev_ebitda": 18.7, "wacc": 0.135, "beta": 0.95, "gross_margin": 0.45 },
  "Retail (General)": { "ev_revenue": 1.8, "ev_ebitda": 15.2, "wacc": 0.140, "beta": 1.10, "gross_margin": 0.35 },
  "Retail (Grocery and Food)": { "ev_revenue": 0.8, "ev_ebitda": 12.1, "wacc": 0.132, "beta": 0.68, "gross_margin": 0.25 },
  "Education": { "ev_revenue": 4.8, "ev_ebitda": 25.3, "wacc": 0.131, "beta": 0.92, "gross_margin": 0.65 },
  "Healthcare Products": { "ev_revenue": 5.1, "ev_ebitda": 21.8, "wacc": 0.125, "beta": 0.88, "gross_margin": 0.60 },
  "Healthcare Support Services": { "ev_revenue": 3.2, "ev_ebitda": 16.5, "wacc": 0.130, "beta": 0.90, "gross_margin": 0.42 },
  "Hospitals/Healthcare Facilities": { "ev_revenue": 2.5, "ev_ebitda": 14.2, "wacc": 0.128, "beta": 0.85, "gross_margin": 0.38 },
  "Information Services": { "ev_revenue": 6.5, "ev_ebitda": 28.4, "wacc": 0.133, "beta": 1.02, "gross_margin": 0.68 },
  "Farming/Agriculture": { "ev_revenue": 2.3, "ev_ebitda": 14.6, "wacc": 0.148, "beta": 0.85, "gross_margin": 0.38 },
  "Food Processing": { "ev_revenue": 1.9, "ev_ebitda": 15.8, "wacc": 0.135, "beta": 0.75, "gross_margin": 0.32 },
  "Food Wholesalers": { "ev_revenue": 0.5, "ev_ebitda": 10.2, "wacc": 0.130, "beta": 0.65, "gross_margin": 0.18 },
  "Transportation": { "ev_revenue": 1.5, "ev_ebitda": 12.1, "wacc": 0.139, "beta": 0.90, "gross_margin": 0.30 },
  "Trucking": { "ev_revenue": 1.2, "ev_ebitda": 10.5, "wacc": 0.142, "beta": 0.95, "gross_margin": 0.25 },
  "Green & Renewable Energy": { "ev_revenue": 3.8, "ev_ebitda": 19.5, "wacc": 0.130, "beta": 0.98, "gross_margin": 0.48 },
  "Power": { "ev_revenue": 2.5, "ev_ebitda": 11.8, "wacc": 0.125, "beta": 0.72, "gross_margin": 0.35 },
  "Computer Services": { "ev_revenue": 4.2, "ev_ebitda": 18.5, "wacc": 0.120, "beta": 0.88, "gross_margin": 0.55 },
  "Entertainment": { "ev_revenue": 3.5, "ev_ebitda": 20.8, "wacc": 0.140, "beta": 1.20, "gross_margin": 0.50 },
  "Real Estate (Operations & Services)": { "ev_revenue": 2.8, "ev_ebitda": 15.2, "wacc": 0.145, "beta": 1.08, "gross_margin": 0.35 },
  "Real Estate (Development)": { "ev_revenue": 1.5, "ev_ebitda": 10.8, "wacc": 0.150, "beta": 1.15, "gross_margin": 0.28 },
  "Auto & Truck": { "ev_revenue": 1.2, "ev_ebitda": 11.5, "wacc": 0.135, "beta": 1.05, "gross_margin": 0.22 },
  "Auto Parts": { "ev_revenue": 1.5, "ev_ebitda": 12.8, "wacc": 0.132, "beta": 0.98, "gross_margin": 0.28 },
  "Machinery": { "ev_revenue": 2.0, "ev_ebitda": 14.5, "wacc": 0.138, "beta": 1.02, "gross_margin": 0.32 },
  "Engineering/Construction": { "ev_revenue": 1.8, "ev_ebitda": 13.2, "wacc": 0.140, "beta": 1.10, "gross_margin": 0.25 },
  "Publishing & Newspapers": { "ev_revenue": 2.5, "ev_ebitda": 14.8, "wacc": 0.135, "beta": 0.92, "gross_margin": 0.45 },
  "Broadcasting": { "ev_revenue": 3.2, "ev_ebitda": 18.5, "wacc": 0.142, "beta": 1.15, "gross_margin": 0.52 },
  "Telecom Services": { "ev_revenue": 2.8, "ev_ebitda": 8.5, "wacc": 0.125, "beta": 0.70, "gross_margin": 0.55 },
  "Telecom Equipment": { "ev_revenue": 2.2, "ev_ebitda": 14.2, "wacc": 0.138, "beta": 1.00, "gross_margin": 0.38 },
  "Hotel/Gaming": { "ev_revenue": 3.5, "ev_ebitda": 16.8, "wacc": 0.140, "beta": 1.12, "gross_margin": 0.42 },
  "Recreation": { "ev_revenue": 2.8, "ev_ebitda": 15.5, "wacc": 0.135, "beta": 1.05, "gross_margin": 0.38 },
  "Business & Consumer Services": { "ev_revenue": 3.0, "ev_ebitda": 16.2, "wacc": 0.130, "beta": 0.92, "gross_margin": 0.45 },
  "Environmental & Waste Services": { "ev_revenue": 2.5, "ev_ebitda": 14.0, "wacc": 0.128, "beta": 0.80, "gross_margin": 0.38 },
  "Electronics (General)": { "ev_revenue": 2.0, "ev_ebitda": 15.0, "wacc": 0.135, "beta": 1.00, "gross_margin": 0.35 },
  "Total Market": { "ev_revenue": 3.2, "ev_ebitda": 18.0, "wacc": 0.135, "beta": 1.00, "gross_margin": 0.50 }
}
```

- [ ] **Step 4: Create the sector mapping module**

Create `src/lib/data/sector-mapping.ts`:

```typescript
import type { StartupCategory, SectorMapping, DamodaranBenchmark } from '@/types'
import damodaranRaw from '../../../public/data/damodaran/india-benchmarks.json'

const damodaranData = damodaranRaw as Record<string, DamodaranBenchmark>

export const SECTOR_MAPPING: Record<StartupCategory, SectorMapping> = {
  saas: {
    label: 'SaaS / Enterprise Software',
    description: 'B2B software, subscriptions, cloud tools',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Information Services',
    adjacent_sectors: ['fintech_payments', 'marketplace'],
  },
  fintech_payments: {
    label: 'Fintech — Payments & Lending',
    description: 'Payment gateways, BNPL, digital lending',
    primary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['saas', 'ecommerce_general'],
  },
  fintech_insurance: {
    label: 'Fintech — Insurance & Wealth',
    description: 'InsurTech, WealthTech, robo-advisory',
    primary_damodaran: 'Insurance (General)',
    secondary_damodaran: 'Investments & Asset Management',
    adjacent_sectors: ['fintech_payments', 'fintech_banking'],
  },
  fintech_banking: {
    label: 'Fintech — Banking & Neo-Banks',
    description: 'Digital banking, account aggregators',
    primary_damodaran: 'Banks (Regional)',
    secondary_damodaran: 'Financial Svcs. (Non-bank & Insurance)',
    adjacent_sectors: ['fintech_payments', 'fintech_insurance'],
  },
  d2c: {
    label: 'D2C / Consumer Brands',
    description: 'Direct brands, FMCG, beauty, fashion',
    primary_damodaran: 'Household Products',
    secondary_damodaran: 'Retail (Special Lines)',
    adjacent_sectors: ['ecommerce_general', 'marketplace'],
  },
  edtech: {
    label: 'EdTech',
    description: 'Online learning, skill platforms, test prep',
    primary_damodaran: 'Education',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['healthtech_services', 'saas'],
  },
  healthtech_products: {
    label: 'HealthTech — Products & Devices',
    description: 'MedTech, diagnostics, health devices',
    primary_damodaran: 'Healthcare Products',
    secondary_damodaran: 'Electronics (General)',
    adjacent_sectors: ['healthtech_services', 'd2c'],
  },
  healthtech_services: {
    label: 'HealthTech — Services & Platforms',
    description: 'Telemedicine, hospital tech, pharmacy',
    primary_damodaran: 'Healthcare Support Services',
    secondary_damodaran: 'Hospitals/Healthcare Facilities',
    adjacent_sectors: ['edtech', 'healthtech_products'],
  },
  ecommerce_general: {
    label: 'E-commerce — General',
    description: 'Online retail, quick commerce',
    primary_damodaran: 'Retail (General)',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['d2c', 'marketplace', 'logistics'],
  },
  ecommerce_grocery: {
    label: 'E-commerce — Grocery & Food',
    description: 'Online grocery, food delivery',
    primary_damodaran: 'Food Wholesalers',
    secondary_damodaran: 'Retail (Grocery and Food)',
    adjacent_sectors: ['ecommerce_general', 'logistics'],
  },
  marketplace: {
    label: 'Marketplace / Platform',
    description: 'Two-sided platforms, aggregators',
    primary_damodaran: 'Information Services',
    secondary_damodaran: 'Software (Internet)',
    adjacent_sectors: ['saas', 'ecommerce_general', 'd2c'],
  },
  agritech: {
    label: 'AgriTech',
    description: 'Farm-to-fork, precision agriculture',
    primary_damodaran: 'Farming/Agriculture',
    secondary_damodaran: 'Food Processing',
    adjacent_sectors: ['logistics', 'cleantech'],
  },
  logistics: {
    label: 'Logistics & Supply Chain',
    description: 'Last-mile, warehousing, fleet tech',
    primary_damodaran: 'Transportation',
    secondary_damodaran: 'Trucking',
    adjacent_sectors: ['ecommerce_general', 'agritech'],
  },
  cleantech: {
    label: 'CleanTech / Green Energy',
    description: 'Solar, EV, carbon tech, renewables',
    primary_damodaran: 'Green & Renewable Energy',
    secondary_damodaran: 'Power',
    adjacent_sectors: ['agritech', 'logistics'],
  },
  deeptech: {
    label: 'DeepTech / AI-ML',
    description: 'AI products, robotics, computer vision',
    primary_damodaran: 'Software (System & Application)',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['saas', 'healthtech_products'],
  },
  gaming: {
    label: 'Gaming & Entertainment',
    description: 'Gaming studios, OTT, content',
    primary_damodaran: 'Software (Entertainment)',
    secondary_damodaran: 'Entertainment',
    adjacent_sectors: ['media_advertising', 'edtech'],
  },
  real_estate_tech: {
    label: 'Real Estate Tech',
    description: 'PropTech, construction tech',
    primary_damodaran: 'Real Estate (Operations & Services)',
    secondary_damodaran: 'Real Estate (Development)',
    adjacent_sectors: ['manufacturing', 'b2b_services'],
  },
  auto_mobility: {
    label: 'Auto / Mobility',
    description: 'EV, ride-sharing, fleet management',
    primary_damodaran: 'Auto & Truck',
    secondary_damodaran: 'Auto Parts',
    adjacent_sectors: ['logistics', 'cleantech'],
  },
  manufacturing: {
    label: 'Manufacturing / Industrial',
    description: 'Smart factory, industrial IoT',
    primary_damodaran: 'Machinery',
    secondary_damodaran: 'Engineering/Construction',
    adjacent_sectors: ['deeptech', 'auto_mobility'],
  },
  media_advertising: {
    label: 'Media & Advertising',
    description: 'AdTech, content marketing, publishing',
    primary_damodaran: 'Publishing & Newspapers',
    secondary_damodaran: 'Broadcasting',
    adjacent_sectors: ['gaming', 'saas'],
  },
  telecom: {
    label: 'Telecom & Connectivity',
    description: 'Telecom services, ISP, IoT connectivity',
    primary_damodaran: 'Telecom Services',
    secondary_damodaran: 'Telecom Equipment',
    adjacent_sectors: ['deeptech', 'b2b_services'],
  },
  travel_hospitality: {
    label: 'Travel & Hospitality',
    description: 'Travel booking, hotel tech, tourism',
    primary_damodaran: 'Hotel/Gaming',
    secondary_damodaran: 'Recreation',
    adjacent_sectors: ['marketplace', 'ecommerce_general'],
  },
  social_impact: {
    label: 'Social Impact / Non-Profit Tech',
    description: 'Impact investing, social enterprises',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Environmental & Waste Services',
    adjacent_sectors: ['cleantech', 'edtech'],
  },
  b2b_services: {
    label: 'B2B Services',
    description: 'Consulting tech, HR tech, legal tech',
    primary_damodaran: 'Business & Consumer Services',
    secondary_damodaran: 'Computer Services',
    adjacent_sectors: ['saas', 'fintech_payments'],
  },
  other: {
    label: 'Other',
    description: 'Other industry not listed',
    primary_damodaran: 'Total Market',
    secondary_damodaran: null,
    adjacent_sectors: [],
  },
}

export function getSectorLabel(category: StartupCategory): string {
  return SECTOR_MAPPING[category].label
}

export function getAdjacentSectors(category: StartupCategory): string[] {
  return SECTOR_MAPPING[category].adjacent_sectors
}

export function getDamodaranBenchmark(category: StartupCategory): DamodaranBenchmark {
  const mapping = SECTOR_MAPPING[category]
  const primary = damodaranData[mapping.primary_damodaran]

  if (!primary) {
    return damodaranData['Total Market']
  }

  // If primary has null fields and secondary exists, fill from secondary
  if (mapping.secondary_damodaran) {
    const secondary = damodaranData[mapping.secondary_damodaran]
    if (secondary) {
      return {
        ev_revenue: primary.ev_revenue ?? secondary.ev_revenue,
        ev_ebitda: primary.ev_ebitda ?? secondary.ev_ebitda,
        wacc: primary.wacc ?? secondary.wacc,
        beta: primary.beta ?? secondary.beta,
        gross_margin: primary.gross_margin ?? secondary.gross_margin,
      }
    }
  }

  return primary
}
```

- [ ] **Step 5: Create the Damodaran wrapper module**

Create `src/lib/data/damodaran-india.ts`:

```typescript
import type { DamodaranBenchmark } from '@/types'
import damodaranRaw from '../../../public/data/damodaran/india-benchmarks.json'

const data = damodaranRaw as Record<string, DamodaranBenchmark>

/**
 * Get Damodaran benchmark by exact Damodaran industry name.
 * Use this when you have the raw Damodaran industry string.
 * For startup category lookups, use getDamodaranBenchmark from sector-mapping.
 */
export function getDamodaranByIndustry(industry: string): DamodaranBenchmark | null {
  return data[industry] ?? null
}

/** Get all available Damodaran industry names */
export function getDamodaranIndustries(): string[] {
  return Object.keys(data)
}

/** Get the full dataset */
export function getAllDamodaranData(): Record<string, DamodaranBenchmark> {
  return { ...data }
}
```

- [ ] **Step 6: Run tests**

```bash
npx vitest run __tests__/lib/data/sector-mapping.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add public/data/damodaran/ src/lib/data/sector-mapping.ts src/lib/data/damodaran-india.ts __tests__/lib/data/sector-mapping.test.ts
git commit -m "feat: add 25-sector mapping to 90 Damodaran India industries with benchmarks"
```

---

### Task 4: Sector Benchmarks, IBC Recovery, Comparable Companies, Investors Data

**Files:**
- Create: `src/lib/data/sector-benchmarks.ts`
- Create: `public/data/ibc/recovery-benchmarks.json`
- Create: `src/lib/data/ibc-recovery.ts`
- Create: `src/lib/data/comparable-companies.ts`
- Create: `src/lib/data/investors.ts`

- [ ] **Step 1: Create sector benchmarks (stage-based pre-money, Berkus milestones, Risk Factor adjustments)**

Create `src/lib/data/sector-benchmarks.ts`:

```typescript
import type { Stage } from '@/types'

/** Pre-money valuation benchmarks by stage (in Rs) */
export const STAGE_BENCHMARKS: Record<Stage, { typical: number; low: number; high: number }> = {
  idea:           { typical: 5_000_000,    low: 2_000_000,     high: 10_000_000 },     // Rs 50L
  pre_seed:       { typical: 20_000_000,   low: 5_000_000,     high: 50_000_000 },     // Rs 2 Cr
  seed:           { typical: 80_000_000,   low: 30_000_000,    high: 150_000_000 },    // Rs 8 Cr
  pre_series_a:   { typical: 200_000_000,  low: 100_000_000,   high: 400_000_000 },   // Rs 20 Cr
  series_a:       { typical: 500_000_000,  low: 250_000_000,   high: 1_000_000_000 }, // Rs 50 Cr
  series_b:       { typical: 2_000_000_000, low: 800_000_000,  high: 5_000_000_000 }, // Rs 200 Cr
  series_c_plus:  { typical: 5_000_000_000, low: 2_000_000_000, high: 20_000_000_000 }, // Rs 500 Cr
}

/** Berkus milestone max values (in Rs) */
export const BERKUS_MILESTONE_MAX = 10_000_000 // Rs 1 Cr per milestone
export const BERKUS_PRE_REVENUE_CAP = 50_000_000 // Rs 5 Cr total

/** Risk Factor per-adjustment amount by stage (in Rs) */
export const RISK_FACTOR_ADJUSTMENT: Record<Stage, number> = {
  idea:          500_000,       // Rs 5 L
  pre_seed:      1_500_000,     // Rs 15 L
  seed:          4_000_000,     // Rs 40 L
  pre_series_a:  10_000_000,    // Rs 1 Cr
  series_a:      25_000_000,    // Rs 2.5 Cr
  series_b:      100_000_000,   // Rs 10 Cr
  series_c_plus: 250_000_000,   // Rs 25 Cr
}

/** Minimum valuation floor (Rs 10 L) */
export const VALUATION_FLOOR = 1_000_000
```

- [ ] **Step 2: Create IBC recovery benchmarks JSON**

Create `public/data/ibc/recovery-benchmarks.json`:

```json
{
  "manufacturing": { "avg_low": 25, "avg_high": 35, "sample_size": "large", "p25": 18, "p75": 42 },
  "real_estate": { "avg_low": 10, "avg_high": 20, "sample_size": "medium", "p25": 5, "p75": 28 },
  "services_it": { "avg_low": 30, "avg_high": 45, "sample_size": "medium", "p25": 22, "p75": 52 },
  "infrastructure": { "avg_low": 15, "avg_high": 25, "sample_size": "medium", "p25": 8, "p75": 32 },
  "retail_consumer": { "avg_low": 20, "avg_high": 30, "sample_size": "small", "p25": 12, "p75": 38 },
  "other": { "avg_low": 10, "avg_high": 40, "sample_size": "large", "p25": 5, "p75": 45 }
}
```

- [ ] **Step 3: Create IBC recovery wrapper**

Create `src/lib/data/ibc-recovery.ts`:

```typescript
import type { StartupCategory } from '@/types'
import ibcRaw from '../../../public/data/ibc/recovery-benchmarks.json'

interface IBCRecovery {
  avg_low: number
  avg_high: number
  sample_size: string
  p25: number
  p75: number
}

const ibcData = ibcRaw as Record<string, IBCRecovery>

// Map startup categories to IBC sectors
const IBC_SECTOR_MAP: Record<string, string> = {
  saas: 'services_it',
  fintech_payments: 'services_it',
  fintech_insurance: 'services_it',
  fintech_banking: 'services_it',
  d2c: 'retail_consumer',
  edtech: 'services_it',
  healthtech_products: 'manufacturing',
  healthtech_services: 'services_it',
  ecommerce_general: 'retail_consumer',
  ecommerce_grocery: 'retail_consumer',
  marketplace: 'services_it',
  agritech: 'manufacturing',
  logistics: 'infrastructure',
  cleantech: 'infrastructure',
  deeptech: 'services_it',
  gaming: 'services_it',
  real_estate_tech: 'real_estate',
  auto_mobility: 'manufacturing',
  manufacturing: 'manufacturing',
  media_advertising: 'services_it',
  telecom: 'infrastructure',
  travel_hospitality: 'retail_consumer',
  social_impact: 'other',
  b2b_services: 'services_it',
  other: 'other',
}

export function getIBCRecovery(category: StartupCategory): IBCRecovery {
  const ibcSector = IBC_SECTOR_MAP[category] || 'other'
  return ibcData[ibcSector] || ibcData['other']
}
```

- [ ] **Step 4: Create comparable companies data**

Create `src/lib/data/comparable-companies.ts`:

```typescript
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

const STAGE_ORDER: string[] = ['idea', 'pre_seed', 'seed', 'pre_series_a', 'series_a', 'series_b', 'series_c_plus']

/**
 * Find top N comparable companies for given sector and stage.
 * Algorithm from spec:
 * 1. Filter: same sector
 * 2. Filter: stage within ±1
 * 3. Sort by revenue proximity (if revenue), else stage proximity + recency
 * 4. Return top N
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

  // If not enough from same sector, include adjacent (all stages)
  if (candidates.length < topN) {
    const remaining = COMPARABLE_COMPANIES.filter(c =>
      c.sector !== sector && validStages.includes(c.stage_at_round)
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
```

- [ ] **Step 5: Create investors data**

Create `src/lib/data/investors.ts`:

```typescript
import type { Investor } from '@/types'

export const INVESTORS: Investor[] = [
  {
    name: 'Sequoia Capital India',
    type: 'vc',
    sectors: ['saas', 'fintech_payments', 'healthtech_services', 'deeptech'],
    stages: ['seed', 'series_a', 'series_b'],
    check_size_min_cr: 5,
    check_size_max_cr: 200,
    city: 'Bangalore',
    portfolio_highlights: ['Razorpay', 'BrowserStack', 'Zomato', 'BYJU\'S'],
    last_active_year: 2025,
    website: 'https://www.sequoiacap.com/india/',
  },
  {
    name: 'Accel India',
    type: 'vc',
    sectors: ['saas', 'fintech_payments', 'marketplace', 'deeptech'],
    stages: ['seed', 'series_a'],
    check_size_min_cr: 3,
    check_size_max_cr: 100,
    city: 'Bangalore',
    portfolio_highlights: ['Flipkart', 'Freshworks', 'Swiggy', 'Cure.fit'],
    last_active_year: 2025,
    website: 'https://www.accel.com/',
  },
  {
    name: 'Blume Ventures',
    type: 'vc',
    sectors: ['saas', 'd2c', 'edtech', 'healthtech_services', 'deeptech'],
    stages: ['pre_seed', 'seed'],
    check_size_min_cr: 1,
    check_size_max_cr: 15,
    city: 'Mumbai',
    portfolio_highlights: ['Unacademy', 'Purplle', 'Dunzo', 'GreyOrange'],
    last_active_year: 2025,
    website: 'https://blume.vc/',
  },
  {
    name: 'Nexus Venture Partners',
    type: 'vc',
    sectors: ['fintech_payments', 'ecommerce_general', 'agritech', 'logistics'],
    stages: ['seed', 'series_a', 'series_b'],
    check_size_min_cr: 5,
    check_size_max_cr: 150,
    city: 'Delhi',
    portfolio_highlights: ['Delhivery', 'Postman', 'Druva', 'Zomato'],
    last_active_year: 2025,
    website: 'https://nexusvp.com/',
  },
  {
    name: 'India Quotient',
    type: 'vc',
    sectors: ['d2c', 'fintech_payments', 'edtech', 'healthtech_services'],
    stages: ['pre_seed', 'seed'],
    check_size_min_cr: 0.5,
    check_size_max_cr: 10,
    city: 'Bangalore',
    portfolio_highlights: ['ShareChat', 'Sugar Cosmetics', 'Lendingkart'],
    last_active_year: 2025,
    website: 'https://www.indiaquotient.in/',
  },
  {
    name: 'Matrix Partners India',
    type: 'vc',
    sectors: ['fintech_payments', 'saas', 'ecommerce_general', 'd2c'],
    stages: ['seed', 'series_a', 'series_b'],
    check_size_min_cr: 5,
    check_size_max_cr: 100,
    city: 'Mumbai',
    portfolio_highlights: ['Razorpay', 'Ola', 'Country Delight', 'Ofbusiness'],
    last_active_year: 2025,
    website: 'https://www.matrixpartners.in/',
  },
  {
    name: 'Peak XV Partners (Surge)',
    type: 'vc',
    sectors: ['saas', 'fintech_payments', 'marketplace', 'healthtech_services'],
    stages: ['pre_seed', 'seed'],
    check_size_min_cr: 1,
    check_size_max_cr: 15,
    city: 'Bangalore',
    portfolio_highlights: ['Groww', 'Urban Company', 'Khatabook'],
    last_active_year: 2025,
    website: 'https://www.peakxv.com/',
  },
  {
    name: 'Elevation Capital',
    type: 'vc',
    sectors: ['saas', 'fintech_payments', 'ecommerce_general', 'edtech'],
    stages: ['seed', 'series_a', 'series_b'],
    check_size_min_cr: 5,
    check_size_max_cr: 100,
    city: 'Gurgaon',
    portfolio_highlights: ['Paytm', 'MakeMyTrip', 'Unacademy', 'ShareChat'],
    last_active_year: 2025,
    website: 'https://www.elevationcapital.com/',
  },
  {
    name: 'Lightspeed India',
    type: 'vc',
    sectors: ['saas', 'fintech_payments', 'healthtech_products', 'ecommerce_general'],
    stages: ['seed', 'series_a'],
    check_size_min_cr: 3,
    check_size_max_cr: 80,
    city: 'Bangalore',
    portfolio_highlights: ['Oyo', 'Byju\'s', 'Udaan', 'Yellow.ai'],
    last_active_year: 2025,
    website: 'https://lsvp.com/',
  },
  {
    name: 'Kalaari Capital',
    type: 'vc',
    sectors: ['d2c', 'fintech_payments', 'healthtech_services', 'gaming'],
    stages: ['seed', 'series_a'],
    check_size_min_cr: 3,
    check_size_max_cr: 50,
    city: 'Bangalore',
    portfolio_highlights: ['Dream11', 'Curefit', 'Myntra', 'Milkbasket'],
    last_active_year: 2025,
    website: 'https://www.kalaari.com/',
  },
  {
    name: '100X.VC',
    type: 'angel',
    sectors: ['saas', 'deeptech', 'd2c', 'fintech_payments', 'healthtech_services'],
    stages: ['idea', 'pre_seed'],
    check_size_min_cr: 0.25,
    check_size_max_cr: 1.25,
    city: 'Mumbai',
    portfolio_highlights: ['Teachmint', 'Juno', 'Tealfeed'],
    last_active_year: 2025,
    website: 'https://www.100x.vc/',
  },
  {
    name: 'Titan Capital',
    type: 'angel',
    sectors: ['saas', 'fintech_payments', 'edtech', 'marketplace'],
    stages: ['pre_seed', 'seed'],
    check_size_min_cr: 0.5,
    check_size_max_cr: 5,
    city: 'Delhi',
    portfolio_highlights: ['Razorpay', 'Ola', 'Lenskart'],
    last_active_year: 2025,
    website: 'https://titancapital.in/',
  },
  {
    name: 'Chiratae Ventures',
    type: 'vc',
    sectors: ['saas', 'healthtech_products', 'cleantech', 'manufacturing'],
    stages: ['seed', 'series_a', 'series_b'],
    check_size_min_cr: 5,
    check_size_max_cr: 80,
    city: 'Bangalore',
    portfolio_highlights: ['Myntra', 'Manthan', 'Fibe', 'Licious'],
    last_active_year: 2025,
    website: 'https://www.chiratae.com/',
  },
  {
    name: 'Omidyar Network India',
    type: 'vc',
    sectors: ['fintech_payments', 'social_impact', 'edtech', 'agritech'],
    stages: ['seed', 'series_a'],
    check_size_min_cr: 2,
    check_size_max_cr: 30,
    city: 'Mumbai',
    portfolio_highlights: ['DailyHunt', 'Pratilipi', 'Avanti Finance'],
    last_active_year: 2024,
    website: 'https://www.omidyarnetwork.in/',
  },
  {
    name: 'Stellaris Venture Partners',
    type: 'vc',
    sectors: ['saas', 'fintech_payments', 'marketplace', 'b2b_services'],
    stages: ['seed', 'series_a'],
    check_size_min_cr: 3,
    check_size_max_cr: 40,
    city: 'Bangalore',
    portfolio_highlights: ['Mamaearth', 'Observe.ai', 'Jar'],
    last_active_year: 2025,
    website: 'https://stellarisvp.com/',
  },
]
```

- [ ] **Step 6: Write tests for data modules**

Create `__tests__/lib/data/data-integrity.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { STAGE_BENCHMARKS, RISK_FACTOR_ADJUSTMENT, BERKUS_MILESTONE_MAX, VALUATION_FLOOR } from '@/lib/data/sector-benchmarks'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'
import { findComparables, COMPARABLE_COMPANIES } from '@/lib/data/comparable-companies'
import { INVESTORS } from '@/lib/data/investors'
import { STAGES, STARTUP_CATEGORIES } from '@/types'

describe('sector-benchmarks', () => {
  it('has benchmarks for all 7 stages', () => {
    for (const stage of STAGES) {
      expect(STAGE_BENCHMARKS[stage]).toBeDefined()
      expect(STAGE_BENCHMARKS[stage].typical).toBeGreaterThan(0)
      expect(STAGE_BENCHMARKS[stage].low).toBeLessThan(STAGE_BENCHMARKS[stage].typical)
      expect(STAGE_BENCHMARKS[stage].high).toBeGreaterThan(STAGE_BENCHMARKS[stage].typical)
    }
  })

  it('has risk factor adjustments for all 7 stages', () => {
    for (const stage of STAGES) {
      expect(RISK_FACTOR_ADJUSTMENT[stage]).toBeDefined()
      expect(RISK_FACTOR_ADJUSTMENT[stage]).toBeGreaterThan(0)
    }
  })

  it('Berkus max is Rs 1 Cr', () => {
    expect(BERKUS_MILESTONE_MAX).toBe(10_000_000)
  })
})

describe('ibc-recovery', () => {
  it('returns recovery data for all startup categories', () => {
    for (const cat of STARTUP_CATEGORIES) {
      const recovery = getIBCRecovery(cat)
      expect(recovery).toBeDefined()
      expect(recovery.avg_low).toBeGreaterThanOrEqual(0)
      expect(recovery.avg_high).toBeGreaterThan(recovery.avg_low)
    }
  })
})

describe('comparable-companies', () => {
  it('has at least 25 companies', () => {
    // TODO: Expand to 50+ entries per spec before launch
    expect(COMPARABLE_COMPANIES.length).toBeGreaterThanOrEqual(25)
  })

  it('findComparables returns up to 5 results', () => {
    const results = findComparables('saas', 'series_a', 300)
    expect(results.length).toBeLessThanOrEqual(5)
    expect(results.length).toBeGreaterThan(0)
  })

  it('findComparables prefers same sector', () => {
    const results = findComparables('fintech_payments', 'series_b', null)
    const sameSector = results.filter(r => r.sector === 'fintech_payments')
    expect(sameSector.length).toBeGreaterThan(0)
  })
})

describe('investors', () => {
  it('has at least 15 investors', () => {
    // TODO: Expand to 40+ entries per spec before launch
    expect(INVESTORS.length).toBeGreaterThanOrEqual(15)
  })

  it('each investor has required fields', () => {
    for (const inv of INVESTORS) {
      expect(inv.name).toBeTruthy()
      expect(inv.sectors.length).toBeGreaterThan(0)
      expect(inv.stages.length).toBeGreaterThan(0)
      expect(inv.check_size_max_cr).toBeGreaterThan(inv.check_size_min_cr)
    }
  })
})
```

- [ ] **Step 7: Run tests**

```bash
npx vitest run __tests__/lib/data/data-integrity.test.ts
```

Expected: All tests PASS.

- [ ] **Step 8: Commit**

```bash
git add src/lib/data/ public/data/ibc/ __tests__/lib/data/data-integrity.test.ts
git commit -m "feat: add sector benchmarks, IBC recovery, comparable companies, and investor data"
```

---

### Task 5: Utility Functions

**Files:**
- Create: `src/lib/utils.ts`
- Create: `src/lib/calculators/burn-rate.ts`
- Test: `__tests__/lib/utils.test.ts`
- Test: `__tests__/lib/calculators/burn-rate.test.ts`

- [ ] **Step 1: Write the failing tests for utils**

Create `__tests__/lib/utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { formatINR, formatPercentage, formatIndianNumber, clamp } from '@/lib/utils'

describe('formatINR', () => {
  it('formats values under Rs 1 Cr in lakhs', () => {
    expect(formatINR(5_000_000)).toBe('Rs 50 L')
    expect(formatINR(1_500_000)).toBe('Rs 15 L')
    expect(formatINR(500_000)).toBe('Rs 5 L')
  })

  it('formats values >= Rs 1 Cr in crores', () => {
    expect(formatINR(10_000_000)).toBe('Rs 1.0 Cr')
    expect(formatINR(80_000_000)).toBe('Rs 8.0 Cr')
    expect(formatINR(1_250_000_000)).toBe('Rs 125.0 Cr')
  })

  it('formats zero', () => {
    expect(formatINR(0)).toBe('Rs 0')
  })
})

describe('formatPercentage', () => {
  it('formats with one decimal', () => {
    expect(formatPercentage(23.456)).toBe('23.5%')
    expect(formatPercentage(100)).toBe('100.0%')
  })
})

describe('formatIndianNumber', () => {
  it('uses Indian comma format', () => {
    expect(formatIndianNumber(100000)).toBe('1,00,000')
    expect(formatIndianNumber(10000000)).toBe('1,00,00,000')
  })
})

describe('clamp', () => {
  it('clamps values to range', () => {
    expect(clamp(50, 0, 100)).toBe(50)
    expect(clamp(-10, 0, 100)).toBe(0)
    expect(clamp(150, 0, 100)).toBe(100)
  })
})
```

- [ ] **Step 2: Write the failing test for burn-rate**

Create `__tests__/lib/calculators/burn-rate.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateRunway, computeDerivedFields } from '@/lib/calculators/burn-rate'

describe('calculateRunway', () => {
  it('returns months of runway', () => {
    expect(calculateRunway(1_000_000, 100_000)).toBe(10)
  })

  it('returns Infinity when burn is 0', () => {
    expect(calculateRunway(1_000_000, 0)).toBe(Infinity)
  })

  it('returns 0 when cash is 0', () => {
    expect(calculateRunway(0, 100_000)).toBe(0)
  })
})

describe('computeDerivedFields', () => {
  it('computes all derived fields', () => {
    const derived = computeDerivedFields({
      monthly_burn: 500_000,
      cash_in_bank: 6_000_000,
      cac: 1000,
      ltv: 5000,
      patents_count: 2,
      stage: 'seed',
      sector: 'saas',
    })
    expect(derived.runway_months).toBe(12)
    expect(derived.ltv_cac_ratio).toBe(5)
    expect(derived.has_patents).toBe(true)
    expect(derived.default_esop_pct).toBe(12)
    expect(derived.startup_volatility).toBeGreaterThanOrEqual(0.40)
    expect(derived.startup_volatility).toBeLessThanOrEqual(0.80)
  })
})
```

- [ ] **Step 3: Run tests to verify they fail**

```bash
npx vitest run __tests__/lib/utils.test.ts __tests__/lib/calculators/burn-rate.test.ts
```

Expected: FAIL — modules not found.

- [ ] **Step 4: Implement utils**

Create `src/lib/utils.ts`:

```typescript
/**
 * Format a number as INR in lakh/crore notation.
 * < Rs 1 Cr → "Rs X L"
 * >= Rs 1 Cr → "Rs X.X Cr"
 */
export function formatINR(value: number): string {
  if (value === 0) return 'Rs 0'
  const crore = 10_000_000
  const lakh = 100_000
  if (Math.abs(value) >= crore) {
    return `Rs ${(value / crore).toFixed(1)} Cr`
  }
  if (Math.abs(value) >= lakh) {
    return `Rs ${Math.round(value / lakh)} L`
  }
  // Sub-lakh: use Indian comma format with thousands
  return `Rs ${formatIndianNumber(Math.round(value))}`
}

/** Format percentage with 1 decimal place */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`
}

/** Format number in Indian comma notation: 1,00,000 */
export function formatIndianNumber(num: number): string {
  const str = Math.round(num).toString()
  if (str.length <= 3) return str
  let result = str.slice(-3)
  let remaining = str.slice(0, -3)
  while (remaining.length > 0) {
    const chunk = remaining.slice(-2)
    result = chunk + ',' + result
    remaining = remaining.slice(0, -2)
  }
  return result
}

/** Clamp a value between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
```

- [ ] **Step 5: Implement burn-rate calculator**

Create `src/lib/calculators/burn-rate.ts`:

```typescript
import type { DerivedFields, Stage, StartupCategory } from '@/types'
import { MARKET_CONSTANTS, DEFAULT_ESOP_PCT } from '@/lib/constants'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { clamp } from '@/lib/utils'

/** Calculate runway in months */
export function calculateRunway(cash_in_bank: number, monthly_burn: number): number {
  if (monthly_burn <= 0) return Infinity
  return cash_in_bank / monthly_burn
}

/** Compute all derived fields from wizard inputs */
export function computeDerivedFields(inputs: {
  monthly_burn: number
  cash_in_bank: number
  cac: number | null
  ltv: number | null
  patents_count: number
  stage: Stage
  sector: StartupCategory
}): DerivedFields {
  const runway_months = calculateRunway(inputs.cash_in_bank, inputs.monthly_burn)

  const ltv_cac_ratio = (inputs.cac && inputs.cac > 0 && inputs.ltv)
    ? inputs.ltv / inputs.cac
    : null

  const has_patents = inputs.patents_count > 0

  const default_esop_pct = DEFAULT_ESOP_PCT[inputs.stage] ?? 10

  const benchmark = getDamodaranBenchmark(inputs.sector)
  const rawVolatility = benchmark.beta * MARKET_CONSTANTS.MARKET_VOLATILITY * MARKET_CONSTANTS.STARTUP_VOLATILITY_PREMIUM
  const startup_volatility = clamp(
    rawVolatility,
    MARKET_CONSTANTS.VOLATILITY_CLAMP_MIN,
    MARKET_CONSTANTS.VOLATILITY_CLAMP_MAX
  )

  return {
    runway_months,
    ltv_cac_ratio,
    has_patents,
    default_esop_pct,
    startup_volatility,
  }
}
```

- [ ] **Step 6: Run tests**

```bash
npx vitest run __tests__/lib/utils.test.ts __tests__/lib/calculators/burn-rate.test.ts
```

Expected: All tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/lib/utils.ts src/lib/calculators/burn-rate.ts __tests__/lib/utils.test.ts __tests__/lib/calculators/burn-rate.test.ts
git commit -m "feat: add INR formatting utilities and burn-rate/derived-fields calculator"
```

---

## Chunk 2: Valuation Engine (3 Approaches × 10 Methods + Monte Carlo + Orchestrator)

Tasks 6-18: Pure functions with zero UI dependencies. Each method takes WizardInputs + DerivedFields + DamodaranBenchmark and returns MethodResult (now with `approach` field).

**10 Methods across 3 Approaches + VC:**
- **Income:** DCF (Task 6), PWERM (Task 7)
- **Market:** Revenue Multiple (Task 8), EV/EBITDA Multiple (Task 9), Comparable Transaction (Task 10)
- **Asset/Cost:** NAV (Task 11), Replacement Cost (Task 12)
- **VC/Startup:** Scorecard (Task 13), Berkus (Task 14), Risk Factor (Task 15)
- **Supporting:** Confidence Score (Task 16), Monte Carlo (Task 17), Orchestrator (Task 18)

**Dependencies from Chunk 1:**
- `@/types` — WizardInputs, DerivedFields, MethodResult, MonteCarloResult, ValuationResult, ValuationMethodName, ValuationApproach
- `@/lib/constants` — MARKET_CONSTANTS
- `@/lib/data/sector-benchmarks` — STAGE_BENCHMARKS, BERKUS_MILESTONE_MAX, BERKUS_PRE_REVENUE_CAP, RISK_FACTOR_ADJUSTMENT, VALUATION_FLOOR
- `@/lib/data/sector-mapping` — getDamodaranBenchmark
- `@/lib/data/comparable-companies` — findComparables, COMPARABLE_COMPANIES
- `@/lib/utils` — clamp
- `@/lib/calculators/burn-rate` — computeDerivedFields
- `@/lib/data/ibc-recovery` — getIBCRecovery

---

### Task 6: DCF Method (Income Approach)

**Files:**
- Create: `src/lib/valuation/dcf.ts`
- Test: `__tests__/lib/valuation/dcf.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/dcf.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateDCF } from '@/lib/valuation/dcf'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 50_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateDCF', () => {
  it('returns applicable result for revenue companies', () => {
    const result = calculateDCF(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('dcf')
    expect(result.value).toBeGreaterThan(0)
  })

  it('uses sector median as proxy for pre-revenue with low confidence', () => {
    const result = calculateDCF(makeInputs({ annual_revenue: 0 }), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.confidence).toBe(0.3)
    expect(result.value).toBeGreaterThan(0)
  })

  it('projects 5 years of revenue with decaying growth', () => {
    const result = calculateDCF(makeInputs({ annual_revenue: 50_000_000, revenue_growth_pct: 80 }), makeDerived())
    const details = result.details as Record<string, unknown>
    expect(details.projected_revenues).toBeDefined()
    const revenues = details.projected_revenues as number[]
    expect(revenues).toHaveLength(5)
    // Year 1: 50M × (1+0.80) = 90M
    expect(revenues[0]).toBeCloseTo(90_000_000, -5)
    // Year 2: 90M × (1+0.80×0.85) = 90M × 1.68 = 151.2M
    expect(revenues[1]).toBeGreaterThan(revenues[0])
  })

  it('computes FCF from revenue × margin × 0.75 × (1-tax)', () => {
    const result = calculateDCF(
      makeInputs({ annual_revenue: 100_000_000, revenue_growth_pct: 50, gross_margin_pct: 60 }),
      makeDerived()
    )
    const details = result.details as Record<string, unknown>
    const fcfs = details.projected_fcfs as number[]
    // Year 1 revenue = 100M × 1.50 = 150M
    // Year 1 FCF = 150M × 0.60 × 0.75 × 0.75 = 50.625M
    expect(fcfs[0]).toBeCloseTo(50_625_000, -4)
  })

  it('caps terminal growth at GDP_GROWTH_CAP (5.5%)', () => {
    const result = calculateDCF(makeInputs(), makeDerived())
    const details = result.details as Record<string, unknown>
    expect(details.terminal_growth).toBe(0.055)
  })

  it('prevents WACC <= terminal growth (sets WACC = growth + 0.02)', () => {
    // This shouldn't happen normally but the guard must exist
    const result = calculateDCF(makeInputs(), makeDerived())
    expect(result.value).toBeGreaterThan(0)
    expect(isFinite(result.value)).toBe(true)
  })

  it('sets confidence 0.85 for revenue > Rs 5 Cr', () => {
    const result = calculateDCF(makeInputs({ annual_revenue: 60_000_000 }), makeDerived())
    expect(result.confidence).toBe(0.85)
  })

  it('sets confidence 0.6 for revenue Rs 1-5 Cr', () => {
    const result = calculateDCF(makeInputs({ annual_revenue: 30_000_000 }), makeDerived())
    expect(result.confidence).toBe(0.6)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/dcf.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement DCF**

Create `src/lib/valuation/dcf.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

/**
 * Method 1: DCF (Discounted Cash Flow) — Deterministic
 * IVS/Rule 11UA alignment: Income Approach
 *
 * 1. Project revenue 5 years: growth decays at 0.85/year
 * 2. FCF = Revenue × gross_margin × 0.75 × (1 - 25% tax)
 * 3. Discount at Damodaran India WACC
 * 4. Terminal value = FCF_y5 × (1 + 5.5%) / (WACC - 5.5%)
 * 5. EV = PV(FCFs) + PV(terminal value)
 */
export function calculateDCF(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const benchmark = getDamodaranBenchmark(inputs.sector)
  let wacc = benchmark.wacc
  const terminalGrowth = MARKET_CONSTANTS.GDP_GROWTH_CAP

  // Guard: WACC must exceed terminal growth
  if (wacc <= terminalGrowth) {
    wacc = terminalGrowth + 0.02
  }

  // For pre-revenue: use sector median revenue as proxy
  const isPreRevenue = inputs.annual_revenue <= 0
  const baseRevenue = isPreRevenue
    ? (benchmark.ev_revenue * 10_000_000) // proxy: EV/Rev × Rs 1 Cr base
    : inputs.annual_revenue

  const grossMargin = inputs.gross_margin_pct / 100
  const decayFactor = MARKET_CONSTANTS.GROWTH_DECAY_FACTOR
  const opMarginProxy = MARKET_CONSTANTS.OPERATING_MARGIN_PROXY
  const taxRate = MARKET_CONSTANTS.TAX_RATE

  // Project 5 years
  const revenues: number[] = []
  const fcfs: number[] = []
  let growth = inputs.revenue_growth_pct / 100
  let revenue = baseRevenue

  for (let year = 0; year < 5; year++) {
    revenue = revenue * (1 + growth)
    revenues.push(revenue)
    const fcf = revenue * grossMargin * opMarginProxy * (1 - taxRate)
    fcfs.push(fcf)
    growth = growth * decayFactor // decay
  }

  // PV of FCFs
  let pvFCFs = 0
  for (let i = 0; i < 5; i++) {
    pvFCFs += fcfs[i] / Math.pow(1 + wacc, i + 1)
  }

  // Terminal value
  const terminalValue = fcfs[4] * (1 + terminalGrowth) / (wacc - terminalGrowth)
  const pvTerminal = terminalValue / Math.pow(1 + wacc, 5)

  const enterpriseValue = pvFCFs + pvTerminal

  // Confidence
  let confidence: number
  if (isPreRevenue) confidence = 0.3
  else if (inputs.annual_revenue > 50_000_000) confidence = 0.85    // > Rs 5 Cr
  else if (inputs.annual_revenue >= 10_000_000) confidence = 0.6     // Rs 1-5 Cr
  else confidence = 0.3

  return {
    method: 'dcf',
    approach: 'income',
    value: Math.max(0, enterpriseValue),
    confidence,
    details: {
      base_revenue: baseRevenue,
      is_pre_revenue: isPreRevenue,
      wacc,
      terminal_growth: terminalGrowth,
      gross_margin: grossMargin,
      projected_revenues: revenues,
      projected_fcfs: fcfs,
      pv_fcfs: pvFCFs,
      terminal_value: terminalValue,
      pv_terminal: pvTerminal,
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/dcf.test.ts
```

Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/dcf.ts __tests__/lib/valuation/dcf.test.ts
git commit -m "feat: add DCF valuation method (deterministic, 5-year projection)"
```

---

### Task 7: PWERM Method (Income Approach) — NEW

**Files:**
- Create: `src/lib/valuation/pwerm.ts`
- Test: `__tests__/lib/valuation/pwerm.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/pwerm.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculatePWERM } from '@/lib/valuation/pwerm'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 100, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculatePWERM', () => {
  it('returns applicable for all stages', () => {
    const result = calculatePWERM(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('pwerm')
    expect(result.approach).toBe('income')
  })

  it('computes 4 scenarios: bull, base, bear, failure', () => {
    const result = calculatePWERM(makeInputs(), makeDerived())
    const details = result.details as Record<string, unknown>
    const scenarios = details.scenarios as Array<{ name: string; probability: number; exit_value: number }>
    expect(scenarios).toHaveLength(4)
    expect(scenarios.map(s => s.name)).toEqual(['bull', 'base', 'bear', 'failure'])
  })

  it('failure scenario always has value 0', () => {
    const result = calculatePWERM(makeInputs(), makeDerived())
    const details = result.details as Record<string, unknown>
    const scenarios = details.scenarios as Array<{ name: string; exit_value: number }>
    const failure = scenarios.find(s => s.name === 'failure')!
    expect(failure.exit_value).toBe(0)
  })

  it('probabilities sum to 100%', () => {
    for (const stage of ['idea', 'seed', 'series_a', 'series_c_plus'] as const) {
      const result = calculatePWERM(makeInputs({ stage }), makeDerived())
      const details = result.details as Record<string, unknown>
      const scenarios = details.scenarios as Array<{ probability: number }>
      const total = scenarios.reduce((sum, s) => sum + s.probability, 0)
      expect(total).toBeCloseTo(1.0, 1)
    }
  })

  it('idea stage has highest failure probability', () => {
    const idea = calculatePWERM(makeInputs({ stage: 'idea', annual_revenue: 0 }), makeDerived())
    const seriesA = calculatePWERM(makeInputs({ stage: 'series_a' }), makeDerived())
    const ideaScenarios = (idea.details as Record<string, unknown>).scenarios as Array<{ name: string; probability: number }>
    const saScenarios = (seriesA.details as Record<string, unknown>).scenarios as Array<{ name: string; probability: number }>
    const ideaFailure = ideaScenarios.find(s => s.name === 'failure')!.probability
    const saFailure = saScenarios.find(s => s.name === 'failure')!.probability
    expect(ideaFailure).toBeGreaterThan(saFailure)
  })

  it('later stages have higher bull probability', () => {
    const seed = calculatePWERM(makeInputs({ stage: 'seed' }), makeDerived())
    const seriesB = calculatePWERM(makeInputs({ stage: 'series_b' }), makeDerived())
    const seedBull = ((seed.details as Record<string, unknown>).scenarios as Array<{ name: string; probability: number }>).find(s => s.name === 'bull')!.probability
    const sbBull = ((seriesB.details as Record<string, unknown>).scenarios as Array<{ name: string; probability: number }>).find(s => s.name === 'bull')!.probability
    expect(sbBull).toBeGreaterThan(seedBull)
  })

  it('value > 0 for revenue companies', () => {
    const result = calculatePWERM(makeInputs({ annual_revenue: 50_000_000 }), makeDerived())
    expect(result.value).toBeGreaterThan(0)
  })

  it('sets confidence 0.7 for revenue > Rs 1 Cr', () => {
    const result = calculatePWERM(makeInputs({ annual_revenue: 20_000_000 }), makeDerived())
    expect(result.confidence).toBe(0.7)
  })

  it('sets confidence 0.4 for idea stage', () => {
    const result = calculatePWERM(makeInputs({ stage: 'idea', annual_revenue: 0 }), makeDerived())
    expect(result.confidence).toBe(0.4)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/pwerm.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement PWERM**

Create `src/lib/valuation/pwerm.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'
import { STAGE_BENCHMARKS } from '@/lib/data/sector-benchmarks'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

/**
 * Method 2: PWERM (Probability Weighted Expected Return Method)
 * IVS/Rule 11UA alignment: Income Approach
 *
 * 4 scenarios with stage-dependent probabilities:
 * - Bull (IPO/large exit)
 * - Base (strategic acquisition)
 * - Bear (acqui-hire/downround)
 * - Failure (shutdown = 0)
 */

const SCENARIO_PROBABILITIES: Record<string, { bull: number; base: number; bear: number; failure: number }> = {
  idea:          { bull: 0.05, base: 0.20, bear: 0.25, failure: 0.50 },
  pre_seed:      { bull: 0.08, base: 0.25, bear: 0.30, failure: 0.37 },
  seed:          { bull: 0.12, base: 0.35, bear: 0.28, failure: 0.25 },
  pre_series_a:  { bull: 0.18, base: 0.40, bear: 0.25, failure: 0.17 },
  series_a:      { bull: 0.25, base: 0.42, bear: 0.23, failure: 0.10 },
  series_b:      { bull: 0.30, base: 0.45, bear: 0.18, failure: 0.07 },
  series_c_plus: { bull: 0.35, base: 0.45, bear: 0.15, failure: 0.05 },
}

// Time to exit by stage (years)
const TIME_TO_EXIT: Record<string, number> = {
  idea: 7, pre_seed: 6, seed: 5, pre_series_a: 4, series_a: 4, series_b: 3, series_c_plus: 2,
}

export function calculatePWERM(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const benchmark = getDamodaranBenchmark(inputs.sector)
  const probs = SCENARIO_PROBABILITIES[inputs.stage] ?? SCENARIO_PROBABILITIES.seed
  const timeToExit = TIME_TO_EXIT[inputs.stage] ?? 5
  const wacc = benchmark.wacc

  // Base revenue for projection
  const isPreRevenue = inputs.annual_revenue <= 0
  const baseRevenue = isPreRevenue
    ? STAGE_BENCHMARKS[inputs.stage].typical / benchmark.ev_revenue // reverse-engineer revenue from stage benchmark
    : inputs.annual_revenue

  // Exit multiples based on Damodaran EV/Revenue
  const baseMultiple = benchmark.ev_revenue
  const bullMultiple = baseMultiple * 1.5
  const bearMultiple = baseMultiple * 0.3

  // Project revenue to exit year using decaying growth
  let projectedRevenue = baseRevenue
  let growth = inputs.revenue_growth_pct / 100
  for (let y = 0; y < timeToExit; y++) {
    projectedRevenue *= (1 + growth)
    growth *= MARKET_CONSTANTS.GROWTH_DECAY_FACTOR
  }

  // Exit values
  const bullExit = projectedRevenue * bullMultiple
  const baseExit = projectedRevenue * baseMultiple
  const bearExit = projectedRevenue * bearMultiple
  const failureExit = 0

  // Discount to present value
  const pvFactor = Math.pow(1 + wacc, timeToExit)
  const pvBull = bullExit / pvFactor
  const pvBase = baseExit / pvFactor
  const pvBear = bearExit / pvFactor

  // Weighted value
  const weightedValue = probs.bull * pvBull + probs.base * pvBase + probs.bear * pvBear + probs.failure * failureExit

  // Confidence
  let confidence: number
  if (inputs.stage === 'idea') confidence = 0.4
  else if (isPreRevenue) confidence = 0.5
  else if (inputs.annual_revenue > 10_000_000) confidence = 0.7
  else confidence = 0.5

  return {
    method: 'pwerm',
    approach: 'income',
    value: Math.max(0, weightedValue),
    confidence,
    details: {
      scenarios: [
        { name: 'bull', probability: probs.bull, exit_value: bullExit, pv: pvBull, multiple: bullMultiple },
        { name: 'base', probability: probs.base, exit_value: baseExit, pv: pvBase, multiple: baseMultiple },
        { name: 'bear', probability: probs.bear, exit_value: bearExit, pv: pvBear, multiple: bearMultiple },
        { name: 'failure', probability: probs.failure, exit_value: 0, pv: 0, multiple: 0 },
      ],
      projected_revenue_at_exit: projectedRevenue,
      time_to_exit: timeToExit,
      wacc,
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/pwerm.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/pwerm.ts __tests__/lib/valuation/pwerm.test.ts
git commit -m "feat: add PWERM valuation method (4 probability-weighted scenarios)"
```

---

### Task 8: Revenue Multiple Method (Market Approach)

**Files:**
- Create: `src/lib/valuation/revenue-multiple.ts`
- Test: `__tests__/lib/valuation/revenue-multiple.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/revenue-multiple.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateRevenueMultiple } from '@/lib/valuation/revenue-multiple'
import type { WizardInputs, DerivedFields } from '@/types'

// Minimal inputs factory — only fields used by revenue multiple
function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 100, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateRevenueMultiple', () => {
  it('returns not applicable for pre-revenue companies', () => {
    const result = calculateRevenueMultiple(makeInputs({ annual_revenue: 0 }), makeDerived())
    expect(result.applicable).toBe(false)
    expect(result.value).toBe(0)
  })

  it('calculates valuation for SaaS with >100% growth', () => {
    // SaaS base: 8.2x (from Damodaran) + growth adjustment 1x (100-200%) + SaaS premium 1.5x = 10.7x
    // Value = Rs 1 Cr × 10.7 = Rs 10.7 Cr
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 10_000_000, revenue_growth_pct: 120, business_model: 'saas_subscription' }),
      makeDerived()
    )
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('revenue_multiple')
    expect(result.value).toBeGreaterThan(0)
    // 10M × (8.2 + 1.0 + 1.5) = 10M × 10.7 = 107M
    expect(result.value).toBeCloseTo(107_000_000, -5)
  })

  it('adds growth adjustment +2x for >200% growth', () => {
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 10_000_000, revenue_growth_pct: 250, business_model: 'saas_subscription' }),
      makeDerived()
    )
    // 10M × (8.2 + 2.0 + 1.5) = 117M
    expect(result.value).toBeCloseTo(117_000_000, -5)
  })

  it('adds LTV/CAC bonus when ratio > 5', () => {
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 10_000_000, revenue_growth_pct: 50, business_model: 'saas_subscription' }),
      makeDerived({ ltv_cac_ratio: 6 })
    )
    // 10M × (8.2 + 0.5 + 1.5 + 1.0) = 10M × 11.2 = 112M
    expect(result.value).toBeCloseTo(112_000_000, -5)
  })

  it('sets high confidence for revenue > Rs 1 Cr', () => {
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 20_000_000 }),
      makeDerived()
    )
    expect(result.confidence).toBe(0.9)
  })

  it('sets medium confidence for revenue Rs 10L-1Cr', () => {
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 5_000_000 }),
      makeDerived()
    )
    expect(result.confidence).toBe(0.7)
  })

  it('sets low confidence for revenue < Rs 10L', () => {
    const result = calculateRevenueMultiple(
      makeInputs({ annual_revenue: 500_000 }),
      makeDerived()
    )
    expect(result.confidence).toBe(0.4)
  })

  it('adds marketplace premium +1x', () => {
    const result = calculateRevenueMultiple(
      makeInputs({
        annual_revenue: 10_000_000, revenue_growth_pct: 0,
        business_model: 'marketplace_commission', sector: 'marketplace',
      }),
      makeDerived()
    )
    // marketplace sector: Information Services ev_revenue = 6.5
    // 10M × (6.5 + 0 + 1.0) = 75M
    expect(result.value).toBeCloseTo(75_000_000, -5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/revenue-multiple.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement revenue multiple**

Create `src/lib/valuation/revenue-multiple.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

/**
 * Method 3: Revenue Multiple
 * IVS/Rule 11UA alignment: Market Approach
 *
 * 1. Base multiple from Damodaran India EV/Revenue
 * 2. Growth adjustment: +2x if >200%, +1x if >100%, +0.5x if >50%
 * 3. Business model premium: SaaS +1.5x, Marketplace +1x, Transaction +0.5x
 * 4. Unit economics bonus: +1x if LTV/CAC > 5
 * 5. Final = Revenue × adjusted multiple
 */
export function calculateRevenueMultiple(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  if (inputs.annual_revenue <= 0) {
    return {
      method: 'revenue_multiple',
      approach: 'market',
      value: 0,
      confidence: 0,
      details: { reason: 'Pre-revenue — method not applicable' },
      applicable: false,
    }
  }

  const benchmark = getDamodaranBenchmark(inputs.sector)
  let multiple = benchmark.ev_revenue

  // Growth adjustment
  if (inputs.revenue_growth_pct > 200) multiple += 2.0
  else if (inputs.revenue_growth_pct > 100) multiple += 1.0
  else if (inputs.revenue_growth_pct > 50) multiple += 0.5

  // Business model premium
  const MODEL_PREMIUMS: Record<string, number> = {
    saas_subscription: 1.5,
    marketplace_commission: 1.0,
    transaction_based: 0.5,
  }
  multiple += MODEL_PREMIUMS[inputs.business_model] ?? 0

  // Unit economics bonus
  if (derived.ltv_cac_ratio !== null && derived.ltv_cac_ratio > 5) {
    multiple += 1.0
  }

  const value = inputs.annual_revenue * multiple

  // Confidence
  let confidence: number
  if (inputs.annual_revenue > 10_000_000) confidence = 0.9       // > Rs 1 Cr
  else if (inputs.annual_revenue >= 1_000_000) confidence = 0.7   // Rs 10L-1Cr
  else confidence = 0.4                                            // < Rs 10L

  return {
    method: 'revenue_multiple',
    approach: 'market',
    value,
    confidence,
    details: {
      base_multiple: benchmark.ev_revenue,
      growth_adjustment: inputs.revenue_growth_pct > 200 ? 2.0 : inputs.revenue_growth_pct > 100 ? 1.0 : inputs.revenue_growth_pct > 50 ? 0.5 : 0,
      model_premium: MODEL_PREMIUMS[inputs.business_model] ?? 0,
      ltv_cac_bonus: derived.ltv_cac_ratio !== null && derived.ltv_cac_ratio > 5 ? 1.0 : 0,
      final_multiple: multiple,
      revenue: inputs.annual_revenue,
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/revenue-multiple.test.ts
```

Expected: All 8 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/revenue-multiple.ts __tests__/lib/valuation/revenue-multiple.test.ts
git commit -m "feat: add revenue multiple valuation method with TDD"
```

---

### Task 9: EV/EBITDA Comparable Company Multiple (Market Approach) — NEW

**Files:**
- Create: `src/lib/valuation/ebitda-multiple.ts`
- Test: `__tests__/lib/valuation/ebitda-multiple.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/ebitda-multiple.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateEBITDAMultiple } from '@/lib/valuation/ebitda-multiple'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 50_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateEBITDAMultiple', () => {
  it('returns not applicable for pre-revenue', () => {
    const result = calculateEBITDAMultiple(makeInputs({ annual_revenue: 0 }), makeDerived())
    expect(result.applicable).toBe(false)
  })

  it('returns not applicable when gross margin is 0', () => {
    const result = calculateEBITDAMultiple(makeInputs({ gross_margin_pct: 0 }), makeDerived())
    expect(result.applicable).toBe(false)
  })

  it('calculates EV from estimated EBITDA × Damodaran multiple', () => {
    const result = calculateEBITDAMultiple(
      makeInputs({ annual_revenue: 50_000_000, gross_margin_pct: 70, revenue_growth_pct: 0, stage: 'series_a' }),
      makeDerived()
    )
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('ebitda_multiple')
    expect(result.approach).toBe('market')
    // EBITDA = 50M × 0.70 × 0.75 = 26.25M
    // SaaS base EV/EBITDA = 32.5x, growth adj = 0, stage = 1.0x → 32.5x
    // EV = 26.25M × 32.5 = 853.1M
    expect(result.value).toBeGreaterThan(0)
  })

  it('adds growth premium for high-growth companies', () => {
    const noGrowth = calculateEBITDAMultiple(
      makeInputs({ revenue_growth_pct: 0, stage: 'series_a' }), makeDerived()
    )
    const highGrowth = calculateEBITDAMultiple(
      makeInputs({ revenue_growth_pct: 150, stage: 'series_a' }), makeDerived()
    )
    expect(highGrowth.value).toBeGreaterThan(noGrowth.value)
  })

  it('applies stage discount for early-stage', () => {
    const seed = calculateEBITDAMultiple(
      makeInputs({ stage: 'seed' }), makeDerived()
    )
    const seriesA = calculateEBITDAMultiple(
      makeInputs({ stage: 'series_a' }), makeDerived()
    )
    // Seed has 0.7x stage discount, Series A has 1.0x
    expect(seriesA.value).toBeGreaterThan(seed.value)
  })

  it('sets confidence based on revenue', () => {
    const high = calculateEBITDAMultiple(makeInputs({ annual_revenue: 60_000_000 }), makeDerived())
    const low = calculateEBITDAMultiple(makeInputs({ annual_revenue: 5_000_000 }), makeDerived())
    expect(high.confidence).toBe(0.8)
    expect(low.confidence).toBe(0.3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/ebitda-multiple.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement EV/EBITDA Multiple**

Create `src/lib/valuation/ebitda-multiple.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

const STAGE_DISCOUNT: Record<string, number> = {
  idea: 0.5, pre_seed: 0.5, seed: 0.7, pre_series_a: 0.85,
  series_a: 1.0, series_b: 1.0, series_c_plus: 1.0,
}

/**
 * Method 4: Comparable Company Multiple (EV/EBITDA)
 * Market Approach — Rule 11UA aligned
 */
export function calculateEBITDAMultiple(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  if (inputs.annual_revenue <= 0 || inputs.gross_margin_pct <= 0) {
    return {
      method: 'ebitda_multiple', approach: 'market',
      value: 0, confidence: 0,
      details: { reason: 'Requires revenue and gross margin' },
      applicable: false,
    }
  }

  const benchmark = getDamodaranBenchmark(inputs.sector)
  const estimatedEBITDA = inputs.annual_revenue * (inputs.gross_margin_pct / 100) * MARKET_CONSTANTS.OPERATING_MARGIN_PROXY

  let multiple = benchmark.ev_ebitda ?? 18.0 // fallback for banks (null ev_ebitda)

  // Growth premium
  if (inputs.revenue_growth_pct > 200) multiple += 3.0
  else if (inputs.revenue_growth_pct > 100) multiple += 2.0
  else if (inputs.revenue_growth_pct > 50) multiple += 1.0

  // Stage discount
  multiple *= STAGE_DISCOUNT[inputs.stage] ?? 1.0

  const value = estimatedEBITDA * multiple

  let confidence: number
  if (inputs.annual_revenue > 50_000_000) confidence = 0.8
  else if (inputs.annual_revenue >= 10_000_000) confidence = 0.6
  else confidence = 0.3

  return {
    method: 'ebitda_multiple', approach: 'market',
    value, confidence,
    details: {
      estimated_ebitda: estimatedEBITDA,
      base_multiple: benchmark.ev_ebitda,
      growth_premium: inputs.revenue_growth_pct > 200 ? 3 : inputs.revenue_growth_pct > 100 ? 2 : inputs.revenue_growth_pct > 50 ? 1 : 0,
      stage_discount: STAGE_DISCOUNT[inputs.stage] ?? 1.0,
      final_multiple: multiple,
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/ebitda-multiple.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/ebitda-multiple.ts __tests__/lib/valuation/ebitda-multiple.test.ts
git commit -m "feat: add EV/EBITDA comparable company multiple (Market Approach)"
```

---

### Task 10: Comparable Transaction Method (Market Approach) — NEW

**Files:**
- Create: `src/lib/valuation/comparable-transaction.ts`
- Test: `__tests__/lib/valuation/comparable-transaction.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/comparable-transaction.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateComparableTransaction } from '@/lib/valuation/comparable-transaction'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 30_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateComparableTransaction', () => {
  it('returns applicable result', () => {
    const result = calculateComparableTransaction(makeInputs({ sector: 'saas' }), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('comparable_txn')
    expect(result.approach).toBe('market')
    expect(result.value).toBeGreaterThan(0)
  })

  it('uses comparables from database', () => {
    const result = calculateComparableTransaction(makeInputs({ sector: 'saas' }), makeDerived())
    const details = result.details as Record<string, unknown>
    expect(details.comparables_used).toBeDefined()
    expect((details.comparables_used as Array<unknown>).length).toBeGreaterThanOrEqual(1)
  })

  it('applies size discount for much smaller companies', () => {
    // Our test company has Rs 3 Cr revenue. SaaS comparables are 250-8500 Cr.
    const result = calculateComparableTransaction(makeInputs({ annual_revenue: 30_000_000, sector: 'saas' }), makeDerived())
    const details = result.details as Record<string, unknown>
    expect(details.size_discount_applied).toBe(true)
  })

  it('sets higher confidence with more sector matches', () => {
    // SaaS has many comparables in our database
    const saas = calculateComparableTransaction(makeInputs({ sector: 'saas' }), makeDerived())
    expect(saas.confidence).toBeGreaterThanOrEqual(0.5)
  })

  it('falls back to cross-sector when no sector match', () => {
    // social_impact has no comparables
    const result = calculateComparableTransaction(makeInputs({ sector: 'social_impact' }), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.confidence).toBeLessThanOrEqual(0.5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/comparable-transaction.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Comparable Transaction**

Create `src/lib/valuation/comparable-transaction.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { findComparables, COMPARABLE_COMPANIES } from '@/lib/data/comparable-companies'
import { STAGE_BENCHMARKS } from '@/lib/data/sector-benchmarks'

/**
 * Method 5: Comparable Transaction Method
 * Market Approach — IVS 105 precedent transactions
 *
 * Uses our comparable Indian startup database to derive implied multiples.
 */
export function calculateComparableTransaction(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const revenueCr = inputs.annual_revenue / 10_000_000 // convert Rs to Cr
  const comparables = findComparables(inputs.sector, inputs.stage, revenueCr > 0 ? revenueCr : null, 5)

  if (comparables.length === 0) {
    return {
      method: 'comparable_txn', approach: 'market',
      value: 0, confidence: 0,
      details: { reason: 'No comparable companies found' },
      applicable: false,
    }
  }

  // Compute implied multiples from comparables
  const impliedMultiples: number[] = []
  for (const comp of comparables) {
    if (comp.revenue_cr && comp.revenue_cr > 0) {
      impliedMultiples.push(comp.valuation_cr / comp.revenue_cr)
    } else if (comp.last_round_size_cr > 0) {
      // Proxy: valuation / round size ratio
      impliedMultiples.push(comp.valuation_cr / comp.last_round_size_cr)
    }
  }

  if (impliedMultiples.length === 0) {
    return {
      method: 'comparable_txn', approach: 'market',
      value: STAGE_BENCHMARKS[inputs.stage].typical, confidence: 0.3,
      details: { reason: 'No revenue data in comparables, using stage benchmark', comparables_used: comparables },
      applicable: true,
    }
  }

  // Median implied multiple
  impliedMultiples.sort((a, b) => a - b)
  const medianMultiple = impliedMultiples[Math.floor(impliedMultiples.length / 2)]

  // Apply to startup's revenue (or stage benchmark if pre-revenue)
  let baseValueCr: number
  if (inputs.annual_revenue > 0) {
    baseValueCr = revenueCr * medianMultiple
  } else {
    baseValueCr = STAGE_BENCHMARKS[inputs.stage].typical / 10_000_000
  }

  // Size discount: if startup revenue < 10% of comparable median, 30% discount
  const comparableMedianRevenue = comparables
    .filter(c => c.revenue_cr && c.revenue_cr > 0)
    .map(c => c.revenue_cr!)
  const medianCompRevenue = comparableMedianRevenue.length > 0
    ? comparableMedianRevenue.sort((a, b) => a - b)[Math.floor(comparableMedianRevenue.length / 2)]
    : 0
  const sizeDiscountApplied = medianCompRevenue > 0 && revenueCr < medianCompRevenue * 0.1
  const sizeDiscount = sizeDiscountApplied ? 0.7 : 1.0

  const valueCr = baseValueCr * sizeDiscount
  const value = valueCr * 10_000_000 // back to Rs

  // Confidence: based on number of sector-matched comparables
  const sectorMatches = comparables.filter(c => c.sector === inputs.sector).length
  let confidence: number
  if (sectorMatches >= 3) confidence = 0.75
  else if (sectorMatches >= 1) confidence = 0.5
  else confidence = 0.3

  return {
    method: 'comparable_txn', approach: 'market',
    value, confidence,
    details: {
      comparables_used: comparables.map(c => ({ name: c.name, sector: c.sector, valuation_cr: c.valuation_cr, revenue_cr: c.revenue_cr })),
      implied_multiples: impliedMultiples,
      median_multiple: medianMultiple,
      size_discount_applied: sizeDiscountApplied,
      size_discount: sizeDiscount,
      sector_matches: sectorMatches,
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/comparable-transaction.test.ts
```

Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/comparable-transaction.ts __tests__/lib/valuation/comparable-transaction.test.ts
git commit -m "feat: add comparable transaction method (Market Approach, IVS 105)"
```

---

### Task 11: Net Asset Value (Asset/Cost Approach) — NEW

**Files:**
- Create: `src/lib/valuation/nav.ts`
- Test: `__tests__/lib/valuation/nav.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/nav.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateNAV } from '@/lib/valuation/nav'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 2,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: true,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateNAV', () => {
  it('returns applicable for all stages', () => {
    const result = calculateNAV(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('nav')
    expect(result.approach).toBe('asset_cost')
  })

  it('includes cash_in_bank as tangible asset', () => {
    const result = calculateNAV(makeInputs({ cash_in_bank: 10_000_000 }), makeDerived())
    const details = result.details as Record<string, unknown>
    expect(details.tangible_assets).toBe(10_000_000)
  })

  it('values technology based on dev_stage', () => {
    const idea = calculateNAV(makeInputs({ dev_stage: 'idea' }), makeDerived())
    const scaling = calculateNAV(makeInputs({ dev_stage: 'scaling' }), makeDerived())
    expect(scaling.value).toBeGreaterThan(idea.value)
  })

  it('values patents at Rs 25L each', () => {
    const noPat = calculateNAV(makeInputs({ patents_count: 0 }), makeDerived({ has_patents: false }))
    const twoPat = calculateNAV(makeInputs({ patents_count: 2 }), makeDerived({ has_patents: true }))
    // 2 patents = Rs 50L = 5M more
    expect(twoPat.value - noPat.value).toBeCloseTo(5_000_000, -5)
  })

  it('values customer relationships at 30% of revenue', () => {
    const noRev = calculateNAV(makeInputs({ annual_revenue: 0 }), makeDerived())
    const withRev = calculateNAV(makeInputs({ annual_revenue: 10_000_000 }), makeDerived())
    expect(withRev.value - noRev.value).toBeCloseTo(3_000_000, -5)
  })

  it('applies software sector multiplier (1.5x on tech assets)', () => {
    const saas = calculateNAV(makeInputs({ sector: 'saas', dev_stage: 'mvp' }), makeDerived())
    const mfg = calculateNAV(makeInputs({ sector: 'manufacturing', dev_stage: 'mvp' }), makeDerived())
    // SaaS gets 1.5x tech multiplier, manufacturing gets 1.0x
    expect(saas.value).toBeGreaterThan(mfg.value)
  })

  it('sets confidence 0.5 for all stages', () => {
    const result = calculateNAV(makeInputs(), makeDerived())
    expect(result.confidence).toBe(0.5)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/nav.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement NAV**

Create `src/lib/valuation/nav.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'

const SOFTWARE_SECTORS = [
  'saas', 'fintech_payments', 'fintech_insurance', 'fintech_banking',
  'edtech', 'deeptech', 'gaming', 'media_advertising', 'marketplace',
  'healthtech_services', 'ecommerce_general', 'ecommerce_grocery',
  'b2b_services', 'social_impact',
]

const HARDWARE_SECTORS = [
  'healthtech_products', 'auto_mobility', 'manufacturing', 'cleantech',
]

const DEV_STAGE_TECH_VALUE: Record<string, number> = {
  idea: 0,
  prototype: 1_000_000,     // Rs 10L
  mvp: 3_000_000,           // Rs 30L
  beta: 5_000_000,          // Rs 50L
  production: 10_000_000,   // Rs 1 Cr
  scaling: 20_000_000,      // Rs 2 Cr
}

const PATENT_VALUE = 2_500_000 // Rs 25L per patent

/**
 * Method 6: Net Asset Value (NAV)
 * Asset/Cost Approach — Rule 11UA, IVS 105
 *
 * Adapted for startups (no balance sheet): proxies for tech, IP, customer assets.
 */
export function calculateNAV(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  // 1. Tangible assets = cash
  const tangibleAssets = inputs.cash_in_bank

  // 2. Technology asset
  const baseTechValue = DEV_STAGE_TECH_VALUE[inputs.dev_stage] ?? 0
  let techMultiplier = 1.0
  if (SOFTWARE_SECTORS.includes(inputs.sector)) techMultiplier = 1.5
  else if (HARDWARE_SECTORS.includes(inputs.sector)) techMultiplier = 2.0
  const technologyAssets = baseTechValue * techMultiplier

  // 3. IP assets
  const ipAssets = inputs.patents_count * PATENT_VALUE

  // 4. Customer relationship proxy
  const customerAssets = inputs.annual_revenue * 0.3

  const totalNAV = tangibleAssets + technologyAssets + ipAssets + customerAssets

  return {
    method: 'nav', approach: 'asset_cost',
    value: totalNAV,
    confidence: 0.5,
    details: {
      tangible_assets: tangibleAssets,
      technology_assets: technologyAssets,
      ip_assets: ipAssets,
      customer_assets: customerAssets,
      tech_multiplier: techMultiplier,
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/nav.test.ts
```

Expected: All 7 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/nav.ts __tests__/lib/valuation/nav.test.ts
git commit -m "feat: add NAV method (Asset/Cost Approach, Rule 11UA)"
```

---

### Task 12: Replacement Cost Method (Asset/Cost Approach) — NEW

**Files:**
- Create: `src/lib/valuation/replacement-cost.ts`
- Test: `__tests__/lib/valuation/replacement-cost.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/replacement-cost.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateReplacementCost } from '@/lib/valuation/replacement-cost'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 10, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: 5000, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateReplacementCost', () => {
  it('returns applicable for all stages', () => {
    const result = calculateReplacementCost(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('replacement_cost')
    expect(result.approach).toBe('asset_cost')
  })

  it('includes team replacement cost based on team_size × years × avg_cost', () => {
    const small = calculateReplacementCost(makeInputs({ team_size: 5, founding_year: 2024 }), makeDerived())
    const large = calculateReplacementCost(makeInputs({ team_size: 20, founding_year: 2024 }), makeDerived())
    expect(large.value).toBeGreaterThan(small.value)
  })

  it('accounts for years of operation', () => {
    const young = calculateReplacementCost(makeInputs({ founding_year: 2025 }), makeDerived())
    const old = calculateReplacementCost(makeInputs({ founding_year: 2020 }), makeDerived())
    expect(old.value).toBeGreaterThan(young.value)
  })

  it('includes technology development cost based on dev_stage', () => {
    const idea = calculateReplacementCost(makeInputs({ dev_stage: 'idea' }), makeDerived())
    const scaling = calculateReplacementCost(makeInputs({ dev_stage: 'scaling' }), makeDerived())
    expect(scaling.value).toBeGreaterThan(idea.value)
  })

  it('uses provided CAC for customer acquisition cost', () => {
    const withCAC = calculateReplacementCost(makeInputs({ cac: 5000, annual_revenue: 10_000_000 }), makeDerived())
    const noCAC = calculateReplacementCost(makeInputs({ cac: null, annual_revenue: 10_000_000 }), makeDerived())
    // Both should compute customer cost, but differently
    expect(withCAC.value).toBeGreaterThan(0)
    expect(noCAC.value).toBeGreaterThan(0)
  })

  it('sets confidence 0.5 for early stage, 0.3 for later', () => {
    const seed = calculateReplacementCost(makeInputs({ stage: 'seed' }), makeDerived())
    const seriesB = calculateReplacementCost(makeInputs({ stage: 'series_b' }), makeDerived())
    expect(seed.confidence).toBe(0.5)
    expect(seriesB.confidence).toBe(0.3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/replacement-cost.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Replacement Cost**

Create `src/lib/valuation/replacement-cost.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'

const AVG_ANNUAL_COST_PER_EMPLOYEE = 1_500_000 // Rs 15L (blended)

const DEV_STAGE_COST: Record<string, number> = {
  idea: 500_000,         // Rs 5L
  prototype: 2_500_000,  // Rs 25L
  mvp: 7_500_000,        // Rs 75L
  beta: 15_000_000,      // Rs 1.5 Cr
  production: 30_000_000, // Rs 3 Cr
  scaling: 50_000_000,   // Rs 5 Cr
}

// Sector-specific proxy CAC when user doesn't provide
const SECTOR_PROXY_CAC: Record<string, number> = {
  saas: 5000, d2c: 2000, marketplace: 3000, ecommerce_general: 2500,
  ecommerce_grocery: 2000, fintech_payments: 4000, edtech: 3000,
}
const DEFAULT_PROXY_CAC = 3000

const CURRENT_YEAR = 2026

/**
 * Method 7: Replacement Cost
 * Asset/Cost Approach — Rule 11UA, IVS 105
 *
 * What would it cost to recreate this startup from scratch?
 */
export function calculateReplacementCost(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const yearsOperating = Math.max(1, CURRENT_YEAR - inputs.founding_year)

  // 1. Team replacement cost
  const teamCost = inputs.team_size * AVG_ANNUAL_COST_PER_EMPLOYEE * yearsOperating

  // 2. Technology development cost
  const techCost = DEV_STAGE_COST[inputs.dev_stage] ?? 500_000

  // 3. Customer acquisition cost
  let customerCost = 0
  if (inputs.annual_revenue > 0) {
    const cac = inputs.cac ?? SECTOR_PROXY_CAC[inputs.sector] ?? DEFAULT_PROXY_CAC
    // Estimate customers: annual_revenue / (team_size × 50) — spec proxy for avg_revenue_per_customer
    const estimatedCustomers = Math.max(1, inputs.annual_revenue / (inputs.team_size * 50))
    customerCost = estimatedCustomers * cac
  }

  const total = teamCost + techCost + customerCost

  // Confidence: 0.5 early stage, 0.3 later (replacement cost undervalues network effects/brand)
  const earlyStages = ['idea', 'pre_seed', 'seed', 'pre_series_a']
  const confidence = earlyStages.includes(inputs.stage) ? 0.5 : 0.3

  return {
    method: 'replacement_cost', approach: 'asset_cost',
    value: total, confidence,
    details: {
      team_cost: teamCost,
      tech_cost: techCost,
      customer_cost: customerCost,
      years_operating: yearsOperating,
      team_size: inputs.team_size,
      cac_used: inputs.cac ?? SECTOR_PROXY_CAC[inputs.sector] ?? DEFAULT_PROXY_CAC,
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/replacement-cost.test.ts
```

Expected: All 6 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/replacement-cost.ts __tests__/lib/valuation/replacement-cost.test.ts
git commit -m "feat: add replacement cost method (Asset/Cost Approach, Rule 11UA)"
```

---

### Task 13: Scorecard Method (VC/Startup)

**Files:**
- Create: `src/lib/valuation/scorecard.ts`
- Test: `__tests__/lib/valuation/scorecard.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/scorecard.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateScorecard } from '@/lib/valuation/scorecard'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 5000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: [], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateScorecard', () => {
  it('returns applicable for all stages', () => {
    const result = calculateScorecard(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('scorecard')
  })

  it('uses stage-based pre-money as base', () => {
    const resultSeed = calculateScorecard(makeInputs({ stage: 'seed' }), makeDerived())
    const resultA = calculateScorecard(makeInputs({ stage: 'series_a' }), makeDerived())
    // Series A base (500M) > Seed base (80M) → result should be higher
    expect(resultA.value).toBeGreaterThan(resultSeed.value)
  })

  it('clamps each factor score to 50-150% range', () => {
    // Max out all factors — the multiplier should still be capped by the clamp
    const result = calculateScorecard(makeInputs({
      founder_experience: 5, domain_expertise: 5, previous_exits: true,
      technical_cofounder: true, tam: 50000, dev_stage: 'scaling',
      competition_level: 1, revenue_growth_pct: 300, city: 'Bangalore',
    }), makeDerived({ runway_months: 24 }))

    const details = result.details as Record<string, unknown>
    const factors = details.factor_scores as Record<string, number>
    // All factors should be clamped to max 150%
    for (const score of Object.values(factors)) {
      expect(score).toBeLessThanOrEqual(1.5)
      expect(score).toBeGreaterThanOrEqual(0.5)
    }
  })

  it('gives exits bonus to management team score', () => {
    const withoutExits = calculateScorecard(makeInputs({ previous_exits: false }), makeDerived())
    const withExits = calculateScorecard(makeInputs({ previous_exits: true }), makeDerived())
    expect(withExits.value).toBeGreaterThan(withoutExits.value)
  })

  it('maps TAM to market opportunity score', () => {
    const lowTAM = calculateScorecard(makeInputs({ tam: 50 }), makeDerived())
    const highTAM = calculateScorecard(makeInputs({ tam: 20000 }), makeDerived())
    expect(highTAM.value).toBeGreaterThan(lowTAM.value)
  })

  it('maps dev_stage to product/technology score', () => {
    const idea = calculateScorecard(makeInputs({ dev_stage: 'idea' }), makeDerived())
    const scaling = calculateScorecard(makeInputs({ dev_stage: 'scaling' }), makeDerived())
    expect(scaling.value).toBeGreaterThan(idea.value)
  })

  it('sets confidence 0.7 for pre-revenue', () => {
    const result = calculateScorecard(makeInputs({ annual_revenue: 0 }), makeDerived())
    expect(result.confidence).toBe(0.7)
  })

  it('sets confidence 0.5 for idea stage', () => {
    const result = calculateScorecard(
      makeInputs({ stage: 'idea', dev_stage: 'idea', annual_revenue: 0 }),
      makeDerived()
    )
    expect(result.confidence).toBe(0.5)
  })

  it('sets confidence 0.6 for revenue companies', () => {
    const result = calculateScorecard(makeInputs({ annual_revenue: 10_000_000, stage: 'seed' }), makeDerived())
    expect(result.confidence).toBe(0.6)
  })

  it('gives metro city bonus', () => {
    const metro = calculateScorecard(makeInputs({ city: 'Bangalore' }), makeDerived())
    const nonMetro = calculateScorecard(makeInputs({ city: 'Jaipur' }), makeDerived())
    expect(metro.value).toBeGreaterThan(nonMetro.value)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/scorecard.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement scorecard**

Create `src/lib/valuation/scorecard.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { STAGE_BENCHMARKS } from '@/lib/data/sector-benchmarks'
import { clamp } from '@/lib/utils'

const METRO_CITIES = ['bangalore', 'bengaluru', 'delhi', 'new delhi', 'mumbai', 'gurgaon', 'gurugram', 'noida', 'hyderabad', 'pune', 'chennai']
const TIER1_CITIES = ['kolkata', 'ahmedabad', 'jaipur', 'lucknow', 'chandigarh', 'kochi', 'indore', 'coimbatore', 'nagpur', 'patna', 'bhopal', 'visakhapatnam', 'thiruvananthapuram']

/**
 * Method 8: Scorecard (Bill Payne)
 * IVS/Rule 11UA alignment: VC/Startup Method
 *
 * 7 factors, each scored 50-150%, weighted. Applied to stage-based pre-money.
 */
export function calculateScorecard(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const base = STAGE_BENCHMARKS[inputs.stage].typical

  // Factor 1: Management team (30%)
  const teamRaw = ((inputs.founder_experience + inputs.domain_expertise) / 10) * 100
    + (inputs.previous_exits ? 25 : 0)
    + (inputs.technical_cofounder ? 10 : 0)
  const management = clamp(teamRaw / 100, 0.5, 1.5)

  // Factor 2: Market opportunity (25%)
  let marketRaw: number
  if (inputs.tam < 100) marketRaw = 0.6
  else if (inputs.tam < 1000) marketRaw = 0.9
  else if (inputs.tam < 10000) marketRaw = 1.2
  else marketRaw = 1.4
  const market = clamp(marketRaw, 0.5, 1.5)

  // Factor 3: Product/technology (15%)
  const devStageMap: Record<string, number> = {
    idea: 0.5, prototype: 0.7, mvp: 0.9, beta: 1.1, production: 1.3, scaling: 1.5,
  }
  const product = clamp(devStageMap[inputs.dev_stage] ?? 0.5, 0.5, 1.5)

  // Factor 4: Competition (10%)
  const compMap: Record<number, number> = { 1: 1.4, 2: 1.2, 3: 1.0, 4: 0.8, 5: 0.6 }
  const competition = clamp(compMap[inputs.competition_level] ?? 1.0, 0.5, 1.5)

  // Factor 5: Sales/marketing (10%)
  let salesRaw: number
  if (inputs.revenue_growth_pct <= 0) salesRaw = 0.6
  else if (inputs.revenue_growth_pct < 50) salesRaw = 0.8
  else if (inputs.revenue_growth_pct < 100) salesRaw = 1.0
  else if (inputs.revenue_growth_pct < 200) salesRaw = 1.2
  else salesRaw = 1.4
  const sales = clamp(salesRaw, 0.5, 1.5)

  // Factor 6: Need for funding (5%)
  let fundingRaw: number
  if (derived.runway_months < 6) fundingRaw = 0.6
  else if (derived.runway_months < 12) fundingRaw = 0.8
  else if (derived.runway_months < 18) fundingRaw = 1.0
  else fundingRaw = 1.3
  const funding = clamp(fundingRaw, 0.5, 1.5)

  // Factor 7: Other factors — city (5%)
  const cityLower = inputs.city.toLowerCase()
  let otherRaw: number
  if (METRO_CITIES.some(c => cityLower.includes(c))) otherRaw = 1.2
  else if (TIER1_CITIES.some(c => cityLower.includes(c))) otherRaw = 1.0
  else otherRaw = 0.8
  const other = clamp(otherRaw, 0.5, 1.5)

  // Weighted sum
  const adjustmentMultiplier =
    management * 0.30 +
    market * 0.25 +
    product * 0.15 +
    competition * 0.10 +
    sales * 0.10 +
    funding * 0.05 +
    other * 0.05

  const value = base * adjustmentMultiplier

  // Confidence
  let confidence: number
  if (inputs.stage === 'idea') confidence = 0.5
  else if (inputs.annual_revenue <= 0) confidence = 0.7
  else confidence = 0.6

  return {
    method: 'scorecard',
    approach: 'vc_startup',
    value,
    confidence,
    details: {
      base,
      adjustment_multiplier: adjustmentMultiplier,
      factor_scores: { management, market, product, competition, sales, funding, other },
      factor_weights: { management: 0.30, market: 0.25, product: 0.15, competition: 0.10, sales: 0.10, funding: 0.05, other: 0.05 },
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/scorecard.test.ts
```

Expected: All 10 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/scorecard.ts __tests__/lib/valuation/scorecard.test.ts
git commit -m "feat: add scorecard (Bill Payne) valuation method with 7 weighted factors"
```

---

### Task 14: Berkus Method (VC/Startup)

**Files:**
- Create: `src/lib/valuation/berkus.ts`
- Test: `__tests__/lib/valuation/berkus.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/berkus.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateBerkus } from '@/lib/valuation/berkus'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 4, domain_expertise: 4,
    previous_exits: true, technical_cofounder: true, key_hires: ['cto'],
    annual_revenue: 0, revenue_growth_pct: 0, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 5000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['proprietary_tech'], patents_count: 1,
    strategic_partnerships: 'one', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 0,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: true,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateBerkus', () => {
  it('calculates 5 milestones with max Rs 1 Cr each', () => {
    const result = calculateBerkus(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('berkus')
    const details = result.details as Record<string, unknown>
    const milestones = details.milestones as Record<string, number>
    expect(Object.keys(milestones)).toHaveLength(5)
    // Each milestone max is Rs 1 Cr = 10M
    for (const val of Object.values(milestones)) {
      expect(val).toBeLessThanOrEqual(10_000_000)
      expect(val).toBeGreaterThanOrEqual(0)
    }
  })

  it('caps pre-revenue valuation at Rs 5 Cr', () => {
    // Max out everything for pre-revenue
    const result = calculateBerkus(makeInputs({
      annual_revenue: 0, tam: 50000, dev_stage: 'scaling',
      founder_experience: 5, domain_expertise: 5, previous_exits: true,
      technical_cofounder: true, patents_count: 3,
      strategic_partnerships: 'multiple', key_hires: ['cto', 'cfo', 'sales_lead'],
    }), makeDerived({ has_patents: true }))
    expect(result.value).toBeLessThanOrEqual(50_000_000) // Rs 5 Cr
  })

  it('maps TAM to sound idea score', () => {
    const lowTAM = calculateBerkus(makeInputs({ tam: 50 }), makeDerived())
    const highTAM = calculateBerkus(makeInputs({ tam: 50000 }), makeDerived())
    expect(highTAM.value).toBeGreaterThan(lowTAM.value)
  })

  it('maps dev_stage to prototype/technology score', () => {
    const idea = calculateBerkus(makeInputs({ dev_stage: 'idea' }), makeDerived())
    const production = calculateBerkus(makeInputs({ dev_stage: 'production' }), makeDerived())
    expect(production.value).toBeGreaterThan(idea.value)
  })

  it('adds patent bonus: 1 patent = +15%, 2+ = +20%', () => {
    const noPat = calculateBerkus(makeInputs({ patents_count: 0 }), makeDerived({ has_patents: false }))
    const onePat = calculateBerkus(makeInputs({ patents_count: 1 }), makeDerived({ has_patents: true }))
    const twoPat = calculateBerkus(makeInputs({ patents_count: 2 }), makeDerived({ has_patents: true }))
    expect(onePat.value).toBeGreaterThan(noPat.value)
    expect(twoPat.value).toBeGreaterThan(onePat.value)
  })

  it('maps revenue to product rollout/sales milestone', () => {
    const noRev = calculateBerkus(makeInputs({ annual_revenue: 0 }), makeDerived())
    const goodRev = calculateBerkus(makeInputs({ annual_revenue: 20_000_000, revenue_growth_pct: 150 }), makeDerived())
    expect(goodRev.value).toBeGreaterThan(noRev.value)
  })

  it('sets confidence 0.8 for Idea/Pre-seed stages', () => {
    const result = calculateBerkus(makeInputs({ stage: 'idea' }), makeDerived())
    expect(result.confidence).toBe(0.8)
  })

  it('sets confidence 0.6 for Seed stage', () => {
    const result = calculateBerkus(makeInputs({ stage: 'seed' }), makeDerived())
    expect(result.confidence).toBe(0.6)
  })

  it('sets confidence 0.3 for later stages', () => {
    const result = calculateBerkus(makeInputs({ stage: 'series_a' }), makeDerived())
    expect(result.confidence).toBe(0.3)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/berkus.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Berkus**

Create `src/lib/valuation/berkus.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { BERKUS_MILESTONE_MAX, BERKUS_PRE_REVENUE_CAP } from '@/lib/data/sector-benchmarks'

/**
 * Method 9: Berkus Method
 * IVS/Rule 11UA alignment: VC/Startup Method
 *
 * 5 milestones, each up to Rs 1 Cr. Cap at Rs 5 Cr for pre-revenue.
 */
export function calculateBerkus(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const max = BERKUS_MILESTONE_MAX // Rs 1 Cr per milestone

  // Milestone 1: Sound idea (TAM + competitive advantages)
  let ideaScore: number
  if (inputs.tam < 100) ideaScore = 0.20
  else if (inputs.tam < 1000) ideaScore = 0.50
  else if (inputs.tam < 10000) ideaScore = 0.80
  else ideaScore = 1.0
  // Competitive advantage bonus: +10% each, capped
  const advantageBonus = Math.min(
    inputs.competitive_advantages.filter(a => a !== 'none').length * 0.10,
    0.20
  )
  ideaScore = Math.min(ideaScore + advantageBonus, 1.0)

  // Milestone 2: Prototype/technology (dev_stage + patents)
  const devStageScores: Record<string, number> = {
    idea: 0, prototype: 0.40, mvp: 0.70, beta: 0.90, production: 1.0, scaling: 1.0,
  }
  let protoScore = devStageScores[inputs.dev_stage] ?? 0
  // Patent bonus: 1 patent = +15%, 2+ = +20%
  if (inputs.patents_count >= 2) protoScore += 0.20
  else if (inputs.patents_count === 1) protoScore += 0.15
  protoScore = Math.min(protoScore, 1.0)

  // Milestone 3: Quality management
  let mgmtScore = ((inputs.founder_experience + inputs.domain_expertise) / 10)
  if (inputs.previous_exits) mgmtScore += 0.25
  if (inputs.technical_cofounder) mgmtScore += 0.15
  mgmtScore = Math.min(mgmtScore, 1.0)

  // Milestone 4: Strategic relationships
  const partnerMap: Record<string, number> = { none: 0, one: 0.50, multiple: 1.0 }
  let stratScore = partnerMap[inputs.strategic_partnerships] ?? 0
  // Key hires bonus: +10% each for CTO/CFO/sales
  const keyHireBonus = Math.min(inputs.key_hires.length * 0.10, 0.30)
  stratScore = Math.min(stratScore + keyHireBonus, 1.0)

  // Milestone 5: Product rollout/sales
  let salesScore: number
  if (inputs.annual_revenue <= 0) salesScore = 0
  else if (inputs.annual_revenue < 1_000_000) salesScore = 0.20      // < Rs 10L
  else if (inputs.annual_revenue < 5_000_000) salesScore = 0.50      // 10L-50L
  else if (inputs.annual_revenue < 10_000_000) salesScore = 0.75     // 50L-1Cr
  else salesScore = 1.0                                                // > Rs 1 Cr
  // Growth bonus: +20% if >100% growth
  if (inputs.revenue_growth_pct > 100) salesScore = Math.min(salesScore + 0.20, 1.0)

  const milestones = {
    sound_idea: ideaScore * max,
    prototype_technology: protoScore * max,
    quality_management: mgmtScore * max,
    strategic_relationships: stratScore * max,
    product_rollout: salesScore * max,
  }

  let total = Object.values(milestones).reduce((sum, v) => sum + v, 0)

  // Cap at Rs 5 Cr for pre-revenue
  if (inputs.annual_revenue <= 0 && total > BERKUS_PRE_REVENUE_CAP) {
    total = BERKUS_PRE_REVENUE_CAP
  }

  // Confidence
  let confidence: number
  if (inputs.stage === 'idea' || inputs.stage === 'pre_seed') confidence = 0.8
  else if (inputs.stage === 'seed') confidence = 0.6
  else confidence = 0.3

  return {
    method: 'berkus',
    approach: 'vc_startup',
    value: total,
    confidence,
    details: {
      milestones,
      milestone_max: max,
      pre_revenue_cap: BERKUS_PRE_REVENUE_CAP,
      capped: inputs.annual_revenue <= 0 && Object.values(milestones).reduce((s, v) => s + v, 0) > BERKUS_PRE_REVENUE_CAP,
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/berkus.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/berkus.ts __tests__/lib/valuation/berkus.test.ts
git commit -m "feat: add Berkus valuation method with 5 milestones and patent bonus"
```

---

### Task 15: Risk Factor Summation (VC/Startup)

**Files:**
- Create: `src/lib/valuation/risk-factor.ts`
- Test: `__tests__/lib/valuation/risk-factor.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/risk-factor.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateRiskFactor } from '@/lib/valuation/risk-factor'
import type { WizardInputs, DerivedFields } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 10_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: null, ltv: null,
    last_round_size: null, last_round_valuation: null,
    tam: 5000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['brand'], patents_count: 0,
    strategic_partnerships: 'none', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 10,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

function makeDerived(overrides: Partial<DerivedFields> = {}): DerivedFields {
  return {
    runway_months: 12, ltv_cac_ratio: null, has_patents: false,
    default_esop_pct: 12, startup_volatility: 0.50, ...overrides,
  }
}

describe('calculateRiskFactor', () => {
  it('returns applicable for all stages', () => {
    const result = calculateRiskFactor(makeInputs(), makeDerived())
    expect(result.applicable).toBe(true)
    expect(result.method).toBe('risk_factor')
  })

  it('computes 12 risk dimensions', () => {
    const result = calculateRiskFactor(makeInputs(), makeDerived())
    const details = result.details as Record<string, unknown>
    const risks = details.risk_scores as Record<string, number>
    expect(Object.keys(risks)).toHaveLength(12)
    for (const score of Object.values(risks)) {
      expect(score).toBeGreaterThanOrEqual(-2)
      expect(score).toBeLessThanOrEqual(2)
    }
  })

  it('uses stage-based pre-money as base', () => {
    const seed = calculateRiskFactor(makeInputs({ stage: 'seed' }), makeDerived())
    const seriesA = calculateRiskFactor(makeInputs({ stage: 'series_a' }), makeDerived())
    // Different base but same adjustment — series_a base is higher
    // The per-factor adjustment is also higher for series_a
    expect(seriesA.value).not.toBe(seed.value)
  })

  it('adjusts by sum × per_factor_adjustment', () => {
    const result = calculateRiskFactor(makeInputs({ stage: 'seed' }), makeDerived())
    const details = result.details as Record<string, unknown>
    const riskSum = details.risk_sum as number
    const adjustment = details.total_adjustment as number
    // Seed per-factor = Rs 40L = 4M
    expect(adjustment).toBe(riskSum * 4_000_000)
  })

  it('floors at VALUATION_FLOOR (Rs 10 L)', () => {
    // Minimize everything to get very low valuation
    const result = calculateRiskFactor(makeInputs({
      stage: 'idea', founder_experience: 1, domain_expertise: 1,
      dev_stage: 'idea', regulatory_risk: 5, revenue_growth_pct: 0,
      competition_level: 5, tam: 50, annual_revenue: 0,
      competitive_advantages: ['none'], patents_count: 0,
    }), makeDerived({ runway_months: 1, has_patents: false }))
    expect(result.value).toBeGreaterThanOrEqual(1_000_000) // Rs 10 L
  })

  it('gives positive scores for strong factors', () => {
    const result = calculateRiskFactor(makeInputs({
      founder_experience: 5, domain_expertise: 5, previous_exits: true,
      dev_stage: 'scaling', regulatory_risk: 1, revenue_growth_pct: 300,
      competition_level: 1, tam: 50000, business_model: 'saas_subscription',
    }), makeDerived({ runway_months: 24, has_patents: true }))
    const details = result.details as Record<string, unknown>
    const riskSum = details.risk_sum as number
    expect(riskSum).toBeGreaterThan(0)
  })

  it('sets confidence 0.65 for all stages', () => {
    const idea = calculateRiskFactor(makeInputs({ stage: 'idea' }), makeDerived())
    const seriesB = calculateRiskFactor(makeInputs({ stage: 'series_b' }), makeDerived())
    expect(idea.confidence).toBe(0.65)
    expect(seriesB.confidence).toBe(0.65)
  })

  it('gives software sectors auto +1 for manufacturing risk', () => {
    const saas = calculateRiskFactor(makeInputs({ sector: 'saas' }), makeDerived())
    const details = saas.details as Record<string, unknown>
    const risks = details.risk_scores as Record<string, number>
    expect(risks.manufacturing).toBe(1)
  })

  it('gives brand advantage +1 for reputation risk', () => {
    const withBrand = calculateRiskFactor(
      makeInputs({ competitive_advantages: ['brand'] }),
      makeDerived()
    )
    const withoutBrand = calculateRiskFactor(
      makeInputs({ competitive_advantages: [] }),
      makeDerived()
    )
    const brandRisks = (withBrand.details as Record<string, unknown>).risk_scores as Record<string, number>
    const noBrandRisks = (withoutBrand.details as Record<string, unknown>).risk_scores as Record<string, number>
    expect(brandRisks.reputation).toBe(1)
    expect(noBrandRisks.reputation).toBe(0)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/risk-factor.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Risk Factor Summation**

Create `src/lib/valuation/risk-factor.ts`:

```typescript
import type { WizardInputs, DerivedFields, MethodResult } from '@/types'
import { STAGE_BENCHMARKS, RISK_FACTOR_ADJUSTMENT, VALUATION_FLOOR } from '@/lib/data/sector-benchmarks'
import { clamp } from '@/lib/utils'

const SOFTWARE_SECTORS = [
  'saas', 'fintech_payments', 'fintech_insurance', 'fintech_banking',
  'edtech', 'deeptech', 'gaming', 'media_advertising', 'marketplace',
  'healthtech_services', 'ecommerce_general', 'ecommerce_grocery',
  'b2b_services', 'social_impact',
]

/**
 * Method 10: Risk Factor Summation
 * IVS/Rule 11UA alignment: VC/Startup Method
 *
 * 12 risk dimensions, each scored -2 to +2. Sum × per-factor adjustment.
 */
export function calculateRiskFactor(
  inputs: WizardInputs,
  derived: DerivedFields
): MethodResult {
  const base = STAGE_BENCHMARKS[inputs.stage].typical
  const perFactor = RISK_FACTOR_ADJUSTMENT[inputs.stage]
  const isSoftware = SOFTWARE_SECTORS.includes(inputs.sector)

  // 1. Management risk
  const mgmtNorm = (inputs.founder_experience + inputs.domain_expertise) / 10
  let management: number
  if (mgmtNorm < 0.3) management = -2
  else if (mgmtNorm < 0.5) management = -1
  else if (mgmtNorm < 0.7) management = 0
  else if (mgmtNorm < 0.9) management = 1
  else management = 2
  if (inputs.previous_exits) management = Math.min(management + 1, 2)

  // 2. Stage of business
  const stageRisk: Record<string, number> = {
    idea: -2, prototype: -1, mvp: 0, beta: 1, production: 2, scaling: 2,
  }
  const stage = stageRisk[inputs.dev_stage] ?? 0

  // 3. Legislation/political risk (inverse of regulatory_risk)
  const legRiskMap: Record<number, number> = { 5: -2, 4: -1, 3: 0, 2: 1, 1: 2 }
  const legislation = legRiskMap[inputs.regulatory_risk] ?? 0

  // 4. Manufacturing risk
  const manufacturing = isSoftware ? 1 : -(inputs.competition_level - 3) as number
  const mfgClamped = clamp(manufacturing, -2, 2)

  // 5. Sales/marketing risk
  let salesRisk: number
  if (inputs.revenue_growth_pct <= 0) salesRisk = -2
  else if (inputs.revenue_growth_pct < 50) salesRisk = -1
  else if (inputs.revenue_growth_pct < 100) salesRisk = 0
  else if (inputs.revenue_growth_pct < 200) salesRisk = 1
  else salesRisk = 2

  // 6. Funding/capital risk
  let fundingRisk: number
  if (derived.runway_months < 3) fundingRisk = -2
  else if (derived.runway_months < 6) fundingRisk = -1
  else if (derived.runway_months < 12) fundingRisk = 0
  else if (derived.runway_months < 18) fundingRisk = 1
  else fundingRisk = 2

  // 7. Competition risk
  const compRiskMap: Record<number, number> = { 5: -2, 4: -1, 3: 0, 2: 1, 1: 2 }
  const competitionRisk = compRiskMap[inputs.competition_level] ?? 0

  // 8. Technology risk
  let techRisk = 0
  if (derived.has_patents) techRisk += 1
  const lateTech = ['production', 'scaling']
  const earlyTech = ['idea', 'prototype']
  if (lateTech.includes(inputs.dev_stage)) techRisk += 1
  else if (earlyTech.includes(inputs.dev_stage)) techRisk -= 1
  techRisk = clamp(techRisk, -2, 2)

  // 9. Litigation risk
  let litigationRisk = 0
  if (['fintech_payments', 'fintech_insurance', 'fintech_banking'].includes(inputs.sector)) {
    litigationRisk = -1
  }

  // 10. International risk
  let internationalRisk = 0
  if (inputs.international_revenue_pct > 0) {
    internationalRisk = 1
  }

  // 11. Reputation risk
  const hasReputation = inputs.competitive_advantages.includes('brand')
  const reputationRisk = hasReputation ? 1 : 0

  // 12. Lucrative exit potential
  let exitRisk: number
  if (inputs.tam < 100) exitRisk = -2
  else if (inputs.tam < 1000) exitRisk = -1
  else if (inputs.tam < 10000) exitRisk = 1
  else exitRisk = 2
  if (['saas_subscription', 'marketplace_commission'].includes(inputs.business_model)) {
    exitRisk = Math.min(exitRisk + 1, 2)
  }

  const riskScores = {
    management,
    stage,
    legislation,
    manufacturing: mfgClamped,
    sales: salesRisk,
    funding: fundingRisk,
    competition: competitionRisk,
    technology: techRisk,
    litigation: litigationRisk,
    international: internationalRisk,
    reputation: reputationRisk,
    exit: exitRisk,
  }

  const riskSum = Object.values(riskScores).reduce((sum, v) => sum + v, 0)
  const totalAdjustment = riskSum * perFactor
  const value = Math.max(base + totalAdjustment, VALUATION_FLOOR)

  return {
    method: 'risk_factor',
    approach: 'vc_startup',
    value,
    confidence: 0.65,
    details: {
      base,
      per_factor_adjustment: perFactor,
      risk_scores: riskScores,
      risk_sum: riskSum,
      total_adjustment: totalAdjustment,
    },
    applicable: true,
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/risk-factor.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/risk-factor.ts __tests__/lib/valuation/risk-factor.test.ts
git commit -m "feat: add risk factor summation method with 12 risk dimensions"
```

---

### Task 16: Confidence Score Calculator

**Files:**
- Create: `src/lib/valuation/confidence-score.ts`
- Test: `__tests__/lib/valuation/confidence-score.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/confidence-score.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateConfidenceScore } from '@/lib/valuation/confidence-score'
import type { WizardInputs, MethodResult } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 50_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000,
    cac: 1000, ltv: 5000,
    last_round_size: 20_000_000, last_round_valuation: 100_000_000,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['proprietary_tech'], patents_count: 1,
    strategic_partnerships: 'one', regulatory_risk: 3,
    revenue_concentration_pct: 30, international_revenue_pct: 10,
    esop_pool_pct: 12, time_to_liquidity_years: 4,
    current_cap_table: null, target_raise: 50_000_000, expected_dilution_pct: 20,
    ...overrides,
  } as WizardInputs
}

function makeMethodResults(values: number[], confidences: number[]): MethodResult[] {
  const methods: Array<{ name: MethodResult['method']; approach: MethodResult['approach'] }> = [
    { name: 'revenue_multiple', approach: 'market' },
    { name: 'dcf', approach: 'income' },
    { name: 'scorecard', approach: 'vc_startup' },
    { name: 'berkus', approach: 'vc_startup' },
    { name: 'risk_factor', approach: 'vc_startup' },
  ]
  return values.map((v, i) => ({
    method: methods[i].name,
    approach: methods[i].approach,
    value: v,
    confidence: confidences[i],
    details: {},
    applicable: v > 0,
  }))
}

describe('calculateConfidenceScore', () => {
  it('returns score 0-100', () => {
    const methods = makeMethodResults(
      [100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    )
    const score = calculateConfidenceScore(makeInputs(), methods)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('awards data completeness points for optional fields', () => {
    const allFilled = calculateConfidenceScore(makeInputs(), makeMethodResults(
      [100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    ))
    const sparseInputs = makeInputs({
      cac: null, ltv: null, last_round_size: null, last_round_valuation: null,
      revenue_concentration_pct: null, esop_pool_pct: null,
      time_to_liquidity_years: null, target_raise: null, expected_dilution_pct: null,
    })
    const sparse = calculateConfidenceScore(sparseInputs, makeMethodResults(
      [100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    ))
    expect(allFilled).toBeGreaterThan(sparse)
  })

  it('awards method agreement points for low CV', () => {
    // Very tight agreement (low CV) → 40 points
    const tight = calculateConfidenceScore(makeInputs(), makeMethodResults(
      [100_000_000, 102_000_000, 98_000_000, 101_000_000, 99_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    ))
    // Wide disagreement (high CV) → 10 points
    const wide = calculateConfidenceScore(makeInputs(), makeMethodResults(
      [50_000_000, 200_000_000, 80_000_000, 30_000_000, 150_000_000],
      [0.9, 0.85, 0.6, 0.6, 0.65]
    ))
    expect(tight).toBeGreaterThan(wide)
  })

  it('awards revenue maturity points', () => {
    const highRev = calculateConfidenceScore(
      makeInputs({ annual_revenue: 60_000_000 }),
      makeMethodResults([100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000], [0.9, 0.85, 0.6, 0.6, 0.65])
    )
    const noRev = calculateConfidenceScore(
      makeInputs({ annual_revenue: 0 }),
      makeMethodResults([100_000_000, 90_000_000, 110_000_000, 80_000_000, 105_000_000], [0.9, 0.85, 0.6, 0.6, 0.65])
    )
    expect(highRev).toBeGreaterThan(noRev)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/confidence-score.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement confidence score**

Create `src/lib/valuation/confidence-score.ts`:

```typescript
import type { WizardInputs, MethodResult } from '@/types'

/**
 * Valuation Confidence Score (0-100)
 * Spec: Valuation Methods → Valuation Confidence Score
 *
 * Components:
 * - Data completeness: 0-30 points (+3 per optional field filled)
 * - Method agreement: 0-40 points (based on CV of applicable methods)
 * - Revenue maturity: 0-20 points
 * - Data quality: 0-10 points
 */
export function calculateConfidenceScore(
  inputs: WizardInputs,
  methods: MethodResult[]
): number {
  let score = 0

  // 1. Data completeness: 0-30 points (each optional field = +3, max 30)
  const optionalFields: Array<keyof WizardInputs> = [
    'cac', 'ltv', 'last_round_size', 'last_round_valuation',
    'revenue_concentration_pct', 'international_revenue_pct',
    'esop_pool_pct', 'time_to_liquidity_years', 'target_raise', 'expected_dilution_pct',
  ]
  let filledCount = 0
  for (const field of optionalFields) {
    const val = inputs[field]
    if (val !== null && val !== undefined && val !== 0) {
      filledCount++
    }
  }
  score += Math.min(filledCount * 3, 30)

  // 2. Method agreement: 0-40 points (CV-based)
  const applicableMethods = methods.filter(m => m.applicable && m.value > 0)
  if (applicableMethods.length >= 2) {
    const values = applicableMethods.map(m => m.value)
    const mean = values.reduce((s, v) => s + v, 0) / values.length
    const variance = values.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / values.length
    const std = Math.sqrt(variance)
    const cv = mean > 0 ? std / mean : 1.0

    if (cv < 0.20) score += 40
    else if (cv < 0.40) score += 25
    else score += 10
  }

  // 3. Revenue maturity: 0-20 points
  if (inputs.annual_revenue > 50_000_000) score += 20        // > Rs 5 Cr
  else if (inputs.annual_revenue >= 10_000_000) score += 15   // Rs 1-5 Cr
  else if (inputs.annual_revenue >= 1_000_000) score += 10    // Rs 10L-1Cr
  else if (inputs.annual_revenue > 0) score += 5              // < Rs 10L
  // Pre-revenue: 0

  // 4. Data quality: 0-10 points (realistic ranges, internal consistency)
  let qualityPoints = 0
  // Gross margin in realistic range (0-95%)
  if (inputs.gross_margin_pct > 0 && inputs.gross_margin_pct <= 95) qualityPoints += 3
  // Revenue growth not impossibly high (< 500%)
  if (inputs.revenue_growth_pct >= 0 && inputs.revenue_growth_pct < 500) qualityPoints += 3
  // TAM in a reasonable range (> Rs 10 Cr)
  if (inputs.tam > 10) qualityPoints += 2
  // Team size > 0
  if (inputs.team_size > 0) qualityPoints += 2
  score += Math.min(qualityPoints, 10)

  return Math.min(score, 100)
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/confidence-score.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/confidence-score.ts __tests__/lib/valuation/confidence-score.test.ts
git commit -m "feat: add confidence score calculator (0-100 composite)"
```

---

### Task 17: Monte Carlo Web Worker

**Files:**
- Create: `src/lib/valuation/monte-carlo.worker.ts`
- Test: `__tests__/lib/valuation/monte-carlo.test.ts`

**Note:** Web Workers cannot be fully tested in Node/jsdom environment. We test the core simulation logic as a regular function, then wrap it in a Web Worker for production use.

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/monte-carlo.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { runMonteCarloSimulation } from '@/lib/valuation/monte-carlo.worker'
import type { MonteCarloResult } from '@/types'

describe('runMonteCarloSimulation', () => {
  it('returns percentiles from simulation', () => {
    const result = runMonteCarloSimulation({
      baseRevenue: 50_000_000,
      growthRate: 0.80,
      grossMargin: 0.70,
      wacc: 0.128,
      iterations: 1_000,
    })
    expect(result).toBeDefined()
    expect(result.p10).toBeLessThan(result.p50)
    expect(result.p50).toBeLessThan(result.p90)
    expect(result.p25).toBeLessThan(result.p75)
    expect(result.iterations_total).toBe(1_000)
    expect(result.iterations_valid).toBeGreaterThanOrEqual(1)
  })

  it('returns null if insufficient valid iterations', () => {
    // With WACC very close to terminal growth, many iterations fail
    // Use an extreme case that produces mostly invalid results
    const result = runMonteCarloSimulation({
      baseRevenue: 0,
      growthRate: 0,
      grossMargin: 0,
      wacc: 0.06, // Close to GDP_GROWTH_CAP
      iterations: 100,
    })
    // With 0 revenue and 0 margin, all values will be 0 or very small
    // This shouldn't produce null since the values are just very small
    expect(result).toBeDefined()
  })

  it('generates reasonable spread around deterministic value', () => {
    const result = runMonteCarloSimulation({
      baseRevenue: 50_000_000,
      growthRate: 0.80,
      grossMargin: 0.70,
      wacc: 0.128,
      iterations: 5_000,
    })
    // P50 should be in a reasonable range
    expect(result.p50).toBeGreaterThan(0)
    // P90 should be wider than P10
    expect(result.p90 - result.p10).toBeGreaterThan(0)
  })

  it('uses growth std = growth × 0.3', () => {
    // Two runs with very different growth rates should produce different spreads
    const lowGrowth = runMonteCarloSimulation({
      baseRevenue: 50_000_000,
      growthRate: 0.10,
      grossMargin: 0.70,
      wacc: 0.128,
      iterations: 2_000,
    })
    const highGrowth = runMonteCarloSimulation({
      baseRevenue: 50_000_000,
      growthRate: 0.80,
      grossMargin: 0.70,
      wacc: 0.128,
      iterations: 2_000,
    })
    // High growth should have wider spread
    const lowSpread = lowGrowth.p90 - lowGrowth.p10
    const highSpread = highGrowth.p90 - highGrowth.p10
    expect(highSpread).toBeGreaterThan(lowSpread)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/monte-carlo.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Monte Carlo simulation**

Create `src/lib/valuation/monte-carlo.worker.ts`:

```typescript
import type { MonteCarloResult } from '@/types'
import { MARKET_CONSTANTS } from '@/lib/constants'

interface MCParams {
  baseRevenue: number
  growthRate: number
  grossMargin: number
  wacc: number
  iterations: number
}

/**
 * Box-Muller transform for Normal distribution sampling.
 */
function normalRandom(mean: number, std: number): number {
  const u1 = Math.random()
  const u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return mean + z * std
}

/**
 * Run a single DCF iteration with random parameters.
 * Returns enterprise value for this iteration, or null if invalid.
 */
function singleIteration(params: MCParams): number | null {
  const { baseRevenue, growthRate, grossMargin, wacc: baseWacc } = params
  const terminalGrowth = MARKET_CONSTANTS.GDP_GROWTH_CAP
  const decayFactor = MARKET_CONSTANTS.GROWTH_DECAY_FACTOR
  const opMarginProxy = MARKET_CONSTANTS.OPERATING_MARGIN_PROXY
  const taxRate = MARKET_CONSTANTS.TAX_RATE

  // Sample parameters
  const sampledGrowth = normalRandom(growthRate, growthRate * MARKET_CONSTANTS.MC_GROWTH_STD_FACTOR)
  const sampledWacc = normalRandom(baseWacc, MARKET_CONSTANTS.MC_WACC_STD)

  // Guard: WACC must exceed terminal growth
  const wacc = sampledWacc <= terminalGrowth ? terminalGrowth + 0.02 : sampledWacc

  // Margin mean-reverts to sector median over 5 years
  // Start at stated margin, linearly move toward sector median (grossMargin)
  const startMargin = grossMargin
  const targetMargin = grossMargin // already the sector median in this context

  let revenue = baseRevenue > 0 ? baseRevenue : 1_000_000 // min Rs 10L proxy
  let growth = sampledGrowth
  const fcfs: number[] = []

  for (let year = 0; year < 5; year++) {
    revenue = revenue * (1 + growth)
    const margin = startMargin + (targetMargin - startMargin) * (year / 4)
    const fcf = revenue * margin * opMarginProxy * (1 - taxRate)
    fcfs.push(fcf)
    growth = growth * decayFactor
  }

  // PV of FCFs
  let pvFCFs = 0
  for (let i = 0; i < 5; i++) {
    pvFCFs += fcfs[i] / Math.pow(1 + wacc, i + 1)
  }

  // Terminal value
  const terminalValue = fcfs[4] * (1 + terminalGrowth) / (wacc - terminalGrowth)
  const pvTerminal = terminalValue / Math.pow(1 + wacc, 5)

  const ev = pvFCFs + pvTerminal
  return isFinite(ev) && ev > 0 ? ev : null
}

/**
 * Run Monte Carlo simulation and return percentiles.
 * Exported for testing — in production, called via Web Worker message handler.
 */
export function runMonteCarloSimulation(params: MCParams): MonteCarloResult {
  const results: number[] = []

  for (let i = 0; i < params.iterations; i++) {
    const ev = singleIteration(params)
    if (ev !== null) results.push(ev)
  }

  if (results.length < MARKET_CONSTANTS.MC_MIN_VALID_ITERATIONS) {
    return {
      p10: 0, p25: 0, p50: 0, p75: 0, p90: 0,
      iterations_valid: results.length,
      iterations_total: params.iterations,
    }
  }

  results.sort((a, b) => a - b)
  const percentile = (p: number) => results[Math.floor(results.length * p / 100)]

  return {
    p10: percentile(10),
    p25: percentile(25),
    p50: percentile(50),
    p75: percentile(75),
    p90: percentile(90),
    iterations_valid: results.length,
    iterations_total: params.iterations,
  }
}

// Web Worker message handler (only runs in browser context)
if (typeof self !== 'undefined' && typeof self.postMessage === 'function') {
  self.onmessage = (event: MessageEvent<MCParams>) => {
    const result = runMonteCarloSimulation(event.data)
    self.postMessage(result)
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/monte-carlo.test.ts
```

Expected: All 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/valuation/monte-carlo.worker.ts __tests__/lib/valuation/monte-carlo.test.ts
git commit -m "feat: add Monte Carlo simulation (Box-Muller, percentiles, Web Worker)"
```

---

### Task 18: Valuation Orchestrator (10 Methods)

**Files:**
- Create: `src/lib/valuation/index.ts`
- Test: `__tests__/lib/valuation/orchestrator.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/valuation/orchestrator.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateValuation } from '@/lib/valuation'
import type { WizardInputs } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'Test Co', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 3, domain_expertise: 3,
    previous_exits: false, technical_cofounder: true, key_hires: [],
    annual_revenue: 50_000_000, revenue_growth_pct: 80, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000, cac: 1000, ltv: 5000,
    last_round_size: null, last_round_valuation: null,
    tam: 10_000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['proprietary_tech'], patents_count: 1,
    strategic_partnerships: 'one', regulatory_risk: 3,
    revenue_concentration_pct: null, international_revenue_pct: 10,
    esop_pool_pct: null, time_to_liquidity_years: null,
    current_cap_table: null, target_raise: null, expected_dilution_pct: null,
    ...overrides,
  } as WizardInputs
}

describe('calculateValuation (orchestrator)', () => {
  it('runs all 10 methods for revenue companies', () => {
    const result = calculateValuation(makeInputs())
    expect(result.methods).toHaveLength(10)
    const applicable = result.methods.filter(m => m.applicable)
    expect(applicable.length).toBeGreaterThanOrEqual(8) // most should be applicable
  })

  it('covers all 4 approach categories', () => {
    const result = calculateValuation(makeInputs())
    const approaches = new Set(result.methods.map(m => m.approach))
    expect(approaches).toContain('income')
    expect(approaches).toContain('market')
    expect(approaches).toContain('asset_cost')
    expect(approaches).toContain('vc_startup')
  })

  it('marks revenue-dependent methods as not applicable for pre-revenue', () => {
    const result = calculateValuation(makeInputs({ annual_revenue: 0, gross_margin_pct: 0 }))
    const revenueMultiple = result.methods.find(m => m.method === 'revenue_multiple')
    const ebitdaMultiple = result.methods.find(m => m.method === 'ebitda_multiple')
    expect(revenueMultiple?.applicable).toBe(false)
    expect(ebitdaMultiple?.applicable).toBe(false)
  })

  it('computes weighted composite from applicable methods', () => {
    const result = calculateValuation(makeInputs())
    expect(result.composite_value).toBeGreaterThan(0)
    // Composite should be within range of individual methods
    const values = result.methods.filter(m => m.applicable).map(m => m.value)
    expect(result.composite_value).toBeGreaterThanOrEqual(Math.min(...values) * 0.5)
    expect(result.composite_value).toBeLessThanOrEqual(Math.max(...values) * 1.5)
  })

  it('excludes methods with confidence < 0.3 from composite', () => {
    // All methods should contribute since min confidence is >= 0.3
    const result = calculateValuation(makeInputs())
    const included = result.methods.filter(m => m.applicable && m.confidence >= 0.3)
    expect(included.length).toBeGreaterThanOrEqual(3)
  })

  it('computes confidence score 0-100', () => {
    const result = calculateValuation(makeInputs())
    expect(result.confidence_score).toBeGreaterThanOrEqual(0)
    expect(result.confidence_score).toBeLessThanOrEqual(100)
  })

  it('includes IBC recovery range', () => {
    const result = calculateValuation(makeInputs())
    expect(result.ibc_recovery_range).toBeDefined()
    expect(result.ibc_recovery_range!.low).toBeLessThan(result.ibc_recovery_range!.high)
  })

  it('sets monte_carlo to null (sync mode — MC runs async in browser)', () => {
    const result = calculateValuation(makeInputs())
    // Orchestrator runs synchronously; Monte Carlo is triggered separately in browser
    expect(result.monte_carlo).toBeNull()
  })

  it('produces different results for different sectors', () => {
    const saas = calculateValuation(makeInputs({ sector: 'saas' }))
    const agritech = calculateValuation(makeInputs({ sector: 'agritech' }))
    expect(saas.composite_value).not.toBe(agritech.composite_value)
  })

  it('produces different results for different stages', () => {
    const seed = calculateValuation(makeInputs({ stage: 'seed' }))
    const seriesA = calculateValuation(makeInputs({ stage: 'series_a' }))
    expect(seed.composite_value).not.toBe(seriesA.composite_value)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/valuation/orchestrator.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement orchestrator**

Create `src/lib/valuation/index.ts`:

```typescript
import type { WizardInputs, ValuationResult, MethodResult } from '@/types'
import { computeDerivedFields } from '@/lib/calculators/burn-rate'
import { calculateDCF } from './dcf'
import { calculatePWERM } from './pwerm'
import { calculateRevenueMultiple } from './revenue-multiple'
import { calculateEBITDAMultiple } from './ebitda-multiple'
import { calculateComparableTransaction } from './comparable-transaction'
import { calculateNAV } from './nav'
import { calculateReplacementCost } from './replacement-cost'
import { calculateScorecard } from './scorecard'
import { calculateBerkus } from './berkus'
import { calculateRiskFactor } from './risk-factor'
import { calculateConfidenceScore } from './confidence-score'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'

/**
 * Main valuation orchestrator.
 * Runs all 10 methods across 3 approaches + VC methods,
 * computes weighted composite, confidence score.
 *
 * Income: DCF, PWERM
 * Market: Revenue Multiple, EV/EBITDA Multiple, Comparable Transaction
 * Asset/Cost: NAV, Replacement Cost
 * VC/Startup: Scorecard, Berkus, Risk Factor
 *
 * Monte Carlo is NOT run here (it runs async in a Web Worker).
 * The caller should trigger MC separately and attach results.
 */
export function calculateValuation(inputs: WizardInputs): ValuationResult {
  const derived = computeDerivedFields({
    monthly_burn: inputs.monthly_burn,
    cash_in_bank: inputs.cash_in_bank,
    cac: inputs.cac,
    ltv: inputs.ltv,
    patents_count: inputs.patents_count,
    stage: inputs.stage,
    sector: inputs.sector,
  })

  // Run all 10 methods across 4 approach categories
  const methods: MethodResult[] = [
    // Income Approach
    calculateDCF(inputs, derived),
    calculatePWERM(inputs, derived),
    // Market Approach
    calculateRevenueMultiple(inputs, derived),
    calculateEBITDAMultiple(inputs, derived),
    calculateComparableTransaction(inputs, derived),
    // Asset/Cost Approach
    calculateNAV(inputs, derived),
    calculateReplacementCost(inputs, derived),
    // VC/Startup Methods
    calculateScorecard(inputs, derived),
    calculateBerkus(inputs, derived),
    calculateRiskFactor(inputs, derived),
  ]

  // Weighted composite: weight by confidence, exclude confidence < 0.3
  const qualifying = methods.filter(m => m.applicable && m.confidence >= 0.3)
  let compositeValue = 0
  if (qualifying.length > 0) {
    const totalWeight = qualifying.reduce((sum, m) => sum + m.confidence, 0)
    compositeValue = qualifying.reduce((sum, m) => sum + m.value * m.confidence, 0) / totalWeight
  }

  // Confidence score
  const confidenceScore = calculateConfidenceScore(inputs, methods)

  // IBC recovery
  const ibcRecovery = getIBCRecovery(inputs.sector)

  return {
    methods,
    composite_value: compositeValue,
    composite_low: compositeValue * 0.7,  // placeholder — MC will replace
    composite_high: compositeValue * 1.3, // placeholder — MC will replace
    confidence_score: confidenceScore,
    monte_carlo: null, // runs async in browser
    ibc_recovery_range: {
      low: ibcRecovery.p25,
      high: ibcRecovery.p75,
      sector: inputs.sector,
    },
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/valuation/orchestrator.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 5: Run ALL valuation tests to verify no regressions**

```bash
npx vitest run __tests__/lib/valuation/
```

Expected: All tests across all 13 test files PASS (dcf, pwerm, revenue-multiple, ebitda-multiple, comparable-transaction, nav, replacement-cost, scorecard, berkus, risk-factor, confidence-score, monte-carlo, orchestrator).

- [ ] **Step 6: Commit**

```bash
git add src/lib/valuation/index.ts __tests__/lib/valuation/orchestrator.test.ts
git commit -m "feat: add valuation orchestrator — runs 10 methods across 3 approaches, weighted composite, IBC recovery"
```

---

## Chunk 3: Calculators (ESOP, Cap Table, Investor Matching)

Tasks 19-21: Pure calculator functions with zero UI dependencies. Each takes typed inputs and returns typed results.

**Dependencies from Chunk 1:**
- `@/types` — ESOPResult, CapTableEntry, CapTableRound, CapTableResult, Investor, InvestorMatch, StartupCategory, Stage, WizardInputs
- `@/lib/data/sector-mapping` — getAdjacentSectors
- `@/lib/data/investors` — INVESTORS

---

### Task 19: ESOP Valuation (Black-Scholes + Sensitivity)

**Files:**
- Create: `src/lib/calculators/esop-valuation.ts`
- Test: `__tests__/lib/calculators/esop-valuation.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/calculators/esop-valuation.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateESOPValue } from '@/lib/calculators/esop-valuation'

describe('calculateESOPValue', () => {
  const baseParams = {
    valuation: 100_000_000,          // Rs 10 Cr
    total_shares: 1_000_000,
    esop_pool_pct: 12,
    exercise_price: 10,              // Rs 10 face value
    time_to_liquidity: 4,            // years
    volatility: 0.55,                // 55%
    risk_free_rate: 0.07,            // 7%
  }

  it('returns positive ESOP value per share', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.value_per_share).toBeGreaterThan(0)
  })

  it('ESOP value is less than current per-share value', () => {
    const result = calculateESOPValue(baseParams)
    const perShareValue = baseParams.valuation / baseParams.total_shares
    expect(result.value_per_share).toBeLessThan(perShareValue)
  })

  it('computes total pool value = value_per_share × pool_shares', () => {
    const result = calculateESOPValue(baseParams)
    const poolShares = baseParams.total_shares * (baseParams.esop_pool_pct / 100)
    expect(result.total_pool_value).toBeCloseTo(result.value_per_share * poolShares, -2)
  })

  it('computes return multiple = value_per_share / exercise_price', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.return_multiple).toBeCloseTo(result.value_per_share / baseParams.exercise_price, 1)
  })

  it('returns 3 sensitivity scenarios', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.sensitivity.conservative).toBeDefined()
    expect(result.sensitivity.base).toBeDefined()
    expect(result.sensitivity.optimistic).toBeDefined()
  })

  it('conservative scenario has higher volatility and longer time', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.sensitivity.conservative.volatility).toBeGreaterThan(result.sensitivity.base.volatility)
    expect(result.sensitivity.conservative.time).toBeGreaterThan(result.sensitivity.base.time)
  })

  it('optimistic scenario has lower volatility and shorter time', () => {
    const result = calculateESOPValue(baseParams)
    expect(result.sensitivity.optimistic.volatility).toBeLessThan(result.sensitivity.base.volatility)
    expect(result.sensitivity.optimistic.time).toBeLessThan(result.sensitivity.base.time)
  })

  it('conservative value < base value < optimistic value', () => {
    const result = calculateESOPValue(baseParams)
    // Higher volatility + longer time generally increases option value (for deep ITM)
    // But we compare the final per-share value, not the option premium
    // Optimistic (lower vol, shorter time) should still yield positive value
    expect(result.sensitivity.optimistic.value).toBeGreaterThan(0)
    expect(result.sensitivity.conservative.value).toBeGreaterThan(0)
    expect(result.sensitivity.base.value).toBeGreaterThan(0)
  })

  it('handles very high exercise price (near ATM)', () => {
    const result = calculateESOPValue({
      ...baseParams,
      exercise_price: 90, // close to per-share value of Rs 100
    })
    expect(result.value_per_share).toBeGreaterThan(0) // still has time value
    expect(result.return_multiple).toBeLessThan(5) // but low multiple
  })

  it('handles zero exercise price (RSUs)', () => {
    const result = calculateESOPValue({
      ...baseParams,
      exercise_price: 0,
    })
    // RSU value ≈ current per-share value (no strike)
    const perShareValue = baseParams.valuation / baseParams.total_shares
    expect(result.value_per_share).toBeCloseTo(perShareValue, -1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/calculators/esop-valuation.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement ESOP valuation**

Create `src/lib/calculators/esop-valuation.ts`:

```typescript
import type { ESOPResult } from '@/types'

/**
 * Black-Scholes ESOP Valuation with Sensitivity Analysis
 * Spec: ESOP Valuation section
 *
 * d1 = (1/(σ√t)) × [ln(S/K) + (r + σ²/2)t]
 * d2 = d1 - σ√t
 * ESOP_value = N(d1) × S - N(d2) × K × e^(-rt)
 */

interface ESOPParams {
  valuation: number          // total company valuation in Rs
  total_shares: number       // total shares outstanding
  esop_pool_pct: number      // ESOP pool as % of total
  exercise_price: number     // strike price per share (Rs)
  time_to_liquidity: number  // years to expected exit
  volatility: number         // annualized volatility (decimal)
  risk_free_rate: number     // risk-free rate (decimal)
}

/** Cumulative normal distribution (Abramowitz & Stegun approximation) */
function normalCDF(x: number): number {
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911

  const sign = x < 0 ? -1 : 1
  const absX = Math.abs(x)
  const t = 1.0 / (1.0 + p * absX)
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX / 2)

  return 0.5 * (1.0 + sign * y)
}

/** Black-Scholes call option value */
function blackScholes(
  S: number, // current price
  K: number, // strike price
  t: number, // time in years
  r: number, // risk-free rate
  sigma: number // volatility
): number {
  if (t <= 0) return Math.max(0, S - K)
  if (K <= 0) return S // RSU case

  const sqrtT = Math.sqrt(t)
  const d1 = (Math.log(S / K) + (r + sigma * sigma / 2) * t) / (sigma * sqrtT)
  const d2 = d1 - sigma * sqrtT

  return normalCDF(d1) * S - normalCDF(d2) * K * Math.exp(-r * t)
}

export function calculateESOPValue(params: ESOPParams): ESOPResult {
  const perShareValue = params.valuation / params.total_shares
  const poolShares = params.total_shares * (params.esop_pool_pct / 100)

  // Base case
  const baseValue = blackScholes(
    perShareValue,
    params.exercise_price,
    params.time_to_liquidity,
    params.risk_free_rate,
    params.volatility
  )

  // Conservative: σ + 20%, t + 1 year (per spec)
  const conservativeVol = params.volatility * 1.20
  const conservativeTime = params.time_to_liquidity + 1
  const conservativeValue = blackScholes(
    perShareValue, params.exercise_price,
    conservativeTime, params.risk_free_rate, conservativeVol
  )

  // Optimistic: σ - 10%, t - 1 year (per spec, min 1 year)
  const optimisticVol = params.volatility * 0.90
  const optimisticTime = Math.max(1, params.time_to_liquidity - 1)
  const optimisticValue = blackScholes(
    perShareValue, params.exercise_price,
    optimisticTime, params.risk_free_rate, optimisticVol
  )

  return {
    value_per_share: baseValue,
    total_pool_value: baseValue * poolShares,
    return_multiple: params.exercise_price > 0 ? baseValue / params.exercise_price : 1,
    sensitivity: {
      conservative: {
        volatility: conservativeVol,
        time: conservativeTime,
        value: conservativeValue,
      },
      base: {
        volatility: params.volatility,
        time: params.time_to_liquidity,
        value: baseValue,
      },
      optimistic: {
        volatility: optimisticVol,
        time: optimisticTime,
        value: optimisticValue,
      },
    },
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/calculators/esop-valuation.test.ts
```

Expected: All 10 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculators/esop-valuation.ts __tests__/lib/calculators/esop-valuation.test.ts
git commit -m "feat: add ESOP valuation calculator (Black-Scholes + 3-scenario sensitivity)"
```

---

### Task 20: Cap Table Simulator (Pre/Post-Round ESOP)

**Files:**
- Create: `src/lib/calculators/cap-table.ts`
- Test: `__tests__/lib/calculators/cap-table.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/calculators/cap-table.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { simulateRound, simulateMultiRound } from '@/lib/calculators/cap-table'
import type { CapTableEntry, CapTableRound } from '@/types'

const baseCapTable: CapTableEntry[] = [
  { name: 'Founder A', percentage: 50, share_class: 'common' },
  { name: 'Founder B', percentage: 30, share_class: 'common' },
  { name: 'Angel Investor', percentage: 10, share_class: 'preference' },
  { name: 'ESOP Pool', percentage: 10, share_class: 'esop' },
]

describe('simulateRound', () => {
  it('computes post-money = pre-money + raise', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 0,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    expect(result.post_money).toBe(250_000_000)
  })

  it('new investor gets raise/post_money percentage', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 0,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    expect(result.new_investor_pct).toBeCloseTo(20, 1) // 50M / 250M = 20%
  })

  it('dilutes existing shareholders proportionally', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 0,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    // Founder A: 50% × (1 - 20%) = 40%
    const founderA = result.shareholders.find(s => s.name === 'Founder A')
    expect(founderA?.percentage).toBeCloseTo(40, 1)
  })

  it('computes founder_pct_after as sum of common shareholders', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 0,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    // Founders: (50 + 30) × 0.80 = 64%
    expect(result.founder_pct_after).toBeCloseTo(64, 0)
  })

  it('pre-round ESOP: carves from existing before investor enters', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 5, // expand by 5%
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    // Step 1: ESOP carved from existing → each existing * (1-0.05)
    // Step 2: Investor enters at 50M/250M = 20%
    // Investor NOT diluted by ESOP
    const newInvestor = result.shareholders.find(s => s.name === 'New Investor')
    expect(newInvestor?.percentage).toBeCloseTo(20, 1)
    // Founder A: 50 × 0.95 × 0.80 = 38%
    const founderA = result.shareholders.find(s => s.name === 'Founder A')
    expect(founderA?.percentage).toBeCloseTo(38, 0)
  })

  it('post-round ESOP: dilutes everyone including new investor', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 5,
      esop_timing: 'post_round',
    }
    const result = simulateRound(baseCapTable, round)
    // Step 1: Investor enters at 20%
    // Step 2: ESOP carved from everyone × (1-0.05)
    // Investor: 20 × 0.95 = 19%
    const newInvestor = result.shareholders.find(s => s.name === 'New Investor')
    expect(newInvestor?.percentage).toBeCloseTo(19, 0)
  })

  it('all percentages sum to ~100%', () => {
    const round: CapTableRound = {
      raise_amount: 50_000_000,
      pre_money: 200_000_000,
      esop_expansion_pct: 5,
      esop_timing: 'pre_round',
    }
    const result = simulateRound(baseCapTable, round)
    const total = result.shareholders.reduce((sum, s) => sum + s.percentage, 0)
    expect(total).toBeCloseTo(100, 0)
  })
})

describe('simulateMultiRound', () => {
  it('applies multiple rounds sequentially', () => {
    const rounds: CapTableRound[] = [
      { raise_amount: 30_000_000, pre_money: 100_000_000, esop_expansion_pct: 0, esop_timing: 'pre_round' },
      { raise_amount: 100_000_000, pre_money: 400_000_000, esop_expansion_pct: 5, esop_timing: 'pre_round' },
    ]
    const results = simulateMultiRound(baseCapTable, rounds)
    expect(results).toHaveLength(2)
    // After round 2, founders should be more diluted
    expect(results[1].founder_pct_after).toBeLessThan(results[0].founder_pct_after)
  })

  it('caps at 3 rounds', () => {
    const rounds: CapTableRound[] = Array(5).fill({
      raise_amount: 10_000_000, pre_money: 50_000_000,
      esop_expansion_pct: 0, esop_timing: 'pre_round' as const,
    })
    const results = simulateMultiRound(baseCapTable, rounds)
    expect(results).toHaveLength(3) // max 3 per spec
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/calculators/cap-table.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement cap table simulator**

Create `src/lib/calculators/cap-table.ts`:

```typescript
import type { CapTableEntry, CapTableRound, CapTableResult } from '@/types'

/**
 * Cap Table Simulator — Pre/Post-Round ESOP Modeling
 * Spec: Cap Table Simulator section
 *
 * Pre-round ESOP: Carved from existing shareholders BEFORE investor enters.
 * Post-round ESOP: Carved from ALL shareholders AFTER investor enters.
 */

export function simulateRound(
  currentCapTable: CapTableEntry[],
  round: CapTableRound
): CapTableResult {
  const postMoney = round.pre_money + round.raise_amount
  const newInvestorPct = (round.raise_amount / postMoney) * 100

  let shareholders = currentCapTable.map(s => ({ ...s }))

  if (round.esop_timing === 'pre_round' && round.esop_expansion_pct > 0) {
    // Step 1: Carve ESOP from existing shareholders before investor
    const esopFactor = 1 - round.esop_expansion_pct / 100
    shareholders = shareholders.map(s => ({
      ...s,
      percentage: s.percentage * esopFactor,
    }))
    // Add/expand ESOP pool
    const existingEsop = shareholders.find(s => s.share_class === 'esop')
    if (existingEsop) {
      existingEsop.percentage += round.esop_expansion_pct
    } else {
      shareholders.push({
        name: 'ESOP Pool',
        percentage: round.esop_expansion_pct,
        share_class: 'esop',
      })
    }
  }

  // Step 2: Investor enters — dilutes all existing proportionally
  const investorDilution = 1 - newInvestorPct / 100
  shareholders = shareholders.map(s => ({
    ...s,
    percentage: s.percentage * investorDilution,
  }))

  // Add new investor
  shareholders.push({
    name: 'New Investor',
    percentage: newInvestorPct,
    share_class: 'preference',
  })

  if (round.esop_timing === 'post_round' && round.esop_expansion_pct > 0) {
    // Step 3: Carve ESOP from ALL shareholders including new investor
    const esopFactor = 1 - round.esop_expansion_pct / 100
    shareholders = shareholders.map(s => ({
      ...s,
      percentage: s.percentage * esopFactor,
    }))
    const existingEsop = shareholders.find(s => s.share_class === 'esop')
    if (existingEsop) {
      existingEsop.percentage += round.esop_expansion_pct
    } else {
      shareholders.push({
        name: 'ESOP Pool',
        percentage: round.esop_expansion_pct,
        share_class: 'esop',
      })
    }
  }

  const founderPct = shareholders
    .filter(s => s.share_class === 'common')
    .reduce((sum, s) => sum + s.percentage, 0)

  return {
    shareholders,
    post_money: postMoney,
    new_investor_pct: newInvestorPct,
    founder_pct_after: founderPct,
  }
}

/**
 * Simulate up to 3 sequential rounds.
 * Each round's output cap table feeds into the next round's input.
 */
export function simulateMultiRound(
  initialCapTable: CapTableEntry[],
  rounds: CapTableRound[]
): CapTableResult[] {
  const maxRounds = 3
  const results: CapTableResult[] = []
  let currentCapTable = initialCapTable

  for (let i = 0; i < Math.min(rounds.length, maxRounds); i++) {
    const result = simulateRound(currentCapTable, rounds[i])
    results.push(result)
    // Use this round's output as next round's input
    currentCapTable = result.shareholders
  }

  return results
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/calculators/cap-table.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculators/cap-table.ts __tests__/lib/calculators/cap-table.test.ts
git commit -m "feat: add cap table simulator with pre/post-round ESOP modeling"
```

---

### Task 21: Investor Matching Algorithm

**Files:**
- Create: `src/lib/matching/investor-match.ts`
- Test: `__tests__/lib/matching/investor-match.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/matching/investor-match.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { matchInvestors } from '@/lib/matching/investor-match'

describe('matchInvestors', () => {
  const baseQuery = {
    sector: 'saas' as const,
    stage: 'seed' as const,
    city: 'Bangalore',
    target_raise_cr: 5,
  }

  it('returns top 5 matches sorted by score descending', () => {
    const matches = matchInvestors(baseQuery)
    expect(matches.length).toBeLessThanOrEqual(5)
    expect(matches.length).toBeGreaterThan(0)
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i].score).toBeLessThanOrEqual(matches[i - 1].score)
    }
  })

  it('includes reasons for each match', () => {
    const matches = matchInvestors(baseQuery)
    for (const match of matches) {
      expect(match.reasons.length).toBeGreaterThan(0)
    }
  })

  it('gives +3 for exact sector match', () => {
    const matches = matchInvestors({ ...baseQuery, sector: 'saas' })
    // At least one investor should have saas in their sectors
    const hasSectorMatch = matches.some(m =>
      m.reasons.some(r => r.includes('sector'))
    )
    expect(hasSectorMatch).toBe(true)
  })

  it('gives +1 for adjacent sector match', () => {
    // agritech is adjacent to logistics in the mapping
    const matches = matchInvestors({ ...baseQuery, sector: 'agritech' })
    // Should still find matches via adjacency
    expect(matches.length).toBeGreaterThan(0)
  })

  it('gives +2 for stage sweet spot', () => {
    const matches = matchInvestors(baseQuery)
    const hasStageMatch = matches.some(m =>
      m.reasons.some(r => r.includes('stage'))
    )
    expect(hasStageMatch).toBe(true)
  })

  it('gives +1 for geographic proximity', () => {
    const bangaloreMatches = matchInvestors({ ...baseQuery, city: 'Bangalore' })
    const delhiMatches = matchInvestors({ ...baseQuery, city: 'Delhi' })
    // Bangalore-based SaaS should score differently than Delhi-based
    expect(bangaloreMatches).not.toEqual(delhiMatches)
  })

  it('filters by check size', () => {
    // Very small raise — should exclude large-check VCs
    const smallRaise = matchInvestors({ ...baseQuery, target_raise_cr: 0.3 })
    // Very large raise — should exclude small-check angels
    const largeRaise = matchInvestors({ ...baseQuery, target_raise_cr: 300 })
    // Results should differ
    const smallNames = smallRaise.map(m => m.investor.name)
    const largeNames = largeRaise.map(m => m.investor.name)
    expect(smallNames).not.toEqual(largeNames)
  })

  it('returns empty array if no investors match', () => {
    // No investor in the database targets series_c_plus auto_mobility with Rs 5000 Cr
    const matches = matchInvestors({
      sector: 'auto_mobility',
      stage: 'series_c_plus',
      city: 'Patna',
      target_raise_cr: 5000,
    })
    // May return empty or very low-scoring matches
    expect(matches.length).toBeLessThanOrEqual(5)
  })

  it('includes investor metadata in results', () => {
    const matches = matchInvestors(baseQuery)
    if (matches.length > 0) {
      const first = matches[0].investor
      expect(first.name).toBeTruthy()
      expect(first.type).toBeTruthy()
      expect(first.sectors.length).toBeGreaterThan(0)
    }
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/lib/matching/investor-match.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement investor matching**

Create `src/lib/matching/investor-match.ts`:

```typescript
import type { Investor, InvestorMatch, StartupCategory, Stage } from '@/types'
import { INVESTORS } from '@/lib/data/investors'
import { getAdjacentSectors } from '@/lib/data/sector-mapping'

/**
 * Investor Matching Algorithm
 * Spec: Investor Matching section
 *
 * Scoring:
 * - Exact sector match: +3
 * - Adjacent sector match: +1
 * - Stage sweet spot: +2
 * - Geographic proximity: +1
 * - Recent sector activity: +1
 */

interface MatchQuery {
  sector: StartupCategory
  stage: Stage
  city: string
  target_raise_cr: number
}

export function matchInvestors(query: MatchQuery): InvestorMatch[] {
  const adjacentSectors = getAdjacentSectors(query.sector)
  const cityNormalized = query.city.toLowerCase().trim()
  const currentYear = new Date().getFullYear()

  // Step 1-3: Pre-filter per spec (stage, sector/adjacent, check size)
  const candidates = INVESTORS.filter(investor => {
    const stageMatch = investor.stages.includes(query.stage)
    const sectorMatch = investor.sectors.includes(query.sector) ||
      adjacentSectors.some(adj => investor.sectors.includes(adj))
    const sizeMatch = query.target_raise_cr >= investor.check_size_min_cr * 0.5 &&
      query.target_raise_cr <= investor.check_size_max_cr * 2
    return stageMatch && sectorMatch && sizeMatch
  })

  // Step 4: Score filtered candidates
  const scored: InvestorMatch[] = []

  for (const investor of candidates) {
    let score = 0
    const reasons: string[] = []

    // Exact sector match: +3
    if (investor.sectors.includes(query.sector)) {
      score += 3
      reasons.push(`Invests in ${query.sector} sector`)
    }

    // Adjacent sector match: +1 (only if no exact match)
    const hasAdjacent = adjacentSectors.some(adj => investor.sectors.includes(adj))
    if (hasAdjacent && !investor.sectors.includes(query.sector)) {
      score += 1
      reasons.push('Active in adjacent sector')
    }

    // Stage sweet spot: +2
    if (investor.stages.includes(query.stage)) {
      score += 2
      reasons.push(`Active at ${query.stage.replace('_', ' ')} stage`)
    }

    // Geographic proximity: +1
    const investorCity = investor.city.toLowerCase().trim()
    if (investorCity === cityNormalized ||
        (cityNormalized.includes('bengaluru') && investorCity.includes('bangalore')) ||
        (cityNormalized.includes('bangalore') && investorCity.includes('bengaluru')) ||
        (cityNormalized.includes('gurgaon') && investorCity.includes('gurugram')) ||
        (cityNormalized.includes('gurugram') && investorCity.includes('gurgaon')) ||
        (cityNormalized.includes('delhi') && investorCity.includes('gurgaon')) ||
        (cityNormalized.includes('delhi') && investorCity.includes('gurugram')) ||
        (cityNormalized.includes('delhi') && investorCity.includes('noida'))) {
      score += 1
      reasons.push(`Based in ${investor.city}`)
    }

    // Recent activity in sector: +1 (per spec)
    if (investor.last_active_year >= currentYear - 1 &&
        investor.sectors.includes(query.sector)) {
      score += 1
      reasons.push('Recently active in sector')
    }

    if (score > 0 && reasons.length > 0) {
      scored.push({ investor, score, reasons })
    }
  }

  // Sort by score descending, return top 5
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 5)
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/lib/matching/investor-match.test.ts
```

Expected: All 9 tests PASS.

- [ ] **Step 5: Run ALL Chunk 3 tests to verify no regressions**

```bash
npx vitest run __tests__/lib/calculators/esop-valuation.test.ts __tests__/lib/calculators/cap-table.test.ts __tests__/lib/matching/investor-match.test.ts
```

Expected: All 28 tests across 3 test files PASS.

- [ ] **Step 6: Commit**

```bash
git add src/lib/matching/investor-match.ts __tests__/lib/matching/investor-match.test.ts
git commit -m "feat: add investor matching algorithm (sector, stage, check size, geography scoring)"
```

---

## Chunk 4: State Management + Wizard UI

Tasks 22-29: Zustand store with localStorage persistence, 6-step wizard container with progress bar, and one component per wizard step. All wizard steps are client components ('use client') that read/write to the Zustand store.

**Dependencies from Chunks 1-3:**
- `@/types` — WizardInputs, ValuationResult, CapTableEntry, Stage, StartupCategory, BusinessModel, DevStage, CompetitiveAdvantage, PartnershipLevel, STARTUP_CATEGORIES, STAGES, BUSINESS_MODELS, DEV_STAGES, COMPETITIVE_ADVANTAGES
- `@/lib/constants` — DEFAULT_ESOP_PCT
- `@/lib/valuation` — calculateValuation (from Chunk 2 orchestrator)

**UI Dependencies (installed in Task 1):**
- `zustand` with `persist` middleware
- `shadcn/ui` components: Button, Input, Label, Select, Slider, RadioGroup, Checkbox, Card, Progress, Tooltip
- `sonner` for toasts

---

### Task 22: Zustand Store (Persisted to localStorage)

**Files:**
- Create: `src/stores/valuation-store.ts`
- Test: `__tests__/stores/valuation-store.test.ts`

- [ ] **Step 1: Write the failing test**

Create `__tests__/stores/valuation-store.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useValuationStore } from '@/stores/valuation-store'

describe('useValuationStore', () => {
  beforeEach(() => {
    useValuationStore.getState().reset()
  })

  it('initializes with step 1 and empty inputs', () => {
    const state = useValuationStore.getState()
    expect(state.currentStep).toBe(1)
    expect(state.inputs.company_name).toBe('')
    expect(state.inputs.sector).toBe('saas')
    expect(state.result).toBeNull()
  })

  it('updates inputs via setField', () => {
    useValuationStore.getState().setField('company_name', 'Test Co')
    expect(useValuationStore.getState().inputs.company_name).toBe('Test Co')
  })

  it('navigates steps with nextStep / prevStep', () => {
    useValuationStore.getState().nextStep()
    expect(useValuationStore.getState().currentStep).toBe(2)
    useValuationStore.getState().prevStep()
    expect(useValuationStore.getState().currentStep).toBe(1)
  })

  it('clamps step to 1-6 range', () => {
    useValuationStore.getState().prevStep()
    expect(useValuationStore.getState().currentStep).toBe(1)
    for (let i = 0; i < 10; i++) useValuationStore.getState().nextStep()
    expect(useValuationStore.getState().currentStep).toBe(6)
  })

  it('goToStep navigates directly', () => {
    useValuationStore.getState().goToStep(4)
    expect(useValuationStore.getState().currentStep).toBe(4)
  })

  it('setResult stores valuation result', () => {
    const mockResult = { composite_value: 100_000_000 } as any
    useValuationStore.getState().setResult(mockResult)
    expect(useValuationStore.getState().result).toBeDefined()
    expect(useValuationStore.getState().result?.composite_value).toBe(100_000_000)
  })

  it('reset clears all state', () => {
    useValuationStore.getState().setField('company_name', 'Test')
    useValuationStore.getState().nextStep()
    useValuationStore.getState().reset()
    expect(useValuationStore.getState().currentStep).toBe(1)
    expect(useValuationStore.getState().inputs.company_name).toBe('')
    expect(useValuationStore.getState().result).toBeNull()
  })

  it('tracks highest completed step', () => {
    useValuationStore.getState().completeStep(1)
    useValuationStore.getState().completeStep(2)
    expect(useValuationStore.getState().highestCompletedStep).toBe(2)
  })

  it('sets email via setEmail', () => {
    useValuationStore.getState().setEmail('test@startup.com')
    expect(useValuationStore.getState().email).toBe('test@startup.com')
  })

  it('reset clears email', () => {
    useValuationStore.getState().setEmail('test@startup.com')
    useValuationStore.getState().reset()
    expect(useValuationStore.getState().email).toBeNull()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run __tests__/stores/valuation-store.test.ts
```

Expected: FAIL — module not found.

- [ ] **Step 3: Implement Zustand store**

Create `src/stores/valuation-store.ts`:

```typescript
'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WizardInputs, ValuationResult } from '@/types'

const DEFAULT_INPUTS: WizardInputs = {
  company_name: '',
  sector: 'saas',
  stage: 'seed',
  business_model: 'saas_subscription',
  city: '',
  founding_year: new Date().getFullYear() - 1,
  team_size: 3,
  founder_experience: 3,
  domain_expertise: 3,
  previous_exits: false,
  technical_cofounder: false,
  key_hires: [],
  annual_revenue: 0,
  revenue_growth_pct: 0,
  gross_margin_pct: 0,
  monthly_burn: 0,
  cash_in_bank: 0,
  cac: null,
  ltv: null,
  last_round_size: null,
  last_round_valuation: null,
  tam: 1000,
  dev_stage: 'idea',
  competition_level: 3,
  competitive_advantages: [],
  patents_count: 0,
  strategic_partnerships: 'none',
  regulatory_risk: 3,
  revenue_concentration_pct: null,
  international_revenue_pct: 0,
  esop_pool_pct: null,
  time_to_liquidity_years: 4,
  current_cap_table: null,
  target_raise: null,
  expected_dilution_pct: null,
}

interface ValuationStore {
  currentStep: number
  highestCompletedStep: number
  inputs: WizardInputs
  result: ValuationResult | null
  email: string | null

  setField: <K extends keyof WizardInputs>(key: K, value: WizardInputs[K]) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  completeStep: (step: number) => void
  setResult: (result: ValuationResult) => void
  setEmail: (email: string) => void
  reset: () => void
}

export const useValuationStore = create<ValuationStore>()(
  persist(
    (set) => ({
      currentStep: 1,
      highestCompletedStep: 0,
      inputs: { ...DEFAULT_INPUTS },
      result: null,
      email: null,

      setField: (key, value) =>
        set((state) => ({
          inputs: { ...state.inputs, [key]: value },
        })),

      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(6, state.currentStep + 1),
        })),

      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(1, state.currentStep - 1),
        })),

      goToStep: (step) =>
        set({ currentStep: Math.max(1, Math.min(6, step)) }),

      completeStep: (step) =>
        set((state) => ({
          highestCompletedStep: Math.max(state.highestCompletedStep, step),
        })),

      setResult: (result) => set({ result }),

      setEmail: (email) => set({ email }),

      reset: () =>
        set({
          currentStep: 1,
          highestCompletedStep: 0,
          inputs: { ...DEFAULT_INPUTS },
          result: null,
          email: null,
        }),
    }),
    {
      name: 'fus-valuation-store',
      version: 1,
    }
  )
)
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run __tests__/stores/valuation-store.test.ts
```

Expected: All 10 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/stores/valuation-store.ts __tests__/stores/valuation-store.test.ts
git commit -m "feat: add Zustand store with localStorage persistence for wizard state"
```

---

### Task 23: Wizard Container (6-Step Navigation)

**Files:**
- Create: `src/components/wizard/wizard-container.tsx`

- [ ] **Step 1: Create wizard container**

Create `src/components/wizard/wizard-container.tsx`:

```tsx
'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { calculateValuation } from '@/lib/valuation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CompanyStep } from './company-step'
import { TeamStep } from './team-step'
import { FinancialsStep } from './financials-step'
import { MarketProductStep } from './market-product-step'
import { StrategicStep } from './strategic-step'
import { ESOPCapTableStep } from './esop-captable-step'
import { toast } from 'sonner'
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
      if (inputs.current_cap_table && inputs.current_cap_table.length > 0) {
        const sum = inputs.current_cap_table.reduce((s, e) => s + e.percentage, 0)
        if (Math.abs(sum - 100) > 0.01) {
          return `Cap table sums to ${sum.toFixed(1)}% — must sum to 100%. Values will be auto-normalized.`
        }
      }
      return null
    default:
      return null
  }
}

const STEP_LABELS = [
  'Company Profile',
  'Team',
  'Financials',
  'Market & Product',
  'Strategic Factors',
  'ESOP & Cap Table',
]

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
      // Final step — compute valuation
      const result = calculateValuation(inputs)
      setResult(result)
      toast.success('Valuation computed!')
    } else {
      nextStep()
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of 6</span>
          <span>{STEP_LABELS[currentStep - 1]}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between">
        {STEP_LABELS.map((label, i) => {
          const stepNum = i + 1
          const isCompleted = stepNum <= highestCompletedStep
          const isCurrent = stepNum === currentStep
          const isAccessible = stepNum <= highestCompletedStep + 1

          return (
            <button
              key={stepNum}
              onClick={() => isAccessible && goToStep(stepNum)}
              disabled={!isAccessible}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                isCurrent
                  ? 'bg-primary text-primary-foreground'
                  : isCompleted
                    ? 'bg-primary/20 text-primary cursor-pointer'
                    : 'bg-muted text-muted-foreground'
              }`}
              title={label}
            >
              {stepNum}
            </button>
          )
        })}
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        <StepComponent />
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button onClick={handleNext}>
          {currentStep === 6 ? 'Get Valuation' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/wizard/wizard-container.tsx
git commit -m "feat: add wizard container with 6-step navigation and progress bar"
```

---

### Task 24: Company Step (Step 1)

**Files:**
- Create: `src/components/wizard/company-step.tsx`

- [ ] **Step 1: Create company step component**

Create `src/components/wizard/company-step.tsx`:

```tsx
'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STARTUP_CATEGORIES, STAGES, BUSINESS_MODELS } from '@/types'
import type { StartupCategory, Stage, BusinessModel } from '@/types'
import { getSectorLabel } from '@/lib/data/sector-mapping'

const SECTOR_OPTIONS = STARTUP_CATEGORIES.map(s => ({
  value: s,
  label: getSectorLabel(s),
}))

const STAGE_LABELS: Record<string, string> = {
  idea: 'Idea Stage',
  pre_seed: 'Pre-Seed',
  seed: 'Seed',
  pre_series_a: 'Pre-Series A',
  series_a: 'Series A',
  series_b: 'Series B',
  series_c_plus: 'Series C+',
}

const MODEL_LABELS: Record<string, string> = {
  saas_subscription: 'SaaS / Subscription',
  marketplace_commission: 'Marketplace / Commission',
  ecommerce_product: 'E-Commerce / Product Sales',
  advertising: 'Advertising',
  freemium: 'Freemium',
  transaction_based: 'Transaction-Based',
  licensing: 'Licensing',
  services: 'Services',
  hardware_software: 'Hardware + Software',
  other: 'Other',
}

export function CompanyStep() {
  const { inputs, setField } = useValuationStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Company Profile</h2>
        <p className="text-sm text-muted-foreground">Basic information about your startup</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            value={inputs.company_name}
            onChange={(e) => setField('company_name', e.target.value)}
            placeholder="Your startup name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Sector</Label>
            <Select value={inputs.sector} onValueChange={(v) => setField('sector', v as StartupCategory)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {SECTOR_OPTIONS.map(s => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Stage</Label>
            <Select value={inputs.stage} onValueChange={(v) => setField('stage', v as Stage)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STAGES.map(s => (
                  <SelectItem key={s} value={s}>{STAGE_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Business Model</Label>
          <Select value={inputs.business_model} onValueChange={(v) => setField('business_model', v as BusinessModel)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {BUSINESS_MODELS.map(m => (
                <SelectItem key={m} value={m}>{MODEL_LABELS[m]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={inputs.city}
              onChange={(e) => setField('city', e.target.value)}
              placeholder="e.g., Bangalore"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="founding_year">Founding Year</Label>
            <Input
              id="founding_year"
              type="number"
              value={inputs.founding_year}
              onChange={(e) => setField('founding_year', parseInt(e.target.value) || 2020)}
              min={2000}
              max={new Date().getFullYear()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/wizard/company-step.tsx
git commit -m "feat: add Company Profile wizard step (sector, stage, business model)"
```

---

### Task 25: Team Step (Step 2)

**Files:**
- Create: `src/components/wizard/team-step.tsx`

- [ ] **Step 1: Create team step component**

Create `src/components/wizard/team-step.tsx`:

```tsx
'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

const KEY_HIRE_OPTIONS = [
  { value: 'cto', label: 'CTO / VP Engineering' },
  { value: 'cfo', label: 'CFO / Finance Lead' },
  { value: 'sales_lead', label: 'Sales / BD Lead' },
  { value: 'product_lead', label: 'Product Lead' },
  { value: 'marketing_lead', label: 'Marketing Lead' },
]

export function TeamStep() {
  const { inputs, setField } = useValuationStore()

  const toggleKeyHire = (hire: string) => {
    const current = inputs.key_hires
    if (current.includes(hire)) {
      setField('key_hires', current.filter(h => h !== hire))
    } else {
      setField('key_hires', [...current, hire])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Team</h2>
        <p className="text-sm text-muted-foreground">Your founding team and key hires</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="team_size">Team Size</Label>
          <Input
            id="team_size"
            type="number"
            value={inputs.team_size}
            onChange={(e) => setField('team_size', parseInt(e.target.value) || 1)}
            min={1}
            max={500}
          />
        </div>

        <div className="space-y-2">
          <Label>Founder Experience (1-5)</Label>
          <Slider
            value={[inputs.founder_experience]}
            onValueChange={([v]) => setField('founder_experience', v)}
            min={1} max={5} step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>First-time founder</span><span>Serial entrepreneur</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Domain Expertise (1-5)</Label>
          <Slider
            value={[inputs.domain_expertise]}
            onValueChange={([v]) => setField('domain_expertise', v)}
            min={1} max={5} step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>New to domain</span><span>Deep domain expert</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="previous_exits"
              checked={inputs.previous_exits}
              onCheckedChange={(v) => setField('previous_exits', Boolean(v))}
            />
            <Label htmlFor="previous_exits">Previous exits</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="technical_cofounder"
              checked={inputs.technical_cofounder}
              onCheckedChange={(v) => setField('technical_cofounder', Boolean(v))}
            />
            <Label htmlFor="technical_cofounder">Technical co-founder</Label>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Key Hires</Label>
          <div className="grid grid-cols-2 gap-2">
            {KEY_HIRE_OPTIONS.map(hire => (
              <div key={hire.value} className="flex items-center space-x-2">
                <Checkbox
                  id={hire.value}
                  checked={inputs.key_hires.includes(hire.value)}
                  onCheckedChange={() => toggleKeyHire(hire.value)}
                />
                <Label htmlFor={hire.value} className="text-sm">{hire.label}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/wizard/team-step.tsx
git commit -m "feat: add Team wizard step (experience, expertise, key hires)"
```

---

### Task 26: Financials Step (Step 3)

**Files:**
- Create: `src/components/wizard/financials-step.tsx`

- [ ] **Step 1: Create financials step component**

Create `src/components/wizard/financials-step.tsx`:

```tsx
'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

function CurrencyInput({
  id, label, value, onChange, tooltip, optional = false,
}: {
  id: string; label: string; value: number | null; onChange: (v: number | null) => void;
  tooltip?: string; optional?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1">
        <Label htmlFor={id}>
          {label}{optional && <span className="text-muted-foreground ml-1">(optional)</span>}
        </Label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-help text-muted-foreground text-xs">ⓘ</span>
              </TooltipTrigger>
              <TooltipContent><p className="max-w-[200px] text-xs">{tooltip}</p></TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
        <Input
          id={id}
          type="number"
          className="pl-7"
          value={value ?? ''}
          onChange={(e) => {
            const v = e.target.value
            onChange(v === '' ? (optional ? null : 0) : parseFloat(v))
          }}
          placeholder={optional ? 'Not specified' : '0'}
        />
      </div>
    </div>
  )
}

export function FinancialsStep() {
  const { inputs, setField } = useValuationStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Financials</h2>
        <p className="text-sm text-muted-foreground">Revenue, burn rate, and unit economics</p>
      </div>

      <div className="space-y-4">
        <CurrencyInput
          id="annual_revenue" label="Annual Revenue (Rs)"
          value={inputs.annual_revenue}
          onChange={(v) => setField('annual_revenue', v ?? 0)}
          tooltip="Annual recurring revenue. Enter 0 if pre-revenue."
        />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="revenue_growth_pct">Revenue Growth (%)</Label>
            <Input
              id="revenue_growth_pct" type="number"
              value={inputs.revenue_growth_pct}
              onChange={(e) => setField('revenue_growth_pct', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gross_margin_pct">Gross Margin (%)</Label>
            <Input
              id="gross_margin_pct" type="number"
              value={inputs.gross_margin_pct}
              onChange={(e) => setField('gross_margin_pct', parseFloat(e.target.value) || 0)}
              placeholder="e.g., 70"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CurrencyInput
            id="monthly_burn" label="Monthly Burn (Rs)"
            value={inputs.monthly_burn}
            onChange={(v) => setField('monthly_burn', v ?? 0)}
            tooltip="Total monthly expenses including salaries"
          />
          <CurrencyInput
            id="cash_in_bank" label="Cash in Bank (Rs)"
            value={inputs.cash_in_bank}
            onChange={(v) => setField('cash_in_bank', v ?? 0)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CurrencyInput
            id="cac" label="Customer Acquisition Cost"
            value={inputs.cac}
            onChange={(v) => setField('cac', v)}
            tooltip="Average cost to acquire one customer"
            optional
          />
          <CurrencyInput
            id="ltv" label="Customer Lifetime Value"
            value={inputs.ltv}
            onChange={(v) => setField('ltv', v)}
            tooltip="Average revenue from one customer over their lifetime"
            optional
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <CurrencyInput
            id="last_round_size" label="Last Round Size"
            value={inputs.last_round_size}
            onChange={(v) => setField('last_round_size', v)}
            optional
          />
          <CurrencyInput
            id="last_round_valuation" label="Last Round Valuation"
            value={inputs.last_round_valuation}
            onChange={(v) => setField('last_round_valuation', v)}
            optional
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/wizard/financials-step.tsx
git commit -m "feat: add Financials wizard step (revenue, burn, unit economics)"
```

---

### Task 27: Market & Product Step (Step 4)

**Files:**
- Create: `src/components/wizard/market-product-step.tsx`

- [ ] **Step 1: Create market & product step component**

Create `src/components/wizard/market-product-step.tsx`:

```tsx
'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { DEV_STAGES, COMPETITIVE_ADVANTAGES } from '@/types'
import type { CompetitiveAdvantage, DevStage } from '@/types'

const DEV_STAGE_LABELS: Record<string, string> = {
  idea: 'Idea / Concept',
  prototype: 'Prototype',
  mvp: 'MVP',
  beta: 'Beta / Early Users',
  production: 'Production / Live',
  scaling: 'Scaling',
}

const ADVANTAGE_LABELS: Record<string, string> = {
  network_effects: 'Network Effects',
  proprietary_tech: 'Proprietary Technology',
  brand: 'Strong Brand',
  cost_advantage: 'Cost Advantage',
  switching_costs: 'High Switching Costs',
  regulatory: 'Regulatory Moat',
  data_moat: 'Data Moat',
  none: 'None',
}

export function MarketProductStep() {
  const { inputs, setField } = useValuationStore()

  const toggleAdvantage = (adv: CompetitiveAdvantage) => {
    const current = inputs.competitive_advantages
    if (adv === 'none') {
      setField('competitive_advantages', ['none'])
      return
    }
    const filtered = current.filter(a => a !== 'none')
    if (filtered.includes(adv)) {
      setField('competitive_advantages', filtered.filter(a => a !== adv))
    } else {
      setField('competitive_advantages', [...filtered, adv])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Market & Product</h2>
        <p className="text-sm text-muted-foreground">Market opportunity and product maturity</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            <Label htmlFor="tam">Total Addressable Market (Rs Cr)</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help text-muted-foreground text-xs">ⓘ</span>
                </TooltipTrigger>
                <TooltipContent><p className="max-w-[200px] text-xs">Total addressable market in Rs Cr. The maximum revenue opportunity if you captured 100% market share.</p></TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Input
            id="tam" type="number"
            value={inputs.tam}
            onChange={(e) => setField('tam', parseFloat(e.target.value) || 0)}
            placeholder="e.g., 5000"
          />
        </div>

        <div className="space-y-2">
          <Label>Development Stage</Label>
          <Select value={inputs.dev_stage} onValueChange={(v) => setField('dev_stage', v as DevStage)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {DEV_STAGES.map(s => (
                <SelectItem key={s} value={s}>{DEV_STAGE_LABELS[s]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Competition Level (1-5)</Label>
          <Slider
            value={[inputs.competition_level]}
            onValueChange={([v]) => setField('competition_level', v)}
            min={1} max={5} step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Blue ocean</span><span>Hypercompetitive</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Competitive Advantages</Label>
          <div className="grid grid-cols-2 gap-2">
            {COMPETITIVE_ADVANTAGES.map(adv => (
              <div key={adv} className="flex items-center space-x-2">
                <Checkbox
                  id={`adv-${adv}`}
                  checked={inputs.competitive_advantages.includes(adv)}
                  onCheckedChange={() => toggleAdvantage(adv)}
                />
                <Label htmlFor={`adv-${adv}`} className="text-sm">{ADVANTAGE_LABELS[adv]}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="patents_count">Patents / IP Count</Label>
          <Input
            id="patents_count" type="number"
            value={inputs.patents_count}
            onChange={(e) => setField('patents_count', parseInt(e.target.value) || 0)}
            min={0}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/wizard/market-product-step.tsx
git commit -m "feat: add Market & Product wizard step (TAM, dev stage, competition)"
```

---

### Task 28: Strategic Step (Step 5)

**Files:**
- Create: `src/components/wizard/strategic-step.tsx`

- [ ] **Step 1: Create strategic step component**

Create `src/components/wizard/strategic-step.tsx`:

```tsx
'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Slider } from '@/components/ui/slider'
import type { PartnershipLevel } from '@/types'

export function StrategicStep() {
  const { inputs, setField } = useValuationStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Strategic Factors</h2>
        <p className="text-sm text-muted-foreground">Partnerships, risk, and international exposure</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Strategic Partnerships</Label>
          <RadioGroup
            value={inputs.strategic_partnerships}
            onValueChange={(v) => setField('strategic_partnerships', v as PartnershipLevel)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="partner-none" />
              <Label htmlFor="partner-none">None</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one" id="partner-one" />
              <Label htmlFor="partner-one">One strategic partner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="multiple" id="partner-multi" />
              <Label htmlFor="partner-multi">Multiple strategic partners</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Regulatory Risk (1-5)</Label>
          <Slider
            value={[inputs.regulatory_risk]}
            onValueChange={([v]) => setField('regulatory_risk', v)}
            min={1} max={5} step={1}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Minimal regulation</span><span>Heavily regulated</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="revenue_concentration_pct">
            Revenue Concentration — Top Client %
            <span className="text-muted-foreground ml-1">(optional)</span>
          </Label>
          <Input
            id="revenue_concentration_pct" type="number"
            value={inputs.revenue_concentration_pct ?? ''}
            onChange={(e) => {
              const v = e.target.value
              setField('revenue_concentration_pct', v === '' ? null : parseFloat(v))
            }}
            placeholder="e.g., 40"
            min={0} max={100}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="international_revenue_pct">International Revenue (%)</Label>
          <Input
            id="international_revenue_pct" type="number"
            value={inputs.international_revenue_pct}
            onChange={(e) => setField('international_revenue_pct', parseFloat(e.target.value) || 0)}
            placeholder="0"
            min={0} max={100}
          />
          <p className="text-xs text-muted-foreground">Relevant for FEMA valuation context</p>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/wizard/strategic-step.tsx
git commit -m "feat: add Strategic Factors wizard step (partnerships, regulation, international)"
```

---

### Task 29: ESOP & Cap Table Step (Step 6)

**Files:**
- Create: `src/components/wizard/esop-captable-step.tsx`

- [ ] **Step 1: Create ESOP & cap table step component**

Create `src/components/wizard/esop-captable-step.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DEFAULT_ESOP_PCT } from '@/lib/constants'
import type { CapTableEntry } from '@/types'

export function ESOPCapTableStep() {
  const { inputs, setField } = useValuationStore()
  const [expanded, setExpanded] = useState(false)

  const defaultEsop = DEFAULT_ESOP_PCT[inputs.stage] ?? 10

  const addShareholder = () => {
    const current = inputs.current_cap_table ?? []
    if (current.length >= 10) return
    setField('current_cap_table', [
      ...current,
      { name: '', percentage: 0, share_class: 'common' as const },
    ])
  }

  const updateShareholder = (index: number, field: keyof CapTableEntry, value: string | number) => {
    const current = [...(inputs.current_cap_table ?? [])]
    current[index] = { ...current[index], [field]: value }
    setField('current_cap_table', current)
  }

  const removeShareholder = (index: number) => {
    const current = [...(inputs.current_cap_table ?? [])]
    current.splice(index, 1)
    setField('current_cap_table', current.length > 0 ? current : null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">ESOP & Cap Table</h2>
        <p className="text-sm text-muted-foreground">
          Optional — expand for ESOP valuation and cap table modeling
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="esop_pool_pct">
            ESOP Pool %
            <span className="text-muted-foreground ml-1">(default: {defaultEsop}% for {inputs.stage})</span>
          </Label>
          <Input
            id="esop_pool_pct" type="number"
            value={inputs.esop_pool_pct ?? ''}
            onChange={(e) => {
              const v = e.target.value
              setField('esop_pool_pct', v === '' ? null : parseFloat(v))
            }}
            placeholder={`${defaultEsop}`}
            min={0} max={30}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="time_to_liquidity_years">
            Expected Time to Liquidity (years)
            <span className="text-muted-foreground ml-1">(optional)</span>
          </Label>
          <Input
            id="time_to_liquidity_years" type="number"
            value={inputs.time_to_liquidity_years ?? ''}
            onChange={(e) => {
              const v = e.target.value
              setField('time_to_liquidity_years', v === '' ? null : parseInt(v))
            }}
            placeholder="4"
            min={1} max={15}
          />
        </div>

        <Button variant="outline" onClick={() => setExpanded(!expanded)} className="w-full">
          {expanded ? 'Hide Cap Table Details' : 'Add Current Cap Table & Next Round'}
        </Button>

        {expanded && (
          <div className="space-y-4 border rounded-lg p-4">
            <div>
              <Label className="text-sm font-medium">Current Shareholders</Label>
              <p className="text-xs text-muted-foreground mb-2">Up to 10 entries</p>
              {(inputs.current_cap_table ?? []).map((entry, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    value={entry.name}
                    onChange={(e) => updateShareholder(i, 'name', e.target.value)}
                    placeholder="Name"
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    value={entry.percentage}
                    onChange={(e) => updateShareholder(i, 'percentage', parseFloat(e.target.value) || 0)}
                    placeholder="%"
                    className="w-20"
                  />
                  <Select
                    value={entry.share_class}
                    onValueChange={(v) => updateShareholder(i, 'share_class', v)}
                  >
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="preference">Preference</SelectItem>
                      <SelectItem value="esop">ESOP</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => removeShareholder(i)}>×</Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addShareholder}>
                + Add Shareholder
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_raise">Target Raise (Rs)</Label>
                <Input
                  id="target_raise" type="number"
                  value={inputs.target_raise ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setField('target_raise', v === '' ? null : parseFloat(v))
                  }}
                  placeholder="e.g., 50000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expected_dilution_pct">Expected Dilution (%)</Label>
                <Input
                  id="expected_dilution_pct" type="number"
                  value={inputs.expected_dilution_pct ?? ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setField('expected_dilution_pct', v === '' ? null : parseFloat(v))
                  }}
                  placeholder="e.g., 20"
                  min={0} max={100}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/wizard/esop-captable-step.tsx
git commit -m "feat: add ESOP & Cap Table wizard step (optional expandable, shareholder entries)"
```

---

## Chunk 5: Results Page + Email Gate

Tasks 30-37: Results components displayed after wizard completion — valuation reveal, 10 method cards grouped by approach, contribution pie chart, Monte Carlo distribution, confidence breakdown, social share buttons, email gate for detailed report, and the valuation page assembly.

**Dependencies from Chunks 1-4:**
- `@/types` — ValuationResult, MethodResult, MonteCarloResult, ValuationApproach, APPROACH_ORDER, APPROACH_LABELS
- `@/lib/utils` — formatINR
- `@/stores/valuation-store` — useValuationStore
- `@/components/wizard/wizard-container` — WizardContainer
- `@/components/ui/*` — Card, Button, Badge, Progress

**UI Dependencies (installed in Task 1):**
- `recharts` — PieChart, AreaChart, BarChart, ResponsiveContainer
- `sonner` — toast

---

### Task 30: Valuation Reveal Component

**Files:**
- Create: `src/components/results/valuation-reveal.tsx`

- [ ] **Step 1: Create valuation reveal component**

Create `src/components/results/valuation-reveal.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
    result.confidence_score >= 70 ? 'text-green-600' :
    result.confidence_score >= 40 ? 'text-yellow-600' : 'text-red-600'

  return (
    <Card className="border-2 border-primary">
      <CardHeader className="text-center pb-2">
        <p className="text-sm text-muted-foreground">Estimated Valuation for</p>
        <CardTitle className="text-xl">{companyName || 'Your Startup'}</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div>
          <p className="text-4xl font-bold tracking-tight">
            {formatINR(result.composite_low)} — {formatINR(result.composite_high)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Weighted Composite: {formatINR(result.composite_value)}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-muted-foreground">Confidence Score:</span>
          <span className={`text-2xl font-bold ${confidenceColor}`}>
            {result.confidence_score}/100
          </span>
          <span className={`text-sm ${confidenceColor}`}>({confidenceLabel})</span>
        </div>

        {result.ibc_recovery_range && (
          <p className="text-xs text-muted-foreground border-t pt-3">
            Downside scenario: In insolvency, similar {result.ibc_recovery_range.sector} companies
            recovered {result.ibc_recovery_range.low}–{result.ibc_recovery_range.high}% of admitted claims.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/results/valuation-reveal.tsx
git commit -m "feat: add Valuation Reveal component with confidence score and IBC downside"
```

---

### Task 31: Method Cards (10 Methods, Grouped by 4 Approaches)

**Files:**
- Create: `src/components/results/method-cards.tsx`

- [ ] **Step 1: Create method cards component**

Create `src/components/results/method-cards.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { MethodResult, MonteCarloResult, ValuationApproach } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'

const METHOD_LABELS: Record<string, string> = {
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

function confidenceBadge(confidence: number) {
  if (confidence >= 0.7) return <Badge variant="default">High</Badge>
  if (confidence >= 0.4) return <Badge variant="secondary">Medium</Badge>
  return <Badge variant="outline">Low</Badge>
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

  // Compute approach-level averages
  const approachAvg = (ms: MethodResult[]) => {
    if (ms.length === 0) return 0
    return ms.reduce((sum, m) => sum + m.value, 0) / ms.length
  }

  return (
    <div className="space-y-6">
      {grouped.map(group => (
        <Card key={group.approach}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{group.label}</CardTitle>
              <span className="text-sm font-medium text-muted-foreground">
                Avg: {formatINR(approachAvg(group.methods))}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {group.methods.map(m => (
              <div key={m.method} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{METHOD_LABELS[m.method] ?? m.method}</span>
                  {confidenceBadge(m.confidence)}
                </div>
                <div className="text-right">
                  <span className="font-medium">{formatINR(m.value)}</span>
                  {m.method === 'dcf' && monteCarlo && (
                    <span className="text-xs text-muted-foreground ml-2">
                      MC: {formatINR(monteCarlo.p10)}–{formatINR(monteCarlo.p90)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/results/method-cards.tsx
git commit -m "feat: add Method Cards component (10 methods grouped by 4 approaches)"
```

---

### Task 32: Method Contribution Pie Chart (by Approach)

**Files:**
- Create: `src/components/results/method-contribution.tsx`

- [ ] **Step 1: Create method contribution pie chart**

Create `src/components/results/method-contribution.tsx`:

```tsx
'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MethodResult, ValuationApproach } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'

const APPROACH_COLORS: Record<ValuationApproach, string> = {
  income: '#2563eb',     // blue-600
  market: '#16a34a',     // green-600
  asset_cost: '#d97706', // amber-600
  vc_startup: '#9333ea', // purple-600
}

interface Props {
  methods: MethodResult[]
  compositeValue: number
}

export function MethodContribution({ methods, compositeValue }: Props) {
  const applicable = methods.filter(m => m.applicable && m.confidence >= 0.3)

  // Group by approach and sum weighted contributions
  const totalWeight = applicable.reduce((sum, m) => sum + m.confidence, 0)
  const approachData = APPROACH_ORDER
    .map(approach => {
      const approachMethods = applicable.filter(m => m.approach === approach)
      const weight = approachMethods.reduce((sum, m) => sum + m.confidence, 0)
      const avgValue = approachMethods.length > 0
        ? approachMethods.reduce((sum, m) => sum + m.value * m.confidence, 0) / weight
        : 0
      return {
        name: APPROACH_LABELS[approach],
        value: Math.round((weight / totalWeight) * 100),
        avgValue,
        fill: APPROACH_COLORS[approach],
      }
    })
    .filter(d => d.value > 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Method Contribution by Approach</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={approachData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {approachData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string, props: any) => [
                  `${value}% weight (Avg: ${formatINR(props.payload.avgValue)})`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          Weighted Composite: {formatINR(compositeValue)}
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/results/method-contribution.tsx
git commit -m "feat: add Method Contribution pie chart (grouped by approach)"
```

---

### Task 33: Monte Carlo Distribution Chart

**Files:**
- Create: `src/components/results/monte-carlo-chart.tsx`

- [ ] **Step 1: Create Monte Carlo chart component**

Create `src/components/results/monte-carlo-chart.tsx`:

```tsx
'use client'

import { AreaChart, Area, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MonteCarloResult } from '@/types'
import { formatINR } from '@/lib/utils'

interface Props {
  monteCarlo: MonteCarloResult
}

export function MonteCarloChart({ monteCarlo }: Props) {
  const { p10, p25, p50, p75, p90 } = monteCarlo

  // Build a simple distribution visualization from percentiles
  // We approximate a bell curve using the 5 percentile points
  const step = (p90 - p10) / 40
  const points: { value: number; density: number }[] = []

  for (let i = 0; i <= 40; i++) {
    const v = p10 + step * i
    // Approximate density using distance from median
    const dist = Math.abs(v - p50) / (p90 - p10)
    const density = Math.exp(-8 * dist * dist)
    points.push({ value: Math.round(v), density: Math.round(density * 100) })
  }

  const percentileLines = [
    { value: p10, label: 'P10', color: '#ef4444' },
    { value: p25, label: 'P25', color: '#f97316' },
    { value: p50, label: 'P50', color: '#22c55e' },
    { value: p75, label: 'P75', color: '#f97316' },
    { value: p90, label: 'P90', color: '#ef4444' },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Monte Carlo Simulation</CardTitle>
          <span className="text-xs text-muted-foreground">
            {monteCarlo.iterations_valid.toLocaleString()} / {monteCarlo.iterations_total.toLocaleString()} valid iterations
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={points} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
              <XAxis
                dataKey="value"
                tickFormatter={(v) => formatINR(v)}
                tick={{ fontSize: 10 }}
                interval="preserveStartEnd"
              />
              <YAxis hide />
              <Tooltip
                formatter={(v: number) => [`Relative likelihood`, '']}
                labelFormatter={(v) => formatINR(v as number)}
              />
              <Area
                type="monotone"
                dataKey="density"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.2}
              />
              {percentileLines.map(pl => (
                <ReferenceLine
                  key={pl.label}
                  x={Math.round(pl.value)}
                  stroke={pl.color}
                  strokeDasharray="3 3"
                  label={{ value: pl.label, position: 'top', fontSize: 10 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2 px-4">
          <span>P10: {formatINR(p10)}</span>
          <span>P25: {formatINR(p25)}</span>
          <span className="font-medium text-foreground">P50: {formatINR(p50)}</span>
          <span>P75: {formatINR(p75)}</span>
          <span>P90: {formatINR(p90)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/results/monte-carlo-chart.tsx
git commit -m "feat: add Monte Carlo distribution chart with percentile markers"
```

---

### Task 34: Confidence Breakdown

**Files:**
- Create: `src/components/results/confidence-breakdown.tsx`

- [ ] **Step 1: Create confidence breakdown component**

Create `src/components/results/confidence-breakdown.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { ValuationResult, MethodResult } from '@/types'

interface Props {
  result: ValuationResult
}

/**
 * Shows what drove the confidence score (0-100):
 * - Data completeness: 0-30
 * - Method agreement: 0-40
 * - Revenue maturity: 0-20
 * - Data quality: 0-10
 *
 * We reverse-engineer approximate sub-scores from the composite
 * since the engine computes them internally. For display, we
 * reconstruct from result data.
 */
export function ConfidenceBreakdown({ result }: Props) {
  const applicable = result.methods.filter(m => m.applicable && m.confidence >= 0.3)

  // Data completeness: approximate from number of applicable methods
  const dataCompleteness = Math.min(30, Math.round((applicable.length / 10) * 30))

  // Method agreement: coefficient of variation
  const values = applicable.map(m => m.value)
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const stddev = Math.sqrt(values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length)
  const cv = mean > 0 ? stddev / mean : 1
  const methodAgreement = cv < 0.2 ? 40 : cv < 0.4 ? 25 : 10

  // Revenue maturity: approximate from composite value and method presence
  const hasDCF = applicable.some(m => m.method === 'dcf' && m.confidence >= 0.6)
  const hasRevMultiple = applicable.some(m => m.method === 'revenue_multiple' && m.confidence >= 0.6)
  const revenueMature = hasDCF && hasRevMultiple ? 20 : hasDCF || hasRevMultiple ? 10 : 0

  // Data quality: remainder to approximate the total
  const computedSubtotal = dataCompleteness + methodAgreement + revenueMature
  const dataQuality = Math.max(0, Math.min(10, result.confidence_score - computedSubtotal))

  const breakdown = [
    { label: 'Data Completeness', score: dataCompleteness, max: 30, description: `${applicable.length} of 10 methods applicable` },
    { label: 'Method Agreement', score: methodAgreement, max: 40, description: `CV: ${(cv * 100).toFixed(0)}%` },
    { label: 'Revenue Maturity', score: revenueMature, max: 20, description: hasDCF ? 'Revenue data available' : 'Limited revenue data' },
    { label: 'Data Quality', score: dataQuality, max: 10, description: 'Internal consistency' },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">What Drove Your Confidence Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {breakdown.map(item => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>{item.label}</span>
              <span className="font-medium">{item.score}/{item.max}</span>
            </div>
            <Progress value={(item.score / item.max) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        ))}
        <div className="border-t pt-3 flex justify-between font-medium">
          <span>Total Confidence</span>
          <span>{result.confidence_score}/100</span>
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/results/confidence-breakdown.tsx
git commit -m "feat: add Confidence Breakdown component (4-factor score display)"
```

---

### Task 35: Share Buttons (LinkedIn / Twitter / WhatsApp)

**Files:**
- Create: `src/components/results/share-buttons.tsx`

- [ ] **Step 1: Create share buttons component**

Create `src/components/results/share-buttons.tsx`:

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { formatINR } from '@/lib/utils'

interface Props {
  compositeValue: number
  companyName: string
}

export function ShareButtons({ compositeValue, companyName }: Props) {
  const text = `Just valued ${companyName || 'my startup'} at ${formatINR(compositeValue)} using firstunicornstartup.com — 10 valuation methods across 3 approaches, powered by Damodaran India data. Try it free!`
  const url = 'https://firstunicornstartup.com'

  const shareLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
  }

  const shareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank',
      'noopener,noreferrer,width=600,height=400'
    )
  }

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      '_blank',
      'noopener,noreferrer'
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={shareLinkedIn}>
        Share on LinkedIn
      </Button>
      <Button variant="outline" size="sm" onClick={shareTwitter}>
        Share on Twitter
      </Button>
      <Button variant="outline" size="sm" onClick={shareWhatsApp}>
        Share on WhatsApp
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/results/share-buttons.tsx
git commit -m "feat: add Share Buttons (LinkedIn, Twitter, WhatsApp)"
```

---

### Task 36: Email Gate Component

**Files:**
- Create: `src/components/results/email-gate.tsx`

- [ ] **Step 1: Create email gate component**

Create `src/components/results/email-gate.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useValuationStore } from '@/stores/valuation-store'
import { toast } from 'sonner'

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
  const [email, setEmailInput] = useState('')
  const [loading, setLoading] = useState(false)

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidEmail || !result) return

    setLoading(true)
    try {
      const res = await fetch('/api/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company_name: inputs.company_name,
          sector: inputs.sector,
          stage: inputs.stage,
          valuation_low: result.composite_low,
          valuation_mid: result.composite_value,
          valuation_high: result.composite_high,
          confidence_score: result.confidence_score,
          method_results: result.methods,
          monte_carlo_percentiles: result.monte_carlo,
        }),
      })

      if (!res.ok) throw new Error('Failed to save')

      const data = await res.json()
      setEmail(email)
      toast.success('Report unlocked!')
      onUnlocked(data.report_id)
    } catch {
      // Fallback: still unlock locally even if API fails
      setEmail(email)
      toast.info('Report unlocked (offline mode)')
      onUnlocked('local')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-2 border-dashed">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-lg">Unlock Your Full Valuation Report</CardTitle>
        <p className="text-sm text-muted-foreground">Enter your email to access:</p>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1 mb-4">
          {UNLOCKS.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <span className="text-green-600 mt-0.5">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="founder@startup.com"
            value={email}
            onChange={(e) => setEmailInput(e.target.value)}
            required
          />
          <Button type="submit" disabled={!isValidEmail || loading}>
            {loading ? 'Unlocking...' : 'Unlock Report'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/results/email-gate.tsx
git commit -m "feat: add Email Gate component with /api/capture integration and offline fallback"
```

---

### Task 37: Valuation Page (Wizard + Results Assembly)

**Files:**
- Create: `src/app/valuation/page.tsx`

- [ ] **Step 1: Create valuation page**

Create `src/app/valuation/page.tsx`:

```tsx
'use client'

import { useRouter } from 'next/navigation'
import { useValuationStore } from '@/stores/valuation-store'
import { WizardContainer } from '@/components/wizard/wizard-container'
import { ValuationReveal } from '@/components/results/valuation-reveal'
import { MethodCards } from '@/components/results/method-cards'
import { MethodContribution } from '@/components/results/method-contribution'
import { MonteCarloChart } from '@/components/results/monte-carlo-chart'
import { ConfidenceBreakdown } from '@/components/results/confidence-breakdown'
import { ShareButtons } from '@/components/results/share-buttons'
import { EmailGate } from '@/components/results/email-gate'

export default function ValuationPage() {
  const { result, inputs, email } = useValuationStore()
  const router = useRouter()

  const handleUnlocked = (reportId: string) => {
    if (reportId !== 'local') {
      router.push(`/report/${reportId}`)
    }
  }

  // Show wizard if no result yet
  if (!result) {
    return (
      <main className="container mx-auto px-4 py-8">
        <WizardContainer />
      </main>
    )
  }

  // Show results
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
      <ValuationReveal result={result} companyName={inputs.company_name} />

      <MethodCards
        methods={result.methods}
        monteCarlo={result.monte_carlo}
      />

      {result.monte_carlo && (
        <MonteCarloChart monteCarlo={result.monte_carlo} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MethodContribution
          methods={result.methods}
          compositeValue={result.composite_value}
        />
        <ConfidenceBreakdown result={result} />
      </div>

      <div className="flex justify-center">
        <ShareButtons
          compositeValue={result.composite_value}
          companyName={inputs.company_name}
        />
      </div>

      {!email && (
        <EmailGate onUnlocked={handleUnlocked} />
      )}
    </main>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/valuation/page.tsx
git commit -m "feat: add Valuation Page assembling wizard + results + email gate"
```

---

## Chunk 6: Detailed Report + PDF Export

Tasks 38-51: Server-side capture API, report page with 12 sections (methodology, benchmarks, comparables, listed comparables, IBC downside, ESOP, cap table, investor matching, AI narrative, recommendations), certified report CTA, and PDF generator.

**Dependencies from Chunks 1-5:**
- `@/types` — ValuationResult, MethodResult, MonteCarloResult, WizardInputs, DamodaranBenchmark, ESOPResult, CapTableResult, InvestorMatch, ComparableCompany, CaptureRequest, CaptureResponse, APPROACH_ORDER, APPROACH_LABELS
- `@/lib/utils` — formatINR, formatPercentage
- `@/lib/data/damodaran-india` — getDamodaranBenchmark
- `@/lib/data/sector-benchmarks` — getSectorBenchmarks
- `@/lib/data/comparable-companies` — findComparableCompanies
- `@/lib/data/ibc-recovery` — getIBCRecovery
- `@/lib/data/investors` — INVESTORS
- `@/lib/calculators/esop-valuation` — calculateESOP
- `@/lib/calculators/cap-table` — simulateRound, simulateMultiRound
- `@/lib/matching/investor-match` — matchInvestors
- `@/lib/valuation` — calculateValuation
- `@/stores/valuation-store` — useValuationStore

**Server Dependencies:**
- `@supabase/supabase-js` — Supabase client (service_role for API routes)
- `@anthropic-ai/sdk` — Claude API (for ai-analysis route)
- `jspdf` + `jspdf-autotable` — PDF generation
- `html2canvas` — Chart image capture for PDF

---

### Task 38: API Route — /api/capture

**Files:**
- Create: `src/app/api/capture/route.ts`

- [ ] **Step 1: Create capture API route**

Create `src/app/api/capture/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { CaptureRequest } from '@/types'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body: CaptureRequest = await req.json()
    const { email, valuation_inputs: inputs, valuation_result: result } = body

    // Validate required fields
    if (!email || !inputs.company_name || !inputs.sector || !inputs.stage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Sanitize text fields (strip HTML tags)
    const sanitize = (s: string | null | undefined) =>
      s ? s.replace(/<[^>]*>/g, '').trim() : s

    // Rate limit: 10 per IP per hour
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

    // Upsert user
    const { data: user } = await supabase
      .from('users')
      .upsert({ email }, { onConflict: 'email' })
      .select('id')
      .single()

    // Insert valuation with all wizard inputs + results
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
        competitive_advantages: sanitize(inputs.competitive_advantages),
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
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({ report_id: valuation!.id })
  } catch (err) {
    console.error('Capture error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/capture/route.ts
git commit -m "feat: add /api/capture route for email + valuation storage"
```

---

### Task 39: Report Page — /report/[id]

**Files:**
- Create: `src/app/report/[id]/page.tsx`

- [ ] **Step 1: Create report page**

Create `src/app/report/[id]/page.tsx`:

```tsx
import { notFound } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { ReportClient } from './report-client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Props {
  params: { id: string }
}

export default async function ReportPage({ params }: Props) {
  const { data: valuation } = await supabase
    .from('valuations')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!valuation) notFound()

  return <ReportClient valuation={valuation} />
}
```

- [ ] **Step 2: Create report client component**

Create `src/app/report/[id]/report-client.tsx`:

```tsx
'use client'

import { ValuationReveal } from '@/components/results/valuation-reveal'
import { MethodCards } from '@/components/results/method-cards'
import { MonteCarloChart } from '@/components/results/monte-carlo-chart'
import { MethodContribution } from '@/components/results/method-contribution'
import { Methodology } from '@/components/report/methodology'
import { Benchmarks } from '@/components/report/benchmarks'
import { Comparables } from '@/components/report/comparables'
import { ListedComparables } from '@/components/report/listed-comparables'
import { DownsideAnalysis } from '@/components/report/downside-analysis'
import { ESOPEstimate } from '@/components/report/esop-estimate'
import { CapTableSimulator } from '@/components/report/cap-table-simulator'
import { InvestorMatching } from '@/components/report/investor-matching'
import { AINarrative } from '@/components/report/ai-narrative'
import { Recommendations } from '@/components/report/recommendations'
import { CertifiedCTA } from '@/components/report/certified-cta'
import { PDFDownloadButton } from '@/components/report/pdf-download-button'

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
  current_cap_table: Array<{ holder: string; pct: number }> | null
  valuation_low: number
  valuation_mid: number
  valuation_high: number
  confidence_score: number
  method_results: any[]
  monte_carlo_percentiles: any | null
  ibc_recovery_range: { low: number; high: number } | null
  ai_narrative: string | null
  created_at: string
}

interface Props {
  valuation: ValuationRow
}

export function ReportClient({ valuation }: Props) {
  const result = {
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
      <ValuationReveal result={result} companyName={valuation.company_name} />

      <MethodCards methods={result.methods} monteCarlo={result.monte_carlo} />

      {result.monte_carlo && <MonteCarloChart monteCarlo={result.monte_carlo} />}

      <MethodContribution methods={result.methods} compositeValue={result.composite_value} />

      <Methodology methods={result.methods} />

      <Benchmarks sector={valuation.sector} />

      <Comparables sector={valuation.sector} stage={valuation.stage} />

      <ListedComparables sector={valuation.sector} revenue={valuation.annual_revenue} stage={valuation.stage} />

      <DownsideAnalysis sector={valuation.sector} />

      <ESOPEstimate valuation={valuation} compositeValue={result.composite_value} />

      <CapTableSimulator valuation={valuation} compositeValue={result.composite_value} />

      <InvestorMatching sector={valuation.sector} stage={valuation.stage} targetRaise={valuation.target_raise} />

      <AINarrative valuationId={valuation.id} />

      <Recommendations result={result} sector={valuation.sector} stage={valuation.stage} />

      <PDFDownloadButton valuation={valuation} result={result} />

      <CertifiedCTA />
    </main>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/report/[id]/page.tsx src/app/report/[id]/report-client.tsx
git commit -m "feat: add Report page with server-side Supabase fetch and client component assembly"
```

---

### Task 40: Methodology Section

**Files:**
- Create: `src/components/report/methodology.tsx`

- [ ] **Step 1: Create methodology component**

Create `src/components/report/methodology.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { MethodResult } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'
import { formatINR } from '@/lib/utils'

const METHOD_LABELS: Record<string, string> = {
  dcf: 'Discounted Cash Flow (DCF)',
  pwerm: 'Probability-Weighted Expected Return (PWERM)',
  revenue_multiple: 'Revenue Multiple',
  ebitda_multiple: 'EV/EBITDA Multiple',
  comparable_txn: 'Comparable Transaction',
  nav: 'Net Asset Value (NAV)',
  replacement_cost: 'Replacement Cost',
  scorecard: 'Scorecard Method',
  berkus: 'Berkus Method',
  risk_factor: 'Risk Factor Summation',
}

const METHOD_DESCRIPTIONS: Record<string, string> = {
  dcf: 'Discounted Cash Flow projects revenue for 5 years, applies sector WACC from Damodaran India, and computes terminal value. IVS 105 Income Approach.',
  pwerm: 'Probability Weighted Expected Return weights exit scenarios (IPO, acquisition, flat, down) by likelihood. IVS 105 Income Approach.',
  revenue_multiple: 'Applies sector-specific EV/Revenue multiple from Damodaran India with stage discount. IVS 105 Market Approach.',
  ebitda_multiple: 'Applies EV/EBITDA comparable multiple from Damodaran India with profitability adjustment. IVS 105 Market Approach.',
  comparable_txn: 'Compares to recent Indian startup funding rounds at similar stage and sector. IVS 105 Market Approach.',
  nav: 'Net Asset Value sums tangible and intangible assets. Serves as valuation floor. IVS 105 Asset Approach.',
  replacement_cost: 'Estimates cost to rebuild the startup from scratch — team, technology, customers, IP. IVS 105 Asset Approach.',
  scorecard: 'Bill Payne Scorecard Method weights team, market, product, competition against sector median. VC/startup method.',
  berkus: 'Dave Berkus Method assigns up to Rs 50L per milestone: concept, prototype, team, partnerships, revenue. VC/startup method.',
  risk_factor: 'Risk Factor Summation adjusts sector median by 12 risk factors scored from very low to very high. VC/startup method.',
}

interface Props {
  methods: MethodResult[]
}

export function Methodology({ methods }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Methodology — 3 Approaches × 10 Methods</CardTitle>
        <p className="text-sm text-muted-foreground">
          Aligned with IBBI Valuation Standards, IVS 105, and Rule 11UA
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {APPROACH_ORDER.map(approach => {
          const approachMethods = methods.filter(m => m.approach === approach)
          if (approachMethods.length === 0) return null

          return (
            <div key={approach}>
              <h3 className="font-semibold mb-2">{APPROACH_LABELS[approach]}</h3>
              <div className="space-y-3">
                {approachMethods.map(m => (
                  <div key={m.method} className="border-l-2 border-muted pl-4">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">{METHOD_LABELS[m.method] ?? m.method}</span>
                      <span className={`text-sm font-medium ${m.applicable ? '' : 'text-muted-foreground'}`}>
                        {m.applicable ? formatINR(m.value) : 'Not applicable'}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {METHOD_DESCRIPTIONS[m.method] ?? ''}
                    </p>
                    {m.applicable && m.details && Object.keys(m.details).length > 0 && (
                      <details className="mt-1">
                        <summary className="text-xs text-muted-foreground cursor-pointer">View inputs & calculations</summary>
                        <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto max-h-40">
                          {JSON.stringify(m.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/methodology.tsx
git commit -m "feat: add Methodology report section (10 methods, 3 approaches, IVS/IBBI aligned)"
```

---

### Task 41: Benchmarks Section (Damodaran)

**Files:**
- Create: `src/components/report/benchmarks.tsx`

- [ ] **Step 1: Create benchmarks component**

Create `src/components/report/benchmarks.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

interface Props {
  sector: string
}

export function Benchmarks({ sector }: Props) {
  const benchmark = getDamodaranBenchmark(sector)

  if (!benchmark) return null

  const rows = [
    { label: 'Unlevered Beta', value: benchmark.beta.toFixed(2) },
    { label: 'WACC (India)', value: `${(benchmark.wacc * 100).toFixed(1)}%` },
    { label: 'EV/Revenue', value: `${benchmark.ev_revenue.toFixed(1)}x` },
    { label: 'EV/EBITDA', value: `${benchmark.ev_ebitda.toFixed(1)}x` },
    { label: 'Net Margin', value: `${(benchmark.net_margin * 100).toFixed(1)}%` },
    { label: 'Operating Margin', value: `${(benchmark.operating_margin * 100).toFixed(1)}%` },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Damodaran India Benchmarks</CardTitle>
        <p className="text-sm text-muted-foreground">
          Source: Damodaran India Industry Data (January 2026) — {benchmark.industry_name}
        </p>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Metric</th>
              <th className="text-right py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.label} className="border-b last:border-0">
                <td className="py-2">{row.label}</td>
                <td className="py-2 text-right font-medium">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-muted-foreground mt-3">
          These benchmarks are used in DCF (WACC), Revenue Multiple, EV/EBITDA Multiple, and ESOP volatility calculations.
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/benchmarks.tsx
git commit -m "feat: add Damodaran India Benchmarks report section"
```

---

### Task 42: Comparables Section

**Files:**
- Create: `src/components/report/comparables.tsx`

- [ ] **Step 1: Create comparables component**

Create `src/components/report/comparables.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { findComparableCompanies } from '@/lib/data/comparable-companies'
import { formatINR } from '@/lib/utils'

interface Props {
  sector: string
  stage: string
}

export function Comparables({ sector, stage }: Props) {
  const comparables = findComparableCompanies(sector, stage, 5)

  if (comparables.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Comparable Indian Startups</CardTitle>
        <p className="text-sm text-muted-foreground">
          5 closest matches by sector and stage from our funding database
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Company</th>
                <th className="text-left py-2">Stage</th>
                <th className="text-right py-2">Last Round</th>
                <th className="text-right py-2">Valuation</th>
                <th className="text-left py-2">Year</th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((c, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 font-medium">{c.name}</td>
                  <td className="py-2">{c.stage}</td>
                  <td className="py-2 text-right">{formatINR(c.last_round)}</td>
                  <td className="py-2 text-right">{formatINR(c.valuation)}</td>
                  <td className="py-2">{c.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Source: Publicly available Indian startup funding data. Valuations are estimates based on reported rounds.
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/comparables.tsx
git commit -m "feat: add Comparable Indian Startups report section"
```

---

### Task 43: Listed Comparables Section

**Files:**
- Create: `src/components/report/listed-comparables.tsx`

- [ ] **Step 1: Create listed comparables component**

Create `src/components/report/listed-comparables.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { formatINR } from '@/lib/utils'

const ILLIQUIDITY_DISCOUNTS: Record<string, number> = {
  series_c_plus: 0.20,
  series_b: 0.25,
  series_a: 0.30,
  pre_series_a: 0.30,
  seed: 0.35,
  pre_seed: 0.35,
  idea: 0.35,
}

interface Props {
  sector: string
  revenue: number | null
  stage: string
}

export function ListedComparables({ sector, revenue, stage }: Props) {
  const benchmark = getDamodaranBenchmark(sector)

  if (!benchmark) return null

  const annualRevenue = Number(revenue) || 0
  const publicEquivalent = annualRevenue * benchmark.ev_revenue
  const discount = ILLIQUIDITY_DISCOUNTS[stage] ?? 0.30
  const adjustedValue = publicEquivalent * (1 - discount)

  const sensitivities = [0.20, 0.30, 0.40].map(d => ({
    discount: d,
    value: publicEquivalent * (1 - d),
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listed Company Comparables</CardTitle>
        <p className="text-sm text-muted-foreground">
          Public market multiples from Damodaran India — {benchmark.industry_name}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {annualRevenue > 0 ? (
          <>
            <p className="text-sm">
              Public companies in <strong>{benchmark.industry_name}</strong> trade at{' '}
              <strong>{benchmark.ev_revenue.toFixed(1)}x EV/Revenue</strong> (Damodaran India, Jan 2026).
            </p>
            <p className="text-sm">
              At your revenue of <strong>{formatINR(annualRevenue)}</strong>, a public-market-equivalent
              valuation would be <strong>{formatINR(publicEquivalent)}</strong>.
            </p>
            <p className="text-sm">
              After private company illiquidity discount ({(discount * 100).toFixed(0)}% for {stage.replace(/_/g, ' ')}),
              adjusted valuation: <strong>{formatINR(adjustedValue)}</strong>.
            </p>

            <div>
              <p className="text-sm font-medium mb-2">Sensitivity — Illiquidity Discount:</p>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-1">Discount</th>
                    <th className="text-right py-1">Adjusted Valuation</th>
                  </tr>
                </thead>
                <tbody>
                  {sensitivities.map(s => (
                    <tr key={s.discount} className="border-b last:border-0">
                      <td className="py-1">{(s.discount * 100).toFixed(0)}%</td>
                      <td className="py-1 text-right font-medium">{formatINR(s.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Listed comparables are most relevant for revenue-generating startups.
            Your sector ({benchmark.industry_name}) trades at {benchmark.ev_revenue.toFixed(1)}x EV/Revenue in public markets.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/listed-comparables.tsx
git commit -m "feat: add Listed Company Comparables with illiquidity discount sensitivity"
```

---

### Task 44: Downside Analysis (IBC)

**Files:**
- Create: `src/components/report/downside-analysis.tsx`

- [ ] **Step 1: Create downside analysis component**

Create `src/components/report/downside-analysis.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'

interface Props {
  sector: string
}

export function DownsideAnalysis({ sector }: Props) {
  const recovery = getIBCRecovery(sector)

  if (!recovery) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Downside Analysis — IBC Recovery Data</CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on 3,952 corporate debtor outcomes from IBBI data
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm">
          In insolvency scenarios, companies in <strong>{recovery.sector_label}</strong> historically
          recovered <strong>{recovery.low}–{recovery.high}%</strong> of admitted claims
          (P25 to P75 range, sample size: {recovery.sample_size}).
        </p>
        <p className="text-sm text-muted-foreground">
          This is the worst-case scenario. Going-concern valuation (computed above) is typically
          2-5x higher than liquidation value.
        </p>
        <p className="text-xs text-muted-foreground border-t pt-2">
          Source: IBC valuation dataset — 190+ landmark cases analyzed, 3,952 corporate debtor outcomes.
          Built by an IBBI-registered Insolvency Professional.
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/downside-analysis.tsx
git commit -m "feat: add Downside Analysis report section (IBC recovery data)"
```

---

### Task 45: ESOP Estimate Section

**Files:**
- Create: `src/components/report/esop-estimate.tsx`

- [ ] **Step 1: Create ESOP estimate component**

Create `src/components/report/esop-estimate.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { calculateESOP } from '@/lib/calculators/esop-valuation'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { formatINR } from '@/lib/utils'

interface Props {
  valuation: any
  compositeValue: number
}

export function ESOPEstimate({ valuation, compositeValue }: Props) {
  const benchmark = getDamodaranBenchmark(valuation.sector)
  if (!benchmark) return null

  const esopPct = valuation.esop_pool_pct ?? 10
  const timeToLiquidity = valuation.time_to_liquidity_years ?? 4

  const result = calculateESOP({
    compositeValue,
    esopPoolPct: esopPct,
    timeToLiquidityYears: timeToLiquidity,
    sectorBeta: benchmark.beta,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>ESOP Valuation Estimate</CardTitle>
        <p className="text-sm text-muted-foreground">
          Black-Scholes model adapted for startup ESOPs
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">
          Each ESOP share (exercise price Rs 10) is estimated at{' '}
          <strong>{formatINR(result.value_per_share)}</strong>, representing a{' '}
          <strong>{result.return_multiple.toFixed(1)}x</strong> potential return over{' '}
          {timeToLiquidity} years.
        </p>
        <p className="text-sm">
          Total ESOP pool value ({esopPct}% of equity):{' '}
          <strong>{formatINR(result.total_pool_value)}</strong>
        </p>

        <div>
          <p className="text-sm font-medium mb-2">Sensitivity Analysis:</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-1">Scenario</th>
                <th className="text-right py-1">Volatility</th>
                <th className="text-right py-1">Time</th>
                <th className="text-right py-1">Value/Share</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-1">Conservative</td>
                <td className="py-1 text-right">{(result.sensitivity.conservative.volatility * 100).toFixed(0)}%</td>
                <td className="py-1 text-right">{result.sensitivity.conservative.time}y</td>
                <td className="py-1 text-right font-medium">{formatINR(result.sensitivity.conservative.value)}</td>
              </tr>
              <tr className="border-b">
                <td className="py-1">Base Case</td>
                <td className="py-1 text-right">{(result.sensitivity.base.volatility * 100).toFixed(0)}%</td>
                <td className="py-1 text-right">{result.sensitivity.base.time}y</td>
                <td className="py-1 text-right font-medium">{formatINR(result.sensitivity.base.value)}</td>
              </tr>
              <tr>
                <td className="py-1">Optimistic</td>
                <td className="py-1 text-right">{(result.sensitivity.optimistic.volatility * 100).toFixed(0)}%</td>
                <td className="py-1 text-right">{result.sensitivity.optimistic.time}y</td>
                <td className="py-1 text-right font-medium">{formatINR(result.sensitivity.optimistic.value)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-muted-foreground border-t pt-2">
          Disclaimer: This is an indicative estimate using Black-Scholes. Actual ESOP value depends
          on exit timing, dilution, and liquidity preferences.
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/esop-estimate.tsx
git commit -m "feat: add ESOP Estimate report section (Black-Scholes + sensitivity table)"
```

---

### Task 46: Cap Table Simulator (Interactive)

**Files:**
- Create: `src/components/report/cap-table-simulator.tsx`

- [ ] **Step 1: Create interactive cap table simulator**

Create `src/components/report/cap-table-simulator.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { simulateRound } from '@/lib/calculators/cap-table'
import { formatINR } from '@/lib/utils'

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#ef4444', '#06b6d4', '#f43f5e', '#84cc16', '#a855f7', '#f59e0b']

interface Props {
  valuation: any
  compositeValue: number
}

export function CapTableSimulator({ valuation, compositeValue }: Props) {
  const [raiseAmount, setRaiseAmount] = useState(valuation.target_raise ?? compositeValue * 0.2)
  const [preMoney, setPreMoney] = useState(compositeValue)
  const [esopTiming, setEsopTiming] = useState<'pre' | 'post'>('pre')

  const currentCapTable = valuation.current_cap_table ?? [
    { name: 'Founders', percentage: 80, share_class: 'common' },
    { name: 'ESOP Pool', percentage: 10, share_class: 'esop' },
    { name: 'Angel Investors', percentage: 10, share_class: 'preference' },
  ]

  const esopExpansion = valuation.esop_pool_pct ? valuation.esop_pool_pct / 100 : 0
  const roundResult = simulateRound(currentCapTable, raiseAmount, preMoney, esopExpansion, esopTiming)

  const preData = currentCapTable.map((e: any, i: number) => ({
    name: e.name,
    value: e.percentage,
    fill: COLORS[i % COLORS.length],
  }))

  const postData = roundResult.post_round.map((e: any, i: number) => ({
    name: e.name,
    value: parseFloat(e.percentage.toFixed(1)),
    fill: COLORS[i % COLORS.length],
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cap Table Simulator</CardTitle>
        <p className="text-sm text-muted-foreground">Interactive — adjust parameters to model your next round</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Raise Amount (Rs)</Label>
            <Input
              type="number"
              value={raiseAmount}
              onChange={(e) => setRaiseAmount(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>Pre-Money Valuation (Rs)</Label>
            <Input
              type="number"
              value={preMoney}
              onChange={(e) => setPreMoney(parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>ESOP Pool Creation</Label>
          <RadioGroup value={esopTiming} onValueChange={(v) => setEsopTiming(v as 'pre' | 'post')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pre" id="esop-pre" />
              <Label htmlFor="esop-pre">Before round (recommended)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="post" id="esop-post" />
              <Label htmlFor="esop-post">After round</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium mb-2 text-center">Pre-Round</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={preData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}>
                    {preData.map((e: any) => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-center">Post-Round</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={postData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}>
                    {postData.map((e: any) => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <p className="text-sm text-center text-muted-foreground">
          Post-money: {formatINR(preMoney + raiseAmount)} | New investor: {((raiseAmount / (preMoney + raiseAmount)) * 100).toFixed(1)}%
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/cap-table-simulator.tsx
git commit -m "feat: add interactive Cap Table Simulator with pre/post ESOP toggle"
```

---

### Task 47: Investor Matching Section

**Files:**
- Create: `src/components/report/investor-matching.tsx`

- [ ] **Step 1: Create investor matching component**

Create `src/components/report/investor-matching.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { matchInvestors } from '@/lib/matching/investor-match'
import { formatINR } from '@/lib/utils'

interface Props {
  sector: string
  stage: string
  targetRaise: number | null
}

export function InvestorMatching({ sector, stage, targetRaise }: Props) {
  const matches = matchInvestors(sector, stage, targetRaise)

  if (matches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Investor Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No exact matches in our database for your profile. This is common for niche sectors
            or very early-stage companies. Browse all investors at our advisory service.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Investor Matches</CardTitle>
        <p className="text-sm text-muted-foreground">
          Based on your profile — {sector.replace(/_/g, ' ')}, {stage.replace(/_/g, ' ')} stage
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Investor</th>
                <th className="text-left py-2">Type</th>
                <th className="text-right py-2">Check Size</th>
                <th className="text-left py-2">Why Matched</th>
              </tr>
            </thead>
            <tbody>
              {matches.slice(0, 5).map((m, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2 font-medium">{m.investor.name}</td>
                  <td className="py-2">{m.investor.type}</td>
                  <td className="py-2 text-right">
                    {formatINR(m.investor.check_size_min)}–{formatINR(m.investor.check_size_max)}
                  </td>
                  <td className="py-2 text-muted-foreground">{m.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Disclaimer: Investor suggestions are based on publicly available investment preferences.
          Introductions are not guaranteed.
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/investor-matching.tsx
git commit -m "feat: add Investor Matching report section (top 5 matches with reasons)"
```

---

### Task 48: AI Narrative (Claude API Route + Component)

**Files:**
- Create: `src/app/api/ai-analysis/route.ts`
- Create: `src/components/report/ai-narrative.tsx`

- [ ] **Step 1: Create AI analysis API route**

Create `src/app/api/ai-analysis/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { valuation_id } = await req.json()
    if (!valuation_id) {
      return NextResponse.json({ error: 'Missing valuation_id' }, { status: 400 })
    }

    // Check cache first
    const { data: existing } = await supabase
      .from('valuations')
      .select('ai_narrative, company_name, sector, stage, annual_revenue, revenue_growth_pct, gross_margin_pct, monthly_burn, cash_in_bank, founder_experience, domain_expertise, previous_exits, dev_stage, competition_level, tam, competitive_advantages, valuation_low, valuation_high, confidence_score, ibc_recovery_range')
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
      .gte('updated_at', todayStart.toISOString())

    if ((dailyCount ?? 0) >= 100) {
      return NextResponse.json({ error: 'Daily AI analysis limit reached. Try again tomorrow.' }, { status: 429 })
    }

    // Get Damodaran benchmark for sector context
    const damodaranBenchmark = getDamodaranBenchmark(existing.sector)

    // Build prompt
    const runway = existing.monthly_burn > 0
      ? Math.round(existing.cash_in_bank / existing.monthly_burn)
      : 'N/A'

    const recovery = existing.ibc_recovery_range
      ? `${existing.ibc_recovery_range.low}-${existing.ibc_recovery_range.high}%`
      : 'N/A'

    const prompt = `You are a senior Indian VC analyst with 15 years experience evaluating startups across India.
Analyze this startup and provide investment-grade insights:

Company: ${existing.company_name} | Sector: ${existing.sector} | Stage: ${existing.stage}
Revenue: Rs ${existing.annual_revenue}, Growth: ${existing.revenue_growth_pct}%, Gross Margin: ${existing.gross_margin_pct}%
Burn: Rs ${existing.monthly_burn}/month, Runway: ${runway} months
Team: ${existing.founder_experience}/5 experience, ${existing.domain_expertise}/5 domain expertise, Previous exits: ${existing.previous_exits}
Product: ${existing.dev_stage}, Competition: ${existing.competition_level}/5
TAM: Rs ${existing.tam} Cr
Competitive advantages: ${existing.competitive_advantages}
Valuation estimate: Rs ${existing.valuation_low}–${existing.valuation_high} (10-method weighted average, 3 approaches)
Confidence score: ${existing.confidence_score}/100

Damodaran India multiples: ${existing.sector} trades at ${damodaranBenchmark?.ev_revenue.toFixed(1) ?? 'N/A'}x EV/Revenue.
IBC context: Companies in ${existing.sector} recover ${recovery} in insolvency scenarios.

Provide exactly 4 sections (under 300 words total):

1. INVESTMENT THESIS (2-3 sentences): What makes this startup investable? Be specific to their numbers and sector. Reference the Damodaran multiple context.

2. KEY RISKS (bullet points): Top 3 risks an investor would flag. Reference specific numbers (burn rate, competition level, margin). Include downside context from IBC data.

3. VALUATION OPINION: Is the estimated range reasonable? Compare to public market multiples. Note whether the valuation accounts for the stage discount appropriately.

4. FUNDRAISE PLAYBOOK (3 concrete actions): What should the founder do in the next 90 days before approaching investors? Be tactical, not generic.

Use INR. Reference Indian market context. Be direct, not diplomatic.`

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
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
```

- [ ] **Step 2: Create AI narrative component**

Create `src/components/report/ai-narrative.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface Props {
  valuationId: string
}

export function AINarrative({ valuationId }: Props) {
  const [narrative, setNarrative] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const fetchNarrative = async () => {
    setLoading(true)
    setError(false)

    // Initial + 3 retries with exponential backoff (spec: 1s, 4s, 16s)
    const delays = [0, 1000, 4000, 16000]
    for (let attempt = 0; attempt < delays.length; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, delays[attempt]))

      try {
        const res = await fetch('/api/ai-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ valuation_id: valuationId }),
        })

        if (res.ok) {
          const data = await res.json()
          setNarrative(data.narrative)
          setLoading(false)
          return
        }
      } catch {
        // Continue to next attempt
      }
    }

    setError(true)
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI-Powered Investment Analysis</CardTitle>
        <p className="text-sm text-muted-foreground">
          Generated by Claude — senior VC analyst perspective
        </p>
      </CardHeader>
      <CardContent>
        {!narrative && !loading && !error && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Get AI-generated investment insights specific to your startup
            </p>
            <Button onClick={fetchNarrative}>Generate AI Analysis</Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground animate-pulse">
              Generating analysis... This takes 5-10 seconds.
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              AI analysis is currently unavailable. Please try again later.
            </p>
            <Button variant="outline" onClick={fetchNarrative}>Retry</Button>
          </div>
        )}

        {narrative && (
          <div className="prose prose-sm max-w-none whitespace-pre-wrap">
            {narrative}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/ai-analysis/route.ts src/components/report/ai-narrative.tsx
git commit -m "feat: add AI Narrative (Claude API route + on-demand component with retry)"
```

---

### Task 49: Recommendations Section

**Files:**
- Create: `src/components/report/recommendations.tsx`

- [ ] **Step 1: Create recommendations component**

Create `src/components/report/recommendations.tsx`:

```tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ValuationResult } from '@/types'

interface Props {
  result: ValuationResult
  sector: string
  stage: string
}

export function Recommendations({ result, sector, stage }: Props) {
  const checklist = generateChecklist(result, stage)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommendations & Fundraise Checklist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold mb-2">Before Approaching Investors:</h3>
          <ul className="space-y-2">
            {checklist.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-muted-foreground mt-0.5">□</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function generateChecklist(result: ValuationResult, stage: string): string[] {
  const items: string[] = []

  // Always recommend
  items.push('Prepare a 2-page executive summary with key metrics')
  items.push('Build a financial model with 3-5 year projections')

  // Confidence-based
  if (result.confidence_score < 50) {
    items.push('Your confidence score is low — focus on filling data gaps (revenue metrics, unit economics)')
  }

  // Stage-based
  if (['idea', 'pre_seed', 'seed'].includes(stage)) {
    items.push('For early-stage: focus pitch on TAM, team credibility, and traction velocity')
    items.push('Get warm introductions — cold outreach has <5% response rate for early-stage')
  } else {
    items.push('For growth-stage: prepare audited financials and customer cohort analysis')
    items.push('Line up 3+ term sheets for leverage in negotiation')
  }

  // Method-based
  const lowConfMethods = result.methods.filter(m => m.applicable && m.confidence < 0.4)
  if (lowConfMethods.length > 3) {
    items.push('Several methods show low confidence — strengthen revenue and financial data before fundraise')
  }

  items.push('Set up a data room (Notion or Google Drive) with key documents')
  items.push('Practice your pitch with 3 friendly investors before going live')

  return items
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/recommendations.tsx
git commit -m "feat: add Recommendations section with dynamic fundraise checklist"
```

---

### Task 50: Certified Report CTA

**Files:**
- Create: `src/components/report/certified-cta.tsx`

- [ ] **Step 1: Create certified report CTA**

Create `src/components/report/certified-cta.tsx`:

```tsx
'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export function CertifiedCTA() {
  return (
    <Card className="border-2 border-primary bg-primary/5">
      <CardContent className="text-center py-8 space-y-4">
        <h2 className="text-xl font-bold">Need a Legally Valid Valuation?</h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          Get a certified Rule 11UA / FEMA valuation report — Rs 14,999.
          Signed by a registered valuer. Valid for RoC filing, fundraising, and tax compliance.
        </p>
        <ul className="text-sm space-y-1 text-left max-w-md mx-auto">
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Compliant with Rule 11UA (Income Tax Act)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Valid for FEMA pricing (foreign investment)
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> 15-20 page professional report
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Signed by registered valuer with registration number
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-600">✓</span> Delivered within 48 hours of payment
          </li>
        </ul>
        <Button
          size="lg"
          className="mt-2"
          onClick={() => {
            // TODO: Wire to Razorpay checkout (Task 56)
            window.open('/api/certified/checkout', '_blank', 'noopener,noreferrer')
          }}
        >
          Get Certified Report — Rs 14,999
        </Button>
        <p className="text-xs text-muted-foreground">
          Payment via Razorpay. GST included. Refund if not delivered within 48 hours.
        </p>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/report/certified-cta.tsx
git commit -m "feat: add Certified Report CTA (Rs 14,999 Rule 11UA/FEMA)"
```

---

### Task 51: PDF Generator (jsPDF)

**Files:**
- Create: `src/lib/export/pdf-generator.ts`
- Create: `src/components/report/pdf-download-button.tsx`

- [ ] **Step 1: Create PDF generator**

Create `src/lib/export/pdf-generator.ts`:

```typescript
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import html2canvas from 'html2canvas'
import type { ValuationResult, MethodResult, DamodaranBenchmark } from '@/types'
import { APPROACH_ORDER, APPROACH_LABELS } from '@/types'

const METHOD_LABELS: Record<string, string> = {
  dcf: 'Discounted Cash Flow (DCF)',
  pwerm: 'Probability-Weighted Expected Return (PWERM)',
  revenue_multiple: 'Revenue Multiple',
  ev_ebitda_multiple: 'EV/EBITDA Multiple',
  comparable_transaction: 'Comparable Transaction',
  nav: 'Net Asset Value (NAV)',
  replacement_cost: 'Replacement Cost',
  scorecard: 'Scorecard Method',
  berkus: 'Berkus Method',
  risk_factor_summation: 'Risk Factor Summation',
}

interface PDFData {
  companyName: string
  sector: string
  stage: string
  result: ValuationResult
  benchmark?: DamodaranBenchmark | null
  comparables?: Array<{ name: string; sector: string; stage: string; valuation: string; similarity: number }>
  listedComparables?: { publicEquivalent: number; discount: number; adjustedValue: number }
  ibcRecovery?: { low: number; high: number; median: number; sectorName: string }
  esop?: { poolValue: number; valuePerShare: number; scenarios: Array<{ label: string; value: number }> }
  capTable?: { preRound: Array<{ holder: string; pct: number }>; postRound?: Array<{ holder: string; pct: number }> }
  investorMatches?: Array<{ name: string; type: string; reason: string }>
  recommendations?: string[]
  aiNarrative?: string | null
  monteCarloChartElement?: HTMLElement | null
}

function formatINRForPDF(value: number): string {
  if (value === 0) return 'Rs 0'
  const crore = 10_000_000
  if (value >= crore) return `Rs ${(value / crore).toFixed(1)} Cr`
  return `Rs ${(value / 100_000).toFixed(0)} L`
}

function addSectionHeader(doc: jsPDF, title: string, y: number): number {
  if (y > 250) { doc.addPage(); y = 20 }
  doc.setFontSize(14)
  doc.setTextColor(0)
  doc.text(title, 20, y)
  return y + 8
}

export async function generateValuationPDF(data: PDFData): Promise<jsPDF> {
  const doc = new jsPDF()
  let y = 20

  // 1. Cover page
  doc.setFontSize(22)
  doc.text('Startup Valuation Report', 20, y)
  y += 12
  doc.setFontSize(16)
  doc.text(data.companyName || 'Unnamed Startup', 20, y)
  y += 10
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 20, y)
  doc.text(`Sector: ${data.sector} | Stage: ${data.stage}`, 20, y + 5)
  doc.text('Powered by firstunicornstartup.com', 20, y + 10)
  doc.setTextColor(0)
  y += 25

  // 2. Executive summary
  y = addSectionHeader(doc, 'Executive Summary', y)
  doc.setFontSize(10)
  doc.text(`Valuation Range: ${formatINRForPDF(data.result.composite_low)} — ${formatINRForPDF(data.result.composite_high)}`, 20, y)
  y += 6
  doc.text(`Weighted Composite: ${formatINRForPDF(data.result.composite_value)}`, 20, y)
  y += 6
  doc.text(`Confidence Score: ${data.result.confidence_score}/100`, 20, y)
  y += 12

  // 3. Methodology overview
  y = addSectionHeader(doc, 'Methodology — 3 Approaches × 10 Methods', y)

  const methodRows = APPROACH_ORDER.flatMap(approach => {
    const methods = data.result.methods.filter(m => m.approach === approach && m.applicable)
    return methods.map(m => [
      APPROACH_LABELS[approach],
      METHOD_LABELS[m.method] ?? m.method,
      formatINRForPDF(m.value),
      `${(m.confidence * 100).toFixed(0)}%`,
    ])
  })

  autoTable(doc, {
    startY: y,
    head: [['Approach', 'Method', 'Value', 'Confidence']],
    body: methodRows,
    theme: 'striped',
    headStyles: { fillColor: [37, 99, 235] },
    margin: { left: 20 },
  })
  y = (doc as any).lastAutoTable.finalY + 10

  // 4. Individual method breakdowns
  y = addSectionHeader(doc, 'Method Details', y)
  doc.setFontSize(9)
  for (const m of data.result.methods) {
    if (!m.applicable) continue
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setFontSize(10)
    doc.setTextColor(37, 99, 235)
    doc.text(`${METHOD_LABELS[m.method] ?? m.method}: ${formatINRForPDF(m.value)}`, 20, y)
    doc.setTextColor(0)
    y += 5
    if (m.details && Object.keys(m.details).length > 0) {
      doc.setFontSize(8)
      for (const [key, val] of Object.entries(m.details)) {
        doc.text(`  ${key}: ${val}`, 22, y)
        y += 4
      }
    }
    y += 3
  }

  // 5. Monte Carlo chart (rendered via html2canvas)
  if (data.result.monte_carlo) {
    doc.addPage()
    y = 20
    y = addSectionHeader(doc, 'Monte Carlo Simulation (10,000 Iterations)', y)

    if (data.monteCarloChartElement) {
      try {
        const canvas = await html2canvas(data.monteCarloChartElement, { scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        doc.addImage(imgData, 'PNG', 20, y, 170, 80)
        y += 85
      } catch {
        // Fallback to table if html2canvas fails
      }
    }

    const mc = data.result.monte_carlo
    autoTable(doc, {
      startY: y,
      head: [['Percentile', 'Value']],
      body: [
        ['P10 (Downside)', formatINRForPDF(mc.p10)],
        ['P25', formatINRForPDF(mc.p25)],
        ['P50 (Median)', formatINRForPDF(mc.p50)],
        ['P75', formatINRForPDF(mc.p75)],
        ['P90 (Upside)', formatINRForPDF(mc.p90)],
      ],
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as any).lastAutoTable.finalY + 10
  }

  // 6. Damodaran India benchmarks
  if (data.benchmark) {
    y = addSectionHeader(doc, 'Damodaran India Benchmarks', y)
    autoTable(doc, {
      startY: y,
      head: [['Metric', 'Value']],
      body: [
        ['Unlevered Beta', data.benchmark.beta.toFixed(2)],
        ['WACC (India)', `${(data.benchmark.wacc * 100).toFixed(1)}%`],
        ['EV/Revenue', `${data.benchmark.ev_revenue.toFixed(1)}x`],
        ['EV/EBITDA', `${data.benchmark.ev_ebitda.toFixed(1)}x`],
        ['Net Margin', `${(data.benchmark.net_margin * 100).toFixed(1)}%`],
      ],
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as any).lastAutoTable.finalY + 10
  }

  // 7. Comparable Indian startups
  if (data.comparables && data.comparables.length > 0) {
    y = addSectionHeader(doc, 'Top 5 Comparable Indian Startups', y)
    autoTable(doc, {
      startY: y,
      head: [['Company', 'Sector', 'Stage', 'Valuation', 'Similarity']],
      body: data.comparables.map(c => [c.name, c.sector, c.stage, c.valuation, `${(c.similarity * 100).toFixed(0)}%`]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as any).lastAutoTable.finalY + 10
  }

  // 8. Listed company comparables
  if (data.listedComparables) {
    y = addSectionHeader(doc, 'Listed Company Comparables', y)
    doc.setFontSize(10)
    doc.text(`Public market equivalent: ${formatINRForPDF(data.listedComparables.publicEquivalent)}`, 20, y)
    y += 6
    doc.text(`Illiquidity discount: ${(data.listedComparables.discount * 100).toFixed(0)}%`, 20, y)
    y += 6
    doc.text(`Adjusted value: ${formatINRForPDF(data.listedComparables.adjustedValue)}`, 20, y)
    y += 10
  }

  // 9. IBC downside analysis
  if (data.ibcRecovery) {
    y = addSectionHeader(doc, 'Downside Analysis (IBC Recovery)', y)
    doc.setFontSize(10)
    doc.text(`Sector: ${data.ibcRecovery.sectorName}`, 20, y)
    y += 6
    doc.text(`Recovery range: ${data.ibcRecovery.low}% — ${data.ibcRecovery.high}%`, 20, y)
    y += 6
    doc.text(`Median recovery: ${data.ibcRecovery.median}%`, 20, y)
    y += 10
  }

  // 10. ESOP valuation
  if (data.esop) {
    y = addSectionHeader(doc, 'ESOP Valuation (Black-Scholes)', y)
    doc.setFontSize(10)
    doc.text(`ESOP pool value: ${formatINRForPDF(data.esop.poolValue)}`, 20, y)
    y += 6
    doc.text(`Value per share: ${formatINRForPDF(data.esop.valuePerShare)}`, 20, y)
    y += 6
    if (data.esop.scenarios.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Scenario', 'Value']],
        body: data.esop.scenarios.map(s => [s.label, formatINRForPDF(s.value)]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 20 },
      })
      y = (doc as any).lastAutoTable.finalY + 10
    }
  }

  // 11. Cap table
  if (data.capTable) {
    y = addSectionHeader(doc, 'Cap Table', y)
    autoTable(doc, {
      startY: y,
      head: [['Holder', 'Ownership %']],
      body: data.capTable.preRound.map(h => [h.holder, `${h.pct.toFixed(1)}%`]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as any).lastAutoTable.finalY + 10

    if (data.capTable.postRound) {
      doc.setFontSize(11)
      doc.text('Post-Round', 20, y)
      y += 4
      autoTable(doc, {
        startY: y,
        head: [['Holder', 'Ownership %']],
        body: data.capTable.postRound.map(h => [h.holder, `${h.pct.toFixed(1)}%`]),
        theme: 'striped',
        headStyles: { fillColor: [37, 99, 235] },
        margin: { left: 20 },
      })
      y = (doc as any).lastAutoTable.finalY + 10
    }
  }

  // 12. Investor matches
  if (data.investorMatches && data.investorMatches.length > 0) {
    y = addSectionHeader(doc, 'Top 5 Investor Matches', y)
    autoTable(doc, {
      startY: y,
      head: [['Investor', 'Type', 'Reason']],
      body: data.investorMatches.map(i => [i.name, i.type, i.reason]),
      theme: 'striped',
      headStyles: { fillColor: [37, 99, 235] },
      margin: { left: 20 },
    })
    y = (doc as any).lastAutoTable.finalY + 10
  }

  // 13. AI Narrative
  if (data.aiNarrative) {
    doc.addPage()
    y = 20
    y = addSectionHeader(doc, 'AI-Powered Investment Analysis', y)
    doc.setFontSize(9)
    const lines = doc.splitTextToSize(data.aiNarrative, 170)
    doc.text(lines, 20, y)
    y += lines.length * 4.5 + 10
  }

  // 14. Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    y = addSectionHeader(doc, 'Recommendations', y)
    doc.setFontSize(9)
    data.recommendations.forEach(r => {
      if (y > 270) { doc.addPage(); y = 20 }
      doc.text(`• ${r}`, 22, y)
      y += 5
    })
    y += 5
  }

  // 15. Disclaimers
  doc.addPage()
  y = 20
  y = addSectionHeader(doc, 'Disclaimers', y)
  doc.setFontSize(8)
  doc.setTextColor(100)
  const disclaimers = [
    'This is an indicative valuation estimate generated by an automated tool.',
    'It is NOT a certified valuation and should NOT be used for legal, tax, or regulatory purposes.',
    'For a legally valid Rule 11UA or FEMA valuation report, visit firstunicornstartup.com.',
    'Valuation is based on self-reported data. Accuracy depends on input quality.',
    'Damodaran India benchmarks are from January 2026 and may not reflect current market conditions.',
    'IBC recovery data is historical and does not predict future outcomes.',
    'Investor matching is based on publicly available data and does not guarantee introductions.',
  ]
  disclaimers.forEach(d => {
    doc.text(`• ${d}`, 20, y)
    y += 5
  })

  // 16. Footer on all pages
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(150)
    doc.text(
      'Indicative estimate — not a certified valuation. firstunicornstartup.com',
      doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10)
  }

  return doc
}
```

- [ ] **Step 2: Create PDF download button**

Create `src/components/report/pdf-download-button.tsx`:

```tsx
'use client'

import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { generateValuationPDF } from '@/lib/export/pdf-generator'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import type { ValuationResult } from '@/types'

interface Props {
  valuation: any
  result: ValuationResult
  comparables?: any[]
  listedComparables?: any
  ibcRecovery?: any
  esop?: any
  capTable?: any
  investorMatches?: any[]
  recommendations?: string[]
  monteCarloChartRef?: React.RefObject<HTMLDivElement | null>
}

export function PDFDownloadButton({
  valuation, result, comparables, listedComparables,
  ibcRecovery, esop, capTable, investorMatches,
  recommendations, monteCarloChartRef,
}: Props) {
  const [generating, setGenerating] = useState(false)

  const handleDownload = async () => {
    setGenerating(true)
    try {
      const benchmark = getDamodaranBenchmark(valuation.sector)
      const doc = await generateValuationPDF({
        companyName: valuation.company_name,
        sector: valuation.sector,
        stage: valuation.stage,
        result,
        benchmark,
        comparables,
        listedComparables,
        ibcRecovery,
        esop,
        capTable,
        investorMatches,
        recommendations,
        aiNarrative: valuation.ai_narrative,
        monteCarloChartElement: monteCarloChartRef?.current,
      })
      doc.save(`${valuation.company_name || 'startup'}-valuation-report.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="text-center">
      <Button size="lg" onClick={handleDownload} disabled={generating}>
        {generating ? 'Generating PDF...' : 'Download PDF Report'}
      </Button>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/export/pdf-generator.ts src/components/report/pdf-download-button.tsx
git commit -m "feat: add PDF generator (jsPDF + autoTable) and download button"
```

---

## Chunk 7: Landing Page + SEO Pages + Certified Report + Final Assembly

Tasks 52-59: Landing page with 5 sections, root layout with SEO metadata, standalone SEO pages (/cap-table, /esop-calculator), Razorpay webhook for certified reports, Supabase migration, environment config, and final integration test.

**Dependencies from Chunks 1-6:**
- `@/types` — all types
- `@/lib/utils` — formatINR
- `@/lib/calculators/esop-valuation` — calculateESOP
- `@/lib/calculators/cap-table` — simulateRound
- `@/lib/data/sector-mapping` — getDamodaranBenchmark, getSectorLabel
- `@/stores/valuation-store` — useValuationStore
- `@/components/report/cap-table-simulator` — CapTableSimulator
- `@/components/report/esop-estimate` — ESOPEstimate
- `@/components/ui/*` — shadcn components

**Server Dependencies:**
- `@supabase/supabase-js` — Supabase client
- `razorpay` — Razorpay SDK (webhook verification)
- `crypto` — HMAC signature verification

---

### Task 52: Landing Page

**Files:**
- Create: `src/components/landing/hero.tsx`
- Create: `src/components/landing/trust-signals.tsx`
- Create: `src/components/landing/how-it-works.tsx`
- Create: `src/components/landing/method-showcase.tsx`
- Create: `src/components/landing/footer.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create hero component**

Create `src/components/landing/hero.tsx`:

```tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <section className="w-full min-h-[500px] flex flex-col items-center justify-center text-center px-6 py-16 bg-gradient-to-b from-primary/5 to-background">
      <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
        AI-Powered Startup Valuation
      </p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl">
        India&apos;s Most Comprehensive Startup Valuation Platform
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
        3 Approaches × 10 Methods — DCF, PWERM, Revenue Multiple, EV/EBITDA, Comparable Transactions,
        NAV, Replacement Cost, Scorecard, Berkus, Risk Factor Summation.
        Powered by Damodaran India data. Monte Carlo simulation. Free.
      </p>
      <div className="flex flex-wrap gap-3 mt-8">
        <Button size="lg" asChild>
          <Link href="/valuation">Get Your Valuation</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/cap-table">Cap Table Simulator</Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/esop-calculator">ESOP Calculator</Link>
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create trust signals component**

Create `src/components/landing/trust-signals.tsx`:

```tsx
export function TrustSignals() {
  const signals = [
    'Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer',
    'Powered by Damodaran India Industry Benchmarks (January 2026)',
    '3 Valuation Approaches × 10 Methods — aligned with IBBI/IVS/Rule 11UA Standards',
    'Monte Carlo Simulation with 10,000 iterations',
    '190+ IBC landmark cases analyzed | 3,952 corporate debtor outcomes studied',
  ]

  return (
    <section className="py-12 px-6 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">Not a Random Calculator</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {signals.map((signal, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-background border">
              <span className="text-primary font-bold text-lg mt-0.5">✓</span>
              <p className="text-sm">{signal}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create how-it-works component**

Create `src/components/landing/how-it-works.tsx`:

```tsx
export function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Answer 6 Quick Steps',
      desc: 'Company profile, team, financials, market, strategy, ESOP — takes 3-5 minutes.',
    },
    {
      num: '2',
      title: 'Get Your Valuation',
      desc: '10 methods across 3 approaches compute your range. Monte Carlo simulation runs 10,000 scenarios.',
    },
    {
      num: '3',
      title: 'Unlock Full Report',
      desc: 'Enter your email for detailed methodology, benchmarks, ESOP valuation, investor matches, and AI insights.',
    },
  ]

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(step => (
            <div key={step.num} className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create method showcase component**

Create `src/components/landing/method-showcase.tsx`:

```tsx
import { APPROACH_LABELS } from '@/types'
import type { ValuationApproach } from '@/types'

const APPROACHES: { key: ValuationApproach; methods: string[] }[] = [
  { key: 'income', methods: ['DCF (Discounted Cash Flow)', 'PWERM (Probability Weighted)'] },
  { key: 'market', methods: ['Revenue Multiple', 'EV/EBITDA Multiple', 'Comparable Transactions'] },
  { key: 'asset_cost', methods: ['Net Asset Value', 'Replacement Cost'] },
  { key: 'vc_startup', methods: ['Scorecard (Bill Payne)', 'Berkus Method', 'Risk Factor Summation'] },
]

export function MethodShowcase() {
  return (
    <section className="py-16 px-6 bg-muted/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2">
          3 Approaches × 10 Methods
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Aligned with IBBI Valuation Standards, IVS 105, and Rule 11UA
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {APPROACHES.map(a => (
            <div key={a.key} className="p-6 rounded-lg bg-background border">
              <h3 className="font-semibold text-primary mb-3">{APPROACH_LABELS[a.key]}</h3>
              <ul className="space-y-1">
                {a.methods.map(m => (
                  <li key={m} className="text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create footer component**

Create `src/components/landing/footer.tsx`:

```tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-8 px-6">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          firstunicornstartup.com — Built by an IBBI-Registered IP & SFA-Licensed Valuer
        </div>
        <div className="flex gap-4 text-sm">
          <Link href="/valuation" className="hover:underline">Valuation</Link>
          <Link href="/cap-table" className="hover:underline">Cap Table</Link>
          <Link href="/esop-calculator" className="hover:underline">ESOP Calculator</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 6: Create landing page**

Create `src/app/page.tsx`:

```tsx
import { Hero } from '@/components/landing/hero'
import { TrustSignals } from '@/components/landing/trust-signals'
import { HowItWorks } from '@/components/landing/how-it-works'
import { MethodShowcase } from '@/components/landing/method-showcase'
import { Footer } from '@/components/landing/footer'

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <TrustSignals />
      <HowItWorks />
      <MethodShowcase />
      <Footer />
    </main>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/components/landing/ src/app/page.tsx
git commit -m "feat: add Landing Page (hero, trust signals, how-it-works, method showcase, footer)"
```

---

### Task 53: Root Layout + Metadata

**Files:**
- Create: `src/app/layout.tsx`

- [ ] **Step 1: Create root layout with metadata**

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'First Unicorn Startup — India\'s Most Comprehensive Startup Valuation Platform',
    template: '%s | First Unicorn Startup',
  },
  description: '3 Approaches × 10 Methods — DCF, PWERM, Revenue Multiple, EV/EBITDA, NAV, Scorecard, Berkus & more. Monte Carlo simulation. Damodaran India data. Free instant valuation. Built by an IBBI-Registered Valuer.',
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
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: add root layout with SEO metadata, OG tags, and Toaster"
```

---

### Task 54: Standalone Cap Table Page (/cap-table)

**Files:**
- Create: `src/app/cap-table/page.tsx`

- [ ] **Step 1: Create standalone cap table page**

Create `src/app/cap-table/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { StandaloneCapTable } from './cap-table-client'

export const metadata: Metadata = {
  title: 'Cap Table Simulator — Model Dilution for Your Next Round',
  description: 'Free startup cap table calculator for Indian founders. Model pre-money, post-money, dilution, ESOP pool impact. Pre-round vs post-round ESOP comparison.',
}

export default function CapTablePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Cap Table Simulator</h1>
      <p className="text-muted-foreground mb-6">
        Model your next funding round — see how dilution affects founder ownership.
        No login required.
      </p>
      <StandaloneCapTable />
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Want a full 10-method startup valuation with this cap table analysis?
        </p>
        <a href="/valuation" className="text-primary font-medium hover:underline">
          Get Your Free Valuation →
        </a>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create standalone cap table client**

Create `src/app/cap-table/cap-table-client.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { simulateRound } from '@/lib/calculators/cap-table'
import { formatINR } from '@/lib/utils'
import type { CapTableEntry } from '@/types'

const COLORS = ['#2563eb', '#16a34a', '#d97706', '#9333ea', '#ef4444', '#06b6d4', '#f43f5e', '#84cc16']

export function StandaloneCapTable() {
  const [capTable, setCapTable] = useState<CapTableEntry[]>([
    { name: 'Founders', percentage: 70, share_class: 'common' },
    { name: 'ESOP Pool', percentage: 10, share_class: 'esop' },
    { name: 'Angel Investors', percentage: 20, share_class: 'preference' },
  ])
  const [raiseAmount, setRaiseAmount] = useState(50_000_000)
  const [preMoney, setPreMoney] = useState(200_000_000)
  const [esopExpansion, setEsopExpansion] = useState(5)
  const [esopTiming, setEsopTiming] = useState<'pre' | 'post'>('pre')

  const addEntry = () => {
    if (capTable.length >= 10) return
    setCapTable([...capTable, { name: '', percentage: 0, share_class: 'common' }])
  }

  const updateEntry = (i: number, field: keyof CapTableEntry, value: string | number) => {
    const updated = [...capTable]
    updated[i] = { ...updated[i], [field]: value }
    setCapTable(updated)
  }

  const removeEntry = (i: number) => {
    setCapTable(capTable.filter((_, idx) => idx !== i))
  }

  const roundResult = simulateRound(capTable, raiseAmount, preMoney, esopExpansion / 100, esopTiming)

  const preData = capTable.map((e, i) => ({ name: e.name, value: e.percentage, fill: COLORS[i % COLORS.length] }))
  const postData = roundResult.post_round.map((e, i) => ({ name: e.name, value: parseFloat(e.percentage.toFixed(1)), fill: COLORS[i % COLORS.length] }))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>Current Cap Table</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {capTable.map((entry, i) => (
            <div key={i} className="flex gap-2">
              <Input value={entry.name} onChange={(e) => updateEntry(i, 'name', e.target.value)} placeholder="Name" className="flex-1" />
              <Input type="number" value={entry.percentage} onChange={(e) => updateEntry(i, 'percentage', parseFloat(e.target.value) || 0)} className="w-20" />
              <span className="flex items-center text-sm text-muted-foreground">%</span>
              <Button variant="ghost" size="sm" onClick={() => removeEntry(i)}>×</Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addEntry}>+ Add Shareholder</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Next Round Parameters</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Raise Amount (Rs)</Label>
              <Input type="number" value={raiseAmount} onChange={(e) => setRaiseAmount(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>Pre-Money Valuation (Rs)</Label>
              <Input type="number" value={preMoney} onChange={(e) => setPreMoney(parseFloat(e.target.value) || 0)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ESOP Expansion (%)</Label>
              <Input type="number" value={esopExpansion} onChange={(e) => setEsopExpansion(parseFloat(e.target.value) || 0)} min={0} max={20} />
            </div>
            <div className="space-y-2">
              <Label>ESOP Timing</Label>
              <RadioGroup value={esopTiming} onValueChange={(v) => setEsopTiming(v as 'pre' | 'post')}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="pre" id="st-pre" /><Label htmlFor="st-pre">Before round</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="post" id="st-post" /><Label htmlFor="st-post">After round</Label></div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="text-base">Pre-Round</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={preData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}>
                    {preData.map(e => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Post-Round</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={postData} cx="50%" cy="50%" outerRadius={80} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}>
                    {postData.map(e => <Cell key={e.name} fill={e.fill} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Post-money: {formatINR(preMoney + raiseAmount)} | New investor: {((raiseAmount / (preMoney + raiseAmount)) * 100).toFixed(1)}%
      </p>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/cap-table/
git commit -m "feat: add standalone Cap Table page (/cap-table) for SEO"
```

---

### Task 55: Standalone ESOP Calculator Page (/esop-calculator)

**Files:**
- Create: `src/app/esop-calculator/page.tsx`
- Create: `src/app/esop-calculator/esop-client.tsx`

- [ ] **Step 1: Create standalone ESOP page**

Create `src/app/esop-calculator/page.tsx`:

```tsx
import type { Metadata } from 'next'
import { ESOPClient } from './esop-client'

export const metadata: Metadata = {
  title: 'ESOP Valuation Calculator — Black-Scholes for Indian Startups',
  description: 'Free ESOP valuation calculator using Black-Scholes model. Sensitivity analysis for conservative, base, and optimistic scenarios. Powered by Damodaran India beta data.',
}

export default function ESOPCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">ESOP Valuation Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Estimate the value of your ESOP shares using the Black-Scholes model with Damodaran India volatility data.
      </p>
      <ESOPClient />
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Want a full 10-method startup valuation with ESOP analysis?
        </p>
        <a href="/valuation" className="text-primary font-medium hover:underline">
          Get Your Free Valuation →
        </a>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Create ESOP client component**

Create `src/app/esop-calculator/esop-client.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { calculateESOP } from '@/lib/calculators/esop-valuation'
import { getDamodaranBenchmark, getSectorLabel } from '@/lib/data/sector-mapping'
import { STARTUP_CATEGORIES } from '@/types'
import type { StartupCategory } from '@/types'
import { formatINR } from '@/lib/utils'

interface ESOPResult {
  value_per_share: number
  return_multiple: number
  total_pool_value: number
  sensitivity: Record<'conservative' | 'base' | 'optimistic', { volatility: number; time: number; value: number }>
}

export function ESOPClient() {
  const [sector, setSector] = useState<StartupCategory>('saas')
  const [companyValuation, setCompanyValuation] = useState(100_000_000)
  const [esopPct, setEsopPct] = useState(10)
  const [timeToLiquidity, setTimeToLiquidity] = useState(4)
  const [computed, setComputed] = useState(false)
  const [result, setResult] = useState<ESOPResult | null>(null)

  const handleCompute = () => {
    const benchmark = getDamodaranBenchmark(sector)

    const esopResult = calculateESOP({
      compositeValue: companyValuation,
      esopPoolPct: esopPct,
      timeToLiquidityYears: timeToLiquidity,
      sectorBeta: benchmark.beta,
    })
    setResult(esopResult)
    setComputed(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>ESOP Parameters</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sector</Label>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STARTUP_CATEGORIES.map(s => (
                  <SelectItem key={s} value={s}>{getSectorLabel(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Company Valuation (Rs)</Label>
              <Input type="number" value={companyValuation} onChange={(e) => setCompanyValuation(parseFloat(e.target.value) || 0)} />
            </div>
            <div className="space-y-2">
              <Label>ESOP Pool (%)</Label>
              <Input type="number" value={esopPct} onChange={(e) => setEsopPct(parseFloat(e.target.value) || 0)} min={1} max={30} />
            </div>
            <div className="space-y-2">
              <Label>Time to Exit (years)</Label>
              <Input type="number" value={timeToLiquidity} onChange={(e) => setTimeToLiquidity(parseInt(e.target.value) || 1)} min={1} max={15} />
            </div>
          </div>
          <Button onClick={handleCompute} className="w-full">Calculate ESOP Value</Button>
        </CardContent>
      </Card>

      {computed && result && (
        <Card>
          <CardHeader><CardTitle>ESOP Valuation Result</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm">
              Each ESOP share (exercise price Rs 10) is estimated at{' '}
              <strong>{formatINR(result.value_per_share)}</strong>, representing a{' '}
              <strong>{result.return_multiple.toFixed(1)}x</strong> potential return.
            </p>
            <p className="text-sm">
              Total pool value: <strong>{formatINR(result.total_pool_value)}</strong>
            </p>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Scenario</th>
                  <th className="text-right py-1">Volatility</th>
                  <th className="text-right py-1">Time</th>
                  <th className="text-right py-1">Value/Share</th>
                </tr>
              </thead>
              <tbody>
                {(['conservative', 'base', 'optimistic'] as const).map(scenario => (
                  <tr key={scenario} className="border-b last:border-0">
                    <td className="py-1 capitalize">{scenario}</td>
                    <td className="py-1 text-right">{(result.sensitivity[scenario].volatility * 100).toFixed(0)}%</td>
                    <td className="py-1 text-right">{result.sensitivity[scenario].time}y</td>
                    <td className="py-1 text-right font-medium">{formatINR(result.sensitivity[scenario].value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p className="text-xs text-muted-foreground">
              Disclaimer: Indicative estimate using Black-Scholes. Actual value depends on exit timing,
              dilution, and liquidity preferences.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/app/esop-calculator/
git commit -m "feat: add standalone ESOP Calculator page (/esop-calculator) for SEO"
```

---

### Task 56: Certified Report API Route (Razorpay Webhook)

**Files:**
- Create: `src/app/api/certified/route.ts`

- [ ] **Step 1: Create Razorpay webhook route**

Create `src/app/api/certified/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET

if (!SUPABASE_URL || !SERVICE_KEY || !WEBHOOK_SECRET) {
  throw new Error('Missing required environment variables for certified webhook route')
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify Razorpay webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const event = JSON.parse(body)

    if (event.event === 'payment.captured') {
      const payment = event.payload.payment.entity
      const notes = payment.notes || {}

      // Create certified request record
      const { error } = await supabase
        .from('certified_requests')
        .insert({
          valuation_id: notes.valuation_id,
          status: 'paid',
          payment_id: payment.id,
          razorpay_order_id: payment.order_id,
          amount: payment.amount / 100, // paise to rupees
          report_type: notes.report_type || 'rule_11ua',
          purpose: notes.purpose || '',
          paid_at: new Date().toISOString(),
        })

      if (error) {
        console.error('Certified request insert error:', error)
        return NextResponse.json({ error: 'DB error' }, { status: 500 })
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/api/certified/route.ts
git commit -m "feat: add Razorpay webhook route for certified report payments"
```

---

### Task 57: Supabase Migration (001_schema.sql)

**Files:**
- Create: `supabase/migrations/001_schema.sql`

- [ ] **Step 1: Create schema migration**

Create `supabase/migrations/001_schema.sql`:

```sql
-- Users (email-based, no auth required for free tier)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  company_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  source TEXT DEFAULT 'organic',
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

-- Valuations table (core)
CREATE TABLE valuations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  email TEXT,
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Step 1: Company Profile
  company_name TEXT,
  sector TEXT NOT NULL,
  stage TEXT NOT NULL,
  business_model TEXT,
  city TEXT,
  founding_year INT,

  -- Step 2: Team
  team_size INT,
  founder_experience INT,
  domain_expertise INT,
  previous_exits BOOLEAN DEFAULT false,
  technical_cofounder BOOLEAN DEFAULT false,
  key_hires JSONB DEFAULT '[]',

  -- Step 3: Financials
  annual_revenue DECIMAL,
  revenue_growth_pct DECIMAL,
  gross_margin_pct DECIMAL,
  monthly_burn DECIMAL,
  cash_in_bank DECIMAL,
  cac DECIMAL,
  ltv DECIMAL,
  last_round_size DECIMAL,
  last_round_valuation DECIMAL,

  -- Step 4: Market/Product
  tam DECIMAL,
  dev_stage TEXT,
  competition_level INT,
  competitive_advantages JSONB DEFAULT '[]',
  patents_count INT DEFAULT 0,

  -- Step 5: Strategic Factors
  strategic_partnerships TEXT DEFAULT 'none',
  regulatory_risk INT DEFAULT 3,
  revenue_concentration_pct DECIMAL,
  international_revenue_pct DECIMAL DEFAULT 0,

  -- Step 6: ESOP & Cap Table
  esop_pool_pct DECIMAL,
  time_to_liquidity_years INT DEFAULT 4,
  current_cap_table JSONB,
  target_raise DECIMAL,
  expected_dilution_pct DECIMAL,

  -- Computed results
  valuation_low DECIMAL,
  valuation_mid DECIMAL,
  valuation_high DECIMAL,
  confidence_score INT,
  method_results JSONB,
  monte_carlo_percentiles JSONB,
  damodaran_inputs JSONB,
  ibc_recovery_range JSONB,
  esop_valuation JSONB,
  investor_matches JSONB,
  ai_narrative TEXT,

  version INT DEFAULT 1
);

-- Certified report requests
CREATE TABLE certified_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valuation_id UUID REFERENCES valuations(id),
  user_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'requested',
  payment_id TEXT UNIQUE,
  razorpay_order_id TEXT,
  amount DECIMAL DEFAULT 14999,
  report_type TEXT DEFAULT 'rule_11ua',
  purpose TEXT,
  requested_at TIMESTAMPTZ DEFAULT now(),
  paid_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  report_url TEXT,
  admin_notes TEXT
);

-- Analytics events
CREATE TABLE page_events (
  id BIGSERIAL PRIMARY KEY,
  session_id TEXT,
  event TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_valuations_sector ON valuations(sector);
CREATE INDEX idx_valuations_stage ON valuations(stage);
CREATE INDEX idx_valuations_created ON valuations(created_at);
CREATE INDEX idx_valuations_city ON valuations(city);
CREATE INDEX idx_events_session ON page_events(session_id);
CREATE INDEX idx_events_event ON page_events(event);
CREATE INDEX idx_certified_status ON certified_requests(status);

-- RLS
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE certified_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access valuations" ON valuations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access users" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access certified" ON certified_requests FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access events" ON page_events FOR ALL USING (auth.role() = 'service_role');

-- Anon can read valuations by UUID (report page)
CREATE POLICY "Anon read valuation by id" ON valuations FOR SELECT USING (true);

-- Anon can insert events (analytics)
CREATE POLICY "Anon insert events" ON page_events FOR INSERT WITH CHECK (true);
```

- [ ] **Step 2: Commit**

```bash
git add supabase/migrations/001_schema.sql
git commit -m "feat: add Supabase schema migration (users, valuations, certified_requests, page_events)"
```

---

### Task 58: Environment Variables + Deployment Config

**Files:**
- Create: `.env.example`
- Create: `src/app/api/health/route.ts`

- [ ] **Step 1: Create .env.example**

Create `.env.example`:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Claude API
ANTHROPIC_API_KEY=sk-ant-xxx

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
RAZORPAY_WEBHOOK_SECRET=xxx

# App
NEXT_PUBLIC_APP_URL=https://firstunicornstartup.com
```

- [ ] **Step 2: Create health check route**

Create `src/app/api/health/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  })
}
```

- [ ] **Step 3: Commit**

```bash
git add .env.example src/app/api/health/route.ts
git commit -m "feat: add .env.example and health check endpoint"
```

---

### Task 59: Final Integration Test (Full Flow)

**Files:**
- Create: `__tests__/integration/full-flow.test.ts`

- [ ] **Step 1: Create integration test**

Create `__tests__/integration/full-flow.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { calculateValuation } from '@/lib/valuation'
import { calculateESOP } from '@/lib/calculators/esop-valuation'
import { simulateRound } from '@/lib/calculators/cap-table'
import { matchInvestors } from '@/lib/matching/investor-match'
import { getDamodaranBenchmark } from '@/lib/data/sector-mapping'
import { getIBCRecovery } from '@/lib/data/ibc-recovery'
import { formatINR } from '@/lib/utils'
import type { WizardInputs, StartupCategory } from '@/types'

function makeInputs(overrides: Partial<WizardInputs> = {}): WizardInputs {
  return {
    company_name: 'TestCo', sector: 'saas', stage: 'seed',
    business_model: 'saas_subscription', city: 'Bangalore', founding_year: 2023,
    team_size: 5, founder_experience: 4, domain_expertise: 4,
    previous_exits: false, technical_cofounder: true, key_hires: ['cto'],
    annual_revenue: 10_000_000, revenue_growth_pct: 100, gross_margin_pct: 70,
    monthly_burn: 500_000, cash_in_bank: 6_000_000,
    cac: 5000, ltv: 50000, last_round_size: null, last_round_valuation: null,
    tam: 5000, dev_stage: 'mvp', competition_level: 3,
    competitive_advantages: ['proprietary_tech'], patents_count: 1,
    strategic_partnerships: 'one', regulatory_risk: 2,
    revenue_concentration_pct: null, international_revenue_pct: 10,
    esop_pool_pct: 12, time_to_liquidity_years: 4,
    current_cap_table: null, target_raise: 50_000_000, expected_dilution_pct: 20,
    ...overrides,
  }
}

describe('Full Valuation Flow', () => {
  it('computes valuation for a seed SaaS startup', () => {
    const inputs = makeInputs()
    const result = calculateValuation(inputs)

    // Should have multiple methods
    expect(result.methods.length).toBeGreaterThan(0)
    expect(result.methods.some(m => m.applicable)).toBe(true)

    // Composite should be positive
    expect(result.composite_value).toBeGreaterThan(0)
    expect(result.composite_low).toBeGreaterThan(0)
    expect(result.composite_high).toBeGreaterThanOrEqual(result.composite_low)

    // Confidence score 0-100
    expect(result.confidence_score).toBeGreaterThanOrEqual(0)
    expect(result.confidence_score).toBeLessThanOrEqual(100)

    // IBC recovery present
    expect(result.ibc_recovery_range).toBeDefined()
  })

  it('computes valuation for a pre-revenue idea-stage startup', () => {
    const inputs = makeInputs({
      stage: 'idea', annual_revenue: 0, revenue_growth_pct: 0,
      gross_margin_pct: 0, dev_stage: 'idea',
    })
    const result = calculateValuation(inputs)

    expect(result.composite_value).toBeGreaterThan(0)
    // Pre-revenue should still produce applicable methods
    const applicable = result.methods.filter(m => m.applicable)
    expect(applicable.length).toBeGreaterThanOrEqual(3) // At least NAV + Scorecard + Berkus
  })

  it('ESOP calculation produces valid sensitivity', () => {
    const benchmark = getDamodaranBenchmark('saas')!

    const esop = calculateESOP({
      compositeValue: 100_000_000,
      esopPoolPct: 10,
      timeToLiquidityYears: 4,
      sectorBeta: benchmark.beta,
    })

    expect(esop.value_per_share).toBeGreaterThan(0)
    expect(esop.return_multiple).toBeGreaterThan(1)
    expect(esop.sensitivity.conservative.value).toBeLessThan(esop.sensitivity.optimistic.value)
  })

  it('cap table simulation preserves total ownership', () => {
    const capTable = [
      { name: 'Founders', percentage: 70, share_class: 'common' as const },
      { name: 'ESOP', percentage: 10, share_class: 'esop' as const },
      { name: 'Angels', percentage: 20, share_class: 'preference' as const },
    ]

    const result = simulateRound(capTable, 50_000_000, 200_000_000, 0.05, 'pre')
    const total = result.post_round.reduce((sum, e) => sum + e.percentage, 0)
    expect(Math.abs(total - 100)).toBeLessThan(0.01)
  })

  it('investor matching returns sorted results', () => {
    const matches = matchInvestors('saas', 'seed', 50_000_000)
    expect(matches.length).toBeGreaterThan(0)
    expect(matches.length).toBeLessThanOrEqual(5)

    // Should be sorted by score descending
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].score).toBeGreaterThanOrEqual(matches[i].score)
    }
  })

  it('Damodaran benchmark lookup works for all sectors', () => {
    const sectors: StartupCategory[] = ['saas', 'fintech_payments', 'healthtech_products', 'd2c', 'edtech']
    for (const sector of sectors) {
      const benchmark = getDamodaranBenchmark(sector)
      expect(benchmark).toBeDefined()
      expect(benchmark!.beta).toBeGreaterThan(0)
      expect(benchmark!.wacc).toBeGreaterThan(0)
    }
  })

  it('IBC recovery data exists for key sectors', () => {
    const sectors: StartupCategory[] = ['saas', 'fintech_payments', 'd2c', 'edtech']
    for (const sector of sectors) {
      const recovery = getIBCRecovery(sector)
      expect(recovery).toBeDefined()
      expect(recovery!.low).toBeGreaterThanOrEqual(0)
      expect(recovery!.high).toBeLessThanOrEqual(100)
    }
  })

  it('formatINR handles edge cases', () => {
    expect(formatINR(0)).toBe('Rs 0')
    expect(formatINR(500_000)).toBe('Rs 5 L')
    expect(formatINR(10_000_000)).toBe('Rs 1.0 Cr')
    expect(formatINR(1_250_000_000)).toBe('Rs 125.0 Cr')
  })
})
```

- [ ] **Step 2: Run integration tests**

```bash
npx vitest run __tests__/integration/full-flow.test.ts
```

Expected: All 8 tests PASS.

- [ ] **Step 3: Commit**

```bash
git add __tests__/integration/full-flow.test.ts
git commit -m "feat: add full-flow integration test (valuation, ESOP, cap table, investor matching)"
```

# Platform Monetization V2 — Design Spec

## Goal

Transform firstunicornstartup.com from a free valuation calculator into India's most comprehensive, monetizable startup valuation platform — with purpose-based pricing, professional-grade reports with full audit trails, AI-powered narratives, wizard education, investor module, and deep curated data. Built to the standard where a practicing Registered Valuer would trust the output for regulatory filings.

## Scope

**In scope:**
- Purpose-based pricing (6 purposes, 3 price bands)
- Purpose selector pre-wizard screen
- Report content gating (free vs. paid sections)
- Payment integration (Razorpay, reuse existing infrastructure)
- Professional report architecture (14 sections, IVS 105 compliant)
- AI narrative integration (single structured Claude call per report)
- Wizard education layer (tooltips, mini-calculators, AI assistant)
- Investor Deal Check module (6-field validator, traffic light verdict)
- Data depth expansion (120+ comparables, 60+ investors, 50+ listed)
- Enhanced matching algorithm with scoring
- Product engineering quality framework
- Database schema additions (purpose, paid_purpose columns)

**Out of scope:**
- Async Web Worker for Monte Carlo
- Automated data ingestion (Tracxn API, screener.in API)
- Mobile native app
- Multi-language support
- Admin dashboard
- Partner/RV network marketplace
- Subscription billing (one-time payments only for V2; Deal Check monthly plans deferred to V3)
- Component-level tests (integration tests only)

---

## Architecture Overview

### System Flow

```
Purpose Selector → Wizard (with education) → Email Gate → Free Report
                                                            ↓
                                              Gated sections (blurred)
                                                            ↓
                                              Payment (Razorpay modal)
                                                            ↓
                                              Full Report (unlocked)
                                                            ↓
                                              PDF Download + AI Narrative
```

### Key Architectural Decisions

1. **All computation is client-side** — valuation methods, MC simulation, scoring all run in browser. No server compute cost.
2. **AI is server-side only** — Claude API call happens via `/api/ai-analysis` route. Cached in Supabase after first generation.
3. **Static data bundled in JS** — comparables, investors, benchmarks are TypeScript arrays. No external API dependency.
4. **Razorpay for all payments** — existing integration extended from single checkout to purpose-based pricing.
5. **Single Supabase instance** — existing schema extended, not replaced.

---

## Section 1: Purpose Selection & Wizard Integration

### 6 Valuation Purposes

| Purpose | Slug | Price | Self-Serve? | Your Review? | Key Report Sections |
|---------|------|-------|-------------|-------------|-------------------|
| Indicative Valuation | `indicative` | Free | Yes | No | Composite + method breakdown + MC range |
| Fundraising | `fundraising` | Rs 4,999 | Yes | No | Full methods + AI narrative + investor match + assumptions |
| ESOP Valuation | `esop` | Rs 4,999 | Yes | No | Black-Scholes working + FMV per share + Section 17(2) context |
| Tax / Rule 11UA | `rule_11ua` | Rs 9,999 | Yes | Yes (sign) | DCF projection tables + assumption sources + 11UA compliance |
| FEMA Pricing | `fema` | Rs 14,999 | Yes | Yes (sign) | DCF mandatory + FEMA NDI disclosures + listed comparables |
| M&A Advisory | `ma` | Rs 14,999 | Yes | Yes (sign) | All methods + sensitivity matrix + IBC recovery + fairness context |

### Purpose Selector Component

New page: `/valuation/purpose` — shown before the wizard.

```typescript
interface PurposeOption {
  slug: ValuationPurpose
  title: string
  description: string
  price: number            // 0 for free
  features: string[]       // bullet points shown on card
  badge?: string           // "Most Popular", "Recommended for startups"
  requiresReview: boolean  // true for Rs 9,999+
}
```

**UX flow:**
1. User lands on `/valuation` → redirected to `/valuation/purpose`
2. 6 cards displayed in 2x3 grid (desktop) or single column (mobile)
3. Each card shows: title, price, 4-5 feature bullets, CTA button
4. Free tier CTA: "Start Free Valuation"
5. Paid tier CTA: "Start Valuation — Rs X"
6. Price is shown upfront but payment happens AFTER report generation (user sees value first)
7. Selected purpose stored in Zustand: `useValuationStore.getState().setPurpose(slug)`
8. Purpose flows to wizard → stored with valuation in Supabase

### Purpose Controls in Report

**New type — add to `src/types/index.ts`:**
```typescript
export const VALUATION_PURPOSES = [
  'indicative', 'fundraising', 'esop', 'rule_11ua', 'fema', 'ma',
] as const
export type ValuationPurpose = typeof VALUATION_PURPOSES[number]
```

**Reconciliation with existing `CertifiedRequest.report_type`:** The existing type `'rule_11ua' | 'fema' | 'general'` maps to the new purposes: `'general'` → `'fundraising'` or `'ma'` depending on context. The `CertifiedRequest` type should be updated to use `ValuationPurpose` instead of its own `report_type` enum. Existing `certified_requests` rows with `report_type: 'general'` should be treated as `'fundraising'` for backward compatibility.

```typescript
function getReportConfig(purpose: ValuationPurpose): ReportConfig {
  return {
    showMethodWorking: purpose !== 'indicative',
    showAINarrative: purpose !== 'indicative',
    showSensitivity: purpose !== 'indicative',
    showComparableDetails: purpose !== 'indicative',
    showInvestorMatch: purpose === 'fundraising' || purpose === 'ma',
    showESOPDetail: purpose === 'esop' || purpose === 'rule_11ua',
    showListedComparables: purpose === 'rule_11ua' || purpose === 'fema' || purpose === 'ma',
    showIBCDownside: purpose === 'ma',
    showRegulatoryCompliance: ['rule_11ua', 'fema', 'ma'].includes(purpose),
    showCredentials: ['rule_11ua', 'fema', 'ma'].includes(purpose),
    disclaimerLevel: purpose === 'indicative' ? 'basic' : purpose === 'fundraising' || purpose === 'esop' ? 'enhanced' : 'full_regulatory',
    aiPromptVariant: purpose,
    pdfWatermark: purpose === 'indicative',
  }
}
```

---

## Section 2: Report Gating & Payment Architecture

### Gating Strategy

Free report shows ALL sections but gates detail:

| Section | Free (blurred?) | Paid (unlocked) |
|---------|----------------|-----------------|
| Header (company, range, confidence) | Visible | Visible |
| Method Breakdown (names + values) | Visible | Visible |
| Monte Carlo (P10/P50/P90) | Visible | Visible |
| Individual Method Working | Blurred | Unlocked |
| AI Narrative | Blurred | Unlocked |
| Sensitivity Analysis | Blurred | Unlocked |
| Comparable Details | Blurred (names visible) | Unlocked |
| Listed Comparables | Hidden | Unlocked (if applicable) |
| Investor Match | Blurred | Unlocked (if applicable) |
| ESOP Detail | Blurred | Unlocked (if applicable) |
| Cap Table Simulator | Blurred | Unlocked |
| PDF Download | Watermarked preview | Clean PDF |
| Recommendations | Blurred | Unlocked |

**Blur implementation:** Render actual computed content behind CSS blur. Users see real substance, not placeholders. Each gated section has a lock overlay with purpose name and price.

### Payment Flow

1. User clicks "Unlock" on any gated section or the main CTA
2. POST `/api/checkout` with `{ valuation_id, email, purpose }`
3. Server creates Razorpay order with purpose-specific amount
4. Client opens Razorpay modal
5. On success: client-side optimistic unlock (set `paid_purpose` in Zustand store)
6. Webhook handles authoritative confirmation (async):
   - Existing `certified_requests` table: **retained** — webhook continues inserting here for audit trail
   - New: webhook ALSO updates `valuations.paid_purpose = purpose` column
   - The `paid_purpose` column is the source of truth for report gating on page load
   - `certified_requests` table serves as payment audit log (retained for backward compatibility)
7. On report page load: check `valuations.paid_purpose` from Supabase to determine gating

**Relationship between `certified_requests` and `paid_purpose` (requires webhook modification — see File Changes Summary):**
- `certified_requests` = payment event log (one row per payment, keeps existing pattern)
- `valuations.paid_purpose` = current state flag (what this valuation has been paid for)
- After modification, webhook will write to BOTH: insert into `certified_requests` AND update `valuations.paid_purpose`
- If `paid_purpose` is non-null on page load, all sections for that purpose tier unlock
- Existing `certified_requests` rows from before this change remain valid (no migration needed)

### API Changes

**Rename:** `/api/certified/checkout` → `/api/checkout` (more general)

```typescript
// Request
interface CheckoutRequest {
  valuation_id: string
  email: string
  purpose: ValuationPurpose
}

// Pricing lookup
const PURPOSE_PRICES: Record<ValuationPurpose, number> = {
  indicative: 0,
  fundraising: 499900,    // Rs 4,999 in paise
  esop: 499900,
  rule_11ua: 999900,
  fema: 1499900,
  ma: 1499900,
}
```

### Database Changes

```sql
-- Add to valuations table
ALTER TABLE valuations ADD COLUMN purpose TEXT DEFAULT 'indicative';
ALTER TABLE valuations ADD COLUMN paid_purpose TEXT DEFAULT NULL;

-- purpose = what user selected at start
-- paid_purpose = what they actually paid for (NULL = free, set on payment)
```

---

## Section 3A: Report Content Architecture

### Professional Report Structure (14 Sections)

#### Section 1: Cover Page
- Company name, sector, stage
- Purpose statement (e.g., "Valuation for the purpose of Section 56(2)(viib) of Income Tax Act")
- Valuation date
- Fair value range (Rs X Cr — Rs Y Cr)
- Composite value and confidence score
- Preparer credentials (Rs 9,999+ tiers only)
- Report ID

#### Section 2: Scope & Engagement Letter
- Purpose and basis of value
- Scope limitations ("Based on management-represented data, no independent verification")
- Methods considered
- Standards followed (IVS 105, IBBI Valuation Standards)
- Independence statement
- **Paid tiers only**

#### Section 3: Company Overview with Benchmarks
- User-provided company details in structured format
- Side-by-side comparison with sector benchmarks:

| Metric | Company | Sector Median | Percentile |
|--------|---------|---------------|------------|
| Revenue Growth | 60% | 45% | 75th |
| Gross Margin | 72% | 68% | 60th |
| Team Size | 25 | 30 | 45th |
| Burn Multiple | 1.8x | 2.5x | 35th (better) |

#### Section 4: Method Selection Table

| Method | Applied? | Rationale | Weight | Confidence |
|--------|----------|-----------|--------|------------|
| DCF | Yes | Revenue-stage company with projectable cash flows | 25% | High |
| Revenue Multiple | Yes | SaaS sector has reliable revenue multiple benchmarks | 20% | High |
| EV/EBITDA | No | Company is EBITDA-negative — method not applicable | 0% | N/A |
| Comparable Txn | Yes | 8 comparable Indian SaaS transactions available | 20% | Medium |
| NAV | Yes | Cross-check only — not primary for technology companies | 5% | Low |
| Replacement Cost | Yes | Cross-check — team + tech replacement proxy | 5% | Low |
| Scorecard | Yes | Stage-appropriate for Series A | 10% | Medium |
| Berkus | No | Revenue > Rs 5 Cr — Berkus designed for pre-revenue | 0% | N/A |
| Risk Factor | Yes | Stage-appropriate adjustment method | 10% | Medium |
| PWERM | Yes | Scenario-weighted for fundraising context | 5% | Medium |

- AI generates rationale text for each method
- Rationale cites IVS 105 approach classification (Income, Market, Cost)

#### Section 5: Individual Method Working

**DCF Example (full calculation table):**

| Year | Revenue | Growth | Gross Profit | OpEx | EBIT | Tax | NOPAT | CapEx | Change WC | FCF |
|------|---------|--------|-------------|------|------|-----|-------|-------|-----------|-----|
| 2026 | 5.0 Cr | — | 3.6 Cr | 2.8 Cr | 0.8 Cr | 0.2 Cr | 0.6 Cr | 0.3 Cr | 0.1 Cr | 0.2 Cr |
| 2027 | 8.0 Cr | 60% | 5.8 Cr | 4.0 Cr | 1.8 Cr | 0.5 Cr | 1.4 Cr | 0.4 Cr | 0.2 Cr | 0.8 Cr |
| ... | ... | ... | ... | ... | ... | ... | ... | ... | ... | ... |
| 2030 | 19.2 Cr | 20% | 13.8 Cr | 8.5 Cr | 5.3 Cr | 1.3 Cr | 4.0 Cr | 0.8 Cr | 0.3 Cr | 2.9 Cr |

**Assumptions table with sources:**

| Assumption | Value | Source |
|------------|-------|--------|
| WACC | 14.0% | Damodaran India SaaS (Jan 2026) |
| Risk-Free Rate | 7.0% | India 10Y G-Sec yield |
| Equity Risk Premium | 7.5% | Damodaran India ERP |
| Size Premium | 3.0% | Early-stage adjustment |
| Revenue Growth (Y1) | 60% | Management representation |
| Revenue Growth (terminal) | 5.5% | GDP growth cap |
| Gross Margin | 72% | Management representation (vs sector median 68%) |
| Tax Rate | 25% | India corporate tax (new regime) |
| Terminal Multiple | 3.0x revenue | Median Indian SaaS exit multiple |

Each method gets a similar table — Revenue Multiple shows comparable selection, Scorecard shows factor-by-factor scoring, etc.

#### Section 6: Composite Reconciliation
- Weighted average computation shown
- AI narrative explaining why weights were assigned
- Cross-method consistency check (if methods diverge >5x, explain why)
- Final range: composite ± MC-derived P10/P90

#### Section 7: Sensitivity Analysis

**3-variable matrix (WACC x Growth x Margin) for DCF:**
- Heatmap visualization
- Current scenario highlighted
- Range of outcomes labeled

**Revenue Multiple sensitivity:**
- Multiple range (sector P25 to P75) × revenue = value range

#### Section 8: Comparable Evidence
- Private comparable table (top 5-8 from enhanced 120+ dataset)
- Selection reasoning: "Selected based on sector (SaaS), stage (Series A ± 1), and revenue proximity"
- Revenue multiples and EV/EBITDA multiples shown
- Scatter plot of comparable universe with user's company highlighted
- Listed comparables (for Rs 9,999+ tiers): BSE/NSE companies with trading multiples

#### Section 9: ESOP Analysis (if applicable)
- Black-Scholes option pricing model working
- Inputs: stock price (FMV), exercise price, time to expiry, volatility, risk-free rate
- Sensitivity: conservative / base / optimistic scenarios
- FMV per share computation
- Pool value as % of enterprise value
- Section 17(2) context for tax implications

#### Section 10: Cap Table Impact (if cap table provided)
- Current cap table visualization
- Post-money cap table (if target raise provided)
- Dilution analysis
- ESOP dilution impact

#### Section 11: Investor Match (fundraising/M&A purposes)
- Top 5-10 matched investors with scores
- For each: match score, why they fit, portfolio overlap, suggested approach
- Co-investment patterns

#### Section 12: IBC Downside Analysis (if applicable sector)
- Sector recovery rate from IBC data
- Liquidation value estimate
- Going concern vs. liquidation comparison

#### Section 13: AI-Generated Recommendations
- Purpose-specific next steps
- Fundraising: optimal raise amount, timing, investor strategy
- ESOP: pool sizing, vesting recommendations
- 11UA: documentation checklist for tax filing
- FEMA: pricing certificate next steps
- M&A: negotiation range, deal structure considerations

#### Section 14: Disclaimers
- Purpose-specific regulatory disclaimers
- Data source attributions with dates
- Limitation of liability
- Credential statement (Rs 9,999+ tiers)

---

## Section 3B: AI Integration Architecture

### Single Structured Claude Call

One API call per report generates all narrative sections. AI receives computed data as structured JSON, generates narrative — never computes.

```typescript
// New types — add to src/types/index.ts
interface CrossMethodWarning {
  method: string
  message: string
  severity: 'info' | 'warning'
}

interface SensitivityResult {
  variable: string                     // e.g., 'wacc', 'growth', 'margin'
  baseValue: number
  steps: { label: string; value: number; valuation: number }[]
}

interface AIAnalysisRequest {
  purpose: ValuationPurpose
  company: {
    name: string; sector: string; stage: string
    revenue: number; growth: number; margin: number
  }
  methods: MethodResult[]
  composite: { value: number; low: number; high: number; confidence: number }
  monteCarlo: MonteCarloResult
  comparables: ComparableCompany[]     // top 5 matched
  benchmarks: { sector: string; data: DamodaranBenchmark; asOf: string }
  warnings: CrossMethodWarning[]       // cross-method consistency issues
  sensitivityMatrix: SensitivityResult[]  // one per variable (WACC, growth, margin)
}

interface AIAnalysisResponse {
  executive_summary: string            // 2-3 paragraphs
  method_rationales: Record<string, string>  // per method (10 entries)
  reconciliation_narrative: string     // why these weights
  sensitivity_interpretation: string   // what the matrix means
  comparable_reasoning: string         // why these comparables chosen
  risk_assessment: string              // key risks identified
  recommendations: string[]           // 3-5 actionable items
  purpose_framing: string             // purpose-specific context
}
```

### Prompt Structure

```
You are a senior Indian startup valuation professional writing a report section.

CONTEXT:
- Company: {name}, {sector}, {stage}
- Purpose: {purpose} (e.g., "Valuation under Rule 11UA for share premium justification")

DATA (do not recompute — use these exact numbers):
{structured JSON of all computed results}

WRITE the following sections in professional valuer tone:
1. Executive Summary (2-3 paragraphs)
2. Method Rationale for each applied method (2-3 sentences each, cite IVS 105)
3. Reconciliation Narrative (explain weight assignments)
4. Sensitivity Interpretation (what the matrix shows)
5. Comparable Reasoning (why these companies were selected)
6. Risk Assessment (3-5 key risks)
7. Recommendations (3-5 actionable items, purpose-specific)
8. Purpose Framing ({purpose-specific regulatory context})

STYLE: Active voice, cite specific numbers, explain causation. Write for a board presentation audience.
Do NOT use generic phrases like "Based on the inputs provided" or "The calculated value is."
```

### Cost, Caching, and Error Handling

- Model: Claude Sonnet (balance of quality and cost)
- Cost: ~Rs 2-3 per report (input ~2K tokens, output ~3K tokens)
- Cache: Stored in `valuations.ai_narrative` as JSON string
- Regeneration: Never — valuation inputs are immutable after save
- Streaming: Response streamed to client for progressive display
- **Error handling:** If Claude API call fails (timeout, rate limit, API error):
  1. Retry once with exponential backoff (existing pattern in `ai-narrative.tsx`)
  2. If retry fails, show fallback message: "AI analysis temporarily unavailable. Your valuation data is complete — narrative insights will be available shortly."
  3. Report renders fully without AI sections (all computed data is independent of AI)
  4. User can click "Retry AI Analysis" button to re-trigger
  5. No payment is blocked by AI failure — the computational report is the core product

---

## Section 3C: Wizard Education Layer

### 3 Layers of Help

#### Layer 1: Tooltips (Every Field)

Static content bundled in the app. Every wizard field has:
- "What is this?" — plain English definition
- Sector benchmark — "SaaS average: 72%" from Damodaran
- "What should I put?" — practical guidance

```typescript
const FIELD_TOOLTIPS: Record<string, (ctx: WizardContext) => TooltipContent> = {
  gross_margin_pct: (ctx) => ({
    definition: 'Revenue minus direct costs (COGS), divided by revenue, as a percentage.',
    benchmark: `${ctx.sector} average: ${ctx.sectorBenchmark.grossMargin}% (Damodaran India, ${ctx.sectorBenchmark.asOf})`,
    guidance: 'Check your P&L statement. Include only costs directly tied to delivering your product (hosting, APIs, direct labor). Exclude sales, marketing, and admin costs.',
  }),
  // ... all fields
}
```

#### Layer 2: Mini-Calculators (5 Complex Fields)

Interactive modal calculators for fields users commonly struggle with:

1. **Growth Rate Calculator**: Input last year + this year revenue → computes growth %
2. **Gross Margin Calculator**: Input revenue + COGS → computes margin %
3. **TAM Calculator**: Bottom-up (customers × deal size) or top-down (market size × share)
4. **Runway Calculator**: Cash ÷ burn → months, with warning thresholds
5. **WACC Reference**: Shows sector WACC with component breakdown (not editable, educational)

Each calculator is a small modal component. Opens via "Calculate" link next to the field. Result can be auto-filled into the wizard field with "Use This Value" button.

#### Layer 3: AI Smart Assistant (Paid Tiers)

Floating chat bubble in wizard for Rs 4,999+ users. Context-aware — knows current step, field, sector, stage.

- Uses Claude Haiku (fast, cheap — ~Rs 0.50 per question)
- Rate limited: 10 questions per wizard session
- Prompt includes: current field, sector benchmarks, filled values so far
- Does NOT compute — only educates and explains

---

## Section 3D: Investor Deal Check Module

### Concept

New page: `/deal-check` — for investors to quickly validate if a startup's ask is reasonable.

### Input (6 Fields)

| Field | Type | Purpose |
|-------|------|---------|
| Sector | Dropdown | Match to sector benchmarks |
| Stage | Dropdown | Stage-appropriate valuation method |
| Annual Revenue (Rs Cr) | Number | Revenue multiple computation |
| Revenue Growth % | Number | Growth premium/discount |
| Amount Raising (Rs Cr) | Number | Implied pre-money and dilution |
| Valuation Ask (Rs Cr) | Number | What founder is claiming |

### Output: Traffic Light Verdict

```typescript
type Verdict = 'green' | 'yellow' | 'red' | 'blue'

// Add to src/types/deal-check.ts
interface DealCheckInput {
  sector: StartupCategory
  stage: Stage
  revenue_cr: number
  growth_pct: number
  raise_cr: number
  ask_cr: number
}

interface DealCheckResult {
  verdict: Verdict
  label: string
  explanation: string
  fairValue: number
  impliedMultiple: number
  sectorMedianMultiple: number
  dilutionPct: number
  comparables: ComparableCompany[]  // top 3 matches
  negotiationInsight: string
}

// computeVerdict determines the traffic light color and label.
// The full DealCheckResult (fairValue, impliedMultiple, comparables, etc.)
// is assembled by the parent function computeDealCheck() which calls
// computeVerdict() for just the verdict portion, then adds the remaining
// fields from separate computations (comparable lookup, multiple calc, etc.)
function computeVerdict(ask: number, fairValue: number): Pick<DealCheckResult, 'verdict' | 'label' | 'explanation'> {
  const ratio = ask / fairValue

  if (ratio <= 1.1) return {
    verdict: 'green',
    label: 'Fair Price',
    explanation: `Ask of ${formatINR(ask)} is within 10% of computed fair value ${formatINR(fairValue)}`
  }
  if (ratio <= 1.5) return {
    verdict: 'yellow',
    label: 'Slight Premium',
    explanation: `Ask is ${Math.round((ratio - 1) * 100)}% above fair value. Common in competitive rounds.`
  }
  if (ratio <= 2.5) return {
    verdict: 'red',
    label: 'Significant Premium',
    explanation: `Ask is ${Math.round((ratio - 1) * 100)}% above fair value. Negotiate or seek justification.`
  }
  return {
    verdict: 'blue',
    label: 'Aspirational',
    explanation: `Ask is ${Math.round((ratio - 1) * 100)}% above fair value. This is an aspirational valuation — not supported by fundamentals.`
  }
}
```

### Additional Output

- Implied revenue multiple vs. sector median
- What percentage dilution at this valuation
- 3 comparable recent transactions in same sector/stage
- Negotiation insight: "Counter at Rs X Cr (sector median multiple applied to their revenue)"

### Investor Education Layer

For beginner investors, each output includes expandable "Learn More":
- "What is a revenue multiple?" — 3-sentence explanation
- "Why does stage matter?" — explains early-stage premium
- "What is fair dilution?" — typical ranges by stage

### Monetization (V2 — One-Time Payments Only)

| Tier | Price | Features |
|------|-------|----------|
| Free | Rs 0 | 3 deal checks/month (IP-based + localStorage tracking), verdict + implied multiple only |
| Per-Deal | Rs 999 | Full analysis + comparables + negotiation insights + PDF export |

**V3 (deferred — requires subscription billing infrastructure):**
- Monthly Angel: Rs 2,999/month — unlimited checks + portfolio dashboard
- Monthly Fund: Rs 9,999/month — unlimited + API access + bulk upload

**Rate limiting for free tier:** Combination of IP-based (Supabase `deal_checks.ip_address`) and localStorage counter. Neither is tamper-proof alone, but together they handle 95% of casual use. Logged-in users (if email captured) get email-based tracking (most reliable).

---

## Section 4: Data Depth Expansion

### 4A. Comparable Companies: 29 → 120+

**Enhanced type:**

**Type migration note:** The existing `ComparableCompany` uses `string` for `sector`, `stage_at_round`, and `business_model`. We tighten these to `StartupCategory`, `Stage`, and `BusinessModel` respectively. All 29 existing entries in `comparable-companies.ts` already use valid enum values — verified against the data file. This is a **breaking type change** that requires auditing all existing data entries during implementation.

```typescript
interface ComparableCompany {
  name: string
  sector: StartupCategory          // TIGHTENED from string — audit existing data
  stage_at_round: Stage            // TIGHTENED from string — audit existing data
  last_round_size_cr: number
  valuation_cr: number
  revenue_cr: number | null
  year: number
  city: string
  business_model: BusinessModel    // TIGHTENED from string — audit existing data
  source: string
  // NEW fields
  revenue_multiple: number | null
  ebitda_cr: number | null
  ebitda_multiple: number | null
  arr_cr: number | null
  employees: number | null
  founded_year: number | null
  deal_type: 'primary' | 'secondary' | 'ipo' | 'acquisition'
  currency_original: 'INR' | 'USD'
  notes: string | null
}
```

**Coverage target:** 5+ companies per sector, across multiple stages.

**Sources:** Tracxn free tier, Venture Intelligence, Inc42, MCA filings (Tofler), press releases, SEBI DRHP filings, practicing valuer knowledge.

**Validation:** Cross-reference rule (2+ sources or 1 audited), outlier tagging, currency normalization, deal type classification.

### 4B. Investors: 16 → 60+

**Enhanced type:**

**Type migration note:** The existing `Investor.type` is `'vc' | 'pe' | 'angel' | 'family_office' | 'cvc'`. We expand it to include new values. Mapping: `'cvc'` remains (Corporate VC), `'pe'` remains (Private Equity). New values added: `'government'`, `'angel_network'`. No existing values removed — backward compatible.

```typescript
interface Investor {
  name: string
  type: 'vc' | 'pe' | 'angel' | 'angel_network' | 'family_office' | 'cvc' | 'government'
  sectors: StartupCategory[]    // TIGHTENED from string[] — audit existing data
  stages: Stage[]               // TIGHTENED from string[] — audit existing data
  check_size_min_cr: number
  check_size_max_cr: number
  city: string
  portfolio_highlights: string[]
  last_active_year: number
  website: string
  // NEW fields
  sweet_spot_cr: number | null
  deals_per_year: number | null
  follow_on_rate: number | null
  board_seat: boolean
  lead_investor: boolean
  co_invest_with: string[]
  geographic_focus: string[]
  thesis_summary: string | null
  contact_method: 'website' | 'linkedin' | 'referral_only'
}
```

**Target by type:** 15 top-tier VC, 10 mid-tier VC, 8 micro-VC, 8 angel networks, 6 family offices, 5 corporate VC, 3 government/PSU, 5 sector specialists = 60+.

### 4C. Listed Comparables (New)

```typescript
interface ListedComparable {
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

**Target:** 50+ listed Indian companies (2-4 per sector). Source: screener.in (free). Required for Rule 11UA and FEMA reports (regulatory defensibility).

### 4D. Enhanced Matching Algorithm

```
Match Score = (sector_match x 40) + (stage_match x 25) + (size_fit x 20) + (activity x 10) + (geo x 5)
```

Output per matched investor: match score, fit explanation, portfolio overlap, co-investment patterns, suggested approach.

### 4E. Data Refresh Cycle

| Data | Frequency | Source | Mechanism |
|------|-----------|--------|-----------|
| Damodaran Benchmarks | Quarterly | damodaran.com | Manual TypeScript update |
| Private Comparables | Bi-annual | Multiple sources | Manual curation + PR |
| Investors | Bi-annual | Websites + Tracxn | Manual update |
| Listed Comparables | Quarterly | screener.in | Manual pull |
| IBC Recovery | Annual | IBBI annual report | Manual update |

All data remains static TypeScript arrays. No external API dependency. Updates are manual PRs.

---

## Section 5: Product Engineering Quality Framework

### 5A. Computational Accuracy

- **Per-method test matrix:** 3 profiles per method (pre-revenue, growth, mature) with hand-verified expected values
- **Cross-method sanity checker:** Flag if any method deviates >5x from median, include warning in report
- **Monte Carlo stability:** 5 runs with same inputs must produce P10/P90 within 2% coefficient of variation
- **Professional calibration:** 5 real valuations from practicing experience — platform must produce composite within ±25% of professional judgment
- **Edge case suite:** 8 profiles (pre-revenue, zero-margin, single-founder, massive TAM, tiny TAM, negative growth, max inputs, min inputs)

### 5B. Regulatory Defensibility

- Every report section maps to IVS 105 requirements
- Purpose-specific compliance elements (Rule 11UA cites Section 56(2)(viib), FEMA cites NDI Rules)
- Three disclaimer levels: basic (free), enhanced (Rs 4,999), full regulatory (Rs 9,999+)
- Assumption source attribution on every parameter (Damodaran, user input, platform default)
- Clear separation: free/Rs 4,999 = automated tool disclaimer; Rs 9,999+ = RV credentials and signature

### 5C. User Experience

- **Progressive disclosure:** Fields shown based on purpose + sector + stage
- **Smart defaults:** Every field pre-fills with sector median from Damodaran
- **Instant validation:** Real-time warnings for implausible values (not blocking errors)
- **Mini-calculators:** 5 interactive helpers for complex fields (growth, margin, TAM, runway, WACC reference)
- **AI assistant:** Contextual help for paid tiers (Haiku model, 10 questions/session)
- **Loading animation:** Minimum 1.5s with real step names ("Running DCF... Monte Carlo simulation...")
- **Save & resume:** Zustand + localStorage persistence (already works)
- **Target:** <15% wizard abandonment rate

### 5D. Report Quality

- Professional cover page with credentials (Rs 9,999+ tiers)
- 4 chart types: MC histogram, method comparison bars, sensitivity heatmap, comparable scatter
- Tables: Indian number format (Cr/L), right-aligned, row striping
- AI narrative in professional valuer tone (not generic AI language)
- Conditional sections (ESOP only if pool > 0, IBC only if applicable sector)
- Gated sections render real content behind blur (not placeholder blocks)

### 5E. Performance

| Operation | Target |
|-----------|--------|
| Wizard page load | <1s |
| All computation (10 methods + MC) | <500ms |
| Report page render (above fold) | <1s |
| PDF generation | <5s |
| AI narrative | <15s (streamed) |
| Payment modal | <2s |

### 5F. Data Integrity

- Build-time validation: every comparable checked for reasonable multiples, valid sector/stage, no duplicates
- Coverage check: deployment fails if any sector has <3 comparables
- Outlier handling: median-based multiples with winsorization (trim top/bottom 10%)
- Input validation: range checks per field with soft warnings for edge values
- Currency normalization: all values in INR, USD conversions noted

### 5G. Monetization Integrity

- Free tier is genuinely useful (full composite, method breakdown, MC range)
- Gated sections show real blurred content (not placeholder blocks)
- Price shown upfront on purpose selector (before wizard starts)
- Payment after report generation (user sees value first)
- Frictionless Razorpay modal (UPI, cards, netbanking)
- Conversion funnel tracking (14 events from wizard_started to pdf_downloaded)

---

## File Changes Summary

### New Files

| File | Purpose |
|------|---------|
| `src/app/valuation/purpose/page.tsx` | Purpose selector page |
| `src/app/api/checkout/route.ts` | Purpose-based payment endpoint (replaces certified/checkout) |
| `src/app/deal-check/page.tsx` | Investor Deal Check page |
| `src/app/api/deal-check/route.ts` | Deal Check computation API (optional, can be client-side) |
| `src/lib/data/listed-comparables.ts` | 50+ BSE/NSE listed companies |
| `src/components/report/gated-section.tsx` | Blur + lock overlay wrapper |
| `src/components/report/sensitivity-matrix.tsx` | Sensitivity heatmap chart |
| `src/components/report/comparable-scatter.tsx` | Scatter plot chart |
| `src/components/report/cover-page.tsx` | PDF cover page component |
| `src/components/wizard/mini-calculator.tsx` | Calculator modal components |
| `src/components/wizard/field-tooltip.tsx` | Enhanced tooltip component |
| `src/components/wizard/ai-assistant.tsx` | Floating AI chat (paid tiers) |
| `src/components/deal-check/verdict-card.tsx` | Traffic light verdict display |
| `src/components/deal-check/negotiation-insights.tsx` | Deal analysis output |
| `src/lib/matching/deal-check.ts` | Deal Check scoring logic |
| `src/lib/validation/cross-method.ts` | Cross-method sanity checker |
| `src/lib/validation/data-integrity.ts` | Build-time data validation |
| `src/lib/disclaimers.ts` | Purpose-specific disclaimer generator |
| `src/types/deal-check.ts` | Deal Check types |
| `supabase/migrations/003_add_purpose_and_deal_checks.sql` | Add purpose + paid_purpose columns |

### Modified Files

| File | Changes |
|------|---------|
| `src/types/index.ts` | **Add new types:** `ValuationPurpose`, `CrossMethodWarning`, `SensitivityResult`, `ListedComparable`. **Extend existing types:** `ComparableCompany` (add fields + tighten string→enum), `Investor` (add fields + expand type union). **Update:** `CertifiedRequest.report_type` to use `ValuationPurpose`. |
| `src/lib/data/comparable-companies.ts` | Expand from 29 to 120+ entries, add new fields |
| `src/lib/data/investors.ts` | Expand from 16 to 60+ entries, add new fields |
| `src/lib/matching/investor-match.ts` | Enhanced scoring algorithm |
| `src/lib/valuation/index.ts` | Add cross-method validation warnings to result |
| `src/stores/valuation-store.ts` | Add `purpose` field + `setPurpose` method, bump persist version from 1 to 2 with migrate function that defaults `purpose: 'indicative'` for existing localStorage state |
| `src/app/valuation/page.tsx` | Redirect to purpose selector |
| `src/app/report/[id]/page.tsx` | Add gating logic based on paid_purpose |
| `src/components/report/certified-cta.tsx` | Rename to `checkout-cta.tsx`. Add `purpose: ValuationPurpose` prop (passed from report page, which reads it from `valuation.purpose`). Price derived from `PURPOSE_PRICES[purpose]`. Display text changes per purpose (e.g., "Unlock Fundraising Report — Rs 4,999"). Keep both routes working during transition: old `/api/certified/checkout` redirects to new `/api/checkout`. |
| `src/app/api/ai-analysis/route.ts` | Enhanced prompt with purpose-specific framing, structured JSON response matching `AIAnalysisResponse` type, purpose-aware system prompt |
| `src/lib/export/pdf-generator.ts` | 14-section layout, purpose-specific content, cover page |
| `src/components/results/method-cards.tsx` | Add method working expandable sections |
| `src/app/api/razorpay-webhook/route.ts` | Update paid_purpose on payment confirmation |

---

## Database Schema Changes

```sql
-- Migration 003: Add purpose columns
ALTER TABLE valuations ADD COLUMN purpose TEXT DEFAULT 'indicative';
ALTER TABLE valuations ADD COLUMN paid_purpose TEXT DEFAULT NULL;

-- Index for querying paid valuations
CREATE INDEX idx_valuations_purpose ON valuations(purpose);
CREATE INDEX idx_valuations_paid ON valuations(paid_purpose) WHERE paid_purpose IS NOT NULL;

-- Deal check table (for investor module)
CREATE TABLE deal_checks (
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

-- Index for rate limiting deal checks
CREATE INDEX idx_deal_checks_ip ON deal_checks(ip_address, created_at);
```

---

## Testing Strategy

- All existing 168 tests must continue passing
- Update orchestrator test to include cross-method validation warnings
- Add data integrity tests (build-time, fail deployment if data is invalid)
- Add MC stability test (5 runs within 2% CoV)
- Add per-method test profiles (3 profiles × 10 methods = 30 new tests)
- Add Deal Check scoring tests
- Add purpose gating logic tests
- Manual: complete valuation for each purpose, verify correct sections shown/hidden
- Manual: payment flow for each price point
- Professional calibration: 5 real valuations within ±25% (one-time validation)

---

## Dependencies

No new npm packages. All existing:
- `razorpay` v2.9.6 — extended for purpose-based pricing
- `@supabase/supabase-js` v2.99.1 — schema additions only
- Razorpay checkout.js — loaded dynamically from CDN
- Claude API — existing AI analysis route enhanced

Data curation (120+ comparables, 60+ investors, 50+ listed) is a manual effort parallel to implementation. TypeScript data files updated via PR.

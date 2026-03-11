# First Unicorn Startup — Full Valuation Intelligence Platform

## Overview

**Domain:** firstunicornstartup.com

**Goal:** India's most comprehensive startup valuation platform — 5 valuation methods, Monte Carlo simulation, cap table modeling, ESOP valuation, investor matching, AI narrative analysis, IBC downside benchmarks, and Damodaran India data — built by an IBBI-registered IP and SFA-licensed Valuer. Free instant valuation as lead magnet → Rs 14,999 certified Rule 11UA/FEMA report as primary revenue → anonymized valuation data as long-term moat.

**Positioning:** Not a toy calculator. A professional valuation platform built by a practicing valuer who has analyzed 190+ IBC landmark cases, 3,952 corporate debtor outcomes, and processes Damodaran India industry benchmarks. The free tool demonstrates expertise; the paid report delivers legal compliance.

**Architecture:** Next.js 14 client-side app + Supabase backend. Core valuation computation in browser (zero API cost). Damodaran India benchmarks auto-populate. AI narrative via Claude haiku (server-side, post-email-capture only). Cap table and ESOP calculators run client-side.

**Tech Stack:** Next.js 14 (App Router), Tailwind CSS, shadcn/ui, Zustand, Recharts, jsPDF, Supabase (PostgreSQL + Auth + Edge Functions + Storage), Claude API (claude-haiku-4-5), Razorpay, Vercel.

---

## Target Users

### Primary: Startup Founders (India)
- 50,000+ funding rounds/year in India — each legally requires a valuation (Rule 11UA for tax, FEMA for foreign investors)
- Angel tax abolished (Apr 2025) → more startups raising → more valuations needed
- Currently pay Rs 15,000-50,000 to a CA for a basic valuation report
- Want to understand their worth BEFORE approaching investors
- Need cap table modeling for negotiation preparation

### Secondary: VCs / PE Funds
- Will pay for anonymized "Indian Startup Valuation Benchmarks" generated from founder data
- Use investor matching to discover deal flow
- Phase 2 data product once 1,000+ valuations accumulated

---

## Professional Credibility (Landing Page Trust Signals)

The landing page MUST prominently feature:
- "Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer"
- "Powered by Damodaran India Industry Benchmarks (January 2026)"
- "5 Valuation Methods: Revenue Multiple + DCF + Scorecard + Berkus + Risk Factor Summation"
- "Monte Carlo Simulation with 10,000 iterations"
- "190+ IBC landmark cases analyzed | 3,952 corporate debtor outcomes studied"
- This is NOT a random calculator — it's a preview of professional valuation services

---

## Enumerations & Lookup Tables

### Two-Tier Sector System:

**Tier 1: Startup Category (25 options — user-facing, searchable dropdown):**

| # | Category | Description |
|---|----------|-------------|
| 1 | SaaS / Enterprise Software | B2B software, subscriptions, cloud tools |
| 2 | Fintech — Payments & Lending | Payment gateways, BNPL, digital lending |
| 3 | Fintech — Insurance & Wealth | InsurTech, WealthTech, robo-advisory |
| 4 | Fintech — Banking & Neo-Banks | Digital banking, account aggregators |
| 5 | D2C / Consumer Brands | Direct brands, FMCG, beauty, fashion |
| 6 | EdTech | Online learning, skill platforms, test prep |
| 7 | HealthTech — Products & Devices | MedTech, diagnostics, health devices |
| 8 | HealthTech — Services & Platforms | Telemedicine, hospital tech, pharmacy |
| 9 | E-commerce — General | Online retail, quick commerce |
| 10 | E-commerce — Grocery & Food | Online grocery, food delivery |
| 11 | Marketplace / Platform | Two-sided platforms, aggregators |
| 12 | AgriTech | Farm-to-fork, precision agriculture |
| 13 | Logistics & Supply Chain | Last-mile, warehousing, fleet tech |
| 14 | CleanTech / Green Energy | Solar, EV, carbon tech, renewables |
| 15 | DeepTech / AI-ML | AI products, robotics, computer vision |
| 16 | Gaming & Entertainment | Gaming studios, OTT, content |
| 17 | Real Estate Tech | PropTech, construction tech |
| 18 | Auto / Mobility | EV, ride-sharing, fleet management |
| 19 | Manufacturing / Industrial | Smart factory, industrial IoT |
| 20 | Media & Advertising | AdTech, content marketing, publishing |
| 21 | Telecom & Connectivity | Telecom services, ISP, IoT connectivity |
| 22 | Travel & Hospitality | Travel booking, hotel tech, tourism |
| 23 | Social Impact / Non-Profit Tech | Impact investing, social enterprises |
| 24 | B2B Services | Consulting tech, HR tech, legal tech |
| 25 | Other | (free-text sub-industry entry) |

**Tier 2: Damodaran Industry Mapping (each startup category maps to 1-3 Damodaran industries for benchmark data):**

| Startup Category | Primary Damodaran Industry | Secondary (fallback) |
|-----------------|---------------------------|---------------------|
| SaaS / Enterprise Software | Software (System & Application) | Information Services |
| Fintech — Payments & Lending | Financial Services (Non-bank & Insurance) | Software (Internet) |
| Fintech — Insurance & Wealth | Insurance (General) | Investments & Asset Management |
| Fintech — Banking & Neo-Banks | Banks (Regional) | Financial Services (Non-bank & Insurance) |
| D2C / Consumer Brands | Household Products | Retail (Special Lines) |
| EdTech | Education | Software (Internet) |
| HealthTech — Products & Devices | Healthcare Products | Electronics (General) |
| HealthTech — Services & Platforms | Healthcare Support Services | Hospitals/Healthcare Facilities |
| E-commerce — General | Retail (General) | Software (Internet) |
| E-commerce — Grocery & Food | Food Wholesalers | Retail (Grocery and Food) |
| Marketplace / Platform | Information Services | Software (Internet) |
| AgriTech | Farming/Agriculture | Food Processing |
| Logistics & Supply Chain | Transportation | Trucking |
| CleanTech / Green Energy | Green & Renewable Energy | Power |
| DeepTech / AI-ML | Software (System & Application) | Computer Services |
| Gaming & Entertainment | Software (Entertainment) | Entertainment |
| Real Estate Tech | Real Estate (Operations & Services) | Real Estate (Development) |
| Auto / Mobility | Auto & Truck | Auto Parts |
| Manufacturing / Industrial | Machinery | Engineering/Construction |
| Media & Advertising | Publishing & Newspapers | Broadcasting |
| Telecom & Connectivity | Telecom Services | Telecom Equipment |
| Travel & Hospitality | Hotel/Gaming | Recreation |
| Social Impact / Non-Profit Tech | Business & Consumer Services | Environmental & Waste Services |
| B2B Services | Business & Consumer Services | Computer Services |
| Other | Total Market (composite) | — |

**How it works:** When a user selects "Fintech — Payments & Lending", the system pulls Damodaran benchmarks from the "Financial Services (Non-bank & Insurance)" industry. If that industry has missing data for any metric, it falls back to the secondary industry. The "Other" category uses Total Market composite as a conservative baseline.

**Implementer note:** The full Damodaran India dataset has **~90 industry groupings**. The `scripts/process-damodaran.py` script extracts ALL 90 industries from each Excel file and stores them in `public/data/damodaran/india-benchmarks.json` keyed by Damodaran industry name. The mapping table above tells the UI which Damodaran industry to look up for each startup category. This means if Damodaran adds or renames industries, only the mapping needs updating — not the data pipeline.

### Stages (7 options):
1. Idea (no product, no revenue)
2. Pre-seed (prototype/early MVP)
3. Seed (MVP live, some traction)
4. Pre-Series A (product-market fit emerging)
5. Series A (proven PMF, scaling)
6. Series B (growth stage)
7. Series C+ (late stage / pre-IPO)

### Business Models (10 options):
1. SaaS (subscription)
2. Marketplace (commission/take-rate)
3. E-commerce (product sales)
4. Advertising
5. Freemium
6. Transaction-based
7. Licensing (IP/tech)
8. Services (consulting/professional)
9. Hardware + Software
10. Other

### Stage-Based Pre-Money Valuation Benchmarks (INR):

| Stage | Typical | Low | High |
|-------|---------|-----|------|
| Idea | Rs 50 L | Rs 20 L | Rs 1 Cr |
| Pre-seed | Rs 2 Cr | Rs 50 L | Rs 5 Cr |
| Seed | Rs 8 Cr | Rs 3 Cr | Rs 15 Cr |
| Pre-Series A | Rs 20 Cr | Rs 10 Cr | Rs 40 Cr |
| Series A | Rs 50 Cr | Rs 25 Cr | Rs 100 Cr |
| Series B | Rs 200 Cr | Rs 80 Cr | Rs 500 Cr |
| Series C+ | Rs 500 Cr | Rs 200 Cr | Rs 2,000 Cr |

### Berkus Method Milestone Values (INR):

| Milestone | If Exists (Value Add) |
|-----------|----------------------|
| Sound idea (quality of pitch) | Up to Rs 1 Cr |
| Prototype / technology | Up to Rs 1 Cr |
| Quality management team | Up to Rs 1 Cr |
| Strategic relationships | Up to Rs 1 Cr |
| Product rollout / sales | Up to Rs 1 Cr |
| **Maximum pre-revenue valuation** | **Rs 5 Cr** |

### Risk Factor Summation — Per-Adjustment Amount by Stage:

| Stage | Per-Factor Adjustment |
|-------|----------------------|
| Idea | Rs 5 L |
| Pre-seed | Rs 15 L |
| Seed | Rs 40 L |
| Pre-Series A | Rs 1 Cr |
| Series A | Rs 2.5 Cr |
| Series B | Rs 10 Cr |
| Series C+ | Rs 25 Cr |

### Damodaran India Benchmark Values (January 2026):

**All ~90 Damodaran India industries are processed and stored in `public/data/damodaran/india-benchmarks.json`.** Below are the values for the primary Damodaran industries used by our 25 startup categories:

| Damodaran Industry | EV/Revenue | EV/EBITDA | WACC (%) | Unlevered Beta | Gross Margin (%) |
|-------------------|-----------|-----------|----------|---------------|-----------------|
| Software (System & Application) | 8.2x | 32.5x | 12.8% | 1.05 | 72% |
| Software (Internet) | 7.5x | 30.1x | 13.0% | 1.12 | 68% |
| Software (Entertainment) | 5.8x | 24.2x | 13.5% | 1.15 | 62% |
| Financial Svcs. (Non-bank & Insurance) | 5.4x | 22.1x | 14.2% | 1.18 | 55% |
| Insurance (General) | 2.8x | 12.5x | 12.0% | 0.78 | 40% |
| Investments & Asset Management | 6.2x | 18.3x | 11.5% | 0.85 | 58% |
| Banks (Regional) | 3.1x | — | 13.8% | 0.72 | — |
| Household Products | 3.5x | 20.4x | 12.2% | 0.82 | 48% |
| Retail (Special Lines) | 2.1x | 18.7x | 13.5% | 0.95 | 45% |
| Retail (General) | 1.8x | 15.2x | 14.0% | 1.10 | 35% |
| Retail (Grocery and Food) | 0.8x | 12.1x | 13.2% | 0.68 | 25% |
| Education | 4.8x | 25.3x | 13.1% | 0.92 | 65% |
| Healthcare Products | 5.1x | 21.8x | 12.5% | 0.88 | 60% |
| Healthcare Support Services | 3.2x | 16.5x | 13.0% | 0.90 | 42% |
| Hospitals/Healthcare Facilities | 2.5x | 14.2x | 12.8% | 0.85 | 38% |
| Information Services | 6.5x | 28.4x | 13.3% | 1.02 | 68% |
| Farming/Agriculture | 2.3x | 14.6x | 14.8% | 0.85 | 38% |
| Food Processing | 1.9x | 15.8x | 13.5% | 0.75 | 32% |
| Food Wholesalers | 0.5x | 10.2x | 13.0% | 0.65 | 18% |
| Transportation | 1.5x | 12.1x | 13.9% | 0.90 | 30% |
| Trucking | 1.2x | 10.5x | 14.2% | 0.95 | 25% |
| Green & Renewable Energy | 3.8x | 19.5x | 13.0% | 0.98 | 48% |
| Power | 2.5x | 11.8x | 12.5% | 0.72 | 35% |
| Computer Services | 4.2x | 18.5x | 12.0% | 0.88 | 55% |
| Entertainment | 3.5x | 20.8x | 14.0% | 1.20 | 50% |
| Real Estate (Operations & Services) | 2.8x | 15.2x | 14.5% | 1.08 | 35% |
| Real Estate (Development) | 1.5x | 10.8x | 15.0% | 1.15 | 28% |
| Auto & Truck | 1.2x | 11.5x | 13.5% | 1.05 | 22% |
| Auto Parts | 1.5x | 12.8x | 13.2% | 0.98 | 28% |
| Machinery | 2.0x | 14.5x | 13.8% | 1.02 | 32% |
| Engineering/Construction | 1.8x | 13.2x | 14.0% | 1.10 | 25% |
| Publishing & Newspapers | 2.5x | 14.8x | 13.5% | 0.92 | 45% |
| Broadcasting | 3.2x | 18.5x | 14.2% | 1.15 | 52% |
| Telecom Services | 2.8x | 8.5x | 12.5% | 0.70 | 55% |
| Telecom Equipment | 2.2x | 14.2x | 13.8% | 1.00 | 38% |
| Hotel/Gaming | 3.5x | 16.8x | 14.0% | 1.12 | 42% |
| Recreation | 2.8x | 15.5x | 13.5% | 1.05 | 38% |
| Business & Consumer Services | 3.0x | 16.2x | 13.0% | 0.92 | 45% |
| Environmental & Waste Services | 2.5x | 14.0x | 12.8% | 0.80 | 38% |
| Total Market (composite) | 3.2x | 18.0x | 13.5% | 1.00 | 50% |
| CleanTech | 3.8x | 19.5x | 13.0% | 0.98 | 48% |
| Other | 3.2x | 18.0x | 13.5% | 1.00 | 50% |

Source: Damodaran Online, pages.stern.nyu.edu/~adamodar/pc/datasets/ (psIndia.xls, vebitdaIndia.xls, waccIndia.xls, betaIndia.xls, marginIndia.xls). Values are sector medians for Indian companies. Updated annually every January.

**Note for implementers:** The `scripts/process-damodaran.py` script processes ALL ~90 Damodaran India industries:

1. **Input:** 5 Excel files downloaded to `data/raw/damodaran/` (psIndia.xls, vebitdaIndia.xls, waccIndia.xls, betaIndia.xls, marginIndia.xls)
2. **Process:** For each Excel, extract the industry name column and relevant metric column. Join all 5 into a single record per industry.
3. **Output:** `public/data/damodaran/india-benchmarks.json` containing ALL industries:
```json
{
  "Software (System & Application)": { "ev_revenue": 8.2, "ev_ebitda": 32.5, "wacc": 0.128, "beta": 1.05, "gross_margin": 0.72 },
  "Financial Svcs. (Non-bank & Insurance)": { "ev_revenue": 5.4, "ev_ebitda": 22.1, "wacc": 0.142, "beta": 1.18, "gross_margin": 0.55 },
  "Total Market": { "ev_revenue": 3.2, "ev_ebitda": 18.0, "wacc": 0.135, "beta": 1.00, "gross_margin": 0.50 }
}
```
4. **TypeScript usage:** `src/lib/data/damodaran-india.ts` imports this JSON. The Tier 2 mapping table (above) maps each startup category to a Damodaran industry key. Lookup: `damodaranData[SECTOR_MAPPING[userCategory].primary]`.
5. **Update:** Run `python scripts/process-damodaran.py` after downloading fresh Excel files (annually, every January).

### Market Constants:

| Constant | Value | Source | Update |
|----------|-------|--------|--------|
| India risk-free rate | 7.0% | 10-year India govt bond yield (Damodaran currencyriskfree.xlsx) | Annual |
| India equity risk premium | 7.5% | Damodaran countryriskfree.xlsx | Annual |
| India long-term GDP growth cap | 5.5% | IMF/RBI consensus | Annual |
| Nifty 50 market volatility | 0.22 (22% annualized) | 5-year Nifty 50 historical volatility | Annual |
| Tax rate | 25% | Indian corporate tax rate (new regime) | As legislation changes |

### Comparable Indian Startups Data:

Schema for `src/lib/data/comparable-companies.ts`:
```typescript
interface ComparableCompany {
  name: string;              // "Razorpay"
  sector: string;            // "fintech" (matches app sector enum)
  stage_at_round: string;    // "series_a" (matches app stage enum)
  last_round_size_cr: number; // 150 (in crores)
  valuation_cr: number;      // 3000 (post-money, in crores)
  revenue_cr: number | null; // 500 (if publicly known)
  year: number;              // 2024
  city: string;              // "Bangalore"
  business_model: string;    // "transaction_based"
  source: string;            // "Tracxn" | "public_announcement" | "media_report"
}
```

Matching algorithm:
1. Filter: same sector → candidates
2. Filter: stage within ±1 of startup's stage (e.g., Seed startup sees Pre-seed through Pre-Series A)
3. If revenue available: sort by absolute difference in revenue
4. If revenue not available: sort by stage proximity, then recency (newer first)
5. Return top 5

Sample data (10 entries — full list of 50+ compiled from Tracxn/public sources):

| Name | Sector | Stage | Round (Cr) | Valuation (Cr) | Revenue (Cr) | Year | City |
|------|--------|-------|-----------|---------------|-------------|------|------|
| Razorpay | fintech | series_c_plus | 500 | 56,000 | 2,100 | 2024 | Bangalore |
| Zerodha | fintech | series_a | 0 (bootstrapped) | 28,000 | 8,000 | 2024 | Bangalore |
| Meesho | e-commerce | series_b | 1,900 | 35,000 | 500 | 2023 | Bangalore |
| PhysicsWallah | edtech | series_a | 750 | 8,100 | 700 | 2023 | Noida |
| Lenskart | d2c | series_c_plus | 450 | 37,500 | 3,200 | 2024 | Delhi |
| Darwinbox | saas | series_b | 225 | 5,000 | 350 | 2024 | Hyderabad |
| Zetwerk | marketplace | series_b | 380 | 18,000 | 12,000 | 2024 | Bangalore |
| DeHaat | agritech | series_b | 150 | 2,200 | 400 | 2023 | Patna |
| Delhivery | logistics | series_c_plus | 800 | 22,000 | 5,500 | 2023 | Gurgaon |
| Healthifyme | healthtech | series_b | 120 | 1,500 | 200 | 2023 | Bangalore |

Data compiled from public sources (Tracxn, company announcements, media). Updated quarterly.

### Investor Database Schema and Sample Data:

Schema for `src/lib/data/investors.ts`:
```typescript
interface Investor {
  name: string;                 // "Sequoia Capital India"
  type: 'vc' | 'pe' | 'angel' | 'family_office' | 'cvc';
  sectors: string[];            // ["saas", "fintech", "healthtech"]
  stages: string[];             // ["seed", "series_a", "series_b"]
  check_size_min_cr: number;    // 5
  check_size_max_cr: number;    // 200
  city: string;                 // "Bangalore"
  portfolio_highlights: string[]; // ["Razorpay", "BrowserStack", "Zomato"]
  last_active_year: number;     // 2025
  website: string;              // "https://www.sequoiacap.com/india/"
}
```

**Sector Adjacency Matrix** (for "+1 point adjacent match"):

| Sector | Adjacent Sectors |
|--------|-----------------|
| SaaS | fintech, marketplace |
| Fintech | saas, e-commerce |
| D2C | e-commerce, marketplace |
| EdTech | healthtech, saas |
| HealthTech | edtech, d2c |
| E-commerce | d2c, marketplace, logistics |
| Marketplace | saas, e-commerce, d2c |
| AgriTech | logistics, cleantech |
| Logistics | e-commerce, agritech |
| CleanTech | agritech, logistics |

"Recent activity" = `last_active_year >= current_year - 1` (active in last 12 months based on public portfolio announcements).

Sample investor data (5 entries — full list of 40+ compiled from fusepl data + public sources):

| Name | Type | Sectors | Stages | Check Size (Cr) | City |
|------|------|---------|--------|-----------------|------|
| Sequoia Capital India | vc | saas, fintech, healthtech | seed, series_a, series_b | 5-200 | Bangalore |
| Accel India | vc | saas, fintech, marketplace | seed, series_a | 3-100 | Bangalore |
| Blume Ventures | vc | saas, d2c, edtech, healthtech | pre_seed, seed | 1-15 | Mumbai |
| Nexus Venture Partners | vc | fintech, e-commerce, agritech | seed, series_a, series_b | 5-150 | Delhi |
| India Quotient | vc | d2c, fintech, edtech | pre_seed, seed | 0.5-10 | Bangalore |

---

## User Flow (Full Platform)

```
LANDING PAGE
  Professional positioning + trust signals
  "India's Most Comprehensive Startup Valuation Platform"
  "By an IBBI-Registered Valuer | 5 Methods | Monte Carlo | Damodaran India Data"
  [Get Your Valuation] CTA
  [Cap Table Simulator] Secondary CTA
  [ESOP Calculator] Secondary CTA
      ↓
6-STEP WIZARD (3-5 minutes)
  Step 1: Company Profile
    - Company name, sector, stage, business model, city, founding year
  Step 2: Team
    - Team size, founder experience (1-5), domain expertise (1-5)
    - Previous exits (yes/no), technical co-founder (yes/no)
    - Key hires: CTO, CFO, sales lead (checkboxes)
  Step 3: Financials
    - Annual revenue (Rs), revenue growth %, gross margin %
    - Monthly burn, cash in bank
    - CAC, LTV (optional)
    - Last round size, last round valuation (optional — for context)
  Step 4: Market & Product
    - TAM (with tooltip: "Total addressable market in Rs Cr")
    - Dev stage (idea → scaling)
    - Competition level (1-5)
    - Competitive advantage type (multi-select)
    - Patents/IP (yes/no + count)
  Step 5: Strategic Factors
    - Strategic partnerships (none/one/multiple)
    - Regulatory risk (1-5)
    - Revenue concentration (top client %)
    - International revenue % (for FEMA relevance)
  Step 6: ESOP & Cap Table (optional, expandable)
    - ESOP pool % (default: stage-based recommendation)
    - Expected time to liquidity (years)
    - Current shareholders (founder %, investor %, ESOP %)
    - Next round: target raise amount, expected dilution %
      ↓
VALUATION REVEAL (FREE — no gate)
  "Your Estimated Valuation: Rs 8 - 12 Cr"
  Valuation Confidence Score: 78/100
  Method breakdown (5 methods with confidence bars):
    - Revenue Multiple: Rs 10 Cr (confidence: high)
    - DCF Analysis: Rs 9.2 Cr (confidence: medium)
    - Scorecard: Rs 11.5 Cr (confidence: high)
    - Berkus: Rs 8 Cr (confidence: medium)
    - Risk Factor: Rs 10.8 Cr (confidence: medium)
  Probabilistic range chart (P10/P25/P50/P75/P90)
  Weighted composite with method contribution pie chart
  Downside scenario: "In insolvency, similar companies recovered 15-35%"
  [Share on LinkedIn] [Share on Twitter] [Share on WhatsApp]
      ↓
EMAIL GATE (for detailed report + tools)
  "Enter your email to unlock:"
  ✓ Full methodology breakdown for all 5 methods
  ✓ Damodaran India benchmarks used
  ✓ Comparable Indian startups
  ✓ AI-powered insights from a VC perspective
  ✓ ESOP valuation (Black-Scholes)
  ✓ Cap Table Simulator
  ✓ Investor Match suggestions
  ✓ IBC downside analysis
  ✓ Downloadable PDF report
      ↓
DETAILED REPORT + TOOLS (unlocked)
  Section 1: Valuation summary with 5-method breakdown + weighted composite
  Section 2: Probabilistic range (Monte Carlo P10/P25/P50/P75/P90 distribution chart)
  Section 3: Each method — full inputs, assumptions, calculations shown
  Section 4: Damodaran India benchmarks (beta, WACC, EV/Revenue, EV/EBITDA, margins)
  Section 5: Comparable Indian startups (5 closest matches with funding data)
  Section 6: Downside analysis (IBC recovery data for your sector)
  Section 7: ESOP valuation estimate (Black-Scholes with sensitivity table)
  Section 8: Cap Table Simulator (interactive — pre/post money, dilution modeling)
  Section 9: AI narrative ("Here's what stands out about your startup...")
  Section 10: Investor matching (5 most relevant investors from database)
  Section 11: Recommendations + fundraise preparation checklist
  Section 12: Listed company comparables (Damodaran India multiples for sector)
  [Download PDF Report]
      ↓
CERTIFIED REPORT CTA
  "Need a legally valid valuation for fundraising?"
  "Get a certified Rule 11UA / FEMA report — Rs 14,999"
  "Signed by a registered valuer. Valid for RoC filing."
  [Get Certified Report] → Razorpay → fulfillment workflow
```

---

## Derived Fields (computed from wizard inputs)

These fields are NOT collected from the user but computed automatically:

```typescript
// Runway (months)
runway_months = monthly_burn > 0 ? cash_in_bank / monthly_burn : Infinity
// When used in factor scoring, Infinity maps to the highest tier (>18 months)

// LTV/CAC ratio (optional)
ltv_cac_ratio = (cac && cac > 0 && ltv) ? ltv / cac : null

// Has patents (boolean, derived from count)
has_patents = patents_count > 0

// ESOP pool default (based on stage, if not specified)
default_esop_pct = stage === 'seed' ? 12 : stage === 'series_a' ? 15 : stage === 'series_b' ? 10 : 10

// Startup volatility (for ESOP Black-Scholes)
startup_volatility = damodaran[sector].beta * MARKET_VOLATILITY * 1.5
// Where MARKET_VOLATILITY = 0.22 (from Market Constants table)
// Clamped to range [0.40, 0.80] (40-80% annualized)
```

---

## Valuation Methods (5 Core Methods + Monte Carlo)

### Method 1: Revenue Multiple

**Inputs:** Annual revenue, sector, growth rate, business model, LTV/CAC (optional)
**When applicable:** Revenue > Rs 0 (pre-revenue companies excluded)

**Calculation:**
1. Base multiple from Damodaran India EV/Revenue for sector (from psIndia.xls)
2. Growth adjustment: +2x if >200% growth, +1x if >100%, +0.5x if >50%
3. Business model premium: SaaS +1.5x, Marketplace +1x, Transaction +0.5x
4. Unit economics bonus: +1x if LTV/CAC > 5 (when provided)
5. Final = Revenue × adjusted multiple
6. Confidence: 0.9 if revenue > Rs 1 Cr, 0.7 if Rs 10L-1Cr, 0.4 if < Rs 10L

### Method 2: DCF (Discounted Cash Flow) with Monte Carlo

**Inputs:** Revenue, growth, gross margin, WACC (auto from Damodaran India)
**When applicable:** Revenue > Rs 0 (pre-revenue uses sector median as proxy, confidence 0.3)

**Deterministic DCF:**
1. Project revenue for 5 years: growth decays at 0.85/year
2. FCF = Revenue × gross_margin × 0.75 (proxy operating margin) × (1 - 25% tax)
3. Discount at Damodaran India WACC for sector (from waccIndia.xls)
4. Terminal value = FCF_year5 × (1 + 5.5%) / (WACC - 5.5%), where 5.5% = India long-term GDP cap
5. Enterprise value = PV of FCFs + PV of terminal value
6. Confidence: 0.85 if revenue > Rs 5 Cr, 0.6 if Rs 1-5 Cr, 0.3 if pre-revenue

**Monte Carlo overlay (runs in Web Worker):**
- 10,000 iterations (2,000 on mobile — detect via navigator.hardwareConcurrency <= 2)
- Growth sampled from Normal(stated_growth, stated_growth × 0.3)
- Margin mean-reverts to Damodaran sector median over 5 years
- WACC sampled from Normal(sector_wacc, 0.02)
- Output: P10, P25, P50, P75, P90 percentiles
- If WACC <= growth in any iteration, set WACC = growth + 0.02 (prevent infinity)
- Require 1,000+ valid iterations for output; else fall back to deterministic only

### Method 3: Scorecard (Bill Payne)

**Inputs:** All wizard qualitative data
**When applicable:** All stages (primary method for pre-revenue)

**Wizard-to-Factor Mapping (each factor scored 50-150%):**

| Factor | Weight | Wizard Mapping |
|--------|--------|---------------|
| Management team | 30% | (founder_exp + domain_exp) / 10 × 100 + exits_bonus(+25%) + tech_cofounder_bonus(+10%) |
| Market opportunity | 25% | TAM: <100Cr=60%, 100-1000Cr=90%, 1000-10000Cr=120%, >10000Cr=140% |
| Product/technology | 15% | dev_stage: idea=50%, prototype=70%, mvp=90%, beta=110%, production=130%, scaling=150% |
| Competition | 10% | competition_level inverse: 1=140%, 2=120%, 3=100%, 4=80%, 5=60% |
| Sales/marketing | 10% | revenue_growth: 0%=60%, <50%=80%, 50-100%=100%, 100-200%=120%, >200%=140% |
| Need for funding | 5% | runway: <6mo=60%, 6-12=80%, 12-18=100%, >18=130% |
| Other factors | 5% | city: metro(BLR/DEL/MUM)=120%, tier1=100%, tier2=80%, other=70% |

**Calculation:**
1. Base = stage-based pre-money from benchmark table
2. For each factor: compute raw score from wizard mapping, then **clamp to 50-150% range**
3. Sum weighted factor percentages → adjustment multiplier
4. Valuation = base × adjustment_multiplier
5. Confidence: 0.7 pre-revenue, 0.5 idea stage, 0.6 otherwise

### Method 4: Berkus Method

**Inputs:** Wizard qualitative data (team, product, market)
**When applicable:** Pre-revenue and early-stage (Idea through Seed). For later stages, runs with reduced confidence.

**Wizard-to-Milestone Mapping:**

| Milestone | Wizard → Score (0-100%) |
|-----------|------------------------|
| Sound idea | TAM: <100Cr=20%, 100-1000Cr=50%, 1000-10000Cr=80%, >10000Cr=100%. Plus competitive_advantage bonus (+10% each) |
| Prototype/technology | dev_stage: idea=0%, prototype=40%, mvp=70%, beta=90%, production=100%, scaling=100%. Plus patents_bonus(1 patent=+15%, 2+=+20%) |
| Quality management | (founder_exp + domain_exp) / 10 × 100. Plus exits_bonus(+25%), tech_cofounder_bonus(+15%) |
| Strategic relationships | partnerships: none=0%, one=50%, multiple=100%. Plus key_hires_bonus(+10% each for CTO/CFO/sales) |
| Product rollout/sales | revenue: Rs 0=0%, <10L=20%, 10L-50L=50%, 50L-1Cr=75%, >1Cr=100%. Plus growth_bonus(>100%=+20%) |

**Calculation:**
1. For each milestone: value_add = milestone_max_value × score_percentage
2. Total valuation = sum of all milestone value_adds
3. Cap at Rs 5 Cr for pre-revenue (Berkus principle)
4. Confidence: 0.8 for Idea/Pre-seed, 0.6 for Seed, 0.3 for later stages

### Method 5: Risk Factor Summation

**Inputs:** All wizard data including strategic factors
**When applicable:** All stages

**12 Risk Dimensions (each scored -2 to +2):**

| Risk Factor | Wizard → Score Mapping |
|-------------|----------------------|
| 1. Management | (founder_exp + domain_exp) / 10 mapped: <0.3=−2, 0.3-0.5=−1, 0.5-0.7=0, 0.7-0.9=+1, >0.9=+2. Plus exits_bonus(+1) |
| 2. Stage of business | dev_stage: idea=−2, prototype=−1, mvp=0, beta=+1, production=+2, scaling=+2 |
| 3. Legislation/political risk | regulatory_risk inverse: 5=−2, 4=−1, 3=0, 2=+1, 1=+2 |
| 4. Manufacturing risk | For hardware/manufacturing sectors: competition_level inverse. For software: auto +1 |
| 5. Sales/marketing risk | revenue_growth: 0%=−2, <50%=−1, 50-100%=0, 100-200%=+1, >200%=+2 |
| 6. Funding/capital risk | runway: <3mo=−2, 3-6=−1, 6-12=0, 12-18=+1, >18=+2 |
| 7. Competition risk | competition_level: 5=−2, 4=−1, 3=0, 2=+1, 1=+2 |
| 8. Technology risk | patents: yes=+1. dev_stage: production/scaling=+1, mvp/beta=0, earlier=−1 |
| 9. Litigation risk | Default 0. If sector=fintech: −1. User can override. |
| 10. International risk | international_revenue: 0%=0, 1-25%=+1, >25%=+1. Sector-specific: if software/SaaS, international is positive |
| 11. Reputation risk | Default 0. Positive if brand competitive_advantage selected (+1) |
| 12. Lucrative exit potential | TAM: <100Cr=−2, 100-1000Cr=−1, 1000-10000Cr=+1, >10000Cr=+2. Plus business_model: SaaS/marketplace=+1 |

**Calculation:**
1. Base = stage-based pre-money from benchmark table
2. Sum all risk scores (range: -24 to +24)
3. Adjustment = sum × per_factor_adjustment (from stage table)
4. Valuation = base + adjustment
5. Floor at Rs 10 L (no negative valuations)
6. Confidence: 0.65 for all stages (risk factor is broadly applicable)

### Valuation Confidence Score (0-100):

Composite score displayed prominently on results page:
- Data completeness: 0-30 points (each filled optional field = +3, required fields expected)
- Method agreement: 0-40 points (coefficient of variation of methods: <20% CV=40, 20-40%=25, >40%=10)
- Revenue maturity: 0-20 points (revenue >5Cr=20, 1-5Cr=15, 10L-1Cr=10, <10L=5, pre-rev=0)
- Data quality: 0-10 points (realistic ranges, internal consistency checks)

### Final Valuation:
- Weighted average of all applicable methods (weighted by confidence)
- Methods with confidence < 0.3 excluded from composite
- Pre-revenue companies: Scorecard + Berkus + Risk Factor (3 methods)
- Revenue companies: All 5 methods
- Display: individual method results + weighted composite + Monte Carlo range (P10-P90)
- Show method contribution breakdown (pie chart)

---

## Downside Analysis (Leveraging IBC Dataset)

**Unique feature — no other free tool offers this.**

Using the 3,952 corporate debtor records from the IBC valuation dataset:

**Display in report:**
"In insolvency scenarios, companies in your sector ({sector}) historically recovered {X-Y}% of admitted claims."

**Sector recovery benchmarks (from IBC data):**
| Sector | Avg Recovery % | Sample Size |
|--------|---------------|-------------|
| Manufacturing | 25-35% | Large |
| Real Estate | 10-20% | Medium |
| Services/IT | 30-45% | Medium |
| Infrastructure | 15-25% | Medium |
| Retail/Consumer | 20-30% | Small |
| Other | 10-40% | Large |

**How it's calculated:**
- From `corporate_debtors.parquet`: filter by closest sector match
- Recovery % = resolution_plan_value / total_admitted_claims
- Show range (P25 to P75) for realistic expectation
- Note: "This is the worst-case scenario. Going-concern valuation (what we computed above) is typically 2-5x higher than liquidation value."

**Why founders care:** Sophisticated founders and VCs want to understand downside protection. Showing "even in the worst case, you'd recover Rs X" builds credibility and demonstrates you understand the full spectrum.

---

## ESOP Valuation (Leveraging pValuation — Black-Scholes)

**Unique feature — adapted from pValuation's Black-Scholes implementation.**

For companies with ESOPs, provide per-share ESOP value with sensitivity analysis.

**Inputs (from Step 6 of wizard, or defaults):**
- Current valuation (from our 5-method computation)
- Total shares outstanding (default: 10,00,000)
- ESOP pool % (default from stage: Seed=12%, Series A=15%, Series B=10%)
- Exercise price per share (default: Rs 10 face value)
- Expected time to liquidity (default: 4 years)
- Volatility: derived from Damodaran India unlevered beta for sector (from betaIndia.xls)
  - Startup volatility = sector_beta × market_volatility × 1.5 (startup premium)
  - Typical range: 40-80% annualized

**Calculation (Black-Scholes adapted):**
```
d1 = (1/(σ√t)) × [ln(S/K) + (r + σ²/2)t]
d2 = d1 - σ√t
ESOP_value = N(d1) × S - N(d2) × K × e^(-rt)

Where:
  S = current per-share value (valuation / total shares)
  K = exercise price (typically face value, Rs 10)
  σ = startup volatility (from Damodaran beta × 1.5)
  r = India risk-free rate (from currencyriskfree.xlsx, ~7%)
  t = years to expected liquidity event
```

**Sensitivity Table (displayed in report):**

| Scenario | Volatility | Time to Exit | ESOP Value/Share |
|----------|-----------|-------------|-----------------|
| Conservative | σ + 20% | t + 1 year | Rs {computed} |
| Base Case | σ | t | Rs {computed} |
| Optimistic | σ - 10% | t - 1 year | Rs {computed} |

**Display:** "Each ESOP share (exercise price Rs 10) is estimated at Rs {X}, representing a {Y}x potential return over {t} years."

**Disclaimer:** "This is an indicative estimate using Black-Scholes. Actual ESOP value depends on exit timing, dilution, and liquidity preferences."

---

## Cap Table Simulator (Leveraging fusepl-valuation-tool patterns)

**Interactive tool — available in detailed report section after email capture.**

Inspired by fusepl-valuation-tool's cap table calculator but built fresh with Indian context.

### Features:
1. **Current Cap Table Visualization:**
   - Pie chart showing current ownership: Founders %, Investors %, ESOP %
   - Input: Up to 10 shareholder entries (name, %, share class)
   - Pre-populated from wizard Step 6 data

2. **Next Round Modeling:**
   - Input: Target raise amount (Rs), pre-money valuation (from our computation)
   - Auto-calculate: post-money, new investor %, dilution to existing shareholders
   - Show before/after comparison with bar chart

3. **Multi-Round Projection (up to 3 future rounds):**
   - For each round: raise amount, expected pre-money multiple (1.5x, 2x, 3x, 5x)
   - Show cumulative dilution waterfall chart
   - Founder ownership trajectory: "After Series A, founders hold {X}%"

4. **ESOP Pool Impact:**
   - Toggle ESOP pool creation/expansion
   - Show dilution impact of creating new ESOP pool pre-round vs post-round
   - Recommendation: "Create ESOP pool before the round to avoid diluting new investors"

### Calculation:

**Basic round modeling:**
```
post_money = pre_money + raise_amount
new_investor_pct = raise_amount / post_money
existing_dilution = 1 - (pre_money / post_money)

For each existing shareholder:
  new_pct = old_pct × (1 - new_investor_pct)
```

**ESOP pool — Pre-round creation (recommended):**
```
// ESOP carved from existing shareholders BEFORE new investor enters
esop_shares = total_shares × esop_expansion_pct
For each existing shareholder:
  diluted_pct = old_pct × (1 - esop_expansion_pct)
// Then apply new investor dilution on top:
  final_pct = diluted_pct × (1 - new_investor_pct)
// New investor is NOT diluted by ESOP pool
new_investor_final_pct = new_investor_pct
```

**ESOP pool — Post-round creation:**
```
// First, new investor enters at negotiated percentage
// Then ESOP carved from ALL shareholders including new investor
For each shareholder (including new investor):
  final_pct = post_round_pct × (1 - esop_expansion_pct)
// New investor IS diluted by ESOP pool
```

**UI toggle:** Radio buttons: "Create ESOP pool before round (recommended)" vs "Create ESOP pool after round". Show side-by-side comparison of founder % in both scenarios.

### Display:
- Interactive sliders for raise amount and pre-money
- Real-time recalculation as user adjusts
- Export cap table as CSV
- Include in PDF report

---

## Investor Matching (Leveraging fusepl-valuation-tool investor data)

**Powered by the investor database from fusepl-valuation-tool.**

### Data Source:
From `fusepl-valuation-tool/src/lib/data/investors.ts` — contains Indian VC/PE fund data with:
- Fund name, type (VC, PE, Angel, Family Office)
- Sector preferences
- Stage preferences
- Typical check size
- Notable portfolio companies
- Location

### Matching Algorithm:
1. Filter by stage match (investor's stage preference includes startup's stage)
2. Filter by sector match (investor's sector preference includes startup's sector)
3. Filter by check size (startup's target raise within investor's typical range)
4. Score remaining investors:
   - Exact sector match: +3 points
   - Adjacent sector match: +1 point
   - Stage sweet spot: +2 points
   - Geographic proximity (same city): +1 point
   - Recent activity in sector: +1 point (from portfolio data)
5. Return top 5 matches sorted by score

### Display in Report:
"Based on your profile, these investors are most relevant:"

| Investor | Type | Check Size | Why Matched |
|----------|------|-----------|-------------|
| {name} | {type} | Rs {range} | {sector} focus, active at {stage} |

**Disclaimer:** "Investor suggestions are based on publicly available investment preferences. Introductions are not guaranteed. For warm introductions, consider our advisory service."

### Future Enhancement:
- Investor opt-in directory (investors register, get discovered by founders)
- Track which investors founders click → build recommendation engine
- Premium: "Get introduced" feature (Rs 4,999/introduction)

---

## Listed Company Comparables (Leveraging PKScreener + Damodaran India)

For **Series B+ and late-stage startups** approaching IPO, provide listed company comparables.

### Implementation:
- Map the startup's sector to NSE/BSE listed companies via Damodaran India sector mapping
- Pull current P/E, EV/Revenue, EV/EBITDA from Damodaran India datasets
- Apply private company illiquidity discount: **default 30%** for primary display
  - Stage adjustment: Series C+ = 20%, Series B = 25%, Series A = 30%, earlier = 35%
- Show sensitivity table: "At 20%/30%/40% illiquidity discount, your valuation equivalent would be Rs {X}/{Y}/{Z} Cr"

### Display:
"Public companies in {Damodaran_industry} trade at {X}x EV/Revenue (Damodaran India, Jan 2026)."
"At your revenue of Rs {Y} Cr, a public-market-equivalent valuation would be Rs {Z} Cr."
"After typical private company illiquidity discount (30%), adjusted valuation: Rs {W} Cr."

### For All Stages (not just Series B+):
Even early-stage companies benefit from seeing "this is where public markets value your sector" — it sets expectations for what multiples to target at exit.

### Data Source:
- Damodaran India datasets: psIndia.xls (EV/Revenue), vebitdaIndia.xls (EV/EBITDA), peIndia.xls (P/E)
- Pre-processed to static JSON files
- Updated annually (January with Damodaran refresh)

---

## AI Narrative Analysis

**Provider:** Claude API (claude-haiku-4-5, ~$0.002/call)

**Trigger:** Server-side, after email capture. Cached in Supabase.

**Prompt:**
```
You are a senior Indian VC analyst with 15 years experience evaluating startups across India.
Analyze this startup and provide investment-grade insights:

Company: {company_name} | Sector: {sector} | Stage: {stage}
Revenue: Rs {revenue}, Growth: {growth}%, Gross Margin: {margin}%
Burn: Rs {burn}/month, Runway: {runway} months
Team: {founder_exp}/5 experience, {domain_exp}/5 domain expertise, Previous exits: {exits}
Product: {dev_stage}, Competition: {competition_level}/5
TAM: Rs {tam} Cr
Competitive advantages: {advantages}
Valuation estimate: Rs {low}-{high} Cr (5-method weighted average)
Confidence score: {score}/100

IBC context: Companies in {sector} recover {recovery_range}% in insolvency scenarios.
Damodaran India multiples: {sector} trades at {ev_revenue}x EV/Revenue.

Provide exactly 4 sections (under 300 words total):

1. INVESTMENT THESIS (2-3 sentences): What makes this startup investable? Be specific to their numbers and sector. Reference the Damodaran multiple context.

2. KEY RISKS (bullet points): Top 3 risks an investor would flag. Reference specific numbers (burn rate, competition level, margin). Include downside context from IBC data.

3. VALUATION OPINION: Is the estimated range reasonable? Compare to public market multiples. Note whether the valuation accounts for the stage discount appropriately.

4. FUNDRAISE PLAYBOOK (3 concrete actions): What should the founder do in the next 90 days before approaching investors? Be tactical, not generic.

Use INR. Reference Indian market context. Be direct, not diplomatic.
```

**Cost Control:**
- Only runs after email capture
- Cache in Supabase — don't re-run for same valuation inputs
- Rate limit: 100 calls/day initially (scale as revenue grows)
- Fallback: If API fails, show "AI analysis will be available shortly" + retry 3x with exponential backoff (1s, 4s, 16s)
- Budget alarm: If daily spend > Rs 500, alert admin

---

## Technical Architecture

### Directory Structure:

```
firstunicornstartup/
├── src/
│   ├── app/
│   │   ├── layout.tsx                    # Root layout
│   │   ├── page.tsx                      # Landing page
│   │   ├── valuation/page.tsx            # Wizard + results
│   │   ├── report/[id]/page.tsx          # Detailed report (post-email)
│   │   ├── cap-table/page.tsx            # Standalone cap table tool (SEO)
│   │   ├── esop-calculator/page.tsx      # Standalone ESOP tool (SEO)
│   │   └── api/
│   │       ├── capture/route.ts          # Email + valuation storage
│   │       ├── ai-analysis/route.ts      # Claude proxy
│   │       ├── certified/route.ts        # Razorpay webhook handler
│   │       └── health/route.ts           # Health check
│   ├── components/
│   │   ├── landing/
│   │   │   ├── hero.tsx                  # Professional hero
│   │   │   ├── trust-signals.tsx         # Credentials, data sources
│   │   │   ├── how-it-works.tsx          # 3-step explainer
│   │   │   ├── method-showcase.tsx       # 5 methods preview
│   │   │   ├── testimonials.tsx          # Social proof (placeholder initially)
│   │   │   └── footer.tsx
│   │   ├── wizard/
│   │   │   ├── wizard-container.tsx      # 6-step navigation + progress bar
│   │   │   ├── company-step.tsx          # Step 1
│   │   │   ├── team-step.tsx             # Step 2
│   │   │   ├── financials-step.tsx       # Step 3
│   │   │   ├── market-product-step.tsx   # Step 4
│   │   │   ├── strategic-step.tsx        # Step 5
│   │   │   └── esop-captable-step.tsx    # Step 6 (optional/expandable)
│   │   ├── results/
│   │   │   ├── valuation-reveal.tsx      # Main result + confidence score
│   │   │   ├── method-cards.tsx          # 5 method results with details
│   │   │   ├── method-contribution.tsx   # Pie chart: weight of each method
│   │   │   ├── monte-carlo-chart.tsx     # Distribution + percentile markers
│   │   │   ├── confidence-breakdown.tsx  # What drove the confidence score
│   │   │   ├── share-buttons.tsx         # LinkedIn / Twitter / WhatsApp share
│   │   │   └── email-gate.tsx            # Unlock detailed report
│   │   ├── report/
│   │   │   ├── methodology.tsx           # Full 5-method breakdown
│   │   │   ├── benchmarks.tsx            # Damodaran India data tables
│   │   │   ├── comparables.tsx           # Indian startup matches
│   │   │   ├── listed-comparables.tsx    # Public market sector multiples
│   │   │   ├── downside-analysis.tsx     # IBC recovery data
│   │   │   ├── esop-estimate.tsx         # Black-Scholes + sensitivity table
│   │   │   ├── cap-table-simulator.tsx   # Interactive cap table
│   │   │   ├── investor-matching.tsx     # Top 5 investor matches
│   │   │   ├── ai-narrative.tsx          # Claude insights
│   │   │   ├── recommendations.tsx       # Action items + checklist
│   │   │   └── certified-cta.tsx         # Rs 14,999 upsell
│   │   └── ui/                           # shadcn components
│   ├── lib/
│   │   ├── valuation/
│   │   │   ├── index.ts                  # Orchestrator (runs all methods, computes composite)
│   │   │   ├── revenue-multiple.ts       # Method 1
│   │   │   ├── dcf.ts                    # Method 2 (deterministic)
│   │   │   ├── scorecard.ts              # Method 3
│   │   │   ├── berkus.ts                 # Method 4
│   │   │   ├── risk-factor.ts            # Method 5
│   │   │   ├── confidence-score.ts       # Composite confidence calculator
│   │   │   └── monte-carlo.worker.ts     # Web Worker for MC simulation
│   │   ├── data/
│   │   │   ├── damodaran-india.ts        # Betas, WACC, EV/Revenue, EV/EBITDA, margins
│   │   │   ├── sector-benchmarks.ts      # Stage × sector benchmarks
│   │   │   ├── comparable-companies.ts   # 50+ Indian startups with funding data
│   │   │   ├── ibc-recovery.ts           # IBC sector recovery rates
│   │   │   ├── investors.ts              # Indian VC/PE database
│   │   │   └── sector-mapping.ts         # App sector → Damodaran mapping
│   │   ├── calculators/
│   │   │   ├── esop-valuation.ts         # Black-Scholes for ESOPs
│   │   │   ├── cap-table.ts              # Dilution, multi-round, waterfall
│   │   │   └── burn-rate.ts              # Runway calculator
│   │   ├── matching/
│   │   │   └── investor-match.ts         # Investor matching algorithm
│   │   ├── export/
│   │   │   ├── pdf-generator.ts          # jsPDF report (all sections)
│   │   │   └── csv-export.ts             # Cap table CSV
│   │   └── utils.ts                      # INR formatting, date helpers
│   ├── stores/
│   │   └── valuation-store.ts            # Zustand (persisted to localStorage)
│   └── types/
│       └── index.ts                      # All TypeScript interfaces
├── public/
│   └── data/
│       ├── damodaran/                    # Pre-processed JSON (betas, WACC, multiples)
│       └── ibc/                          # IBC recovery benchmarks JSON
├── supabase/
│   ├── migrations/
│   │   └── 001_schema.sql
│   └── functions/
│       └── ai-analysis/
├── scripts/
│   └── process-damodaran.py              # Excel → JSON converter
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

### Database Schema:

```sql
-- Users table
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

  -- Computed results (stored for analytics)
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
  payment_id TEXT,
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

-- Indexes for analytics queries
CREATE INDEX idx_valuations_sector ON valuations(sector);
CREATE INDEX idx_valuations_stage ON valuations(stage);
CREATE INDEX idx_valuations_created ON valuations(created_at);
CREATE INDEX idx_valuations_city ON valuations(city);
CREATE INDEX idx_events_session ON page_events(session_id);
CREATE INDEX idx_events_event ON page_events(event);
CREATE INDEX idx_certified_status ON certified_requests(status);

-- RLS policies
ALTER TABLE valuations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE certified_requests ENABLE ROW LEVEL SECURITY;

-- Service role can read all (for admin/analytics)
CREATE POLICY "Service role full access" ON valuations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON users FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access" ON certified_requests FOR ALL USING (auth.role() = 'service_role');

-- Anon role: insert via API routes only (server-side uses service_role key)
-- All inserts go through /api/capture which uses service_role, NOT anon direct insert
-- This prevents arbitrary data injection. Client never writes directly to Supabase.

-- Anon role: read own valuation by UUID (for report page /report/[id])
-- UUID v4 is unguessable (122-bit random), so this is safe
CREATE POLICY "Anon can read valuation by id" ON valuations FOR SELECT USING (true);
-- Note: Security relies on UUID unguessability, not RLS filtering by user.
-- The /report/[id] page fetches by UUID — only someone with the link can access.

-- page_events: anon can insert (analytics), no read needed from client
ALTER TABLE page_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role full access events" ON page_events FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Anon can insert events" ON page_events FOR INSERT WITH CHECK (true);
```

**Data flow:** All valuation writes happen through `/api/capture` (Next.js API route) which uses the Supabase **service_role** key server-side. The client never writes directly to Supabase. This prevents data pollution since the API route validates inputs before inserting.

### API Routes:

| Route | Method | Purpose | Rate Limit |
|-------|--------|---------|-----------|
| `/api/capture` | POST | Store email + valuation data, return report URL | 10/IP/hour |
| `/api/ai-analysis` | POST | Claude proxy, cache result in Supabase | 100/day total |
| `/api/certified` | POST | Razorpay webhook → create certified_request | Razorpay signed |
| `/api/health` | GET | Health check for monitoring | No limit |

---

## Certified Report — Rs 14,999 (Primary Revenue Product)

### What the Customer Gets:
- Professionally formatted PDF (15-20 pages)
- Compliant with Rule 11UA (Income Tax) or FEMA (foreign investment) format
- Signed by registered valuer (you) with registration number
- Valid for RoC filing, investor submissions, tax compliance
- 5 valuation methods with full methodology disclosure
- Damodaran India data citations with source references
- Comparable company analysis
- Risk assessment with IBC downside context
- Cap table analysis and ESOP valuation
- Delivered within 48 hours of payment

### Report Types:
1. **Rule 11UA Report** (most common) — for share issuance to residents
   - Methods: DCF + NAV (as prescribed by Rule 11UA)
   - Includes: Fair market value computation, assumptions documented
2. **FEMA Pricing Report** — for foreign investor rounds
   - Methods: Any internationally accepted methodology
   - Includes: Arm's length pricing certificate
3. **General Valuation Report** — for board/investor presentations
   - Methods: All 5 methods with Monte Carlo
   - Includes: Full analysis, cap table impact, investor landscape

### Fulfillment Workflow:

```
Founder clicks "Get Certified Report" on report page
    ↓
Select report type: Rule 11UA / FEMA / General
Enter purpose: "Series Seed fundraise" / "CCPS issuance" / etc.
    ↓
Razorpay payment (Rs 14,999)
    ↓
On payment success (Razorpay webhook → /api/certified):
  - Create certified_request record with status='paid'
  - Send confirmation email to founder (via Supabase Edge Function)
  - Send notification email to admin with:
    - Valuation ID (link to all founder inputs)
    - Report type requested
    - Purpose stated
    ↓
Admin (the valuer) within 48 hours:
  - Review the founder's inputs in Supabase dashboard
  - Use the free report data as starting point
  - Add professional judgment, adjust assumptions
  - Format in certified report template
  - Sign with valuer credentials
  - Upload signed PDF to Supabase Storage
  - Update certified_request status='delivered'
    ↓
Founder receives email: "Your certified report is ready"
  - Download link to signed PDF
  - Valid for 90 days from valuation date (per Rule 11UA)
```

### Admin Dashboard (Simple — initial):
- Use Supabase Table Editor to view/manage certified_requests
- Filter by status: 'paid' (needs action), 'delivered' (done)
- Build proper admin panel when volume exceeds 20/month

---

## Input Validation

### Financial Inputs:
- `annual_revenue`: >= 0. If 0 → pre-revenue (Revenue Multiple excluded). Max Rs 10,000 Cr.
- `revenue_growth_pct`: -100% to 1000%.
- `gross_margin_pct`: 0% to 100%. Required if revenue > 0. Default 60% for SaaS, 30% for E-commerce.
- `monthly_burn`: >= 0. If 0 → profitable/bootstrapped.
- `cash_in_bank`: >= 0.
- `tam`: >= 0. Warning if TAM > Rs 1,00,000 Cr (likely unrealistic).
- `cac`, `ltv`: Optional. >= 0. Warning if LTV/CAC < 1 ("Unit economics are negative").
- `last_round_size`, `last_round_valuation`: Optional. >= 0.

### Qualitative Inputs:
- All 1-5 scales: integer, min 1, max 5.
- `competition_level`: required.
- `competitive_advantages`: multi-select from: network_effects, proprietary_tech, brand, cost_advantage, switching_costs, regulatory, data_moat, none.
- `dev_stage`: required, single-select: idea, prototype, mvp, beta, production, scaling.
- `strategic_partnerships`: required, single-select: none, one, multiple.
- `regulatory_risk`: default 3.

### Cap Table Inputs:
- `esop_pool_pct`: 0-30%. Default based on stage.
- `time_to_liquidity_years`: 1-10. Default 4.
- Shareholder entries: name (text), percentage (0-100), must sum to 100%.
- `target_raise`: >= 0. `expected_dilution_pct`: 0-50%.

### Edge Cases:
- Pre-revenue: Scorecard + Berkus + Risk Factor (3 methods). DCF uses sector-median proxy (confidence 0.3). Revenue Multiple excluded.
- All financials zero (Idea stage): Scorecard + Berkus only. Display: "At the Idea stage, valuation is primarily driven by team and market potential."
- Very high growth (>500%): Cap growth decay to ensure DCF doesn't explode. Show note.
- Cap table doesn't sum to 100%: Warn, auto-normalize on confirm.

---

## Error Handling

| Scenario | Handling |
|----------|----------|
| Supabase down during email capture | localStorage fallback, retry on next load, queue for sync |
| Claude API error/timeout | "AI analysis loading..." placeholder, 3x retry with exponential backoff (1s, 4s, 16s), graceful "unavailable" after |
| Razorpay payment fails | Razorpay's built-in error UI. Keep CTA visible. No certified_request created until webhook confirms. |
| Direct nav to `/report/[id]` | Check Supabase for ID. If exists → render. If not → redirect to `/valuation`. |
| Browser closed mid-wizard | Zustand persisted to localStorage. Resume on return. Show "Welcome back" toast. |
| DCF produces NaN/Infinity | Clamp: WACC must be > growth + 0.02. Exclude invalid MC iterations. Need 1,000+ valid for output. |
| Monte Carlo timeout (>10s) | Reduce to 2,000 iterations. If still fails, deterministic DCF only. |
| Cap table percentages don't sum | Warning banner, auto-normalize option |
| No investor matches found | "No exact matches in our database. Browse all investors at [link]." |

---

## Security

- Report URLs use UUID v4 (122 bits randomness) — infeasible to guess
- Supabase RLS: service role for admin, anon role for insert only
- ANTHROPIC_API_KEY only in server-side API routes, never in client bundle
- RAZORPAY_KEY_SECRET only server-side; RAZORPAY_KEY_ID in client (public key)
- Razorpay webhook signature verification using X-Razorpay-Signature header
- `/api/capture`: 10 req/IP/hour rate limit (Vercel Edge Middleware)
- `/api/ai-analysis`: 100 calls/day budget cap with counter in Supabase
- All text inputs sanitized for XSS before Supabase insert (DOMPurify)
- No financial data in URLs or query params
- CSP headers: restrict script sources
- CORS: only firstunicornstartup.com origin

---

## PDF Report Specification

**Library:** jsPDF (client-side)

**Sections in downloadable PDF (15+ pages):**
1. Cover page: "Startup Valuation Report — {company_name}" + date + branding
2. Executive summary: low/mid/high range + weighted average + confidence score
3. Methodology overview: which methods applied and why
4. Method 1-5: Individual method breakdown with inputs, calculations, result
5. Monte Carlo distribution chart (rendered as image via html2canvas)
6. Damodaran India benchmarks table (sector beta, WACC, EV/Revenue, EV/EBITDA, margins)
7. Top 5 comparable Indian startups (table with funding data)
8. Listed company comparables (sector multiples + illiquidity discount)
9. Downside analysis: IBC recovery range for sector
10. ESOP valuation with sensitivity table
11. Cap table: current + post-next-round
12. Top 5 investor matches
13. AI narrative (if generated)
14. Recommendations + fundraise checklist
15. Disclaimers + data attribution
16. Footer: "Indicative estimate — not a certified valuation. For a legally valid report: firstunicornstartup.com"

**Score badge for social sharing:**
- 1200×630px via html2canvas
- Shows: valuation range, confidence score, company name, branding
- Used as og:image for share URLs

---

## Currency & Formatting

- All INR values in lakh/crore notation: < Rs 1 Cr → "Rs X L", >= Rs 1 Cr → "Rs X.X Cr"
- Use "Rs" prefix consistently (not ₹ symbol — easier to render across devices/PDF)
- Input fields accept plain numbers, auto-format on display
- Percentages displayed with 1 decimal: "23.5%"
- Large numbers use Indian comma format: 1,00,000 (not 100,000)

---

## Data Freshness

| Source | Vintage | Update | Process |
|--------|---------|--------|---------|
| Damodaran India | Jan 2026 | Annual (January) | Download Excel → Python script → JSON → commit |
| Sector benchmarks | 2024 compiled | Every 6 months | Manual from Tracxn, VCCEdge |
| Comparable companies | 2024-2025 | Quarterly | Add notable rounds |
| Investor database | 2024-2025 | Quarterly | Refresh from public sources |
| IBC recovery data | Mar 2026 | Quarterly | Re-run pipeline on new IBBI data |
| Percentile tables | Pre-computed | Monthly (after 500 users) | Recompute from Supabase data |

Footer in all reports: "Industry benchmarks: Damodaran Online, January 2026."

---

## Monetization Summary

| Tier | Price | What | Revenue Target (90 days) |
|------|-------|------|-------------------------|
| Free | Rs 0 | 5-method valuation + email capture | 400 emails |
| Detailed Report | Rs 0 (post-email) | Full breakdown + cap table + investor matches + AI | Lead nurture |
| Certified Report | Rs 14,999 | Rule 11UA / FEMA compliant, signed by RV | 20 reports = Rs 3L |
| Full Engagement | Rs 49,999-1,99,999 | M&A, IBC, complex valuations | 2-3 engagements |
| VC Data (future) | Rs 50,000/yr | Anonymized benchmarks dashboard | After 1,000 valuations |

---

## Success Metrics (First 90 Days)

| Metric | Target |
|--------|--------|
| Wizard starts | 2,000 |
| Wizard completions | 1,000 (50%) |
| Email captures | 400 (40% of completions) |
| LinkedIn shares | 100 |
| Cap table tool usage | 200 |
| ESOP calculator usage | 150 |
| Certified report purchases | 20 |
| Revenue | Rs 3,00,000 |

---

## Standalone SEO Pages

Two standalone tools that double as SEO landing pages:

### `/cap-table` — Cap Table Simulator
- Works without going through the valuation wizard
- Standalone tool for founders modeling dilution
- SEO target: "startup cap table calculator india"
- Captures email for full multi-round modeling
- Links back to full valuation wizard

### `/esop-calculator` — ESOP Valuation Calculator
- Standalone Black-Scholes ESOP calculator
- SEO target: "esop valuation calculator india black scholes"
- Captures email for detailed sensitivity analysis
- Links back to full valuation wizard

Both pages share components with the main report but work independently.

---

## Build Approach

All code built fresh. Inspired by patterns from existing repos but no copy-paste:
- **fusepl-valuation-tool:** 5 valuation method architecture, Indian benchmarks structure, calculator patterns (cap table, burn rate, unit economics), investor database
- **StartupValuator:** Database schema patterns, AI integration approach, report generation
- **pValuation:** Monte Carlo simulation approach (dcf_stoch), Black-Scholes ESOP valuation (option_value), sensitivity analysis patterns
- **ibc-valuation-dataset:** IBC sector recovery benchmarks for downside analysis (190 landmark cases, 3,952 corporate debtors)
- **Damodaran datasets:** India-specific betas (betaIndia.xls), WACC (waccIndia.xls), EV/Revenue (psIndia.xls), EV/EBITDA (vebitdaIndia.xls), margins (marginIndia.xls) — processed to static JSON
- **PKScreener:** NSE/BSE stock data architecture patterns for listed comparables
- **Automated-Fundamental-Analysis:** Sector-relative percentile grading methodology for confidence scoring

---

## Phase 2 (Post-Launch, Not Blocking)

- User accounts / login / dashboard / saved history
- Real-time NSE/BSE data integration via PKScreener patterns
- Automated certified report pipeline (AI-assisted template generation)
- Blog / CMS for SEO content
- Referral system ("Share with a founder, get Rs 500 off certified report")
- Multi-language (Hindi, Gujarati, Marathi)
- VC analytics dashboard (aggregate anonymized data)
- Investor opt-in directory
- Warm introduction marketplace

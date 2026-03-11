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

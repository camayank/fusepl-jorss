-- Migration 003: Purpose-based pricing + Deal Check module

-- Add purpose tracking to valuations
ALTER TABLE valuations ADD COLUMN IF NOT EXISTS purpose TEXT DEFAULT 'indicative';
ALTER TABLE valuations ADD COLUMN IF NOT EXISTS paid_purpose TEXT DEFAULT NULL;

-- Backfill: existing certified_requests -> set paid_purpose on matching valuations
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

-- RLS for deal_checks
ALTER TABLE deal_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts on deal_checks"
  ON deal_checks FOR INSERT
  WITH CHECK (true);
CREATE POLICY "Allow read deal_checks"
  ON deal_checks FOR SELECT
  USING (true);

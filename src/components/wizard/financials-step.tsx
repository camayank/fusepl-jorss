'use client'

import { useMemo } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatINR } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Activity, TrendingUp, Wallet } from 'lucide-react'
import { RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts'
import { useAnimatedCounter, staggerContainer, staggerItem } from './wizard-container'

function CurrencyInput({ label, value, onChange, placeholder, help }: {
  label: string; value: number | null; onChange: (v: number | null) => void;
  placeholder?: string; help?: string
}) {
  return (
    <div>
      <Label className="text-[oklch(0.72_0.005_250)] text-xs font-semibold uppercase tracking-wider">{label}</Label>
      {help && <p className="text-[10px] text-[oklch(0.42_0.01_250)] mb-1">{help}</p>}
      <div className="relative mt-1">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[oklch(0.45_0.01_250)] text-sm font-mono">₹</span>
        <Input
          type="number"
          value={value ?? ''}
          onChange={(e) => { const v = e.target.value; onChange(v === '' ? null : parseFloat(v)) }}
          placeholder={placeholder || '0'}
          className="bg-[oklch(0.12_0.012_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.92_0.005_250)] pl-7 h-10"
        />
      </div>
      {value !== null && value > 0 && (
        <p className="text-[10px] text-[oklch(0.72_0.17_162/0.7)] mt-1 font-mono">{formatINR(value)}</p>
      )}
    </div>
  )
}

function computeHealthScore(inputs: {
  annual_revenue: number; revenue_growth_pct: number; gross_margin_pct: number;
  monthly_burn: number; cash_in_bank: number; cac: number | null; ltv: number | null
}): { score: number; label: string } {
  let score = 0
  if (inputs.monthly_burn > 0 && inputs.cash_in_bank > 0) {
    score += Math.min(25, (inputs.cash_in_bank / inputs.monthly_burn) * 1.4)
  } else if (inputs.cash_in_bank > 0) { score += 20 }
  if (inputs.annual_revenue > 0) { score += Math.min(30, Math.max(0, inputs.revenue_growth_pct * 0.3)) }
  score += Math.min(25, inputs.gross_margin_pct * 0.3)
  if (inputs.cac && inputs.ltv && inputs.cac > 0) { score += Math.min(20, (inputs.ltv / inputs.cac) * 5) }
  const rounded = Math.round(Math.min(100, score))
  const label = rounded >= 75 ? 'Strong financials' : rounded >= 50 ? 'Healthy foundation' : rounded >= 25 ? 'Building momentum' : 'Early stage — focus on growth'
  return { score: rounded, label }
}

function getHealthColor(score: number): string {
  if (score >= 70) return 'oklch(0.65 0.16 155)'
  if (score >= 40) return 'oklch(0.72 0.14 80)'
  return 'oklch(0.62 0.18 25)'
}

/* ─── Financial Health Radial Gauge (Hero) ─────────────────────────── */
function HealthRadialGauge({ score, color, label }: { score: number; color: string; label: string }) {
  const animatedScore = useAnimatedCounter(score)
  const data = [{ value: score, fill: color }]

  return (
    <div className="glass-card grain relative rounded-xl p-5 overflow-hidden">
      {/* Grid-line background for dashboard feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]" style={{
        backgroundImage: `linear-gradient(oklch(0.72 0.17 162 / 0.4) 1px, transparent 1px), linear-gradient(90deg, oklch(0.72 0.17 162 / 0.4) 1px, transparent 1px)`,
        backgroundSize: '20px 20px',
      }} />
      <div className="relative z-[1]">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-[oklch(0.72_0.17_162)]" />
          <span className="font-heading text-sm text-[oklch(0.65_0.01_250)]">Financial Health Score</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="relative">
            <RadialBarChart
              width={220} height={130} cx={110} cy={110}
              innerRadius={65} outerRadius={90}
              startAngle={180} endAngle={0}
              data={data} barSize={14}
            >
              <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
              <RadialBar dataKey="value" cornerRadius={7} background={{ fill: 'oklch(0.18 0.015 250)' }} isAnimationActive={true} animationDuration={1000} animationEasing="ease-out" />
            </RadialBarChart>
            {/* Score overlay */}
            <div className="absolute top-[56px] left-1/2 -translate-x-1/2 text-center">
              <span className={`font-mono text-4xl font-bold tabular-nums leading-none ${score >= 70 ? 'text-gold-gradient' : ''}`} style={score < 70 ? { color } : undefined}>
                {animatedScore}
              </span>
              <span className="text-xs block mt-0.5 text-[oklch(0.50_0.01_250)]">/ 100</span>
            </div>
          </div>
          <p className="text-[11px] font-heading text-center -mt-2" style={{ color }}>{label}</p>
        </div>
      </div>
    </div>
  )
}

export function FinancialsStep() {
  const { inputs, setField } = useValuationStore()
  const runway = inputs.monthly_burn > 0 && inputs.cash_in_bank > 0 ? Math.round(inputs.cash_in_bank / inputs.monthly_burn) : null
  const health = useMemo(() => computeHealthScore(inputs), [inputs.annual_revenue, inputs.revenue_growth_pct, inputs.gross_margin_pct, inputs.monthly_burn, inputs.cash_in_bank, inputs.cac, inputs.ltv])
  const healthColor = getHealthColor(health.score)

  return (
    <motion.div className="space-y-5" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.72_0.17_162/0.12)] flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-[oklch(0.72_0.17_162)]" />
          </div>
          <h2 className="font-heading text-2xl text-[oklch(0.95_0.002_250)]">Financials</h2>
        </div>
        <p className="text-[oklch(0.55_0.01_250)] text-sm">These numbers drive your DCF and market multiple valuations. Pre-revenue? Enter 0 — we still value you using VC methods.</p>
      </motion.div>

      {/* Health Score — Hero at TOP */}
      <motion.div variants={staggerItem}>
        <HealthRadialGauge score={health.score} color={healthColor} label={health.label} />
      </motion.div>

      {/* Revenue Section */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-3.5 h-3.5 text-[oklch(0.50_0.01_250)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.55_0.01_250)]">Revenue & Growth</span>
        </div>

        <CurrencyInput label="Annual Revenue (ARR) *" value={inputs.annual_revenue} onChange={(v) => setField('annual_revenue', v ?? 0)} help="Enter 0 if pre-revenue — VC methods will be used" />

        {inputs.annual_revenue === 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs bg-[oklch(0.72_0.17_162/0.06)] border border-[oklch(0.72_0.17_162/0.15)] text-[oklch(0.72_0.17_162)]">
            Pre-revenue startups can still have strong valuations through VC methods like Scorecard and Berkus
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-[oklch(0.72_0.005_250)] text-xs font-semibold uppercase tracking-wider">Revenue Growth (%)</Label>
            <p className="text-[10px] text-[oklch(0.42_0.01_250)]">YoY growth. Good SaaS = 100%+, Average = 30-50%</p>
            <Input type="number" value={inputs.revenue_growth_pct} onChange={(e) => setField('revenue_growth_pct', parseFloat(e.target.value) || 0)} className="bg-[oklch(0.12_0.012_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.92_0.005_250)] mt-1 h-10" placeholder="80" />
            {inputs.annual_revenue > 0 && inputs.revenue_growth_pct > 0 && (
              <div className="mt-1.5 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-[oklch(0.18_0.015_250)] rounded-full overflow-hidden relative">
                  <div className="absolute top-0 bottom-0 w-px bg-[oklch(0.50_0.01_250)]" style={{ left: `${Math.min(100, (50 / Math.max(inputs.revenue_growth_pct, 100)) * 100)}%` }} />
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (inputs.revenue_growth_pct / Math.max(inputs.revenue_growth_pct, 100)) * 100)}%`, background: inputs.revenue_growth_pct >= 50 ? 'oklch(0.65 0.16 155)' : 'oklch(0.72 0.14 80)' }} />
                </div>
                <span className="text-[9px] text-[oklch(0.40_0.01_250)] whitespace-nowrap font-mono">Median: 50%</span>
              </div>
            )}
          </div>
          <div>
            <Label className="text-[oklch(0.72_0.005_250)] text-xs font-semibold uppercase tracking-wider">Gross Margin (%)</Label>
            <p className="text-[10px] text-[oklch(0.42_0.01_250)]">SaaS = 70-90%, E-commerce = 30-50%</p>
            <Input type="number" value={inputs.gross_margin_pct} onChange={(e) => setField('gross_margin_pct', parseFloat(e.target.value) || 0)} min={0} max={100} className="bg-[oklch(0.12_0.012_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.92_0.005_250)] mt-1 h-10" placeholder="70" />
          </div>
        </div>
      </motion.div>

      {/* Burn & Runway Section */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="w-3.5 h-3.5 text-[oklch(0.50_0.01_250)]" />
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.55_0.01_250)]">Cash & Runway</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput label="Monthly Burn Rate" value={inputs.monthly_burn} onChange={(v) => setField('monthly_burn', v ?? 0)} help="Total monthly expenses" />
          <CurrencyInput label="Cash in Bank" value={inputs.cash_in_bank} onChange={(v) => setField('cash_in_bank', v ?? 0)} help="Current bank balance" />
        </div>

        {/* Visual runway bar */}
        {runway !== null && (
          <div className="rounded-lg bg-[oklch(0.12_0.010_250)] border border-[oklch(0.22_0.015_250)] p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.50_0.01_250)]">Runway</span>
              <span className={`font-mono text-xl font-bold tabular-nums ${runway >= 18 ? 'text-[oklch(0.65_0.16_155)]' : runway >= 6 ? 'text-[oklch(0.72_0.14_80)]' : 'text-[oklch(0.62_0.18_25)]'}`}>{runway}<span className="text-xs ml-0.5">mo</span></span>
            </div>
            <div className="h-3 bg-[oklch(0.16_0.012_250)] rounded-full overflow-hidden relative">
              <div className="absolute inset-0 flex">
                <div className="w-1/4 bg-[oklch(0.62_0.18_25/0.08)]" />
                <div className="w-1/4 bg-[oklch(0.72_0.14_80/0.06)]" />
                <div className="flex-1 bg-[oklch(0.65_0.16_155/0.05)]" />
              </div>
              {[6, 12, 18].map(m => <div key={m} className="absolute top-0 bottom-0 w-px bg-[oklch(0.35_0.01_250/0.5)]" style={{ left: `${(m / 24) * 100}%` }} />)}
              <motion.div className="h-full rounded-full relative z-10" style={{ background: runway >= 18 ? 'oklch(0.65 0.16 155)' : runway >= 6 ? 'oklch(0.72 0.14 80)' : 'oklch(0.62 0.18 25)' }} animate={{ width: `${Math.min(100, (runway / 24) * 100)}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
              <motion.div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full z-20 border-2 border-[oklch(0.14_0.015_250)]" style={{ background: runway >= 18 ? 'oklch(0.65 0.16 155)' : runway >= 6 ? 'oklch(0.72 0.14 80)' : 'oklch(0.62 0.18 25)', boxShadow: `0 0 10px ${runway >= 18 ? 'oklch(0.65 0.16 155 / 0.5)' : runway >= 6 ? 'oklch(0.72 0.14 80 / 0.5)' : 'oklch(0.62 0.18 25 / 0.5)'}` }} animate={{ left: `calc(${Math.min(100, (runway / 24) * 100)}% - 7px)`, scale: [1, 1.15, 1] }} transition={{ left: { duration: 0.5 }, scale: { duration: 2, repeat: Infinity } }} />
            </div>
            <div className="flex justify-between mt-1.5">
              {['0', '6m', '12m', '18m', '24m+'].map(l => <span key={l} className="text-[8px] font-mono text-[oklch(0.35_0.01_250)]">{l}</span>)}
            </div>
            <p className="text-[10px] font-heading mt-1" style={{ color: runway >= 18 ? 'oklch(0.65 0.16 155)' : runway >= 6 ? 'oklch(0.72 0.14 80)' : 'oklch(0.62 0.18 25)' }}>
              {runway >= 18 ? 'Comfortable runway' : runway >= 6 ? 'Start planning next raise' : 'Urgent: fundraise now'}
            </p>
          </div>
        )}
      </motion.div>

      {/* Unit Economics */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.55_0.01_250)]">Unit Economics (optional)</span>
        <p className="text-[10px] text-[oklch(0.42_0.01_250)]">Investors love LTV/CAC &gt; 3x. Improves valuation accuracy.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput label="Customer Acquisition Cost (CAC)" value={inputs.cac} onChange={(v) => setField('cac', v)} />
          <CurrencyInput label="Lifetime Value (LTV)" value={inputs.ltv} onChange={(v) => setField('ltv', v)} />
        </div>
        {inputs.cac && inputs.ltv && inputs.cac > 0 && (
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs ${inputs.ltv / inputs.cac >= 3 ? 'bg-[oklch(0.72_0.17_162/0.08)] text-[oklch(0.72_0.17_162)]' : inputs.ltv / inputs.cac >= 1 ? 'bg-[oklch(0.72_0.14_80/0.08)] text-[oklch(0.72_0.14_80)]' : 'bg-[oklch(0.62_0.18_25/0.08)] text-[oklch(0.62_0.18_25)]'}`}>
            <span className="font-mono font-bold">{(inputs.ltv / inputs.cac).toFixed(1)}x</span>
            <span className="text-[oklch(0.50_0.01_250)]">{inputs.ltv / inputs.cac >= 3 ? '— Excellent unit economics' : inputs.ltv / inputs.cac >= 1 ? '— Needs improvement (target 3x+)' : '— Losing money per customer'}</span>
          </div>
        )}
      </motion.div>

      {/* Previous Funding */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.55_0.01_250)]">Previous Funding (optional)</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CurrencyInput label="Last Round Size" value={inputs.last_round_size} onChange={(v) => setField('last_round_size', v)} />
          <CurrencyInput label="Last Round Valuation" value={inputs.last_round_valuation} onChange={(v) => setField('last_round_valuation', v)} />
        </div>
      </motion.div>
    </motion.div>
  )
}

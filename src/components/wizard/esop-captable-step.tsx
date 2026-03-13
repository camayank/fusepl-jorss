'use client'

import { useMemo, useState, useRef } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_ESOP_PCT } from '@/lib/constants'
import { SkipForward, PieChart } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAnimatedCounter, staggerContainer, staggerItem } from './wizard-container'

const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

function CapTableRing({ percentage, entries }: {
  percentage: number
  entries: { name: string; percentage: number }[]
}) {
  const animatedPct = useAnimatedCounter(Math.round(percentage))
  const radius = 48
  const cx = 60, cy = 60
  const circumference = 2 * Math.PI * radius
  const hasTriggered100 = useRef(false)
  const [showPulse, setShowPulse] = useState(false)

  if (percentage === 100 && !hasTriggered100.current) {
    hasTriggered100.current = true
    setTimeout(() => setShowPulse(true), 100)
    setTimeout(() => setShowPulse(false), 800)
  } else if (percentage !== 100) {
    hasTriggered100.current = false
  }

  const color = percentage === 100
    ? 'oklch(0.65 0.16 155)'
    : percentage >= 90 && percentage <= 110
    ? 'oklch(0.72 0.14 80)'
    : percentage > 100
    ? 'oklch(0.62 0.18 25)'
    : 'oklch(0.50 0.01 250)'

  let cumulativeOffset = 0
  const segments = entries.filter(e => e.percentage > 0).map((entry, i) => {
    const segPct = Math.min(entry.percentage, 100) / 100
    const segLength = segPct * circumference
    const offset = circumference - segLength
    const rotation = (cumulativeOffset / circumference) * 360 - 90
    cumulativeOffset += segLength
    return { ...entry, offset, segLength, rotation, color: CHART_COLORS[i % CHART_COLORS.length], index: i }
  })

  return (
    <div className="glass-card grain relative rounded-xl p-5 flex flex-col items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.20 0.02 250 / 0.8), oklch(0.17 0.018 250 / 0.6))' }}>
      {/* Subtle background icons */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-[0.04] pointer-events-none">
        <PieChart className="w-10 h-10" /><PieChart className="w-10 h-10" /><PieChart className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-2 mb-3 self-start">
        <PieChart className="w-4 h-4 text-[oklch(0.72_0.17_162)]" />
        <span className="font-heading text-sm text-[oklch(0.65_0.01_250)]">Ownership Distribution</span>
      </div>
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 120 120" className="overflow-visible">
          {/* Decorative outer dashed ring */}
          <circle cx={cx} cy={cy} r={radius + 8} fill="none" stroke="oklch(0.30 0.01 250 / 0.4)" strokeWidth="1" strokeDasharray="4 8" />
          {/* Background circle */}
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="oklch(0.18 0.015 250)" strokeWidth="8" />
          {/* Multi-segment arcs */}
          {segments.map((seg) => (
            <motion.circle
              key={seg.index}
              cx={cx} cy={cy} r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${seg.segLength} ${circumference - seg.segLength}`}
              transform={`rotate(${seg.rotation} ${cx} ${cy})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: seg.index * 0.08 }}
              style={{ filter: percentage === 100 ? `drop-shadow(0 0 8px ${seg.color})` : undefined }}
            />
          ))}
          {/* Single-color fallback when no entries */}
          {segments.length === 0 && percentage > 0 && (
            <motion.circle
              cx={cx} cy={cy} r={radius}
              fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - Math.min(percentage, 120) / 100)}
              transform={`rotate(-90 ${cx} ${cy})`}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference * (1 - Math.min(percentage, 120) / 100) }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </svg>
        {/* Pulse effect at 100% */}
        {showPulse && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.15, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ border: '2px solid oklch(0.65 0.16 155)', boxShadow: '0 0 20px oklch(0.65 0.16 155 / 0.4)' }}
          />
        )}
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-2xl font-bold tabular-nums ${percentage === 100 ? 'text-gold-gradient' : ''}`} style={percentage !== 100 ? { color } : undefined}>
            {animatedPct}%
          </span>
        </div>
      </div>
      {/* Status message */}
      <p className="text-xs font-heading mt-3 text-center" style={{ color }}>
        {percentage === 100 ? 'Perfect — adds up to 100%'
          : percentage > 100 ? `Over-allocated by ${(percentage - 100).toFixed(1)}%`
          : percentage >= 90 ? 'Almost there!'
          : percentage > 0 ? `${(100 - percentage).toFixed(1)}% unallocated`
          : 'Add shareholders below'}
      </p>
      {/* Legend */}
      {segments.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 justify-center">
          {segments.map((seg) => (
            <div key={seg.index} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: seg.color }} />
              <span className="text-[10px] text-[oklch(0.60_0.01_250)]">{seg.name || 'Unnamed'} ({seg.percentage}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function ESOPCapTableStep() {
  const { inputs, setField } = useValuationStore()
  const defaultEsop = DEFAULT_ESOP_PCT[inputs.stage] ?? 10

  const capTableTotal = useMemo(() => {
    if (!inputs.current_cap_table || inputs.current_cap_table.length === 0) return 0
    return inputs.current_cap_table.reduce((s, e) => s + e.percentage, 0)
  }, [inputs.current_cap_table])

  const capEntries = useMemo(() => {
    if (!inputs.current_cap_table) return []
    return inputs.current_cap_table.map(e => ({ name: e.name, percentage: e.percentage }))
  }, [inputs.current_cap_table])

  return (
    <motion.div className="space-y-5" variants={staggerContainer} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.72_0.17_162/0.12)] flex items-center justify-center">
            <PieChart className="w-4 h-4 text-[oklch(0.72_0.17_162)]" />
          </div>
          <h2 className="font-heading text-2xl text-[oklch(0.95_0.002_250)]">ESOP & Cap Table</h2>
        </div>
        <p className="text-[oklch(0.55_0.01_250)] text-sm">Optional but powerful. ESOP pools and cap tables help us calculate per-share value and dilution impact.</p>
      </motion.div>

      {/* Skip encouragement */}
      <motion.div variants={staggerItem} className="glass-card relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg">
        <SkipForward className="w-4 h-4 text-[oklch(0.72_0.17_162)] shrink-0 animate-[float_3s_ease-in-out_infinite]" />
        <p className="text-xs text-[oklch(0.60_0.01_250)]">
          Not sure? <span className="text-[oklch(0.72_0.17_162)] font-medium">Just click &quot;Get Valuation&quot;</span> — we&apos;ll use smart defaults based on your stage ({inputs.stage.replace(/_/g, ' ')}: {defaultEsop}% ESOP).
        </p>
      </motion.div>

      {/* Cap Table Ring at TOP (only show when there are entries) */}
      {inputs.current_cap_table && inputs.current_cap_table.length > 0 && (
        <motion.div variants={staggerItem}>
          <CapTableRing percentage={capTableTotal} entries={capEntries} />
        </motion.div>
      )}

      {/* ESOP Pool */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-5">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.55_0.01_250)]">ESOP Pool</span>
        <div>
          <Label className="text-[oklch(0.72_0.005_250)] text-xs font-semibold uppercase tracking-wider">ESOP Pool (%)</Label>
          <p className="text-[10px] text-[oklch(0.42_0.01_250)]">
            Percentage of equity reserved for employee stock options. Typical for {inputs.stage.replace(/_/g, ' ')} stage: {defaultEsop}%
          </p>
          <Input
            type="number"
            value={inputs.esop_pool_pct ?? ''}
            onChange={(e) => setField('esop_pool_pct', e.target.value === '' ? null : parseFloat(e.target.value))}
            min={0} max={30}
            placeholder={String(defaultEsop)}
            className="bg-[oklch(0.12_0.012_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.92_0.005_250)] mt-1 w-32 h-10"
          />
        </div>

        <div>
          <Label className="text-[oklch(0.72_0.005_250)] text-xs font-semibold uppercase tracking-wider">Time to Liquidity (years)</Label>
          <p className="text-[10px] text-[oklch(0.42_0.01_250)]">How many years until a potential exit (acquisition/IPO)? Used for Black-Scholes ESOP valuation. Typical: 3-7 years.</p>
          <Input
            type="number"
            value={inputs.time_to_liquidity_years ?? ''}
            onChange={(e) => setField('time_to_liquidity_years', e.target.value === '' ? null : parseInt(e.target.value))}
            min={1} max={15}
            placeholder="4"
            className="bg-[oklch(0.12_0.012_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.92_0.005_250)] mt-1 w-32 h-10"
          />
        </div>
      </motion.div>

      {/* Cap Table */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.55_0.01_250)]">Current Cap Table</span>
            <p className="text-[10px] text-[oklch(0.42_0.01_250)]">Add up to 10 shareholders. Total should equal 100%.</p>
          </div>
          <button
            onClick={() => {
              const current = inputs.current_cap_table || []
              if (current.length < 10) {
                setField('current_cap_table', [
                  ...current,
                  { name: '', percentage: 0, share_class: 'common' as const },
                ])
              }
            }}
            className="text-sm text-[oklch(0.72_0.17_162)] hover:text-[oklch(0.80_0.14_162)] px-3 py-1.5 rounded border border-[oklch(0.72_0.17_162/0.3)] hover:border-[oklch(0.72_0.17_162/0.5)] transition-colors"
          >
            + Add Row
          </button>
        </div>

        {inputs.current_cap_table && inputs.current_cap_table.length > 0 ? (
          <div className="space-y-2">
            <div className="grid grid-cols-12 gap-2 text-[10px] text-[oklch(0.45_0.01_250)] font-bold uppercase tracking-wider px-1">
              <span className="col-span-5">Name</span>
              <span className="col-span-3">Ownership %</span>
              <span className="col-span-3">Class</span>
              <span className="col-span-1"></span>
            </div>
            {inputs.current_cap_table.map((entry, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <Input
                  value={entry.name}
                  onChange={(e) => {
                    const updated = [...inputs.current_cap_table!]
                    updated[idx] = { ...updated[idx], name: e.target.value }
                    setField('current_cap_table', updated)
                  }}
                  placeholder="Shareholder name"
                  className="col-span-5 bg-[oklch(0.12_0.012_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.92_0.005_250)] text-sm h-9"
                />
                <Input
                  type="number"
                  value={entry.percentage}
                  onChange={(e) => {
                    const updated = [...inputs.current_cap_table!]
                    updated[idx] = { ...updated[idx], percentage: parseFloat(e.target.value) || 0 }
                    setField('current_cap_table', updated)
                  }}
                  min={0} max={100}
                  className="col-span-3 bg-[oklch(0.12_0.012_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.92_0.005_250)] text-sm h-9"
                />
                <select
                  value={entry.share_class}
                  onChange={(e) => {
                    const updated = [...inputs.current_cap_table!]
                    updated[idx] = { ...updated[idx], share_class: e.target.value as any }
                    setField('current_cap_table', updated)
                  }}
                  className="col-span-3 bg-[oklch(0.12_0.012_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.92_0.005_250)] text-sm h-9 rounded-md px-2"
                >
                  <option value="common">Common</option>
                  <option value="preference">Preference</option>
                  <option value="esop">ESOP</option>
                </select>
                <button
                  onClick={() => {
                    const updated = inputs.current_cap_table!.filter((_, i) => i !== idx)
                    setField('current_cap_table', updated.length > 0 ? updated : null)
                  }}
                  className="col-span-1 text-red-400 hover:text-red-300 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[oklch(0.45_0.01_250)] italic">No cap table entries. Click &quot;+ Add Row&quot; to start.</p>
        )}
      </motion.div>
    </motion.div>
  )
}

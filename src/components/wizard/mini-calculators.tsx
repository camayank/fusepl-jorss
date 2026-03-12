'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calculator, X } from 'lucide-react'

interface CalculatorModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

function CalculatorModal({ title, onClose, children }: CalculatorModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80 bg-slate-900 border border-slate-700 rounded-xl p-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </>
  )
}

interface CalcButtonProps {
  onClick: () => void
}

function CalcButton({ onClick }: CalcButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
    >
      <Calculator className="h-3 w-3" />
      Calculate
    </button>
  )
}

export function GrowthRateCalculator({ onUseValue }: { onUseValue: (v: number) => void }) {
  const [open, setOpen] = useState(false)
  const [lastYear, setLastYear] = useState<number | null>(null)
  const [thisYear, setThisYear] = useState<number | null>(null)

  const growth = lastYear && lastYear > 0 && thisYear !== null
    ? Math.round(((thisYear - lastYear) / lastYear) * 100)
    : null

  return (
    <>
      <CalcButton onClick={() => setOpen(true)} />
      {open && (
        <CalculatorModal title="Growth Rate Calculator" onClose={() => setOpen(false)}>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-400">Last year revenue (Rs)</Label>
              <Input
                type="number"
                value={lastYear ?? ''}
                onChange={(e) => setLastYear(e.target.value ? Number(e.target.value) : null)}
                className="bg-slate-800 border-slate-700 text-white text-sm"
                placeholder="e.g., 50,00,000"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400">This year revenue (Rs)</Label>
              <Input
                type="number"
                value={thisYear ?? ''}
                onChange={(e) => setThisYear(e.target.value ? Number(e.target.value) : null)}
                className="bg-slate-800 border-slate-700 text-white text-sm"
                placeholder="e.g., 1,20,00,000"
              />
            </div>
            {growth !== null && (
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-amber-400">{growth}%</p>
                <p className="text-xs text-slate-400">Year-over-year growth</p>
                <Button
                  size="sm"
                  className="mt-2 bg-amber-500 hover:bg-amber-600 text-black text-xs"
                  onClick={() => { onUseValue(growth); setOpen(false) }}
                >
                  Use This Value
                </Button>
              </div>
            )}
          </div>
        </CalculatorModal>
      )}
    </>
  )
}

export function GrossMarginCalculator({ onUseValue }: { onUseValue: (v: number) => void }) {
  const [open, setOpen] = useState(false)
  const [revenue, setRevenue] = useState<number | null>(null)
  const [cogs, setCogs] = useState<number | null>(null)

  const margin = revenue && revenue > 0 && cogs !== null
    ? Math.round(((revenue - cogs) / revenue) * 100)
    : null

  return (
    <>
      <CalcButton onClick={() => setOpen(true)} />
      {open && (
        <CalculatorModal title="Gross Margin Calculator" onClose={() => setOpen(false)}>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-400">Revenue (Rs)</Label>
              <Input
                type="number"
                value={revenue ?? ''}
                onChange={(e) => setRevenue(e.target.value ? Number(e.target.value) : null)}
                className="bg-slate-800 border-slate-700 text-white text-sm"
              />
            </div>
            <div>
              <Label className="text-xs text-slate-400">Cost of Goods Sold (Rs)</Label>
              <Input
                type="number"
                value={cogs ?? ''}
                onChange={(e) => setCogs(e.target.value ? Number(e.target.value) : null)}
                className="bg-slate-800 border-slate-700 text-white text-sm"
              />
            </div>
            {margin !== null && (
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-amber-400">{margin}%</p>
                <p className="text-xs text-slate-400">Gross Margin</p>
                <Button
                  size="sm"
                  className="mt-2 bg-amber-500 hover:bg-amber-600 text-black text-xs"
                  onClick={() => { onUseValue(margin); setOpen(false) }}
                >
                  Use This Value
                </Button>
              </div>
            )}
          </div>
        </CalculatorModal>
      )}
    </>
  )
}

export function TAMCalculator({ onUseValue }: { onUseValue: (v: number) => void }) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'bottomup' | 'topdown'>('bottomup')
  const [customers, setCustomers] = useState<number | null>(null)
  const [dealSize, setDealSize] = useState<number | null>(null)
  const [marketSize, setMarketSize] = useState<number | null>(null)
  const [sharePercent, setSharePercent] = useState<number | null>(null)

  const tamCr = mode === 'bottomup'
    ? (customers && dealSize ? Math.round((customers * dealSize) / 10000000) : null)
    : (marketSize && sharePercent ? Math.round(marketSize * sharePercent / 100) : null)

  return (
    <>
      <CalcButton onClick={() => setOpen(true)} />
      {open && (
        <CalculatorModal title="TAM Calculator" onClose={() => setOpen(false)}>
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                className={`text-xs px-3 py-1 rounded ${mode === 'bottomup' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'}`}
                onClick={() => setMode('bottomup')}
              >
                Bottom-Up
              </button>
              <button
                className={`text-xs px-3 py-1 rounded ${mode === 'topdown' ? 'bg-amber-500 text-black' : 'bg-slate-800 text-slate-400'}`}
                onClick={() => setMode('topdown')}
              >
                Top-Down
              </button>
            </div>

            {mode === 'bottomup' ? (
              <>
                <div>
                  <Label className="text-xs text-slate-400">Total addressable customers</Label>
                  <Input type="number" value={customers ?? ''} onChange={(e) => setCustomers(e.target.value ? Number(e.target.value) : null)} className="bg-slate-800 border-slate-700 text-white text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Average deal size (Rs/year)</Label>
                  <Input type="number" value={dealSize ?? ''} onChange={(e) => setDealSize(e.target.value ? Number(e.target.value) : null)} className="bg-slate-800 border-slate-700 text-white text-sm" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-xs text-slate-400">Market size (Rs Cr)</Label>
                  <Input type="number" value={marketSize ?? ''} onChange={(e) => setMarketSize(e.target.value ? Number(e.target.value) : null)} className="bg-slate-800 border-slate-700 text-white text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-slate-400">Addressable share (%)</Label>
                  <Input type="number" value={sharePercent ?? ''} onChange={(e) => setSharePercent(e.target.value ? Number(e.target.value) : null)} className="bg-slate-800 border-slate-700 text-white text-sm" />
                </div>
              </>
            )}

            {tamCr !== null && tamCr > 0 && (
              <div className="bg-slate-800 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-amber-400">Rs {tamCr.toLocaleString('en-IN')} Cr</p>
                <p className="text-xs text-slate-400">Total Addressable Market</p>
                <Button
                  size="sm"
                  className="mt-2 bg-amber-500 hover:bg-amber-600 text-black text-xs"
                  onClick={() => { onUseValue(tamCr); setOpen(false) }}
                >
                  Use This Value
                </Button>
              </div>
            )}
          </div>
        </CalculatorModal>
      )}
    </>
  )
}

export function RunwayCalculator() {
  const [open, setOpen] = useState(false)
  const [cash, setCash] = useState<number | null>(null)
  const [burn, setBurn] = useState<number | null>(null)

  const months = cash && burn && burn > 0 ? Math.round(cash / burn) : null

  return (
    <>
      <CalcButton onClick={() => setOpen(true)} />
      {open && (
        <CalculatorModal title="Runway Calculator" onClose={() => setOpen(false)}>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-slate-400">Cash in bank (Rs)</Label>
              <Input type="number" value={cash ?? ''} onChange={(e) => setCash(e.target.value ? Number(e.target.value) : null)} className="bg-slate-800 border-slate-700 text-white text-sm" />
            </div>
            <div>
              <Label className="text-xs text-slate-400">Monthly burn (Rs)</Label>
              <Input type="number" value={burn ?? ''} onChange={(e) => setBurn(e.target.value ? Number(e.target.value) : null)} className="bg-slate-800 border-slate-700 text-white text-sm" />
            </div>
            {months !== null && (
              <div className={`rounded-lg p-3 text-center ${months < 6 ? 'bg-red-500/10 border border-red-500/30' : months < 12 ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-green-500/10 border border-green-500/30'}`}>
                <p className={`text-2xl font-bold ${months < 6 ? 'text-red-400' : months < 12 ? 'text-amber-400' : 'text-green-400'}`}>
                  {months} months
                </p>
                <p className="text-xs text-slate-400">
                  {months < 6 ? 'Critical — raise immediately' : months < 12 ? 'Start fundraising now' : months < 18 ? 'Healthy runway' : 'Strong cash position'}
                </p>
              </div>
            )}
          </div>
        </CalculatorModal>
      )}
    </>
  )
}

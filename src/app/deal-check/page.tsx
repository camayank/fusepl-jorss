'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { STARTUP_CATEGORIES, STAGES, type StartupCategory, type Stage, type DealCheckInput, type DealCheckResult } from '@/types'
import { computeDealCheck } from '@/lib/deal-check'
import { formatINR } from '@/lib/utils'

const SECTOR_LABELS: Partial<Record<StartupCategory, string>> = {
  saas: 'SaaS',
  fintech_payments: 'Fintech (Payments)',
  fintech_insurance: 'Fintech (Insurance)',
  fintech_banking: 'Fintech (Banking)',
  d2c: 'D2C',
  edtech: 'EdTech',
  healthtech_products: 'HealthTech (Products)',
  healthtech_services: 'HealthTech (Services)',
  ecommerce_general: 'E-Commerce',
  marketplace: 'Marketplace',
  agritech: 'AgriTech',
  logistics: 'Logistics',
  deeptech: 'DeepTech',
  auto_mobility: 'Auto/Mobility',
  other: 'Other',
}

const STAGE_LABELS: Record<Stage, string> = {
  idea: 'Idea',
  pre_seed: 'Pre-Seed',
  seed: 'Seed',
  pre_series_a: 'Pre-Series A',
  series_a: 'Series A',
  series_b: 'Series B',
  series_c_plus: 'Series C+',
}

const VERDICT_COLORS = {
  green: 'border-green-500 bg-green-500/10 text-green-400',
  yellow: 'border-amber-500 bg-amber-500/10 text-amber-400',
  red: 'border-red-500 bg-red-500/10 text-red-400',
  blue: 'border-blue-500 bg-blue-500/10 text-blue-400',
}

export default function DealCheckPage() {
  const [input, setInput] = useState<DealCheckInput>({
    sector: 'saas',
    stage: 'seed',
    revenue_cr: 0,
    growth_pct: 0,
    raise_cr: 0,
    ask_cr: 0,
  })
  const [result, setResult] = useState<DealCheckResult | null>(null)

  const handleCheck = () => {
    const r = computeDealCheck(input)
    setResult(r)
  }

  return (
    <main className="min-h-screen bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-2xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Investor Deal Check</h1>
          <p className="text-slate-400">
            Quickly validate if a startup&apos;s valuation ask is reasonable.
          </p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white text-lg">Deal Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300 text-sm">Sector</Label>
                <Select
                  value={input.sector}
                  onValueChange={(v) => setInput({ ...input, sector: v as StartupCategory })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STARTUP_CATEGORIES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {SECTOR_LABELS[s] || s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-slate-300 text-sm">Stage</Label>
                <Select
                  value={input.stage}
                  onValueChange={(v) => setInput({ ...input, stage: v as Stage })}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-700 text-white mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STAGES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {STAGE_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300 text-sm">Annual Revenue (Rs Cr)</Label>
                <Input
                  type="number"
                  value={input.revenue_cr || ''}
                  onChange={(e) => setInput({ ...input, revenue_cr: Number(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-sm">Revenue Growth %</Label>
                <Input
                  type="number"
                  value={input.growth_pct || ''}
                  onChange={(e) => setInput({ ...input, growth_pct: Number(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="e.g., 80"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300 text-sm">Amount Raising (Rs Cr)</Label>
                <Input
                  type="number"
                  value={input.raise_cr || ''}
                  onChange={(e) => setInput({ ...input, raise_cr: Number(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <Label className="text-slate-300 text-sm">Valuation Ask (Rs Cr)</Label>
                <Input
                  type="number"
                  value={input.ask_cr || ''}
                  onChange={(e) => setInput({ ...input, ask_cr: Number(e.target.value) || 0 })}
                  className="bg-slate-800 border-slate-700 text-white mt-1"
                  placeholder="e.g., 50"
                />
              </div>
            </div>

            <Button
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              onClick={handleCheck}
            >
              Check Deal
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            {/* Verdict */}
            <Card className={`border-2 ${VERDICT_COLORS[result.verdict]}`}>
              <CardContent className="py-6 text-center space-y-2">
                <p className="text-3xl font-bold">{result.label}</p>
                <p className="text-sm text-slate-300">{result.explanation}</p>
              </CardContent>
            </Card>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="py-4 text-center">
                  <p className="text-xs text-slate-400">Fair Value</p>
                  <p className="text-lg font-bold text-white">{formatINR(result.fairValue)}</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="py-4 text-center">
                  <p className="text-xs text-slate-400">Implied Multiple</p>
                  <p className="text-lg font-bold text-white">{result.impliedMultiple.toFixed(1)}x</p>
                  <p className="text-xs text-slate-500">vs {result.sectorMedianMultiple.toFixed(1)}x median</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800">
                <CardContent className="py-4 text-center">
                  <p className="text-xs text-slate-400">Dilution</p>
                  <p className="text-lg font-bold text-white">{result.dilutionPct.toFixed(1)}%</p>
                </CardContent>
              </Card>
            </div>

            {/* Negotiation Insight */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white text-sm">Negotiation Insight</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-300">{result.negotiationInsight}</p>
              </CardContent>
            </Card>

            {/* Comparables */}
            {result.comparables.length > 0 && (
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Comparable Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {result.comparables.map((c) => (
                      <div key={c.name} className="flex justify-between items-center text-sm border-b border-slate-800 pb-2">
                        <div>
                          <p className="text-white font-medium">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.sector} | {c.stage_at_round} | {c.year}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-amber-400">Rs {c.valuation_cr.toLocaleString('en-IN')} Cr</p>
                          {c.revenue_cr && c.revenue_cr > 0 && (
                            <p className="text-xs text-slate-500">
                              {(c.valuation_cr / c.revenue_cr).toFixed(1)}x revenue
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

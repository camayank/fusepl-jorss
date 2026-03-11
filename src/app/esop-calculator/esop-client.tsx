'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { calculateESOPValue } from '@/lib/calculators/esop-valuation'
import { getDamodaranBenchmark, getSectorLabel } from '@/lib/data/sector-mapping'
import { STARTUP_CATEGORIES } from '@/types'
import type { StartupCategory, ESOPResult } from '@/types'
import { formatINR } from '@/lib/utils'

export function ESOPClient() {
  const [sector, setSector] = useState<StartupCategory>('saas')
  const [companyValuation, setCompanyValuation] = useState(100_000_000)
  const [esopPct, setEsopPct] = useState(10)
  const [timeToLiquidity, setTimeToLiquidity] = useState(4)
  const [computed, setComputed] = useState(false)
  const [result, setResult] = useState<ESOPResult | null>(null)

  const handleCompute = () => {
    const benchmark = getDamodaranBenchmark(sector)
    const totalShares = 1_000_000 // standard assumption
    const exercisePrice = 10 // Rs 10 per share

    // Derive volatility from beta: sigma = beta * market_vol (assume market vol ~25%)
    const volatility = Math.min(0.80, Math.max(0.40, benchmark.beta * 0.25))

    const esopResult = calculateESOPValue({
      valuation: companyValuation,
      total_shares: totalShares,
      esop_pool_pct: esopPct,
      exercise_price: exercisePrice,
      time_to_liquidity: timeToLiquidity,
      volatility,
      risk_free_rate: 0.07, // India 10-year G-sec
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
            <Select value={sector} onValueChange={(v) => setSector(v as StartupCategory)}>
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

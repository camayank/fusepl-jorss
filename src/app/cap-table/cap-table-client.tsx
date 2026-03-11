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
  const [esopTiming, setEsopTiming] = useState<'pre_round' | 'post_round'>('pre_round')

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

  const roundResult = simulateRound(capTable, {
    raise_amount: raiseAmount,
    pre_money: preMoney,
    esop_expansion_pct: esopExpansion,
    esop_timing: esopTiming,
  })

  const preData = capTable.map((e, i) => ({ name: e.name, value: e.percentage, fill: COLORS[i % COLORS.length] }))
  const postData = roundResult.shareholders.map((e, i) => ({ name: e.name, value: parseFloat(e.percentage.toFixed(1)), fill: COLORS[i % COLORS.length] }))

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
              <Button variant="ghost" size="sm" onClick={() => removeEntry(i)}>x</Button>
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
              <RadioGroup value={esopTiming} onValueChange={(v) => setEsopTiming(v as 'pre_round' | 'post_round')}>
                <div className="flex items-center space-x-2"><RadioGroupItem value="pre_round" id="st-pre" /><Label htmlFor="st-pre">Before round</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="post_round" id="st-post" /><Label htmlFor="st-post">After round</Label></div>
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

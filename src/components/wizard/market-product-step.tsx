'use client'

import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { DEV_STAGES, COMPETITIVE_ADVANTAGES } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'

export function MarketProductStep() {
  const { inputs, setField } = useValuationStore()

  const toggleAdvantage = (adv: string) => {
    const current = inputs.competitive_advantages
    if (current.includes(adv as any)) {
      setField('competitive_advantages', current.filter(a => a !== adv))
    } else {
      setField('competitive_advantages', [...current, adv as any])
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[oklch(0.93_0.005_80)] mb-1">Market & Product</h2>
        <p className="text-[oklch(0.50_0.01_260)] text-sm">Market size, product stage, and competitive position</p>
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor="tam" className="text-[oklch(0.65_0.005_80)]">Total Addressable Market (TAM in Cr) *</Label>
          <p className="text-xs text-[oklch(0.30_0.01_260)] mb-1">Enter in crores (e.g., 5000 = Rs 5,000 Cr)</p>
          <Input
            id="tam"
            type="number"
            value={inputs.tam}
            onChange={(e) => setField('tam', parseInt(e.target.value) || 0)}
            className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1 w-48"
            placeholder="5000"
          />
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)]">Development Stage *</Label>
          <Select value={inputs.dev_stage} onValueChange={(v) => setField('dev_stage', v as any)}>
            <SelectTrigger className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)]">
              {Object.entries(DEV_STAGES).map(([key, label]) => (
                <SelectItem key={key} value={key} className="text-[oklch(0.93_0.005_80)] hover:bg-[oklch(0.15_0.008_260)]">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)]">Competition Level (1-5): {inputs.competition_level}</Label>
          <p className="text-xs text-[oklch(0.30_0.01_260)] mb-2">1 = Blue ocean, 5 = Hypercompetitive market</p>
          <Slider
            value={[inputs.competition_level]}
            onValueChange={(v) => setField('competition_level', Array.isArray(v) ? v[0] : v)}
            min={1}
            max={5}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <Label className="text-[oklch(0.65_0.005_80)] mb-2 block">Competitive Advantages</Label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(COMPETITIVE_ADVANTAGES).map(([key, label]) => (
              <label
                key={key}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                  inputs.competitive_advantages.includes(key as any)
                    ? 'border-amber-400/50 bg-amber-400/10 text-amber-300'
                    : 'border-[oklch(0.20_0.008_260)] bg-[oklch(0.08_0.008_260)] text-[oklch(0.50_0.01_260)] hover:border-slate-600'
                }`}
              >
                <Checkbox
                  checked={inputs.competitive_advantages.includes(key as any)}
                  onCheckedChange={() => toggleAdvantage(key)}
                  className="hidden"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="patents_count" className="text-[oklch(0.65_0.005_80)]">Number of Patents</Label>
          <Input
            id="patents_count"
            type="number"
            value={inputs.patents_count}
            onChange={(e) => setField('patents_count', parseInt(e.target.value) || 0)}
            min={0}
            className="bg-[oklch(0.08_0.008_260)] border-[oklch(0.20_0.008_260)] text-[oklch(0.93_0.005_80)] mt-1 w-32"
          />
        </div>
      </div>
    </div>
  )
}

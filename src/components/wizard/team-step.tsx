'use client'

import { useMemo } from 'react'
import { useValuationStore } from '@/stores/valuation-store'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { useAnimatedCounter, staggerContainer, staggerItem } from './wizard-container'

const KEY_HIRE_OPTIONS = [
  { value: 'cto', label: 'CTO' },
  { value: 'cfo', label: 'CFO' },
  { value: 'sales_lead', label: 'Sales Lead' },
  { value: 'marketing_head', label: 'Marketing Head' },
  { value: 'product_head', label: 'Product Head' },
]

const EXPERIENCE_LEVELS: Record<number, string> = {
  1: 'First-time founder', 2: 'Some startup experience',
  3: 'Experienced — 3+ years in startups', 4: 'Seasoned — multiple ventures',
  5: 'Serial entrepreneur with deep expertise',
}

const EXPERTISE_LEVELS: Record<number, string> = {
  1: 'New to the sector', 2: 'Basic industry knowledge',
  3: 'Solid domain understanding', 4: 'Domain expert — 7+ years',
  5: 'Industry veteran — 10+ years',
}

function computeTeamScore(inputs: { team_size: number; founder_experience: number; domain_expertise: number; previous_exits: boolean; technical_cofounder: boolean; key_hires: string[] }): number {
  const sizeScore = inputs.team_size >= 5 ? Math.min(20, 10 + Math.min(10, (inputs.team_size - 5) * 0.5)) : Math.max(0, inputs.team_size * 2)
  return Math.round(sizeScore + (inputs.founder_experience / 5) * 25 + (inputs.domain_expertise / 5) * 20 + (inputs.previous_exits ? 15 : 0) + (inputs.technical_cofounder ? 10 : 0) + Math.min(10, inputs.key_hires.length * 2))
}

function getScoreColor(score: number): string {
  if (score >= 70) return 'oklch(0.65 0.16 155)'
  if (score >= 40) return 'oklch(0.72 0.14 80)'
  return 'oklch(0.62 0.18 25)'
}

function getScoreMessage(score: number): string {
  if (score >= 80) return 'Exceptional founding team!'
  if (score >= 60) return 'Strong team — investors will notice'
  if (score >= 40) return 'Good start — consider adding domain experts'
  if (score >= 20) return 'Building up — key hires can boost this score'
  return 'Early stage — focus on founding team strength'
}

/* ─── SVG Semicircle Gauge ─────────────────────────────────────────── */
function SemicircleGauge({ score, color }: { score: number; color: string }) {
  const animatedScore = useAnimatedCounter(score)
  const cx = 100, cy = 85, r = 65
  const startX = cx - r, startY = cy
  const endX = cx + r, endY = cy
  const arcPath = `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`

  return (
    <div className="glass-card grain relative rounded-xl p-5 overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.20 0.02 250 / 0.8), oklch(0.17 0.018 250 / 0.6)), linear-gradient(180deg, oklch(0.72 0.12 55 / 0.04), transparent)' }}>
      {/* Subtle Users icons */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-2 opacity-[0.04] pointer-events-none">
        <Users className="w-10 h-10" /><Users className="w-10 h-10" /><Users className="w-10 h-10" />
      </div>
      <div className="flex items-center gap-2 mb-2">
        <Users className="w-4 h-4 text-[oklch(0.72_0.17_162)]" />
        <span className="font-heading text-sm text-[oklch(0.65_0.01_250)]">Team Strength</span>
      </div>
      <div className="relative flex flex-col items-center">
        <svg width="200" height="110" viewBox="0 0 200 110" className="overflow-visible">
          <path d={arcPath} fill="none" stroke="oklch(0.20 0.015 250)" strokeWidth="12" strokeLinecap="round" />
          <motion.path d={arcPath} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" pathLength={1} initial={{ pathLength: 0 }} animate={{ pathLength: score / 100 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        </svg>
        <div className="absolute top-[36px] left-1/2 -translate-x-1/2 text-center">
          <span className={`font-mono text-4xl font-bold tabular-nums leading-none ${score >= 70 ? 'text-gold-gradient' : ''}`} style={score < 70 ? { color } : undefined}>{animatedScore}</span>
          <span className="text-xs block mt-0.5 text-[oklch(0.50_0.01_250)]">/ 100</span>
        </div>
      </div>
      <motion.p key={getScoreMessage(score)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-[11px] font-heading text-center mt-1" style={{ color }}>{getScoreMessage(score)}</motion.p>
    </div>
  )
}

export function TeamStep() {
  const { inputs, setField } = useValuationStore()
  const teamScore = useMemo(() => computeTeamScore(inputs), [inputs.team_size, inputs.founder_experience, inputs.domain_expertise, inputs.previous_exits, inputs.technical_cofounder, inputs.key_hires])
  const scoreColor = getScoreColor(teamScore)

  const toggleKeyHire = (hire: string) => {
    const current = inputs.key_hires
    setField('key_hires', current.includes(hire) ? current.filter(h => h !== hire) : [...current, hire])
  }

  return (
    <motion.div className="space-y-5" variants={staggerContainer} initial="hidden" animate="visible">
      <motion.div variants={staggerItem}>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-[oklch(0.72_0.17_162/0.12)] flex items-center justify-center">
            <Users className="w-4 h-4 text-[oklch(0.72_0.17_162)]" />
          </div>
          <h2 className="font-heading text-2xl text-[oklch(0.95_0.002_250)]">Team</h2>
        </div>
        <p className="text-[oklch(0.55_0.01_250)] text-sm">Investors bet on people first. A strong team can add 2-3x to your valuation.</p>
      </motion.div>

      {/* Gauge at TOP */}
      <motion.div variants={staggerItem}>
        <SemicircleGauge score={teamScore} color={scoreColor} />
      </motion.div>

      {/* Team Details */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-5">
        <div>
          <Label htmlFor="team_size" className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Team Size *</Label>
          <p className="text-[10px] text-[oklch(0.50_0.01_250)]">Founders + employees + contractors</p>
          <Input id="team_size" type="number" value={inputs.team_size} onChange={(e) => setField('team_size', parseInt(e.target.value) || 1)} min={1} max={500} className="bg-[oklch(0.12_0.012_250)] border-[oklch(0.26_0.018_250)] text-[oklch(0.92_0.005_250)] mt-1 w-32 h-10" />
        </div>

        <div>
          <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Founder Experience: <span className="text-[oklch(0.72_0.17_162)]">{inputs.founder_experience}/5</span></Label>
          <p className="text-[10px] text-[oklch(0.72_0.17_162/0.7)] mb-2">{EXPERIENCE_LEVELS[inputs.founder_experience]}</p>
          <Slider value={[inputs.founder_experience]} onValueChange={(v) => setField('founder_experience', Array.isArray(v) ? v[0] : v)} min={1} max={5} step={1} />
        </div>

        <div>
          <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Domain Expertise: <span className="text-[oklch(0.72_0.17_162)]">{inputs.domain_expertise}/5</span></Label>
          <p className="text-[10px] text-[oklch(0.72_0.17_162/0.7)] mb-2">{EXPERTISE_LEVELS[inputs.domain_expertise]}</p>
          <Slider value={[inputs.domain_expertise]} onValueChange={(v) => setField('domain_expertise', Array.isArray(v) ? v[0] : v)} min={1} max={5} step={1} />
        </div>
      </motion.div>

      {/* Founder Signals */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5 space-y-4">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[oklch(0.62_0.01_250)]">Founder Signals</span>
        <div className="flex items-center gap-3">
          <Checkbox id="previous_exits" checked={inputs.previous_exits} onCheckedChange={(checked) => setField('previous_exits', !!checked)} />
          <div>
            <Label htmlFor="previous_exits" className="text-[oklch(0.78_0.005_250)] cursor-pointer text-sm">Founders have previous exits</Label>
            <p className="text-[10px] text-[oklch(0.50_0.01_250)]">Previously sold or IPO&apos;d a company (+15 pts)</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Checkbox id="technical_cofounder" checked={inputs.technical_cofounder} onCheckedChange={(checked) => setField('technical_cofounder', !!checked)} />
          <div>
            <Label htmlFor="technical_cofounder" className="text-[oklch(0.78_0.005_250)] cursor-pointer text-sm">Has technical co-founder</Label>
            <p className="text-[10px] text-[oklch(0.50_0.01_250)]">Reduces execution risk for product-led startups (+10 pts)</p>
          </div>
        </div>
      </motion.div>

      {/* Key Hires */}
      <motion.div variants={staggerItem} className="glass-card grain relative rounded-xl p-5">
        <div className="mb-3">
          <Label className="text-[oklch(0.78_0.005_250)] text-xs font-semibold uppercase tracking-wider">Key Hires</Label>
          <p className="text-[10px] text-[oklch(0.50_0.01_250)]">Senior roles already filled (+2 pts each)</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {KEY_HIRE_OPTIONS.map(option => (
            <label key={option.value} className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border cursor-pointer transition-all text-sm ${inputs.key_hires.includes(option.value) ? 'border-[oklch(0.72_0.17_162/0.5)] bg-[oklch(0.72_0.17_162/0.10)] text-[oklch(0.80_0.14_162)] shadow-[0_0_12px_oklch(0.72_0.17_162/0.08)]' : 'border-[oklch(0.26_0.018_250)] bg-[oklch(0.12_0.012_250)] text-[oklch(0.55_0.01_250)] hover:border-[oklch(0.35_0.008_260)] hover:bg-[oklch(0.14_0.015_250)]'}`}>
              <Checkbox checked={inputs.key_hires.includes(option.value)} onCheckedChange={() => toggleKeyHire(option.value)} className="hidden" />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

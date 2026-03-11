import { APPROACH_LABELS } from '@/types'
import type { ValuationApproach } from '@/types'

const APPROACHES: { key: ValuationApproach; methods: string[] }[] = [
  { key: 'income', methods: ['DCF (Discounted Cash Flow)', 'PWERM (Probability Weighted)'] },
  { key: 'market', methods: ['Revenue Multiple', 'EV/EBITDA Multiple', 'Comparable Transactions'] },
  { key: 'asset_cost', methods: ['Net Asset Value', 'Replacement Cost'] },
  { key: 'vc_startup', methods: ['Scorecard (Bill Payne)', 'Berkus Method', 'Risk Factor Summation'] },
]

export function MethodShowcase() {
  return (
    <section className="py-16 px-6 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-2 text-white">
          3 Approaches x 10 Methods
        </h2>
        <p className="text-center text-slate-400 mb-10">
          Aligned with IBBI Valuation Standards, IVS 105, and Rule 11UA
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {APPROACHES.map(a => (
            <div key={a.key} className="p-6 rounded-lg bg-slate-950 border border-slate-800 backdrop-blur-sm">
              <h3 className="font-semibold text-amber-400 mb-3">{APPROACH_LABELS[a.key]}</h3>
              <ul className="space-y-1">
                {a.methods.map(m => (
                  <li key={m} className="text-sm flex items-center gap-2 text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

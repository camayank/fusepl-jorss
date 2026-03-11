export function TrustSignals() {
  const signals = [
    'Built by an IBBI-Registered Insolvency Professional & SFA-Licensed Valuer',
    'Powered by Damodaran India Industry Benchmarks (January 2026)',
    '3 Valuation Approaches x 10 Methods — aligned with IBBI/IVS/Rule 11UA Standards',
    'Monte Carlo Simulation with 10,000 iterations',
    '190+ IBC landmark cases analyzed | 3,952 corporate debtor outcomes studied',
  ]

  return (
    <section className="py-12 px-6 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-white">Not a Random Calculator</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {signals.map((signal, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-amber-400 font-bold text-lg mt-0.5">&#10003;</span>
              <p className="text-sm text-slate-300">{signal}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

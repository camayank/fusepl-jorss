import Link from 'next/link'

export function Hero() {
  return (
    <section className="w-full min-h-[600px] flex flex-col items-center justify-center text-center px-6 py-20 bg-gradient-to-b from-amber-950/20 to-slate-950 relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

      <p className="text-sm font-semibold text-amber-400 uppercase tracking-wider mb-4 relative z-10">
        AI-Powered Startup Valuation
      </p>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-4xl relative z-10">
        <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
          India&apos;s Most Comprehensive
        </span>
        <br />
        <span className="text-white">
          Startup Valuation Platform
        </span>
      </h1>
      <p className="mt-6 text-lg text-slate-300 max-w-2xl relative z-10">
        3 Approaches x 10 Methods — DCF, PWERM, Revenue Multiple, EV/EBITDA, Comparable Transactions,
        NAV, Replacement Cost, Scorecard, Berkus, Risk Factor Summation.
        Powered by Damodaran India data. Monte Carlo simulation. Free.
      </p>
      <div className="flex flex-wrap gap-3 mt-8 relative z-10">
        <Link
          href="/valuation"
          className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
        >
          Get Your Valuation
        </Link>
        <Link
          href="/cap-table"
          className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
        >
          Cap Table Simulator
        </Link>
        <Link
          href="/esop-calculator"
          className="inline-flex items-center justify-center rounded-lg h-9 px-4 text-sm font-medium border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors"
        >
          ESOP Calculator
        </Link>
      </div>
    </section>
  )
}

export function HowItWorks() {
  const steps = [
    {
      num: '1',
      title: 'Answer 6 Quick Steps',
      desc: 'Company profile, team, financials, market, strategy, ESOP — takes 3-5 minutes.',
    },
    {
      num: '2',
      title: 'Get Your Valuation',
      desc: '10 methods across 3 approaches compute your range. Monte Carlo simulation runs 10,000 scenarios.',
    },
    {
      num: '3',
      title: 'Unlock Full Report',
      desc: 'Enter your email for detailed methodology, benchmarks, ESOP valuation, investor matches, and AI insights.',
    },
  ]

  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10 text-white">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map(step => (
            <div key={step.num} className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {step.num}
              </div>
              <h3 className="font-semibold mb-2 text-white">{step.title}</h3>
              <p className="text-sm text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

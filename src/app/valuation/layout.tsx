import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Startup Valuation Wizard',
  description: 'Get your startup valued using 10 methods across 4 approaches. DCF, Revenue Multiple, Scorecard, Berkus, Monte Carlo simulation, and more.',
}

export default function ValuationLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import { ESOPClient } from './esop-client'

export const metadata: Metadata = {
  title: 'ESOP Valuation Calculator — Black-Scholes for Indian Startups',
  description: 'Free ESOP valuation calculator using Black-Scholes model. Sensitivity analysis for conservative, base, and optimistic scenarios. Powered by Damodaran India beta data.',
}

export default function ESOPCalculatorPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">ESOP Valuation Calculator</h1>
      <p className="text-muted-foreground mb-6">
        Estimate the value of your ESOP shares using the Black-Scholes model with Damodaran India volatility data.
      </p>
      <ESOPClient />
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Want a full 10-method startup valuation with ESOP analysis?
        </p>
        <a href="/valuation" className="text-amber-400 font-medium hover:underline">
          Get Your Free Valuation &rarr;
        </a>
      </div>
    </main>
  )
}

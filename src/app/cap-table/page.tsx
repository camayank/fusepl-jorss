import type { Metadata } from 'next'
import { StandaloneCapTable } from './cap-table-client'

export const metadata: Metadata = {
  title: 'Cap Table Simulator — Model Dilution for Your Next Round',
  description: 'Free startup cap table calculator for Indian founders. Model pre-money, post-money, dilution, ESOP pool impact. Pre-round vs post-round ESOP comparison.',
}

export default function CapTablePage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-2">Cap Table Simulator</h1>
      <p className="text-muted-foreground mb-6">
        Model your next funding round — see how dilution affects founder ownership.
        No login required.
      </p>
      <StandaloneCapTable />
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Want a full 10-method startup valuation with this cap table analysis?
        </p>
        <a href="/valuation" className="text-amber-400 font-medium hover:underline">
          Get Your Free Valuation &rarr;
        </a>
      </div>
    </main>
  )
}

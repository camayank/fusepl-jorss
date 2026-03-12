import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Choose Your Valuation Purpose',
  description: 'Select your valuation purpose — Indicative, Fundraising, ESOP, Rule 11UA, FEMA, or M&A. Each purpose determines analysis depth and regulatory compliance.',
}

export default function PurposeLayout({ children }: { children: React.ReactNode }) {
  return children
}

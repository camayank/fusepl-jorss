import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Valuation Report',
  description: 'Your startup valuation report — 10 methods, Monte Carlo simulation, confidence scoring, and AI-generated narrative analysis.',
  robots: { index: false, follow: false },
}

export default function ReportLayout({ children }: { children: React.ReactNode }) {
  return children
}

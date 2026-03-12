import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Investor Deal Check',
  description: 'Validate any startup deal in seconds. Check if the ask is fair based on sector benchmarks, growth, and comparable transactions.',
}

export default function DealCheckLayout({ children }: { children: React.ReactNode }) {
  return children
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'First Unicorn Startup — India\'s Most Comprehensive Startup Valuation Platform',
    template: '%s | First Unicorn Startup',
  },
  description: '3 Approaches x 10 Methods — DCF, PWERM, Revenue Multiple, EV/EBITDA, NAV, Scorecard, Berkus & more. Monte Carlo simulation. Damodaran India data. Free instant valuation. Built by an IBBI-Registered Valuer.',
  keywords: ['startup valuation', 'india', 'rule 11ua', 'fema valuation', 'dcf', 'monte carlo', 'cap table', 'esop valuation', 'damodaran india'],
  authors: [{ name: 'First Unicorn Startup' }],
  openGraph: {
    title: 'First Unicorn Startup — Know Your Startup\'s True Worth',
    description: '10 valuation methods, 3 approaches, Monte Carlo simulation. Free.',
    url: 'https://firstunicornstartup.com',
    siteName: 'First Unicorn Startup',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'First Unicorn Startup — Startup Valuation Platform',
    description: '10 methods, 3 approaches, Monte Carlo, Damodaran India data. Free.',
  },
  metadataBase: new URL('https://firstunicornstartup.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}

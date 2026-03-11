import Link from 'next/link'

const PRODUCT_LINKS = [
  { href: '/valuation', label: 'Startup Valuation' },
  { href: '/cap-table', label: 'Cap Table Simulator' },
  { href: '/esop-calculator', label: 'ESOP Calculator' },
]

const RESOURCE_LINKS = [
  { href: '/valuation', label: 'DCF Calculator' },
  { href: '/valuation', label: 'Monte Carlo Simulation' },
  { href: '/valuation', label: 'Rule 11UA Compliance' },
]

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-white/[0.06] bg-slate-950">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <span aria-hidden="true">&#x1f984;</span>
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                First Unicorn Startup
              </span>
            </Link>
            <p className="mt-3 text-sm text-slate-500 leading-relaxed max-w-xs">
              India&apos;s most comprehensive startup valuation platform.
              3 approaches, 10 methods, Monte Carlo simulation.
            </p>
            {/* Trust badge */}
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/[0.08] border border-amber-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-xs font-medium text-amber-400/90">
                Built by an IBBI-Registered Valuer
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Tools</h4>
            <ul className="space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-600">
            &copy; {year} firstunicornstartup.com. All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            Valuation platform by an IBBI-Registered IP &amp; SFA-Licensed Valuer
          </p>
        </div>
      </div>
    </footer>
  )
}

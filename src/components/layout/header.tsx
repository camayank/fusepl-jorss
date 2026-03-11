'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MobileNav } from './mobile-nav'

const NAV_LINKS = [
  { href: '/valuation', label: 'Valuation' },
  { href: '/cap-table', label: 'Cap Table' },
  { href: '/esop-calculator', label: 'ESOP Calculator' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-slate-950/70 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg tracking-tight transition-opacity hover:opacity-90"
        >
          <span className="text-xl" aria-hidden="true">&#x1f984;</span>
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            First Unicorn Startup
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (pathname?.startsWith(link.href + '/') ?? false)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                  ${isActive ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'}
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[13px] h-[2px] rounded-full bg-amber-400" />
                )}
              </Link>
            )
          })}

          <div className="ml-4 pl-4 border-l border-white/[0.08]">
            <Link
              href="/valuation"
              className="inline-flex items-center justify-center rounded-lg h-8 px-4 text-sm font-semibold bg-amber-500 text-slate-950 transition-all hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] active:scale-[0.98]"
            >
              Get Valuation
            </Link>
          </div>
        </nav>

        {/* Mobile navigation trigger */}
        <div className="md:hidden">
          <MobileNav links={NAV_LINKS} pathname={pathname} />
        </div>
      </div>
    </header>
  )
}

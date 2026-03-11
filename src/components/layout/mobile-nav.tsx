'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

interface NavLink {
  href: string
  label: string
}

interface MobileNavProps {
  links: NavLink[]
  pathname: string | null
}

export function MobileNav({ links, pathname }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white"
          />
        }
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] bg-slate-950/95 backdrop-blur-xl border-slate-800/50 p-0"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex flex-col h-full">
          {/* Branding */}
          <div className="flex items-center gap-2 p-5 border-b border-slate-800/50">
            <span className="text-lg">&#x1f984;</span>
            <span className="font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              First Unicorn Startup
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-4 flex-1">
            {links.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname?.startsWith(link.href + '/') ?? false)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`
                    relative rounded-lg px-4 py-3 text-sm font-medium transition-colors
                    ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-400'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA at bottom */}
          <div className="p-4 border-t border-slate-800/50">
            <Link
              href="/valuation"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full rounded-lg h-10 px-4 text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors"
            >
              Get Valuation
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

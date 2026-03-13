'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
            className="text-[oklch(0.35_0.02_260)] hover:text-[oklch(0.15_0.02_260)]"
          />
        }
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[300px] bg-[oklch(1_0_0/0.97)] backdrop-blur-xl border-[oklch(0.91_0.005_260)] p-0"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        <div className="flex flex-col h-full">
          {/* Branding */}
          <div className="flex items-center gap-2 p-5 border-b border-[oklch(0.91_0.005_260)]">
            <Image src="/logo.png" alt="First Unicorn Startup" width={120} height={32} className="h-7 w-auto" />
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
                        ? 'bg-[oklch(0.62_0.22_330/0.08)] text-[oklch(0.62_0.22_330)] border-l-2 border-[oklch(0.62_0.22_330)]'
                        : 'text-[oklch(0.35_0.02_260)] hover:text-[oklch(0.15_0.02_260)] hover:bg-[oklch(0.96_0.005_260)]'
                    }
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* CTA at bottom */}
          <div className="p-4 border-t border-[oklch(0.91_0.005_260)]">
            <Link
              href="/valuation"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center w-full rounded-lg h-10 px-4 text-sm font-semibold bg-[#32373c] text-white transition-all hover:bg-[#1d2024]"
            >
              Get Valuation
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

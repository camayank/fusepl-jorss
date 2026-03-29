'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ headings }: { headings: TocItem[] }) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 },
    )

    for (const heading of headings) {
      const el = document.getElementById(heading.id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  return (
    <nav className="space-y-1" aria-label="Table of contents">
      <p className="text-[10px] font-bold text-[oklch(0.62 0.22 330)] uppercase tracking-[0.2em] mb-3">
        On This Page
      </p>
      {headings.map((h) => (
        <a
          key={h.id}
          href={`#${h.id}`}
          onClick={(e) => {
            e.preventDefault()
            document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className={`block text-[13px] leading-relaxed transition-colors duration-200 ${
            h.level === 3 ? 'pl-4' : h.level === 4 ? 'pl-8' : ''
          } ${
            activeId === h.id
              ? 'text-[oklch(0.62 0.22 330)] font-medium'
              : 'text-[oklch(0.50 0.01 260)] hover:text-[oklch(0.25 0.02 260)]'
          }`}
        >
          {h.text}
        </a>
      ))}
    </nav>
  )
}

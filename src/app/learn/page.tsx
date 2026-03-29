import type { Metadata } from 'next'
import { getAllArticles } from '@/lib/content'
import { LearnPageClient } from './learn-page-client'

export const metadata: Metadata = {
  title: "Learn — The Founder's Edge",
  description:
    "1,000 data-backed guides on startup valuation, fundraising, growth, and building startups that last. By First Unicorn Startup.",
  other: { robots: 'max-image-preview:large' },
}

export default function LearnPage() {
  const articles = getAllArticles()

  return <LearnPageClient articles={articles} />
}

import { getAllArticles, getPillar } from '@/lib/content'

const BASE_URL = 'https://firstunicornstartup.com'

export async function GET() {
  const articles = getAllArticles().slice(0, 50) // Latest 50 articles

  const items = articles.map((article) => {
    const pillar = getPillar(article.frontmatter.pillar)
    return `
    <item>
      <title><![CDATA[${article.frontmatter.title}]]></title>
      <link>${BASE_URL}/learn/${article.frontmatter.pillar}/${article.frontmatter.slug}</link>
      <description><![CDATA[${article.frontmatter.excerpt}]]></description>
      <pubDate>${new Date(article.frontmatter.publishDate).toUTCString()}</pubDate>
      <guid isPermaLink="true">${BASE_URL}/learn/${article.frontmatter.pillar}/${article.frontmatter.slug}</guid>
      <category>${pillar?.name || article.frontmatter.pillar}</category>
      <author>team@firstunicornstartup.com (First Unicorn Startup)</author>
    </item>`
  })

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>First Unicorn Startup — The Founder's Edge</title>
    <link>${BASE_URL}/learn</link>
    <description>Data-backed guides on startup valuation, fundraising, growth, and building startups that last. By India's most rigorous startup valuation platform.</description>
    <language>en-in</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE_URL}/logo.png</url>
      <title>First Unicorn Startup</title>
      <link>${BASE_URL}</link>
    </image>
    ${items.join('')}
  </channel>
</rss>`

  return new Response(feed.trim(), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

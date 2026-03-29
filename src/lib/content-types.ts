export interface ArticleFrontmatter {
  title: string
  slug: string
  pillar: string
  cluster: string
  excerpt: string
  publishDate: string
  updatedDate?: string
  author: string
  keywords: {
    primary: string
    secondary?: string[]
    longtail?: string[]
  }
  schema: string[]
  tools?: string[]
  featured?: boolean
  image?: string
}

export interface Article {
  frontmatter: ArticleFrontmatter
  content: string
  readingTime: number
  wordCount: number
}

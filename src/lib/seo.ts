import { getBaseUrl } from '@/lib/media'

/** Strip HTML tags and collapse whitespace for meta descriptions. */
export function stripHtmlToPlainText(input: string | null | undefined, maxLength = 320): string | undefined {
  if (!input || typeof input !== 'string') return undefined

  const withoutTags = input
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/\s+/g, ' ')
    .trim()

  if (!withoutTags) return undefined
  if (withoutTags.length <= maxLength) return withoutTags
  return `${withoutTags.slice(0, maxLength - 1).trim()}…`
}

/** Detect blogr.blog import pollution in SEO fields. */
export function seoFieldLooksImported(raw: string | null | undefined): boolean {
  if (!raw || typeof raw !== 'string') return false
  return (
    raw.includes('blogr.blog') ||
    raw.includes('<title>') ||
    raw.includes('<meta ') ||
    raw.includes('<link rel=')
  )
}

type ArticleJsonLdInput = {
  title: string
  description?: string
  slug: string
  imageUrl?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  authorName?: string | null
}

/** Build clean Article JSON-LD for blog posts. */
export function buildArticleJsonLd(input: ArticleJsonLdInput): Record<string, unknown> {
  const base = getBaseUrl()
  const url = `${base}/blog/${input.slug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    image: input.imageUrl || undefined,
    datePublished: input.publishedAt || undefined,
    dateModified: input.updatedAt || input.publishedAt || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: input.authorName ? { '@type': 'Person', name: input.authorName } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'The Truckers Edge',
      logo: { '@type': 'ImageObject', url: `${base}/images/og-default.png` },
    },
  }
}

/** Prefer clean excerpt/SEO text; ignore imported HTML meta blocks. */
export function resolvePostDescription(
  excerpt: string | null | undefined,
  metaDescription: string | null | undefined,
): string | undefined {
  const cleanMeta = seoFieldLooksImported(metaDescription)
    ? undefined
    : stripHtmlToPlainText(metaDescription, 160)
  const cleanExcerpt = stripHtmlToPlainText(excerpt, 160)
  return cleanMeta || cleanExcerpt
}

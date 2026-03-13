import Parser from 'rss-parser'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'

export interface NewsItem {
  id: string
  title: string
  url: string
  source: string
  publishedAt: Date
  type: 'rss' | 'post' | 'link'
  category?: string
}

const parser = new Parser()

async function fetchRssFeed(
  feedUrl: string,
  sourceName: string,
  category?: string | null
): Promise<NewsItem[]> {
  try {
    const res = await fetch(feedUrl, { next: { revalidate: 900 } })
    if (!res.ok) return []
    const xml = await res.text()
    const feed = await parser.parseString(xml)
    const items: NewsItem[] = []
    for (const item of feed.items.slice(0, 30)) {
      const link = item.link
      if (!link) continue
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date()
      items.push({
        id: `rss-${sourceName}-${item.guid || link}`,
        title: item.title || '(No title)',
        url: link,
        source: sourceName,
        publishedAt: pubDate,
        type: 'rss',
        category: category || undefined,
      })
    }
    return items
  } catch {
    return []
  }
}

async function fetchAllNewsUncached(): Promise<NewsItem[]> {
  const payload = await getPayload({ config })

  const [feedSourcesRes, postsRes, newsLinksRes] = await Promise.all([
    payload.find({
      collection: 'feed-sources',
      where: { enabled: { equals: true } },
      limit: 100,
    }),
    payload.find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 20,
    }),
    payload.find({
      collection: 'news-links',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 50,
    }),
  ])

  const rssItems = await Promise.all(
    feedSourcesRes.docs.map((feed) =>
      fetchRssFeed(feed.feedUrl, feed.name, feed.category)
    )
  )

  const postItems: NewsItem[] = postsRes.docs.map((post) => ({
    id: `post-${post.id}`,
    title: post.title,
    url: `/blog/${post.slug || post.id}`,
    source: 'The Truckers Edge',
    publishedAt: post.publishedAt ? new Date(post.publishedAt) : new Date(),
    type: 'post',
  }))

  const linkItems: NewsItem[] = newsLinksRes.docs.map((link) => ({
    id: `link-${link.id}`,
    title: link.title,
    url: link.url.startsWith('http') || link.url.startsWith('/') ? link.url : `/${link.url}`,
    source: link.source || 'Curated',
    publishedAt: link.publishedAt ? new Date(link.publishedAt) : new Date(),
    type: 'link',
    category: link.category || undefined,
  }))

  const combined = [
    ...rssItems.flat(),
    ...postItems,
    ...linkItems,
  ].sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  return combined.slice(0, 150)
}

export async function fetchNews(): Promise<NewsItem[]> {
  try {
    return await unstable_cache(fetchAllNewsUncached, ['truckers-news'], {
      revalidate: 900,
      tags: ['news'],
    })()
  } catch {
    return []
  }
}

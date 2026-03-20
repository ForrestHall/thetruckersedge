import Parser from 'rss-parser'
import { getPayload } from 'payload'
import config from '@payload-config'
import { scoreAndRewriteHeadline } from './xai-news'

const parser = new Parser()
const BATCH_LIMIT = 50
const MAX_AGE_DAYS = 7

interface RawRssItem {
  url: string
  title: string
  source: string
  publishedAt: Date
}

async function fetchRssItems(
  feedUrl: string,
  sourceName: string
): Promise<RawRssItem[]> {
  try {
    const res = await fetch(feedUrl)
    if (!res.ok) return []
    const xml = await res.text()
    const feed = await parser.parseString(xml)
    const items: RawRssItem[] = []
    for (const item of feed.items.slice(0, 30)) {
      const link = item.link
      if (!link) continue
      const pubDate = item.pubDate ? new Date(item.pubDate) : new Date()
      items.push({
        url: link,
        title: item.title || '(No title)',
        source: sourceName,
        publishedAt: pubDate,
      })
    }
    return items
  } catch {
    return []
  }
}

export async function runProcessNewsJob(): Promise<{
  processed: number
  error?: string
  feedsChecked?: number
  itemsFetched?: number
  itemsNew?: number
  itemsSkipped?: number
}> {
  if (!process.env.XAI_API_KEY) {
    return { processed: 0, error: 'XAI_API_KEY not set' }
  }

  const payload = await getPayload({ config })

  const { docs: feedSources } = await payload.find({
    collection: 'feed-sources',
    where: { enabled: { equals: true } },
    limit: 100,
  })

  const allRssItems: RawRssItem[] = []
  for (const feed of feedSources) {
    const items = await fetchRssItems(feed.feedUrl, feed.name)
    allRssItems.push(...items)
  }

  const { docs: existing } = await payload.find({
    collection: 'processed-news-items',
    limit: 10000,
  })
  const existingUrls = new Set(existing.map((d) => (d as { url: string }).url))

  const newItems = allRssItems
    .filter((item) => !existingUrls.has(item.url))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
    .slice(0, BATCH_LIMIT)

  let processed = 0
  let skipped = 0
  for (const item of newItems) {
    try {
      const result = await scoreAndRewriteHeadline(item.title, item.source)
      if (!result) {
        skipped++
        continue
      }

      await payload.create({
        collection: 'processed-news-items',
        data: {
          url: item.url,
          originalTitle: item.title,
          rewrittenTitle: result.rewritten,
          viralScore: result.score,
          source: item.source,
          publishedAt: item.publishedAt.toISOString(),
          processedAt: new Date().toISOString(),
          seo: {
            metaTitle: result.metaTitle,
            metaDescription: result.metaDescription,
          },
        },
      })
      processed++
      existingUrls.add(item.url)
    } catch {
      // skip failed items
    }
  }

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - MAX_AGE_DAYS)
  const { docs: oldItems } = await payload.find({
    collection: 'processed-news-items',
    where: { processedAt: { less_than: cutoff.toISOString() } },
    limit: 500,
  })
  for (const doc of oldItems) {
    await payload.delete({
      collection: 'processed-news-items',
      id: doc.id,
    })
  }

  return {
    processed,
    feedsChecked: feedSources.length,
    itemsFetched: allRssItems.length,
    itemsNew: newItems.length,
    itemsSkipped: skipped,
  }
}

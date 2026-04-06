import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://thetruckersedge.com'

const staticPages: MetadataRoute.Sitemap = [
  { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
  { url: `${baseUrl}/practice-tests`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
  { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${baseUrl}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${baseUrl}/tools`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  { url: `${baseUrl}/tools/ifta-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${baseUrl}/tools/per-diem-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${baseUrl}/tools/service-intervals`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  { url: `${baseUrl}/mechanics`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const payload = await getPayload({ config })

    const [posts, articles, tests, mechanicSites] = await Promise.all([
      payload.find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 500,
        select: { slug: true, publishedAt: true, updatedAt: true },
      }),
      payload.find({
        collection: 'articles',
        where: { status: { equals: 'published' } },
        limit: 500,
        select: { slug: true, publishedAt: true, updatedAt: true },
      }),
      payload.find({
        collection: 'practice-tests',
        where: { status: { equals: 'published' } },
        limit: 100,
        select: { slug: true, updatedAt: true },
      }),
      payload.find({
        collection: 'mechanic-sites',
        where: { status: { equals: 'active' } },
        limit: 500,
        select: { slug: true, updatedAt: true },
        overrideAccess: true,
      }),
    ])

    const blogUrls: MetadataRoute.Sitemap = posts.docs
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${baseUrl}/blog/${p.slug}`,
        lastModified: (p.updatedAt ? new Date(p.updatedAt) : p.publishedAt ? new Date(p.publishedAt) : new Date()) as Date,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }))

    const guideUrls: MetadataRoute.Sitemap = articles.docs
      .filter((a) => a.slug)
      .map((a) => ({
        url: `${baseUrl}/guides/${a.slug}`,
        lastModified: (a.updatedAt ? new Date(a.updatedAt) : a.publishedAt ? new Date(a.publishedAt) : new Date()) as Date,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))

    const testUrls: MetadataRoute.Sitemap = tests.docs
      .filter((t) => t.slug)
      .map((t) => ({
        url: `${baseUrl}/practice-tests/${t.slug}`,
        lastModified: (t.updatedAt ? new Date(t.updatedAt) : new Date()) as Date,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))

    const mechanicUrls: MetadataRoute.Sitemap = mechanicSites.docs
      .filter((m) => m.slug)
      .map((m) => ({
        url: `${baseUrl}/mechanics/${m.slug}`,
        lastModified: (m.updatedAt ? new Date(m.updatedAt) : new Date()) as Date,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      }))

    return [...staticPages, ...blogUrls, ...guideUrls, ...testUrls, ...mechanicUrls]
  } catch {
    return staticPages
  }
}

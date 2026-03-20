import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@/components/RichText'
import { getMediaUrl, getBaseUrl } from '@/lib/media'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })
  const article = docs[0]
  if (!article) return {}

  const title = article.seo?.metaTitle || article.title
  const description = article.seo?.metaDescription || article.excerpt || undefined
  const url = `${getBaseUrl()}/guides/${slug}`
  const media = article.featuredImage && typeof article.featuredImage === 'object' ? article.featuredImage : null
  const imageUrl = media?.url ? getMediaUrl(media.url) : null

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: description ?? undefined,
      url,
      type: 'article',
      publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
      images: imageUrl ? [{ url: imageUrl, alt: media?.alt || article.title }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: description ?? undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })

  const article = docs[0]
  if (!article) notFound()

  const categorySlug =
    article.category && typeof article.category === 'object' && 'slug' in article.category
      ? (article.category as { slug?: string }).slug
      : undefined
  const guideLabel =
    categorySlug === 'cdl-by-state'
      ? 'CDL by State'
      : categorySlug === 'career-guides'
        ? 'Career Guide'
        : 'Guide'

  const baseUrl = getBaseUrl()
  const url = `${baseUrl}/guides/${slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.seo?.metaDescription || article.excerpt,
    datePublished: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
    url,
    publisher: { '@type': 'Organization', name: 'The Truckers Edge', url: baseUrl },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="text-brand-yellow font-semibold text-sm mb-3 uppercase tracking-wide">
          {guideLabel}
        </div>
        <h1 className="text-4xl font-extrabold text-brand-navy mb-4 leading-tight">{article.title}</h1>
        {article.excerpt && (
          <p className="text-xl text-gray-500 leading-relaxed">{article.excerpt}</p>
        )}
        {article.publishedAt && (
          <p className="text-sm text-gray-400 mt-4">
            Published{' '}
            {new Date(article.publishedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}
      </div>

      <hr className="border-gray-200 mb-8" />

      <div className="prose-truckers">
        <RichText content={article.content} />
      </div>

      <div className="mt-16 bg-brand-navy rounded-2xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">Ready to get your CDL?</h3>
        <p className="text-gray-300 mb-6">Take a free practice test and see where you stand before your exam day.</p>
        <a href="/practice-tests" className="btn-primary">
          Start a Free Practice Test
        </a>
      </div>
    </div>
    </>
  )
}

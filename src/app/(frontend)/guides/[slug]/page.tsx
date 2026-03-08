import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { RichText } from '@/components/RichText'

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
  })
  const article = docs[0]
  if (!article) return {}

  return {
    title: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.excerpt,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })

  const article = docs[0]
  if (!article) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <div className="text-brand-yellow font-semibold text-sm mb-3 uppercase tracking-wide">
          Career Guide
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
  )
}

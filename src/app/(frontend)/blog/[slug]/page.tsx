import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { HtmlContent } from '@/components/HtmlContent'
import { RichText } from '@/components/RichText'
import { getMediaUrl } from '@/lib/media'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  const post = docs[0]
  if (!post) return {}

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })

  const post = docs[0]
  if (!post) notFound()

  const author = typeof post.author === 'object' && post.author !== null ? post.author : null

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="mb-8">
        <a href="/blog" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
          ← All Posts
        </a>
        <h1 className="text-4xl font-extrabold text-brand-navy mb-4 leading-tight">{post.title}</h1>
        {post.excerpt && (
          <p className="text-xl text-gray-500 leading-relaxed">{post.excerpt}</p>
        )}
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          {author && typeof author === 'object' && 'name' in author && author.name && (
            <span>by {author.name}</span>
          )}
        </div>
      </div>

      {(() => {
        const media = post.featuredImage && typeof post.featuredImage === 'object' ? post.featuredImage : null
        const imgUrl = media?.url ? getMediaUrl(media.url) : null
        return imgUrl ? (
          <div className="aspect-video overflow-hidden rounded-lg mb-8">
            <img
              src={imgUrl}
              alt={media?.alt ?? ''}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null
      })()}

      <div className="prose-truckers">
        {typeof post.content === 'string' && !(post.content as string).trim().startsWith('{') ? (
          <HtmlContent html={post.content as string} />
        ) : (
          <RichText content={post.content} />
        )}
      </div>

      <div className="mt-16 text-center">
        <a href="/blog" className="text-brand-yellow font-semibold hover:text-brand-yellowDark">
          ← Back to Blog
        </a>
      </div>
    </div>
  )
}

import Link from 'next/link'
import { getMediaUrl } from '@/lib/media'

interface PostCardProps {
  post: {
    id: string | number
    title: string
    slug: string
    excerpt?: string | null
    publishedAt?: string | null
    author?: { name?: string } | string | number | null
    featuredImage?: { url?: string | null; alt?: string } | number | null
  }
}

export function PostCard({ post }: PostCardProps) {
  const authorName =
    typeof post.author === 'object' && post.author !== null ? (post.author as { name?: string }).name : null

  const imgUrl =
    post.featuredImage && typeof post.featuredImage === 'object' && post.featuredImage?.url
      ? getMediaUrl(post.featuredImage.url)
      : null

  return (
    <Link href={`/blog/${post.slug}`} className="card p-6 flex flex-col gap-3 overflow-hidden">
      {imgUrl && (
        <div className="relative -mx-6 -mt-6 mb-4 aspect-video overflow-hidden">
          <img
            src={imgUrl}
            alt={typeof post.featuredImage === 'object' && post.featuredImage?.alt ? String(post.featuredImage.alt) : ''}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <h3 className="text-lg font-bold text-brand-navy leading-snug">{post.title}</h3>
      {post.excerpt && (
        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
      )}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {post.publishedAt && (
            <span>
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          )}
          {authorName && <span>by {authorName}</span>}
        </div>
        <span className="text-brand-yellow text-sm font-semibold ml-auto">Read more →</span>
      </div>
    </Link>
  )
}

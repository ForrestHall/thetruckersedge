import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PostCard } from '@/components/PostCard'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Trucking news, driving tips, and updates for CDL holders. Stay informed on the latest in the trucking industry.',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
    depth: 2,
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-brand-navy mb-4">Blog</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Trucking news, driving tips, and updates for CDL holders. Stay informed on the latest in the trucking industry.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No posts yet — check back soon.</p>
          <p className="text-sm mt-2">
            Admins can add posts at <Link href="/admin" className="text-brand-yellow hover:underline">/admin</Link>
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post as any} />
          ))}
        </div>
      )}
    </div>
  )
}

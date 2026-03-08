import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ArticleCard } from '@/components/ArticleCard'

export const metadata: Metadata = {
  title: 'Trucking Career Guides',
  description:
    'Honest, experience-based guides on getting your CDL, finding the best trucking companies, owner-operator tips, and advancing your driving career.',
}

export const dynamic = 'force-dynamic'

export default async function GuidesPage() {
  const payload = await getPayload({ config })

  const { docs: articles } = await payload.find({
    collection: 'articles',
    where: { status: { equals: 'published' } },
    sort: '-publishedAt',
    limit: 50,
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-brand-navy mb-4">Trucking Career Guides</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Straight-talk guides on getting your CDL, picking the right company, going owner-operator, and everything in between.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">Guides coming soon — check back shortly.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article as any} />
          ))}
        </div>
      )}
    </div>
  )
}

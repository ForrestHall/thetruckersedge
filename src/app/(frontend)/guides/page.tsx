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

  const { docs: categories } = await payload.find({
    collection: 'categories',
    where: { slug: { in: ['cdl-by-state', 'career-guides'] } },
    limit: 2,
  })

  const stateCat = categories.find((c) => c.slug === 'cdl-by-state')
  const careerCat = categories.find((c) => c.slug === 'career-guides')

  const [stateArticlesRes, careerArticlesRes] = await Promise.all([
    stateCat
      ? payload.find({
          collection: 'articles',
          where: {
            status: { equals: 'published' },
            category: { equals: stateCat.id },
          },
          sort: 'title',
          limit: 60,
        })
      : { docs: [] as { id: string | number; title: string; slug: string; excerpt?: string | null; publishedAt?: string | null; category?: unknown }[] },
    careerCat
      ? payload.find({
          collection: 'articles',
          where: {
            status: { equals: 'published' },
            category: { equals: careerCat.id },
          },
          sort: '-publishedAt',
          limit: 20,
        })
      : { docs: [] as { id: string | number; title: string; slug: string; excerpt?: string | null; publishedAt?: string | null; category?: unknown }[] },
  ])

  const stateArticles = stateArticlesRes.docs
  const careerArticles = careerArticlesRes.docs

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-brand-navy mb-4">Trucking Career Guides</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Straight-talk guides on getting your CDL in every state, picking the right company, going owner-operator, and everything in between.
        </p>
      </div>

      {stateArticles.length === 0 && careerArticles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">Guides coming soon — check back shortly.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {stateArticles.length > 0 && (
            <section id="cdl-by-state">
              <h2 className="text-2xl font-bold text-brand-navy mb-4">CDL by State (50 guides)</h2>
              <p className="text-gray-500 mb-6">Step-by-step guides for getting your Commercial Driver&apos;s License in every state.</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stateArticles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            </section>
          )}

          {careerArticles.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-brand-navy mb-4">Career & Industry Guides</h2>
              <p className="text-gray-500 mb-6">Advice on choosing a trucking path, going owner-operator, and advancing your career.</p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {careerArticles.map((article) => (
                  <ArticleCard key={article.id} article={article as any} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}

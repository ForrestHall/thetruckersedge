import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchNews } from '@/lib/fetch-news'

export const metadata: Metadata = {
  title: 'Truckers News',
  description:
    'Aggregated trucking industry news from Fleet Owner, FMCSA, Overdrive, FreightWaves, and more. Stay informed on regulations, freight, and equipment.',
}

export const revalidate = 900

export default async function NewsPage() {
  const items = await fetchNews()
  const leadItems = items.slice(0, 2)
  const restItems = items.slice(2)

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-navy mb-2">Truckers News</h1>
        <p className="text-gray-500">
          Industry news, regulations, and updates — aggregated for truckers.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl">No news items yet.</p>
          <p className="text-sm mt-2">
            Run <code className="bg-brand-gray px-2 py-1 rounded">npx tsx scripts/seed-news-feeds.ts</code> to add RSS
            sources, or add links in Admin → News Links.
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {leadItems.length > 0 && (
            <div className="border-b border-gray-200 pb-8">
              {leadItems.map((item) => (
                <div key={item.id} className="mb-4 last:mb-0">
                  <a
                    href={item.url}
                    target={item.url.startsWith('http') ? '_blank' : undefined}
                    rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="text-xl font-bold text-brand-navy hover:text-brand-yellow hover:underline block"
                  >
                    {item.title}
                  </a>
                  <span className="text-sm text-gray-500">{item.source}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-12 gap-y-6">
            {restItems.map((item) => (
              <div key={item.id} className="border-l-2 border-brand-yellow pl-3">
                <a
                  href={item.url}
                  target={item.url.startsWith('http') ? '_blank' : undefined}
                  rel={item.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-brand-navy hover:text-brand-yellow hover:underline font-medium block"
                >
                  {item.title}
                </a>
                <span className="text-xs text-gray-500">{item.source}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

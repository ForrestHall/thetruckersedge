import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ServiceIntervalsSearch } from '@/components/ServiceIntervalsSearch'

export const metadata: Metadata = {
  title: 'Truck Service Intervals Lookup',
  description:
    'Look up maintenance intervals for your truck or engine by make, model, or year. Covers Volvo, Cummins, Detroit, PACCAR, and more.',
}

export const dynamic = 'force-dynamic'

interface SearchParams {
  q?: string
}

export default async function ServiceIntervalsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q } = await searchParams
  const searchTerm = typeof q === 'string' ? q.trim() : ''

  let docs: Awaited<ReturnType<Awaited<ReturnType<typeof getPayload>>['find']>>['docs'] = []

  if (searchTerm.length > 0) {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'service-intervals',
      where: {
        and: [
          { status: { equals: 'published' } },
          {
            or: [
              { name: { contains: searchTerm } },
              { make: { contains: searchTerm } },
              { model: { contains: searchTerm } },
              { yearRange: { contains: searchTerm } },
            ],
          },
        ],
      },
      sort: 'name',
      depth: 2,
    })
    docs = result.docs
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <Link href="/tools" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
          ← All Tools
        </Link>
        <h1 className="text-3xl font-extrabold text-brand-navy mt-3 mb-3">Truck Service Intervals</h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Look up maintenance intervals for your truck or engine. Search by make (Volvo, Cummins, Detroit), engine
          (X15, MX-13, DD13), or year (2022).
        </p>
      </div>

      <ServiceIntervalsSearch defaultQuery={searchTerm} results={docs} />

      <div className="mt-12 bg-brand-gray rounded-2xl p-6">
        <h2 className="text-xl font-bold text-brand-navy mb-3">Why Service Intervals Matter</h2>
        <div className="prose-truckers text-sm text-gray-600 space-y-3">
          <p>
            Following manufacturer-recommended service intervals helps extend engine life, avoid costly repairs, and
            stay compliant with warranty requirements. Intervals vary by duty cycle (idle time, fuel economy), oil
            spec, and model year — always refer to your specific manual or the source PDF for full details.
          </p>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'
import type { MechanicSite } from '@/payload-types'
import { getBaseUrl, getMediaUrl } from '@/lib/media'
import { MECHANIC_DIRECTORY_US_STATES } from '@/lib/mechanic-directory-us-states'
import { MechanicsDirectorySearchForm } from './MechanicsDirectorySearchForm'

const directoryDesc =
  'Find diesel mechanics and heavy truck repair shops listed on The Truckers Edge. Browse by location, services, and certifications — hosted profiles for independent shops and fleets.'

export const metadata: Metadata = {
  title: 'Diesel mechanic directory',
  description: directoryDesc,
  keywords: [
    'diesel mechanic directory',
    'heavy truck repair',
    'semi truck mechanic',
    'commercial truck repair',
    'diesel shop',
    'fleet repair',
  ],
  alternates: {
    canonical: `${getBaseUrl().replace(/\/$/, '')}/mechanics`,
  },
  openGraph: {
    title: 'Diesel mechanic directory | The Truckers Edge',
    description: directoryDesc,
    type: 'website',
    url: `${getBaseUrl().replace(/\/$/, '')}/mechanics`,
    siteName: 'The Truckers Edge',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Diesel mechanic directory',
    description: directoryDesc,
  },
  robots: { index: true, follow: true },
}

export const revalidate = 300

function thumb(site: MechanicSite): string | null {
  const logo = site.logo
  if (logo && typeof logo === 'object' && logo.url) {
    return getMediaUrl(logo.url)
  }
  return null
}

const allowedStateCodes = new Set(MECHANIC_DIRECTORY_US_STATES.map((s) => s.value))

export default async function MechanicsDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; q?: string }>
}) {
  const sp = await searchParams
  const stateParam = sp.state?.trim().toUpperCase() ?? ''
  const stateFilter = stateParam && allowedStateCodes.has(stateParam) ? stateParam : ''
  const qRaw = (sp.q ?? '').trim().slice(0, 80)

  const andParts: Where[] = [{ status: { equals: 'active' } }]
  if (stateFilter) {
    andParts.push({ state: { equals: stateFilter } })
  }
  if (qRaw) {
    andParts.push({
      or: [
        { businessName: { contains: qRaw } },
        { city: { contains: qRaw } },
        { tagline: { contains: qRaw } },
      ],
    })
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mechanic-sites',
    where: { and: andParts },
    sort: 'businessName',
    limit: 200,
    depth: 1,
    overrideAccess: true,
  })

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-brand-navy mb-3">Diesel mechanic directory</h1>
        <p className="text-gray-600">
          Browse independent shops with a hosted profile on The Truckers Edge. Looking to list your business?{' '}
          <Link href="/mechanics/signup" className="text-brand-navy font-semibold underline">
            Get started
          </Link>
          .
        </p>
      </header>

      <MechanicsDirectorySearchForm stateValue={stateFilter} qValue={qRaw} />

      {docs.length === 0 ? (
        <p className="text-center text-gray-600 py-16">
          {stateFilter || qRaw
            ? 'No shops match those filters. Try clearing search or choosing another state.'
            : 'Listings will appear here as mechanics go live.'}
        </p>
      ) : (
        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => {
            const site = doc as MechanicSite
            const src = thumb(site)
            const location = [site.city, site.state].filter(Boolean).join(', ')
            return (
              <li key={site.id}>
                <Link
                  href={`/mechanics/${site.slug}`}
                  className="card block p-6 h-full hover:shadow-md transition-shadow no-underline hover:no-underline border border-gray-100"
                >
                  <div className="flex gap-4">
                    {src ? (
                      <div className="relative h-16 w-16 shrink-0 rounded-lg bg-gray-50 overflow-hidden ring-1 ring-gray-100">
                        <Image
                          src={src}
                          alt={`${site.businessName} logo`}
                          fill
                          className="object-contain p-1"
                          sizes="64px"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 shrink-0 rounded-lg bg-brand-gray flex items-center justify-center text-brand-navy font-bold text-lg ring-1 ring-gray-100">
                        {site.businessName.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h2 className="font-bold text-brand-navy text-lg leading-tight mb-1">{site.businessName}</h2>
                      {location && <p className="text-sm text-gray-500 mb-1">{location}</p>}
                      {site.tagline && <p className="text-sm text-gray-600 line-clamp-2">{site.tagline}</p>}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

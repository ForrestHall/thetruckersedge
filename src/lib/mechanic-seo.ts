import type { MechanicSite } from '@/payload-types'
import { getBaseUrl, getMediaUrl } from '@/lib/media'

const SCHEMA_DAY: Record<string, string> = {
  monday: 'https://schema.org/Monday',
  tuesday: 'https://schema.org/Tuesday',
  wednesday: 'https://schema.org/Wednesday',
  thursday: 'https://schema.org/Thursday',
  friday: 'https://schema.org/Friday',
  saturday: 'https://schema.org/Saturday',
  sunday: 'https://schema.org/Sunday',
}

function mediaAbsoluteUrls(site: MechanicSite): string[] {
  const out: string[] = []
  const logo = site.logo
  if (logo && typeof logo === 'object' && logo.url) {
    const u = getMediaUrl(logo.url)
    if (u) out.push(u)
  }
  for (const g of site.gallery ?? []) {
    if (g && typeof g === 'object' && g.url) {
      const u = getMediaUrl(g.url)
      if (u) out.push(u)
    }
  }
  return [...new Set(out)]
}

function clampMetaDescription(text: string, max = 158): string {
  const t = text.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 48 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
}

export function buildMechanicPageTitle(site: MechanicSite): string {
  const city = site.city?.trim()
  const state = site.state?.trim()
  if (city && state) {
    return `${site.businessName} — Diesel & truck repair in ${city}, ${state}`
  }
  if (city) {
    return `${site.businessName} — Diesel & heavy truck repair in ${city}`
  }
  return `${site.businessName} — Diesel mechanic & heavy truck repair`
}

export function buildMechanicMetaDescription(site: MechanicSite): string {
  const loc = [site.city, site.state].filter((x) => x?.trim()).join(', ')
  const serviceNames =
    site.services
      ?.map((s) => s.name?.trim())
      .filter(Boolean)
      .slice(0, 4) ?? []
  const servicePhrase =
    serviceNames.length > 0 ? serviceNames.join(', ') : 'diesel engine repair, heavy truck service, and fleet maintenance'

  let core = site.tagline?.trim()
  if (!core && site.about?.trim()) {
    core = site.about.trim().replace(/\s+/g, ' ')
    if (core.length > 120) core = core.slice(0, 117).trimEnd() + '…'
  }
  if (!core) {
    core = `Professional diesel mechanic services including ${servicePhrase}.`
  }

  let text = loc
    ? `${site.businessName} in ${loc}: ${core}`
    : `${site.businessName}: ${core}`

  text += ' Listed on The Truckers Edge.'
  if (site.phone?.trim()) {
    text += ` Call ${site.phone.trim()}.`
  }

  return clampMetaDescription(text)
}

export function buildMechanicKeywords(site: MechanicSite): string[] {
  const k = new Set<string>([
    'diesel mechanic',
    'diesel repair',
    'heavy truck repair',
    'semi truck repair',
    'commercial truck repair',
    'fleet repair',
    'diesel engine repair',
  ])
  const city = site.city?.trim()
  const state = site.state?.trim()
  if (city) {
    k.add(`diesel mechanic ${city}`)
    k.add(`truck repair ${city}`)
  }
  if (city && state) {
    k.add(`diesel mechanic ${city} ${state}`)
    k.add(`heavy truck repair ${city} ${state}`)
  }
  if (state) k.add(`diesel mechanic ${state}`)
  for (const name of site.services?.map((s) => s.name?.trim()).filter(Boolean) ?? []) {
    k.add(name.toLowerCase())
    if (city) k.add(`${name} ${city}`)
  }
  return [...k]
}

/** Rough HH:MM for schema.org when possible; otherwise undefined (skip that row). */
function normalizeSchemaTime(raw: string | null | undefined): string | undefined {
  if (!raw?.trim()) return undefined
  const t = raw.trim().toLowerCase()
  if (t === 'closed' || t === '—' || t === '-') return undefined

  const m24 = t.match(/^(\d{1,2}):(\d{2})$/)
  if (m24) {
    const h = Number(m24[1])
    const min = m24[2]
    if (h >= 0 && h <= 23) return `${String(h).padStart(2, '0')}:${min}`
  }

  const m = t.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/)
  if (m) {
    let h = Number(m[1])
    const min = m[2]
    const ap = m[3]
    if (ap === 'pm' && h < 12) h += 12
    if (ap === 'am' && h === 12) h = 0
    if (h >= 0 && h <= 23) return `${String(h).padStart(2, '0')}:${min}`
  }
  return undefined
}

export function buildMechanicOpeningHoursSpecs(site: MechanicSite): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = []
  for (const h of site.businessHours ?? []) {
    const day = h.day?.toLowerCase()
    const dayUrl = day ? SCHEMA_DAY[day] : undefined
    if (!dayUrl) continue
    const opens = normalizeSchemaTime(h.open)
    const closes = normalizeSchemaTime(h.close)
    if (opens && closes) {
      rows.push({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayUrl,
        opens,
        closes,
      })
    }
  }
  return rows
}

export function buildMechanicJsonLdGraph(site: MechanicSite): Record<string, unknown>[] {
  const base = getBaseUrl().replace(/\/$/, '')
  const pageUrl = `${base}/mechanics/${site.slug}`
  const images = mediaAbsoluteUrls(site)

  const orgId = `${base}/#organization`
  const websiteId = `${base}/#website`
  const webpageId = `${pageUrl}#webpage`
  const businessId = `${pageUrl}#business`
  const breadcrumbId = `${pageUrl}#breadcrumb`

  const description =
    site.tagline?.trim() ||
    (site.about?.trim() ? site.about.trim().replace(/\s+/g, ' ').slice(0, 300) : buildMechanicMetaDescription(site))

  const addressParts = {
    '@type': 'PostalAddress' as const,
    ...(site.address?.trim() ? { streetAddress: site.address.trim() } : {}),
    ...(site.city?.trim() ? { addressLocality: site.city.trim() } : {}),
    ...(site.state?.trim() ? { addressRegion: site.state.trim() } : {}),
    ...(site.zip?.trim() ? { postalCode: site.zip.trim() } : {}),
    addressCountry: 'US',
  }

  const hasStreetOrCity = Boolean(site.address?.trim() || site.city?.trim())

  const openingHoursSpecs = buildMechanicOpeningHoursSpecs(site)

  const serviceOffers =
    site.services
      ?.filter((s) => s.name?.trim())
      .map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name!.trim(),
          ...(s.description?.trim() ? { description: s.description.trim() } : {}),
        },
      })) ?? []

  const sameAs: string[] = []
  const w = site.website?.trim()
  if (w) {
    sameAs.push(w.startsWith('http') ? w : `https://${w}`)
  }

  const business: Record<string, unknown> = {
    '@type': 'AutomotiveRepair',
    '@id': businessId,
    name: site.businessName,
    description,
    url: pageUrl,
    ...(site.phone?.trim() ? { telephone: site.phone.trim() } : {}),
    ...(site.email?.trim() ? { email: site.email.trim() } : {}),
    ...(images.length ? { image: images } : {}),
    ...(hasStreetOrCity ? { address: addressParts } : {}),
    ...(openingHoursSpecs.length ? { openingHoursSpecification: openingHoursSpecs } : {}),
    ...(serviceOffers.length
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Services',
            itemListElement: serviceOffers,
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
    mainEntityOfPage: { '@id': webpageId },
  }

  const webPage: Record<string, unknown> = {
    '@type': 'WebPage',
    '@id': webpageId,
    url: pageUrl,
    name: buildMechanicPageTitle(site),
    description: buildMechanicMetaDescription(site),
    isPartOf: { '@id': websiteId },
    about: { '@id': businessId },
    breadcrumb: { '@id': breadcrumbId },
  }
  if (images[0]) {
    webPage.primaryImageOfPage = { '@type': 'ImageObject', url: images[0] }
  }

  return [
    {
      '@type': 'Organization',
      '@id': orgId,
      name: 'The Truckers Edge',
      url: base,
    },
    {
      '@type': 'WebSite',
      '@id': websiteId,
      url: base,
      name: 'The Truckers Edge',
      publisher: { '@id': orgId },
    },
    webPage,
    {
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: base,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Diesel mechanics',
          item: `${base}/mechanics`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: site.businessName,
          item: pageUrl,
        },
      ],
    },
    business,
  ]
}

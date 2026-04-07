import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { MechanicSite } from '@/payload-types'
import { getMediaUrl } from '@/lib/media'
import { resolveMechanicMicrositePublicUrl } from '@/lib/mechanic-subdomain'
import {
  buildMechanicJsonLdGraph,
  buildMechanicKeywords,
  resolveMechanicMetaDescription,
  resolveMechanicMetaTitle,
} from '@/lib/mechanic-seo'
import { mechanicMicrositeRootClass } from '@/lib/mechanic-theme'
import { MechanicSiteHero } from '@/components/mechanic-site/MechanicSiteHero'
import { MechanicSiteAboutBlock } from '@/components/mechanic-site/MechanicSiteAboutBlock'
import { MechanicSiteServicesGrid } from '@/components/mechanic-site/MechanicSiteServicesGrid'
import { MechanicSiteGalleryGrid } from '@/components/mechanic-site/MechanicSiteGalleryGrid'
import { MechanicSiteCertifications } from '@/components/mechanic-site/MechanicSiteCertifications'
import { MechanicSiteHoursLocation } from '@/components/mechanic-site/MechanicSiteHoursLocation'
import { MechanicSiteContactBlock } from '@/components/mechanic-site/MechanicSiteContactBlock'
import { MechanicVisibleBreadcrumbs } from '@/components/mechanic-site/MechanicVisibleBreadcrumbs'

type Props = { params: Promise<{ slug: string }> }

export const revalidate = 300

function ogImages(site: MechanicSite): { url: string; alt?: string }[] {
  const out: { url: string; alt?: string }[] = []
  const heroBg = site.heroBackground
  if (heroBg && typeof heroBg === 'object' && heroBg.url) {
    const u = getMediaUrl(heroBg.url)
    if (u) out.push({ url: u, alt: heroBg.alt || `${site.businessName} — shop photo` })
  }
  const logo = site.logo
  if (logo && typeof logo === 'object' && logo.url) {
    const u = getMediaUrl(logo.url)
    if (u) out.push({ url: u, alt: logo.alt || `${site.businessName} logo` })
  }
  for (const g of site.gallery ?? []) {
    if (g && typeof g === 'object' && g.url) {
      const u = getMediaUrl(g.url)
      if (u) out.push({ url: u, alt: g.alt || `${site.businessName} photo` })
    }
  }
  return out.slice(0, 4)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mechanic-sites',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'active' } }],
    },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  })
  const site = docs[0] as MechanicSite | undefined
  if (!site) {
    return {
      title: 'Mechanic profile',
      robots: { index: false, follow: true },
    }
  }

  const h = await headers()
  const url = resolveMechanicMicrositePublicUrl(site, h.get('host'), h.get('x-forwarded-proto'))
  const title = resolveMechanicMetaTitle(site)
  const description = resolveMechanicMetaDescription(site)
  const images = ogImages(site)

  return {
    title,
    description,
    keywords: buildMechanicKeywords(site),
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
    openGraph: {
      title,
      description,
      url,
      type: 'website',
      siteName: 'The Truckers Edge',
      locale: 'en_US',
      images: images.length ? images : undefined,
    },
    twitter: {
      card: images.length ? 'summary_large_image' : 'summary',
      title,
      description,
      images: images.length ? images.map((i) => i.url) : undefined,
    },
  }
}

export default async function MechanicPublicPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mechanic-sites',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'active' } }],
    },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  })

  const site = docs[0] as MechanicSite | undefined
  if (!site) {
    notFound()
  }

  const h = await headers()
  const publicPageUrl = resolveMechanicMicrositePublicUrl(site, h.get('host'), h.get('x-forwarded-proto'))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': buildMechanicJsonLdGraph(site, { mechanicPageUrl: publicPageUrl }),
  }

  const rootClass = mechanicMicrositeRootClass(site)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className={rootClass}>
        <MechanicVisibleBreadcrumbs businessName={site.businessName} />
        <article>
          <MechanicSiteHero site={site} />
          <MechanicSiteAboutBlock site={site} />
          <MechanicSiteServicesGrid site={site} />
          <MechanicSiteGalleryGrid site={site} />
          <MechanicSiteCertifications site={site} />
          <MechanicSiteHoursLocation site={site} />
          <MechanicSiteContactBlock site={site} />
        </article>
      </div>
    </>
  )
}

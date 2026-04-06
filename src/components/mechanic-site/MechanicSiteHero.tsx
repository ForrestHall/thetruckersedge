import Image from 'next/image'
import type { MechanicSite, Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/media'

function logoSrc(logo: number | Media | null | undefined): string | null {
  if (!logo || typeof logo === 'number') return null
  return getMediaUrl(logo.url)
}

export function MechanicSiteHero({ site }: { site: MechanicSite }) {
  const logoUrl = logoSrc(site.logo)
  const ctaHref = site.ctaLink?.trim() || (site.phone ? `tel:${site.phone.replace(/\s/g, '')}` : '#contact')
  const loc = [site.city?.trim(), site.state?.trim()].filter(Boolean).join(', ')

  return (
    <section className="relative bg-gradient-to-br from-brand-navy via-brand-navyLight to-brand-navy text-white py-16 sm:py-24 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {logoUrl && (
          <div className="mb-8 flex justify-center">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-xl bg-white/10 p-2 shadow-lg ring-2 ring-white/20">
              <Image
                src={logoUrl}
                alt={`${site.businessName} logo`}
                fill
                className="object-contain p-1"
                sizes="112px"
                unoptimized
              />
            </div>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3">{site.businessName}</h1>
        {loc && (
          <p className="text-sm sm:text-base text-blue-200/95 font-medium mb-3 max-w-2xl mx-auto leading-snug">
            Diesel mechanic &amp; heavy truck repair in {loc}
          </p>
        )}
        {site.tagline && <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto mb-8">{site.tagline}</p>}
        {site.ctaText && (
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center btn-primary text-base px-8 py-3 shadow-lg"
          >
            {site.ctaText}
          </a>
        )}
      </div>
    </section>
  )
}

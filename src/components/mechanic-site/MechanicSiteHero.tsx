import Image from 'next/image'
import type { MechanicSite, Media } from '@/payload-types'
import { getMediaUrl } from '@/lib/media'

function mediaSrc(rel: number | Media | null | undefined): string | null {
  if (!rel || typeof rel === 'number') return null
  return getMediaUrl(rel.url)
}

export function MechanicSiteHero({ site }: { site: MechanicSite }) {
  const logoUrl = mediaSrc(site.logo)
  const heroBgUrl = mediaSrc(site.heroBackground)
  const ctaHref = site.ctaLink?.trim() || (site.phone ? `tel:${site.phone.replace(/\s/g, '')}` : '#contact')
  const loc = [site.city?.trim(), site.state?.trim()].filter(Boolean).join(', ')

  const lcpIsHeroBg = Boolean(heroBgUrl)
  const lcpIsLogo = !lcpIsHeroBg && Boolean(logoUrl)

  return (
    <section
      className="relative overflow-hidden text-white px-4 py-16 sm:py-24"
      style={{
        background: `linear-gradient(135deg, var(--ms-hero-a) 0%, var(--ms-hero-b) 50%, var(--ms-hero-c) 100%)`,
      }}
    >
      {heroBgUrl && (
        <>
          <Image
            src={heroBgUrl}
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
            fetchPriority="high"
            unoptimized
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-black/75" aria-hidden />
        </>
      )}
      <div className="relative z-[1] max-w-4xl mx-auto text-center">
        {logoUrl && (
          <div className="mb-8 flex justify-center">
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-2xl bg-white/12 p-2 shadow-xl ring-2 ring-white/25 backdrop-blur-[2px]">
              <Image
                src={logoUrl}
                alt={`${site.businessName} logo`}
                fill
                className="object-contain p-1.5"
                sizes="(max-width: 640px) 96px, 128px"
                priority={lcpIsLogo}
                fetchPriority={lcpIsLogo ? 'high' : 'low'}
                unoptimized
              />
            </div>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-3 drop-shadow-sm">
          {site.businessName}
        </h1>
        {loc && (
          <p
            className="text-sm sm:text-base font-medium mb-3 max-w-2xl mx-auto leading-snug"
            style={{ color: 'var(--ms-hero-sub)' }}
          >
            Diesel mechanic &amp; heavy truck repair in {loc}
          </p>
        )}
        {site.tagline && (
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: 'var(--ms-hero-tagline)' }}
          >
            {site.tagline}
          </p>
        )}
        {site.ctaText && (
          <a href={ctaHref} className="mechanic-cta text-base px-8 py-3.5">
            {site.ctaText}
          </a>
        )}
      </div>
    </section>
  )
}

import type { MechanicSite } from '@/payload-types'

export function MechanicSiteContactBlock({ site }: { site: MechanicSite }) {
  const phone = site.phone?.trim()
  const email = site.email?.trim()
  const website = site.website?.trim()
  const ctaText = site.ctaText?.trim()
  const ctaLink = site.ctaLink?.trim()
  const ctaHref = ctaLink || (phone ? `tel:${phone.replace(/\s/g, '')}` : undefined)

  if (!phone && !email && !website && !ctaHref) return null

  return (
    <section id="contact" className="py-14 px-4 bg-brand-navy text-white">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Contact</h2>
        <div className="space-y-3 text-blue-100">
          {phone && (
            <p>
              <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-white font-semibold hover:underline text-lg">
                {phone}
              </a>
            </p>
          )}
          {email && (
            <p>
              <a href={`mailto:${email}`} className="text-white hover:underline">
                {email}
              </a>
            </p>
          )}
          {website && (
            <p>
              <a href={website.startsWith('http') ? website : `https://${website}`} className="text-white hover:underline">
                Visit website
              </a>
            </p>
          )}
        </div>
        {ctaText && ctaHref && (
          <div className="mt-8">
            <a href={ctaHref} className="inline-flex btn-primary px-8 py-3">
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

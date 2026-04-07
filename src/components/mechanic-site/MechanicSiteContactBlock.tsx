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
    <section
      id="contact"
      className="mechanic-section"
      style={{ backgroundColor: 'var(--ms-contact-bg)', color: 'var(--ms-contact-fg)' }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--ms-contact-fg)' }}>
          Contact
        </h2>
        <div className="space-y-3" style={{ color: 'var(--ms-contact-muted)' }}>
          {phone && (
            <p>
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="font-semibold hover:underline text-lg"
                style={{ color: 'var(--ms-contact-fg)' }}
              >
                {phone}
              </a>
            </p>
          )}
          {email && (
            <p>
              <a href={`mailto:${email}`} className="hover:underline" style={{ color: 'var(--ms-contact-fg)' }}>
                {email}
              </a>
            </p>
          )}
          {website && (
            <p>
              <a
                href={website.startsWith('http') ? website : `https://${website}`}
                className="hover:underline"
                style={{ color: 'var(--ms-contact-fg)' }}
              >
                Visit website
              </a>
            </p>
          )}
        </div>
        {ctaText && ctaHref && (
          <div className="mt-8">
            <a href={ctaHref} className="mechanic-cta px-8 py-3">
              {ctaText}
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

import type { MechanicSite } from '@/payload-types'
import { MechanicLeadForm } from '@/components/mechanic-site/MechanicLeadForm'

export function MechanicSiteContactBlock({ site }: { site: MechanicSite }) {
  const phone = site.phone?.trim()
  const email = site.email?.trim()
  const website = site.website?.trim()
  const ctaText = site.ctaText?.trim()
  const ctaLink = site.ctaLink?.trim()
  const ctaHref = ctaLink || (phone ? `tel:${phone.replace(/\s/g, '')}` : undefined)
  const phoneDigits = phone ? phone.replace(/\D/g, '') : ''
  const smsHref = phoneDigits.length >= 10 ? `sms:${phoneDigits}` : undefined
  const hasDirectContact = Boolean(phone || email || website || ctaHref)

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
        {hasDirectContact && (
        <div className="space-y-3" style={{ color: 'var(--ms-contact-muted)' }}>
          {phone && (
            <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="font-semibold hover:underline text-lg"
                style={{ color: 'var(--ms-contact-fg)' }}
              >
                {phone}
              </a>
              {smsHref && (
                <a
                  href={smsHref}
                  className="text-sm font-semibold hover:underline"
                  style={{ color: 'var(--ms-contact-fg)' }}
                >
                  Text
                </a>
              )}
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
        )}
        {ctaText && ctaHref && (
          <div className="mt-8">
            <a href={ctaHref} className="mechanic-cta px-8 py-3">
              {ctaText}
            </a>
          </div>
        )}
        {site.slug && site.businessName && (
          <MechanicLeadForm siteSlug={site.slug} businessName={site.businessName} />
        )}
      </div>
    </section>
  )
}

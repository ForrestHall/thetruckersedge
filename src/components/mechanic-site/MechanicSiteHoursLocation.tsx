import type { MechanicSite } from '@/payload-types'
import { mechanicDayLabel } from '@/components/mechanic-site/mechanic-day-label'

export function MechanicSiteHoursLocation({ site }: { site: MechanicSite }) {
  const hours = site.businessHours?.filter((h) => h.day) ?? []
  const hasAddress = [site.address, site.city, site.state, site.zip].some((x) => x?.trim())

  if (hours.length === 0 && !hasAddress) return null

  return (
    <section id="hours-location" className="mechanic-section" style={{ backgroundColor: 'var(--ms-surface)' }}>
      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-10">
        {hours.length > 0 && (
          <div>
            <h2 className="mechanic-h2 mb-4">Hours</h2>
            <table className="w-full text-sm">
              <tbody>
                {hours.map((h, i) => (
                  <tr
                    key={h.id ?? i}
                    className="border-b"
                    style={{ borderColor: 'var(--ms-card-border)' }}
                  >
                    <th className="py-2.5 pr-4 text-left font-medium" style={{ color: 'var(--ms-heading)' }}>
                      {mechanicDayLabel(h.day)}
                    </th>
                    <td className="py-2.5" style={{ color: 'var(--ms-muted)' }}>
                      {h.open?.trim() || '—'} {h.close?.trim() ? `– ${h.close}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {hasAddress && (
          <div id="location">
            <h2 className="mechanic-h2 mb-4">Location</h2>
            <address className="not-italic leading-relaxed" style={{ color: 'var(--ms-body)' }}>
              {site.address?.trim() && (
                <>
                  {site.address}
                  <br />
                </>
              )}
              {(site.city || site.state || site.zip) && (
                <>
                  {[site.city, site.state].filter(Boolean).join(', ')} {site.zip}
                </>
              )}
            </address>
          </div>
        )}
      </div>
    </section>
  )
}

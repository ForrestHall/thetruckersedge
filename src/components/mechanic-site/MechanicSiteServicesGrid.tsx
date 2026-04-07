import type { MechanicSite } from '@/payload-types'

export function MechanicSiteServicesGrid({ site }: { site: MechanicSite }) {
  const items = site.services?.filter((s) => s.name?.trim()) ?? []
  if (items.length === 0) return null
  return (
    <section id="services" className="mechanic-section" style={{ backgroundColor: 'var(--ms-surface-alt)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="mechanic-h2 mb-8 text-center">Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((s, i) => (
            <div
              key={s.id ?? i}
              className="rounded-xl p-6 sm:p-7 shadow-sm transition-shadow hover:shadow-md"
              style={{
                backgroundColor: 'var(--ms-surface)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--ms-card-border)',
              }}
            >
              <h3 className="font-semibold text-lg mb-2" style={{ color: 'var(--ms-heading)' }}>
                {s.name}
              </h3>
              {s.description?.trim() && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ms-muted)' }}>
                  {s.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

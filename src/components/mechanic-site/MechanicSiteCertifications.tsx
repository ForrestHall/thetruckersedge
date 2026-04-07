import type { MechanicSite } from '@/payload-types'

export function MechanicSiteCertifications({ site }: { site: MechanicSite }) {
  const items = site.certifications?.map((c) => c.label?.trim()).filter(Boolean) ?? []
  if (items.length === 0) return null
  return (
    <section id="certifications" className="mechanic-section" style={{ backgroundColor: 'var(--ms-surface-alt)' }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="mechanic-h2 mb-6 text-center">Certifications</h2>
        <ul className="flex flex-wrap justify-center gap-2">
          {items.map((label, i) => (
            <li
              key={i}
              className="px-4 py-2 rounded-full text-sm font-medium shadow-sm"
              style={{
                backgroundColor: 'var(--ms-surface)',
                color: 'var(--ms-heading)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: 'var(--ms-badge-border)',
              }}
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import type { MechanicSite } from '@/payload-types'

export function MechanicSiteAboutBlock({ site }: { site: MechanicSite }) {
  if (!site.about?.trim()) return null
  return (
    <section id="about" className="mechanic-section" style={{ backgroundColor: 'var(--ms-surface)' }}>
      <div className="max-w-3xl mx-auto">
        <h2 className="mechanic-h2 mb-4">About</h2>
        <p className="leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--ms-body)' }}>
          {site.about}
        </p>
      </div>
    </section>
  )
}

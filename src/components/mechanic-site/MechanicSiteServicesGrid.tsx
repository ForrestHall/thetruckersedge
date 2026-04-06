import type { MechanicSite } from '@/payload-types'

export function MechanicSiteServicesGrid({ site }: { site: MechanicSite }) {
  const items = site.services?.filter((s) => s.name?.trim()) ?? []
  if (items.length === 0) return null
  return (
    <section id="services" className="py-14 px-4 bg-brand-gray">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-navy mb-8 text-center">Services</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <div key={s.id ?? i} className="card p-6 bg-white border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-brand-navy text-lg mb-2">{s.name}</h3>
              {s.description?.trim() && <p className="text-gray-600 text-sm leading-relaxed">{s.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

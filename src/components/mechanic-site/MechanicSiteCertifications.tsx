import type { MechanicSite } from '@/payload-types'

export function MechanicSiteCertifications({ site }: { site: MechanicSite }) {
  const items = site.certifications?.map((c) => c.label?.trim()).filter(Boolean) ?? []
  if (items.length === 0) return null
  return (
    <section id="certifications" className="py-14 px-4 bg-brand-gray">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-navy mb-6 text-center">Certifications</h2>
        <ul className="flex flex-wrap justify-center gap-2">
          {items.map((label, i) => (
            <li
              key={i}
              className="px-4 py-2 rounded-full bg-white border border-brand-navy/15 text-brand-navy text-sm font-medium shadow-sm"
            >
              {label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

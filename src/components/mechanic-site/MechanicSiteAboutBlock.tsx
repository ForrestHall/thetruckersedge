import type { MechanicSite } from '@/payload-types'

export function MechanicSiteAboutBlock({ site }: { site: MechanicSite }) {
  if (!site.about?.trim()) return null
  return (
    <section id="about" className="py-14 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-brand-navy mb-4">About</h2>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{site.about}</p>
      </div>
    </section>
  )
}

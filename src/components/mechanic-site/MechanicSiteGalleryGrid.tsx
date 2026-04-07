import Image from 'next/image'
import type { MechanicSite } from '@/payload-types'
import { getMediaUrl } from '@/lib/media'

export function MechanicSiteGalleryGrid({ site }: { site: MechanicSite }) {
  const imgs =
    site.gallery
      ?.map((g) => (typeof g === 'object' && g?.url ? getMediaUrl(g.url) : null))
      .filter((u): u is string => Boolean(u)) ?? []
  if (imgs.length === 0) return null
  const altBase = site.businessName || 'Shop photo'
  return (
    <section id="gallery" className="mechanic-section" style={{ backgroundColor: 'var(--ms-surface)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="mechanic-h2 mb-8 text-center">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {imgs.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 ring-1 ring-black/5"
            >
              <Image
                src={src}
                alt={`${altBase} — photo ${i + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

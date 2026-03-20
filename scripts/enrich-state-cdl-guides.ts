/**
 * One-time: refresh CDL-by-state article bodies + excerpts with differentiated content.
 * Run after deploy: npx tsx scripts/enrich-state-cdl-guides.ts
 * Requires DATABASE_URL and Payload env (same as app).
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { buildStateCdlGuidePayload } from '../src/lib/cdl-state-guide-content'

async function main() {
  try {
    const payload = await getPayload({ config })

    const { docs: cats } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: 'cdl-by-state' } },
      limit: 1,
    })

    if (!cats.length) {
      console.log('[enrich] No "cdl-by-state" category found. Skipping.')
      process.exit(0)
    }

    const catId = cats[0].id

    const { docs: articles } = await payload.find({
      collection: 'articles',
      where: { category: { equals: catId } },
      limit: 100,
    })

    let updated = 0
    for (const art of articles) {
      const slug = typeof art.slug === 'string' ? art.slug : ''
      if (!slug.startsWith('how-to-get-cdl-')) continue

      const stateSlug = slug.replace(/^how-to-get-cdl-/, '')
      const title = typeof art.title === 'string' ? art.title : ''
      const m = title.match(/How to Get Your CDL in (.+?) \(\d{4}/)
      const stateName = m ? m[1].trim() : null
      if (!stateName) {
        console.warn(`[enrich] Could not parse state name from title: ${title}`)
        continue
      }

      const built = buildStateCdlGuidePayload(stateName, stateSlug)
      if (!built) {
        console.warn(`[enrich] No payload for ${stateSlug}`)
        continue
      }

      await payload.update({
        collection: 'articles',
        id: art.id,
        data: {
          content: built.content,
          excerpt: built.excerpt,
        },
      })
      updated++
      console.log(`[enrich] Updated ${slug}`)
    }

    console.log(`[enrich] Done. Updated ${updated} article(s).`)
    process.exit(0)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[enrich] Error:', message)
    process.exit(1)
  }
}

main()

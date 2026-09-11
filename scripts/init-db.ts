/**
 * Run before npm start on deploy. Triggers Payload schema push (creates tables),
 * then idempotent blog SEO fix + post seed.
 * Uses NODE_ENV=development so pushDevSchema runs.
 */
;(process.env as Record<string, string | undefined>).NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { fixImportedBlogSeo } from '../src/lib/blog-seo-fix'
import { seedBlogPosts } from '../src/lib/blog-post-seeds'

async function main() {
  try {
    const payload = await getPayload({ config })
    console.log('[init-db] Schema push complete. Tables created.')

    await fixImportedBlogSeo(payload)
    await seedBlogPosts(payload)

    process.exit(0)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[init-db] Error:', message)
    process.exit(1)
  }
}

main()

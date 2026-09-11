/**
 * Seeds blog posts into Payload (posts collection).
 * Run: npx tsx scripts/seed-posts.ts
 *
 * Safe to re-run — skips posts that already exist by slug.
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { seedBlogPosts } from '../src/lib/blog-post-seeds'

async function main() {
  const payload = await getPayload({ config })
  await seedBlogPosts(payload)
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed-posts] Failed:', err)
  process.exit(1)
})

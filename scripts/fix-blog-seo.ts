/**
 * Fixes blogr.blog import pollution on existing blog posts.
 * Run: npx tsx scripts/fix-blog-seo.ts
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { fixImportedBlogSeo } from '../src/lib/blog-seo-fix'

async function main() {
  const payload = await getPayload({ config })
  await fixImportedBlogSeo(payload)
  process.exit(0)
}

main().catch((err) => {
  console.error('[fix-blog-seo] Failed:', err)
  process.exit(1)
})

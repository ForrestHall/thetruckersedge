/**
 * Fixes blogr.blog import pollution on existing blog posts.
 * Run against production DB: npx tsx scripts/fix-blog-seo.ts
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'
import { buildArticleJsonLd, resolvePostDescription, seoFieldLooksImported } from '../src/lib/seo'

const CDL_TIPS_SLUG = 'top-10-cdl-practice-test-tips-every-aspiring-trucker-needs'

const CDL_CLEAN_DESCRIPTION =
  'Master top 10 CDL practice test tips: study the CDL manual, take daily free practice tests, review wrong answers, simulate exam conditions, and manage test-day stress to pass your CDL exam.'

async function main() {
  const payload = await getPayload({ config })

  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 200,
  })

  let fixed = 0

  for (const post of posts) {
    const slug = post.slug as string
    const metaDescription =
      typeof post.seo?.metaDescription === 'string' ? post.seo.metaDescription : undefined
    const structuredJson = post.seo?.structuredData
      ? JSON.stringify(post.seo.structuredData)
      : ''
    const needsFix =
      seoFieldLooksImported(metaDescription) ||
      structuredJson.includes('blogr.blog') ||
      (slug === CDL_TIPS_SLUG && seoFieldLooksImported(metaDescription))

    if (!needsFix) continue

    const author =
      typeof post.author === 'object' && post.author && 'name' in post.author
        ? (post.author.name as string)
        : null

    const description =
      slug === CDL_TIPS_SLUG
        ? CDL_CLEAN_DESCRIPTION
        : resolvePostDescription(
            typeof post.excerpt === 'string' ? post.excerpt : undefined,
            metaDescription,
          )

    await payload.update({
      collection: 'posts',
      id: post.id,
      data: {
        seo: {
          metaTitle: post.seo?.metaTitle || post.title,
          metaDescription: description,
          structuredData: buildArticleJsonLd({
            title: post.title as string,
            description,
            slug,
            publishedAt: typeof post.publishedAt === 'string' ? post.publishedAt : null,
            updatedAt: typeof post.updatedAt === 'string' ? post.updatedAt : null,
            authorName: author,
          }),
        },
      },
    })

    console.log(`[fix-blog-seo] Fixed: ${slug}`)
    fixed++
  }

  console.log(`[fix-blog-seo] Done. Fixed ${fixed} post(s).`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[fix-blog-seo] Failed:', err)
  process.exit(1)
})

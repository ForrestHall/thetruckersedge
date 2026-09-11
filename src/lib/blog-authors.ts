import type { Payload } from 'payload'

export type BlogAuthorKey = 'marcus' | 'dana' | 'jake' | 'elena'

const BLOG_AUTHOR_SEEDS: { key: BlogAuthorKey; name: string; email: string }[] = [
  { key: 'marcus', name: 'Marcus Reed', email: 'marcus.reed@authors.thetruckersedge.com' },
  { key: 'dana', name: 'Dana Whitfield', email: 'dana.whitfield@authors.thetruckersedge.com' },
  { key: 'jake', name: 'Jake Torrance', email: 'jake.torrance@authors.thetruckersedge.com' },
  { key: 'elena', name: 'Elena Voss', email: 'elena.voss@authors.thetruckersedge.com' },
]

/** Default author per post slug (existing + seeded posts). */
export const POST_AUTHOR_BY_SLUG: Record<string, BlogAuthorKey> = {
  'top-10-cdl-practice-test-tips-every-aspiring-trucker-needs': 'marcus',
  'how-much-does-a-cdl-cost-2026': 'marcus',
  'owner-operator-startup-costs-budget': 'dana',
  'truck-breakdown-on-the-road-first-steps': 'jake',
  'semi-truck-warranty-guide-owner-operators': 'elena',
}

const SEED_PASSWORD = 'blog-author-seed-not-for-login'

/** Ensure fictional author users exist; returns map of key → user id. */
export async function ensureBlogAuthors(payload: Payload): Promise<Map<BlogAuthorKey, number>> {
  const ids = new Map<BlogAuthorKey, number>()

  for (const author of BLOG_AUTHOR_SEEDS) {
    const { docs } = await payload.find({
      collection: 'users',
      where: { email: { equals: author.email } },
      limit: 1,
      overrideAccess: true,
    })

    if (docs[0]) {
      if (docs[0].name !== author.name) {
        await payload.update({
          collection: 'users',
          id: docs[0].id,
          data: { name: author.name },
          overrideAccess: true,
        })
      }
      ids.set(author.key, docs[0].id as number)
      continue
    }

    const created = await payload.create({
      collection: 'users',
      data: {
        email: author.email,
        password: SEED_PASSWORD,
        name: author.name,
      },
      overrideAccess: true,
    })
    ids.set(author.key, created.id as number)
    console.log(`[blog-authors] Created author: ${author.name}`)
  }

  return ids
}

/** Assign (or reassign) blog posts to fictional authors by slug. */
export async function assignBlogPostAuthors(payload: Payload): Promise<number> {
  const authorIds = await ensureBlogAuthors(payload)

  const { docs: posts } = await payload.find({
    collection: 'posts',
    limit: 200,
    overrideAccess: true,
  })

  let updated = 0

  for (const post of posts) {
    const slug = post.slug as string | undefined
    if (!slug) continue

    const key = POST_AUTHOR_BY_SLUG[slug] ?? 'marcus'
    const authorId = authorIds.get(key)
    if (!authorId) continue

    const currentAuthorId =
      typeof post.author === 'object' && post.author ? post.author.id : post.author

    if (currentAuthorId === authorId) continue

    await payload.update({
      collection: 'posts',
      id: post.id,
      data: { author: authorId },
      overrideAccess: true,
    })
    console.log(`[blog-authors] Assigned "${slug}" → ${key}`)
    updated++
  }

  console.log(`[blog-authors] Done. Updated ${updated} post(s).`)
  return updated
}

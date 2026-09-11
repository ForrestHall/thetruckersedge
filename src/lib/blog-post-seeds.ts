import type { Payload } from 'payload'
import { ensureBlogAuthors, POST_AUTHOR_BY_SLUG, type BlogAuthorKey } from '@/lib/blog-authors'

export type BlogPostSeed = {
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
  authorKey?: BlogAuthorKey
}

export const BLOG_POST_SEEDS: BlogPostSeed[] = [
  {
    title: 'How Much Does a CDL Cost in 2026?',
    slug: 'how-much-does-a-cdl-cost-2026',
    excerpt:
      'CDL school tuition, DMV fees, endorsements, and hidden costs — a realistic 2026 budget for aspiring truck drivers.',
    publishedAt: '2026-03-01T12:00:00.000Z',
    authorKey: 'marcus',
    content: `<h2>CDL cost breakdown for 2026</h2>
<p>Getting your commercial driver's license is an investment — but the total bill varies widely depending on your state, whether you go through a company-sponsored program, and which endorsements you add.</p>
<h3>Tuition and training</h3>
<p>Private CDL schools typically run <strong>$3,000–$8,000</strong> for a full Class A program. Company-sponsored training may cost little upfront but often comes with a contract requiring you to drive for that carrier for 9–12 months.</p>
<h3>DMV and testing fees</h3>
<p>Permit fees, skills tests, and license issuance vary by state. Budget <strong>$100–$300</strong> for the basics, plus more if you add HazMat, tanker, or doubles/triples endorsements.</p>
<h3>Endorsements worth planning for</h3>
<ul>
<li><strong>HazMat</strong> — TSA background check plus test fees</li>
<li><strong>Tanker / doubles</strong> — often required for higher-paying freight</li>
<li><strong>Passenger / school bus</strong> — only if that lane fits your career plan</li>
</ul>
<h3>Hidden costs new drivers miss</h3>
<p>Medical exam (DOT physical), study materials, travel to a testing site, and time off work while training all add up. Build a <strong>$500–$1,000 cushion</strong> beyond the advertised tuition.</p>
<p>Before you commit, take a free <a href="/practice-tests">CDL practice test</a> to see where you stand — and read our state-specific guides on the <a href="/guides">career guides hub</a>.</p>`,
  },
  {
    title: 'Owner-Operator Startup Costs: What to Budget Before You Buy a Truck',
    slug: 'owner-operator-startup-costs-budget',
    excerpt:
      'Down payment, insurance, permits, maintenance reserves, and working capital — what it really costs to go independent in trucking.',
    publishedAt: '2026-03-05T12:00:00.000Z',
    authorKey: 'dana',
    content: `<h2>The real cost of going independent</h2>
<p>Buying the truck is only the beginning. Most new owner-operators underestimate how much cash they need before the first profitable load clears.</p>
<h3>Truck acquisition</h3>
<p>A used Class 8 tractor might run <strong>$40,000–$120,000</strong> depending on year, mileage, and spec. New equipment pushes far higher. Many drivers finance — plan for a down payment plus monthly note from day one.</p>
<h3>Insurance and compliance</h3>
<p>Primary liability, physical damage, cargo, and occupational accident coverage can total <strong>$12,000–$20,000+ per year</strong> for a single truck. Add IRP plates, UCR, MC authority (if applicable), and IFTA setup.</p>
<h3>Maintenance and breakdown reserve</h3>
<p>Set aside <strong>$0.10–$0.15 per mile</strong> for tires, oil, filters, and unexpected repairs. One roadside failure can wipe out a month's profit if you are not reserved.</p>
<h3>Working capital</h3>
<p>Factoring or quick-pay helps, but you still need fuel, tolls, and living expenses between settlements. Many experienced O/Os keep <strong>60–90 days of operating expenses</strong> accessible.</p>
<p>Protection matters too — see if your rig <a href="/tools/warranty-qualify">qualifies for extended warranty coverage</a> before you sign on a high-mileage unit, and use our <a href="/command-center">owner-operator command center</a> to track costs per mile.</p>`,
  },
  {
    title: 'Truck Breakdown on the Road: What Every Driver Should Do First',
    slug: 'truck-breakdown-on-the-road-first-steps',
    excerpt:
      'Safety, roadside positioning, who to call, and how to avoid a bad day turning into a lost load — a practical breakdown checklist for drivers.',
    publishedAt: '2026-03-08T12:00:00.000Z',
    authorKey: 'jake',
    content: `<h2>When the truck stops moving</h2>
<p>Every driver will face a breakdown eventually. What you do in the first ten minutes affects safety, repair cost, and whether you keep the load on schedule.</p>
<h3>1. Secure the scene</h3>
<p>Get off the travel lane if you can. Turn on flashers, set triangles, and stay visible. Never work under a trailer on the shoulder without proper chocking and support.</p>
<h3>2. Diagnose before you guess</h3>
<p>Check dash codes, air pressure, coolant level, and obvious leaks. A limp-mode DPF issue is different from a blown air line — calling the wrong shop wastes hours.</p>
<h3>3. Call the right help</h3>
<p>Contact your fleet manager or broker if under dispatch. For independent operators, use a trusted roadside service or a <a href="/mechanics">diesel shop in our directory</a> near your exit. Have VIN, location mile marker, and symptoms ready.</p>
<h3>4. Protect the load and your clock</h3>
<p>Document everything for detention or layover claims. If refrigeration or time-sensitive freight is involved, escalate immediately — waiting often costs more than the tow.</p>
<h3>5. Plan for the next one</h3>
<p>Keep a breakdown kit: triangles, flashlight, gloves, basic tools, and your warranty or roadside policy number. Preventive maintenance beats emergency towing every time.</p>
<p>Running your own rig? <a href="/tools/warranty-qualify">Check warranty eligibility</a> so major component failures do not land entirely on your wallet.</p>`,
  },
  {
    title: 'Semi Truck Warranty Guide: What Owner-Operators Should Know Before You Buy',
    slug: 'semi-truck-warranty-guide-owner-operators',
    excerpt:
      'Extended warranties for Class 8 semis — what’s covered, what’s excluded, mileage limits, and how to tell if your tractor is worth protecting.',
    publishedAt: '2026-03-12T12:00:00.000Z',
    authorKey: 'elena',
    content: `<h2>Do you need a warranty on your semi?</h2>
<p>A semi truck is a six-figure asset that earns its keep only when it turns miles. One major engine or aftertreatment failure can cost more than many owner-operators clear in a month. An extended warranty (extended service contract) is not insurance — it is a service agreement that pays specified repair bills after the factory coverage ends.</p>
<p>Whether it makes sense depends on your truck’s year, mileage, how hard you run it, and how much cash you keep reserved for breakdowns.</p>
<h3>What semi warranties usually cover</h3>
<ul>
<li><strong>Powertrain</strong> — engine, transmission, differential (most common entry-level plan)</li>
<li><strong>Inclusionary / tiered</strong> — listed components with Good, Better, Best style tiers</li>
<li><strong>Exclusionary</strong> — broad coverage; only named exclusions are uncovered (often the strongest option for high-mile OTR)</li>
<li><strong>Aftertreatment</strong> — DPF, DEF system, sensors (critical on 2010+ emissions trucks)</li>
</ul>
<h3>Common exclusions to watch for</h3>
<p>Read the fine print before you sign. Most plans exclude wear items (clutches, brakes, tires), cosmetic damage, and failures caused by neglect or unapproved modifications. High-mileage tractors may cap eligible years or require an inspection first.</p>
<h3>Factory vs extended coverage</h3>
<p>New Freightliner, Peterbilt, Kenworth, and Volvo tractors ship with limited factory warranty — often 2–5 years depending on component. Used semis with 400k–700k miles are where extended contracts matter most: the factory plan is long gone, but the truck may have years of revenue left.</p>
<h3>How to shop a semi warranty</h3>
<ol>
<li>Match coverage to how you run — full-time OTR usually needs broader protection than local day-cab work.</li>
<li>Compare deductible, per-visit caps, and whether lodging/towing is included.</li>
<li>Confirm which shops honor the plan on your lanes (national networks vs reimbursement).</li>
<li>Get everything in writing — verbal “bumper-to-bumper” promises are worthless.</li>
</ol>
<h3>Quick eligibility check</h3>
<p>Not every rig qualifies. Year, odometer, and engine family all affect pricing and availability. Use our free <a href="/tools/warranty-qualify">semi warranty eligibility tool</a> to see if your tractor is likely to fit, then request a match by email or phone.</p>
<p>For a deeper comparison of plan types and red flags, read our <a href="/tools/truck-warranty-reviews">commercial truck warranty buyer’s guide</a> or complete the <a href="/tools/warranty-quote">full quote questionnaire</a>.</p>
<p><em>This article is for general information only — not insurance or legal advice. Always review contract terms before purchase.</em></p>`,
  },
]

/** Seed blog posts. Idempotent — skips slugs that already exist. */
export async function seedBlogPosts(payload: Payload): Promise<{ created: number; skipped: number }> {
  const authorIds = await ensureBlogAuthors(payload)

  let created = 0
  let skipped = 0

  for (const post of BLOG_POST_SEEDS) {
    const { docs: existing } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: post.slug } },
      limit: 1,
    })

    if (existing[0]) {
      console.log(`[seed-posts] Skip (exists): ${post.slug}`)
      skipped++
      continue
    }

    const authorKey = post.authorKey ?? POST_AUTHOR_BY_SLUG[post.slug] ?? 'marcus'
    const authorId = authorIds.get(authorKey)

    await payload.create({
      collection: 'posts',
      data: {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        status: 'published',
        publishedAt: post.publishedAt,
        ...(authorId ? { author: authorId } : {}),
      },
      overrideAccess: true,
    })
    console.log(`[seed-posts] Created: ${post.slug}`)
    created++
  }

  console.log(`[seed-posts] Done. Created ${created}, skipped ${skipped}.`)
  return { created, skipped }
}

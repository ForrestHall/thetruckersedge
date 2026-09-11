/**
 * Seeds blog posts into Payload (posts collection).
 * Run: npx tsx scripts/seed-posts.ts
 *
 * Safe to re-run — skips posts that already exist by slug.
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'

type PostSeed = {
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: string
}

const POSTS: PostSeed[] = [
  {
    title: 'How Much Does a CDL Cost in 2026?',
    slug: 'how-much-does-a-cdl-cost-2026',
    excerpt:
      'CDL school tuition, DMV fees, endorsements, and hidden costs — a realistic 2026 budget for aspiring truck drivers.',
    publishedAt: '2026-03-01T12:00:00.000Z',
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
]

async function main() {
  const payload = await getPayload({ config })

  const { docs: users } = await payload.find({
    collection: 'users',
    limit: 1,
    sort: 'createdAt',
  })
  const authorId = users[0]?.id

  let created = 0
  let skipped = 0

  for (const post of POSTS) {
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
    })
    console.log(`[seed-posts] Created: ${post.slug}`)
    created++
  }

  console.log(`[seed-posts] Done. Created ${created}, skipped ${skipped}.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[seed-posts] Failed:', err)
  process.exit(1)
})

/**
 * Seeds career guide articles and categories.
 * Run: npx tsx scripts/seed-guides.ts
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'

function paragraph(text: string) {
  return {
    type: 'paragraph',
    version: 1,
    children: [{ type: 'text', version: 1, text, format: 0, mode: 'normal', style: '', detail: 0 }],
  }
}

function heading(tag: 'h1' | 'h2' | 'h3' | 'h4', text: string) {
  return {
    type: 'heading',
    tag,
    version: 1,
    children: [{ type: 'text', version: 1, text, format: 0, mode: 'normal', style: '', detail: 0 }],
  }
}

function listItem(text: string) {
  return {
    type: 'listitem',
    version: 1,
    value: 1,
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', version: 1, text, format: 0, mode: 'normal', style: '', detail: 0 }],
      },
    ],
  }
}

function bulletList(items: string[]) {
  return {
    type: 'list',
    listType: 'bullet',
    version: 1,
    tag: 'ul',
    children: items.map((t) => listItem(t)),
  }
}

function buildContent(blocks: object[]) {
  return {
    root: {
      type: 'root',
      version: 1,
      children: blocks,
      direction: 'ltr' as const,
      format: '',
      indent: 0,
    },
  }
}

const STATES = [
  { name: 'Alabama', slug: 'alabama' },
  { name: 'Alaska', slug: 'alaska' },
  { name: 'Arizona', slug: 'arizona' },
  { name: 'Arkansas', slug: 'arkansas' },
  { name: 'California', slug: 'california' },
  { name: 'Colorado', slug: 'colorado' },
  { name: 'Connecticut', slug: 'connecticut' },
  { name: 'Delaware', slug: 'delaware' },
  { name: 'Florida', slug: 'florida' },
  { name: 'Georgia', slug: 'georgia' },
  { name: 'Hawaii', slug: 'hawaii' },
  { name: 'Idaho', slug: 'idaho' },
  { name: 'Illinois', slug: 'illinois' },
  { name: 'Indiana', slug: 'indiana' },
  { name: 'Iowa', slug: 'iowa' },
  { name: 'Kansas', slug: 'kansas' },
  { name: 'Kentucky', slug: 'kentucky' },
  { name: 'Louisiana', slug: 'louisiana' },
  { name: 'Maine', slug: 'maine' },
  { name: 'Maryland', slug: 'maryland' },
  { name: 'Massachusetts', slug: 'massachusetts' },
  { name: 'Michigan', slug: 'michigan' },
  { name: 'Minnesota', slug: 'minnesota' },
  { name: 'Mississippi', slug: 'mississippi' },
  { name: 'Missouri', slug: 'missouri' },
  { name: 'Montana', slug: 'montana' },
  { name: 'Nebraska', slug: 'nebraska' },
  { name: 'Nevada', slug: 'nevada' },
  { name: 'New Hampshire', slug: 'new-hampshire' },
  { name: 'New Jersey', slug: 'new-jersey' },
  { name: 'New Mexico', slug: 'new-mexico' },
  { name: 'New York', slug: 'new-york' },
  { name: 'North Carolina', slug: 'north-carolina' },
  { name: 'North Dakota', slug: 'north-dakota' },
  { name: 'Ohio', slug: 'ohio' },
  { name: 'Oklahoma', slug: 'oklahoma' },
  { name: 'Oregon', slug: 'oregon' },
  { name: 'Pennsylvania', slug: 'pennsylvania' },
  { name: 'Rhode Island', slug: 'rhode-island' },
  { name: 'South Carolina', slug: 'south-carolina' },
  { name: 'South Dakota', slug: 'south-dakota' },
  { name: 'Tennessee', slug: 'tennessee' },
  { name: 'Texas', slug: 'texas' },
  { name: 'Utah', slug: 'utah' },
  { name: 'Vermont', slug: 'vermont' },
  { name: 'Virginia', slug: 'virginia' },
  { name: 'Washington', slug: 'washington' },
  { name: 'West Virginia', slug: 'west-virginia' },
  { name: 'Wisconsin', slug: 'wisconsin' },
  { name: 'Wyoming', slug: 'wyoming' },
]

function createStateCdlGuide(stateName: string, slug: string) {
  return {
    slug: `how-to-get-cdl-${slug}`,
    title: `How to Get Your CDL in ${stateName} (2026 Guide)`,
    relatedEndorsements: ['general-knowledge', 'air-brakes'] as string[],
    excerpt: `Step-by-step guide to obtaining your Commercial Driver's License in ${stateName}. Covers requirements, testing, and where to find quality training.`,
    content: buildContent([
      heading('h2', `${stateName} CDL Requirements`),
      paragraph(
        `To get a Commercial Driver's License in ${stateName}, you must be at least 18 years old for intrastate driving or 21 for interstate. You'll need a valid ${stateName} driver's license, pass a medical exam (DOT physical), and complete the required knowledge and skills tests.`
      ),
      heading('h2', 'CDL Knowledge Tests'),
      paragraph(
        `${stateName} requires you to pass the General Knowledge test at minimum. Depending on the type of vehicle you plan to drive, you may also need Air Brakes, Combination Vehicles, or endorsement-specific tests (HazMat, Passenger, etc.). Each test typically has 50 questions, and you must score at least 80% to pass.`
      ),
      heading('h2', 'Skills Test (Behind-the-Wheel)'),
      paragraph(
        'The skills test includes a pre-trip inspection, basic vehicle control (backing, turns), and an on-road driving portion. You must provide a vehicle that matches the class of CDL you\'re testing for. Many drivers choose to attend a CDL training school that provides the truck and helps prepare you for all three portions.'
      ),
      heading('h2', `CDL Training Schools in ${stateName}`),
      paragraph(
        `${stateName} has approved CDL training programs, including community colleges and private trucking schools. Some carriers offer paid training programs where they cover your tuition in exchange for a commitment to drive for them. Contact your state DMV or check their website for a list of approved programs.`
      ),
      heading('h2', 'Next Steps'),
      paragraph(
        'Start by studying for your General Knowledge test. Use our free practice tests to identify weak areas. Once you pass the written tests, schedule your skills test with an approved tester. Many new drivers find that 3–4 weeks of focused training is enough to pass the CDL exam on the first try.'
      ),
    ]),
  }
}

const GUIDES = [
  {
    slug: 'how-to-get-cdl-georgia',
    title: 'How to Get Your CDL in Georgia (2026 Guide)',
    category: 'state' as const,
    relatedEndorsements: ['general-knowledge', 'air-brakes'] as string[],
    excerpt:
      'Step-by-step guide to obtaining your Commercial Driver\'s License in Georgia. Covers requirements, testing, and where to find quality training.',
    content: buildContent([
      heading('h2', 'Georgia CDL Requirements'),
      paragraph(
        'To get a Commercial Driver\'s License in Georgia, you must be at least 18 years old for intrastate driving or 21 for interstate. You\'ll need a valid Georgia driver\'s license, pass a medical exam (DOT physical), and complete the required knowledge and skills tests.'
      ),
      heading('h2', 'CDL Knowledge Tests'),
      paragraph(
        'Georgia requires you to pass the General Knowledge test at minimum. Depending on the type of vehicle you plan to drive, you may also need Air Brakes, Combination Vehicles, or endorsement-specific tests (HazMat, Passenger, etc.). Each test typically has 50 questions, and you must score at least 80% to pass.'
      ),
      heading('h2', 'Skills Test (Behind-the-Wheel)'),
      paragraph(
        'The skills test includes a pre-trip inspection, basic vehicle control (backing, turns), and an on-road driving portion. You must provide a vehicle that matches the class of CDL you\'re testing for. Many drivers choose to attend a CDL training school that provides the truck and helps prepare you for all three portions.'
      ),
      heading('h2', 'CDL Training Schools in Georgia'),
      paragraph(
        'Georgia has several approved CDL training programs, including community colleges and private trucking schools. Some carriers offer paid training programs where they cover your tuition in exchange for a commitment to drive for them. Research programs carefully — look for job placement rates and graduate reviews.'
      ),
      heading('h2', 'Next Steps'),
      paragraph(
        'Start by studying for your General Knowledge test. Use practice tests to identify weak areas, then hit the books. Once you pass the written tests, schedule your skills test. Many new drivers find that 3–4 weeks of focused training is enough to pass the CDL exam on the first try.'
      ),
    ]),
  },
  {
    slug: 'otr-vs-local-trucking',
    title: 'OTR vs Local Trucking: Which Is Right for You?',
    category: 'career' as const,
    relatedEndorsements: [] as string[],
    excerpt:
      'Compare over-the-road and local trucking jobs. Pay, home time, lifestyle, and how to decide which path fits your goals.',
    content: buildContent([
      heading('h2', 'What Is OTR Trucking?'),
      paragraph(
        'Over-the-road (OTR) trucking means you\'re on the road for days or weeks at a time, often covering multiple states. You\'ll sleep in the sleeper cab, shower at truck stops, and earn miles. OTR drivers typically have the highest earning potential but the least home time.'
      ),
      heading('h2', 'What Is Local Trucking?'),
      paragraph(
        'Local trucking means you\'re home most nights — or at least several times a week. You might run regional routes, deliver in a metro area, or do dedicated runs that start and end near home. Pay is often lower than OTR, but the tradeoff is a more predictable schedule and family time.'
      ),
      heading('h2', 'Key Differences'),
      bulletList([
        'Home time: Local = most nights home; OTR = days or weeks away',
        'Pay: OTR often pays more per mile; local pays by the hour or a daily rate',
        'Lifestyle: OTR is isolating but offers travel; local is routine but stable',
        'Experience: Many carriers want OTR experience before hiring for local',
      ]),
      heading('h2', 'Who Should Choose OTR?'),
      paragraph(
        'OTR suits drivers who want to maximize earnings, don\'t mind being away from home, and enjoy seeing the country. It\'s common for new CDL holders to start OTR to build experience, then switch to regional or local once they have a year or two under their belt.'
      ),
      heading('h2', 'Who Should Choose Local?'),
      paragraph(
        'Local is ideal if you have family obligations, prefer a fixed schedule, or want to avoid life on the road. Jobs like food and beverage delivery, construction materials, or dedicated routes often offer solid pay with regular home time. Competition can be stiffer for the best local gigs.'
      ),
      heading('h2', 'The Bottom Line'),
      paragraph(
        'There\'s no single "best" choice — it depends on your priorities. Many drivers start OTR to build skills and bank account, then move to regional or local when they\'re ready for more home time. Your first year will teach you a lot about what you want long term.'
      ),
    ]),
  },
  {
    slug: 'how-to-become-owner-operator',
    title: 'How to Become an Owner-Operator: A Realistic Guide',
    category: 'career' as const,
    relatedEndorsements: [] as string[],
    excerpt:
      'What it takes to run your own trucking business. Startup costs, finding loads, and the pros and cons of being your own boss.',
    content: buildContent([
      heading('h2', 'What Is an Owner-Operator?'),
      paragraph(
        'An owner-operator is a truck driver who owns (or leases) their own truck and runs as an independent business. You find your own loads, manage expenses, and keep what\'s left after fuel, insurance, maintenance, and other costs. It\'s not just driving — it\'s running a small business.'
      ),
      heading('h2', 'Startup Costs'),
      paragraph(
        'Expect to invest $15,000–$25,000 for a down payment on a truck (or a significant chunk for a lease), plus cargo and liability insurance ($12,000–$20,000/year), authority filing fees, and working capital for fuel and repairs. Many owner-operators start by leasing through a carrier to reduce risk.'
      ),
      heading('h2', 'Getting Authority vs. Leasing On'),
      paragraph(
        'You can get your own DOT authority and find loads on load boards (load-to-truck matching services), or you can lease your truck to a carrier that provides loads and fuel advances. Leasing on reduces independence but also reduces the headache of finding freight and managing back-office tasks.'
      ),
      heading('h2', 'The Reality Check'),
      bulletList([
        'Profit margins are thin — fuel, insurance, and maintenance eat most of revenue',
        'You\'re responsible for everything: breakdowns, compliance, taxes, and downtime',
        'Load boards and freight rates fluctuate; a bad month can hurt',
        'Many owner-operators fail in the first two years due to undercapitalization',
      ]),
      heading('h2', 'When It Makes Sense'),
      paragraph(
        'Owner-operator life can work if you have experience, strong credit, and discipline. It\'s best suited for drivers who understand the business side, have a financial cushion, and are willing to treat it like a real company — not just "driving my own truck."'
      ),
      heading('h2', 'First Steps'),
      paragraph(
        'Get at least 1–2 years of company driving experience first. Learn the industry, build savings, and research carriers that offer lease-purchase or support programs. Talk to successful owner-operators and learn from their mistakes before you sign anything.'
      ),
    ]),
  },
]

async function main() {
  try {
    const payload = await getPayload({ config })

    // Ensure categories exist
    const { docs: careerCats } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: 'career-guides' } },
      limit: 1,
    })
    const { docs: stateCats } = await payload.find({
      collection: 'categories',
      where: { slug: { equals: 'cdl-by-state' } },
      limit: 1,
    })

    let categoryId: number
    if (careerCats.length > 0) {
      categoryId = careerCats[0].id
      console.log('[seed] Category "Career Guides" already exists.')
    } else {
      const cat = await payload.create({
        collection: 'categories',
        data: {
          name: 'Career Guides',
          slug: 'career-guides',
          description: 'Guides for getting your CDL, choosing a trucking career path, and advancing in the industry.',
        },
      })
      categoryId = cat.id
      console.log('[seed] Category "Career Guides" created.')
    }

    let stateCategoryId: number
    if (stateCats.length > 0) {
      stateCategoryId = stateCats[0].id
      console.log('[seed] Category "CDL by State" already exists.')
    } else {
      const cat = await payload.create({
        collection: 'categories',
        data: {
          name: 'CDL by State',
          slug: 'cdl-by-state',
          description: 'State-by-state guides for getting your Commercial Driver\'s License.',
        },
      })
      stateCategoryId = cat.id
      console.log('[seed] Category "CDL by State" created.')
    }

    const now = new Date().toISOString().split('T')[0]

    for (const guide of GUIDES) {
      const existing = await payload.find({
        collection: 'articles',
        where: { slug: { equals: guide.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`[seed] Article "${guide.slug}" already exists. Skipping.`)
        continue
      }

      await payload.create({
        collection: 'articles',
        data: {
          title: guide.title,
          slug: guide.slug,
          excerpt: guide.excerpt,
          category: guide.category === 'state' ? stateCategoryId : categoryId,
          relatedEndorsements: guide.relatedEndorsements,
          content: guide.content,
          status: 'published',
          publishedAt: now,
        },
      })

      console.log(`[seed] Article "${guide.title}" created.`)
    }

    // Seed CDL guides for the other 49 states (Georgia already in GUIDES) (Georgia uses custom GUIDES entry above)
    for (const state of STATES) {
      if (state.slug === 'georgia') continue // Georgia has custom content in GUIDES
      const guide = createStateCdlGuide(state.name, state.slug)
      const existing = await payload.find({
        collection: 'articles',
        where: { slug: { equals: guide.slug } },
        limit: 1,
      })

      if (existing.docs.length > 0) {
        console.log(`[seed] Article "${guide.slug}" already exists. Skipping.`)
        continue
      }

      await payload.create({
        collection: 'articles',
        data: {
          title: guide.title,
          slug: guide.slug,
          excerpt: guide.excerpt,
          category: stateCategoryId,
          relatedEndorsements: guide.relatedEndorsements,
          content: guide.content,
          status: 'published',
          publishedAt: now,
        },
      })

      console.log(`[seed] Article "${guide.title}" created.`)
    }

    console.log('[seed] Career guides seeding complete (50 state guides + career guides).')
    process.exit(0)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[seed] Error:', message)
    process.exit(1)
  }
}

main()

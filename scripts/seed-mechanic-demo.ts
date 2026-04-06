/**
 * Seeds one demo mechanic + active hosted page for local preview.
 * Run: npx tsx scripts/seed-mechanic-demo.ts
 *
 * Visit: /mechanics/demo-diesel-little-rock (slug below)
 * Login (optional): demo.mechanic@thetruckersedge.local / demo-mechanic-2024
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'

const DEMO_EMAIL = 'demo.mechanic@thetruckersedge.local'
const DEMO_PASSWORD = 'demo-mechanic-2024'
const DEMO_SLUG = 'demo-diesel-little-rock'

async function main() {
  try {
    const payload = await getPayload({ config })

    const { docs: existingSites } = await payload.find({
      collection: 'mechanic-sites',
      where: { slug: { equals: DEMO_SLUG } },
      limit: 1,
      overrideAccess: true,
    })

    if (existingSites[0]) {
      const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || 'http://localhost:3000'
      console.log('[seed-mechanic-demo] Demo site already exists.')
      console.log(`[seed-mechanic-demo] Open: ${base}/mechanics/${DEMO_SLUG}`)
      process.exit(0)
      return
    }

    const { docs: existingMechanics } = await payload.find({
      collection: 'mechanics',
      where: { email: { equals: DEMO_EMAIL } },
      limit: 1,
      overrideAccess: true,
    })

    let mechanicId: number
    if (existingMechanics[0]) {
      mechanicId = existingMechanics[0].id as number
      console.log('[seed-mechanic-demo] Reusing existing mechanic:', DEMO_EMAIL)
    } else {
      const mechanic = await payload.create({
        collection: 'mechanics',
        data: {
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          businessName: 'I-40 Diesel & Truck Repair (Demo)',
          phone: '(501) 555-0142',
        },
        overrideAccess: true,
      })
      mechanicId = mechanic.id as number
      console.log('[seed-mechanic-demo] Created mechanic:', DEMO_EMAIL)
    }

    await payload.create({
      collection: 'mechanic-sites',
      data: {
        mechanic: mechanicId,
        status: 'active',
        businessName: 'I-40 Diesel & Truck Repair',
        slug: DEMO_SLUG,
        tagline: 'Full-service diesel engine and heavy truck repair — OTR drivers and fleets welcome.',
        about:
          'Family-owned shop off I-40 with ASE-certified techs. We work on Class 8 tractors, trailers, and auxiliary power. Same-day diagnostics on most engine codes, and we stock common wear parts to get you rolling faster.',
        phone: '(501) 555-0142',
        email: 'service@demo-diesel.example.com',
        address: '1840 Interstate Dr',
        city: 'Little Rock',
        state: 'AR',
        zip: '72209',
        website: 'https://example.com',
        services: [
          {
            name: 'Engine diagnostics & repair',
            description: 'Cummins, Detroit Diesel, PACCAR MX — fault codes, aftertreatment, turbos.',
          },
          {
            name: 'DOT & annual inspections',
            description: 'Federal annual and periodic inspections for tractors and trailers.',
          },
          {
            name: 'Brakes, suspension & steering',
            description: 'Air brake systems, kingpins, shocks, and alignment checks.',
          },
          {
            name: 'A/C & electrical',
            description: 'HVAC recharge, alternators, starters, and lighting.',
          },
        ],
        certifications: [
          { label: 'ASE Master Medium/Heavy Truck' },
          { label: 'DOT certified inspectors' },
          { label: '24/7 breakdown coordination' },
        ],
        businessHours: [
          { day: 'monday', open: '07:00', close: '18:00' },
          { day: 'tuesday', open: '07:00', close: '18:00' },
          { day: 'wednesday', open: '07:00', close: '18:00' },
          { day: 'thursday', open: '07:00', close: '18:00' },
          { day: 'friday', open: '07:00', close: '18:00' },
          { day: 'saturday', open: '08:00', close: '14:00' },
        ],
        ctaText: 'Call now for service',
        ctaLink: 'tel:+15015550142',
        subscriptionStatus: 'active',
        subscriptionPaidThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      overrideAccess: true,
    })

    const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || 'http://localhost:3000'
    console.log('[seed-mechanic-demo] Created active demo site.')
    console.log(`[seed-mechanic-demo] Public page: ${base}/mechanics/${DEMO_SLUG}`)
    console.log(`[seed-mechanic-demo] Directory: ${base}/mechanics`)
    console.log(`[seed-mechanic-demo] Mechanic login: ${base}/mechanics/login`)
    console.log(`[seed-mechanic-demo]   email: ${DEMO_EMAIL}`)
    console.log(`[seed-mechanic-demo]   password: ${DEMO_PASSWORD}`)
  } catch (err) {
    console.error('[seed-mechanic-demo] Error:', err)
    process.exit(1)
  } finally {
    process.exit(0)
  }
}

main()

import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getMechanicFromRequest } from '@/lib/mechanic-from-request'
import { getStripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

  const mechanic = await getMechanicFromRequest(request)
  if (!mechanic) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mechanic-sites',
    where: { mechanic: { equals: mechanic.id } },
    limit: 1,
    depth: 0,
  })

  const site = docs[0]
  const customerId = site?.stripeCustomerId
  if (!site || !customerId) {
    return NextResponse.json({ error: 'No billing account on file yet.' }, { status: 400 })
  }

  try {
    const stripe = getStripe()
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${baseUrl}/mechanics/dashboard`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('[mechanic-subscription/portal]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Portal session failed' },
      { status: 500 }
    )
  }
}

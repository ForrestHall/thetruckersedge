import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getMechanicFromRequest } from '@/lib/mechanic-from-request'
import { getStripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const priceId = process.env.STRIPE_PRICE_ID
  const baseUrl = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

  if (!priceId) {
    return NextResponse.json({ error: 'Stripe price is not configured' }, { status: 503 })
  }

  const mechanic = await getMechanicFromRequest(request)
  if (!mechanic) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mechanic-sites',
    where: {
      and: [{ mechanic: { equals: mechanic.id } }, { status: { equals: 'approved' } }],
    },
    limit: 1,
    depth: 0,
  })

  const site = docs[0]
  if (!site) {
    return NextResponse.json(
      { error: 'No approved site ready for checkout. Wait for admin approval or contact support.' },
      { status: 400 }
    )
  }

  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: mechanic.email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/mechanics/dashboard?checkout=success`,
      cancel_url: `${baseUrl}/mechanics/dashboard?checkout=cancel`,
      metadata: {
        mechanicSiteId: String(site.id),
      },
      subscription_data: {
        metadata: {
          mechanicSiteId: String(site.id),
        },
      },
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Could not create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (e) {
    console.error('[mechanic-subscription/checkout]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Checkout failed' },
      { status: 500 }
    )
  }
}

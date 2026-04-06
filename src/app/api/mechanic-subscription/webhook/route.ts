import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getStripe, mapStripeSubscriptionStatus } from '@/lib/stripe'

export const runtime = 'nodejs'

function siteStatusFromSubscription(subscription: Stripe.Subscription): 'active' | 'suspended' | undefined {
  if (subscription.status === 'active' || subscription.status === 'trialing') {
    return 'active'
  }
  if (
    subscription.status === 'canceled' ||
    subscription.status === 'unpaid' ||
    subscription.status === 'incomplete_expired'
  ) {
    return 'suspended'
  }
  return undefined
}

async function updateSiteFromSubscription(
  payload: Awaited<ReturnType<typeof getPayload>>,
  siteId: number,
  subscription: Stripe.Subscription,
  customerId: string
) {
  const paidThrough = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : undefined

  const nextStatus = siteStatusFromSubscription(subscription)

  await payload.update({
    collection: 'mechanic-sites',
    id: siteId,
    data: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: mapStripeSubscriptionStatus(subscription.status),
      ...(paidThrough ? { subscriptionPaidThrough: paidThrough } : {}),
      ...(nextStatus ? { status: nextStatus } : {}),
    },
    overrideAccess: true,
  })
}

async function findSiteIdFromSubscription(
  payload: Awaited<ReturnType<typeof getPayload>>,
  subscription: Stripe.Subscription
): Promise<number | null> {
  const meta = subscription.metadata?.mechanicSiteId
  if (meta) {
    const id = Number.parseInt(meta, 10)
    if (Number.isFinite(id)) return id
  }
  const cust =
    typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id
  if (cust) {
    const { docs } = await payload.find({
      collection: 'mechanic-sites',
      where: { stripeCustomerId: { equals: cust } },
      limit: 1,
      depth: 0,
    })
    const first = docs[0]
    if (first && typeof first.id === 'number') return first.id
  }
  return null
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(rawBody, signature, secret)
  } catch (err) {
    console.error('[mechanic-subscription/webhook] signature:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const stripe = getStripe()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const siteIdRaw = session.metadata?.mechanicSiteId
        if (!siteIdRaw) break
        const siteId = Number.parseInt(siteIdRaw, 10)
        if (!Number.isFinite(siteId)) break

        const customerId =
          typeof session.customer === 'string' ? session.customer : session.customer?.id
        const subId =
          typeof session.subscription === 'string' ? session.subscription : session.subscription?.id
        if (!customerId || !subId) break

        const subscription = await stripe.subscriptions.retrieve(subId)
        await updateSiteFromSubscription(payload, siteId, subscription, customerId)
        break
      }
      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subId =
          typeof invoice.subscription === 'string'
            ? invoice.subscription
            : invoice.subscription && typeof invoice.subscription !== 'string'
              ? invoice.subscription.id
              : null
        if (!subId) break
        const subscription = await stripe.subscriptions.retrieve(subId)
        const siteId = await findSiteIdFromSubscription(payload, subscription)
        if (siteId == null) break
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id
        await updateSiteFromSubscription(payload, siteId, subscription, customerId)
        break
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const siteId = await findSiteIdFromSubscription(payload, subscription)
        if (siteId == null) break
        const customerId =
          typeof subscription.customer === 'string'
            ? subscription.customer
            : subscription.customer.id
        await updateSiteFromSubscription(payload, siteId, subscription, customerId)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const siteId = await findSiteIdFromSubscription(payload, subscription)
        if (siteId == null) break
        await payload.update({
          collection: 'mechanic-sites',
          id: siteId,
          data: {
            subscriptionStatus: 'cancelled',
            status: 'suspended',
          },
          overrideAccess: true,
        })
        break
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subId =
          typeof invoice.subscription === 'string'
            ? invoice.subscription
            : invoice.subscription && typeof invoice.subscription !== 'string'
              ? invoice.subscription.id
              : null
        if (!subId) break
        const subscription = await stripe.subscriptions.retrieve(subId)
        const siteId = await findSiteIdFromSubscription(payload, subscription)
        if (siteId == null) break
        await payload.update({
          collection: 'mechanic-sites',
          id: siteId,
          data: {
            subscriptionStatus: mapStripeSubscriptionStatus(subscription.status),
          },
          overrideAccess: true,
        })
        break
      }
      default:
        break
    }
  } catch (err) {
    console.error('[mechanic-subscription/webhook] handler:', err)
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

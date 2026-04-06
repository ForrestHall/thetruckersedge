import Stripe from 'stripe'

let stripeClient: Stripe | null = null

export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: '2025-02-24.acacia',
    })
  }
  return stripeClient
}

export type SiteSubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'cancelled' | 'unpaid'

export function mapStripeSubscriptionStatus(status: Stripe.Subscription.Status): SiteSubscriptionStatus {
  switch (status) {
    case 'trialing':
      return 'trialing'
    case 'active':
      return 'active'
    case 'past_due':
      return 'past_due'
    case 'canceled':
    case 'incomplete_expired':
      return 'cancelled'
    case 'unpaid':
      return 'unpaid'
    case 'incomplete':
    case 'paused':
    default:
      return 'past_due'
  }
}

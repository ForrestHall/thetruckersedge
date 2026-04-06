import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentMechanic } from '@/lib/mechanic-server'
import type { MechanicSite } from '@/payload-types'
import { MechanicDashboardClient } from '@/components/mechanic-site/MechanicDashboardClient'

export const metadata: Metadata = {
  title: 'Mechanic dashboard',
  description: 'Manage your hosted mechanic page and billing.',
}

export const dynamic = 'force-dynamic'

export default async function MechanicDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>
}) {
  const sp = await searchParams
  const checkoutFlash = sp.checkout === 'success' || sp.checkout === 'cancel' ? sp.checkout : null

  const mechanic = await getCurrentMechanic()
  if (!mechanic) {
    redirect('/mechanics/login?next=/mechanics/dashboard')
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mechanic-sites',
    where: { mechanic: { equals: mechanic.id } },
    limit: 1,
    depth: 2,
    overrideAccess: true,
  })

  const raw = docs[0]
  if (!raw) {
    redirect('/mechanics/onboarding')
  }

  const site = JSON.parse(JSON.stringify(raw)) as MechanicSite

  const stripeReady = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID)

  return (
    <MechanicDashboardClient site={site} checkoutFlash={checkoutFlash} stripeReady={stripeReady} />
  )
}

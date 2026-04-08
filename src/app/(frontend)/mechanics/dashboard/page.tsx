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

  const { docs: leadDocs } = await payload.find({
    collection: 'mechanic-leads',
    where: { mechanic: { equals: mechanic.id } },
    sort: '-createdAt',
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })

  const leads = leadDocs.map((row) => ({
    id: row.id as number,
    contactName: typeof row.contactName === 'string' ? row.contactName : '',
    phone: row.phone,
    email: row.email,
    cityOrLocation: row.cityOrLocation,
    message: typeof row.message === 'string' ? row.message : '',
    createdAt: typeof row.createdAt === 'string' ? row.createdAt : new Date().toISOString(),
  }))

  const stripeReady = Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID)

  return (
    <MechanicDashboardClient
      site={site}
      leads={leads}
      checkoutFlash={checkoutFlash}
      stripeReady={stripeReady}
    />
  )
}

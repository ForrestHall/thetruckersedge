import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { CommandCenterDashboard } from '@/components/command-center/CommandCenterDashboard'
import { getCurrentOwnerOperator } from '@/lib/owner-operator-server'
import type { OwnerOperator } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Command center',
  description:
    'Owner-operator hub: save your truck, lanes, and cost assumptions — quick links to IFTA, service intervals, warranty tools, and the diesel mechanic directory.',
}

export const dynamic = 'force-dynamic'

export default async function CommandCenterPage() {
  const sessionUser = await getCurrentOwnerOperator()
  if (!sessionUser) {
    redirect('/command-center/login?next=/command-center')
  }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'owner-operators',
    where: { id: { equals: sessionUser.id } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  const doc = docs[0]
  if (!doc) {
    redirect('/command-center/login?next=/command-center')
  }

  const initial = JSON.parse(JSON.stringify(doc)) as OwnerOperator

  return <CommandCenterDashboard initial={initial} />
}

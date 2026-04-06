import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentMechanic } from '@/lib/mechanic-server'
import { MechanicSiteEditorForm } from '@/components/mechanic-site/MechanicSiteEditorForm'

export const metadata: Metadata = {
  title: 'Mechanic onboarding',
  description: 'Submit your diesel shop details for review.',
}

export const dynamic = 'force-dynamic'

export default async function MechanicOnboardingPage() {
  const mechanic = await getCurrentMechanic()
  if (!mechanic) {
    redirect('/mechanics/login?next=/mechanics/onboarding')
  }

  const payload = await getPayload({ config })
  const { totalDocs } = await payload.count({
    collection: 'mechanic-sites',
    where: { mechanic: { equals: mechanic.id } },
    overrideAccess: true,
  })

  if (totalDocs > 0) {
    redirect('/mechanics/dashboard')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-brand-navy mb-2">Tell us about your shop</h1>
      <p className="text-gray-600 mb-8">
        Fill in as much as you can. After you submit, we will review your page. When it is approved, you can subscribe
        monthly to go live on The Truckers Edge.
      </p>
      <MechanicSiteEditorForm mode="create" />
    </div>
  )
}

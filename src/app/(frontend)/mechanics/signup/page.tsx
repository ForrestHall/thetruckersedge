import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentMechanic } from '@/lib/mechanic-server'
import { MechanicSignupForm } from '@/components/mechanic-site/MechanicSignupForm'

export const metadata: Metadata = {
  title: 'Mechanic signup',
  description: 'Create an account to list your diesel shop on The Truckers Edge.',
}

export default async function MechanicSignupPage() {
  const mechanic = await getCurrentMechanic()
  if (mechanic) {
    redirect('/mechanics/dashboard')
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-navy mb-2">Mechanic signup</h1>
      <p className="text-gray-600 mb-8">
        Create your account. After you submit your business details for review and subscribe, your one-page site
        goes live at <span className="font-medium">thetruckersedge.com/mechanics/your-shop</span>.
      </p>
      <MechanicSignupForm />
      <p className="mt-8 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/mechanics/login" className="text-brand-navy font-semibold underline">
          Log in
        </Link>
      </p>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentMechanic } from '@/lib/mechanic-server'
import { MechanicLoginForm } from '@/components/mechanic-site/MechanicLoginForm'

export const metadata: Metadata = {
  title: 'Mechanic login',
  description: 'Log in to manage your hosted mechanic page.',
}

export default async function MechanicLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const mechanic = await getCurrentMechanic()
  if (mechanic) {
    redirect('/mechanics/dashboard')
  }

  const sp = await searchParams
  const next =
    typeof sp.next === 'string' && sp.next.startsWith('/mechanics') ? sp.next : '/mechanics/dashboard'

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-navy mb-2">Mechanic login</h1>
      <p className="text-gray-600 mb-8">Sign in to edit your page, complete onboarding, or manage billing.</p>
      <MechanicLoginForm redirectTo={next} />
      <p className="mt-8 text-center text-sm text-gray-600">
        Need an account?{' '}
        <Link href="/mechanics/signup" className="text-brand-navy font-semibold underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { OwnerOperatorLoginForm } from '@/components/command-center/OwnerOperatorLoginForm'

export const metadata: Metadata = {
  title: 'Sign in — Command center',
  description: 'Sign in to your owner-operator command center on The Truckers Edge.',
}

export default async function CommandCenterLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const sp = await searchParams
  const next = sp.next?.startsWith('/') && !sp.next.startsWith('//') ? sp.next : '/command-center'

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <Link href="/tools" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
        ← Tools
      </Link>
      <h1 className="text-3xl font-bold text-brand-navy mt-4 mb-2">Command center</h1>
      <p className="text-gray-600 mb-8">Sign in to load your saved truck, lanes, and cost assumptions.</p>
      <OwnerOperatorLoginForm redirectTo={next} />
      <p className="text-sm text-gray-600 mt-6 text-center">
        No account?{' '}
        <Link href="/command-center/signup" className="font-semibold text-brand-navy underline">
          Create one
        </Link>
      </p>
    </div>
  )
}

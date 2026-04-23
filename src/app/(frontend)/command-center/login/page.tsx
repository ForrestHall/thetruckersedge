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
    <div className="max-w-md mx-auto">
      <Link href="/" className="text-sm font-medium text-gray-500 hover:text-brand-navy transition-colors">
        ← Home
      </Link>
      <h1 className="text-3xl font-bold text-brand-navy mt-4 mb-2">Command center</h1>
      <p className="text-gray-600 mb-8">Sign in to load your saved truck, lanes, and cost assumptions.</p>
      <p className="text-sm text-gray-500 mb-6">
        One session per browser: signing in here replaces an admin or mechanic login on this site.
      </p>
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

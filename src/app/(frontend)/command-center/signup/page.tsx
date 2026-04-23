import type { Metadata } from 'next'
import Link from 'next/link'
import { OwnerOperatorSignupForm } from '@/components/command-center/OwnerOperatorSignupForm'

export const metadata: Metadata = {
  title: 'Create account — Command center',
  description: 'Create a free owner-operator account for The Truckers Edge command center.',
}

export default function CommandCenterSignupPage() {
  return (
    <div className="max-w-md mx-auto">
      <Link
        href="/command-center/login"
        className="text-sm font-medium text-gray-500 hover:text-brand-navy transition-colors"
      >
        ← Sign in
      </Link>
      <h1 className="text-3xl font-bold text-brand-navy mt-4 mb-2">Create your account</h1>
      <p className="text-gray-600 mb-8">
        One login for your command center. Same account is intended for future mobile apps (iOS/Android).
      </p>
      <OwnerOperatorSignupForm />
      <p className="text-xs text-gray-500 mt-6">
        By creating an account you agree we store your profile for the command center. Not financial or legal advice.
      </p>
    </div>
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function MechanicSignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const form = e.currentTarget
    const fd = new FormData(form)
    const email = String(fd.get('email') || '')
    const password = String(fd.get('password') || '')
    const businessName = String(fd.get('businessName') || '')
    const phone = String(fd.get('phone') || '')

    try {
      const res = await fetch('/api/mechanics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, businessName, phone }),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string; errors?: { message?: string }[] }
      if (!res.ok) {
        const msg =
          data.errors?.[0]?.message ||
          (typeof data.message === 'string' ? data.message : null) ||
          'Could not create account'
        setError(msg)
        setLoading(false)
        return
      }
      const loginRes = await fetch('/api/mechanics/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      if (!loginRes.ok) {
        setError('Account created. Please log in with your email and password.')
        setLoading(false)
        router.push('/mechanics/login')
        return
      }
      window.location.assign('/mechanics/onboarding')
    } catch {
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 text-red-800 text-sm px-4 py-3 border border-red-100" role="alert">
          {error}
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
        />
      </div>
      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
          Business name
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}

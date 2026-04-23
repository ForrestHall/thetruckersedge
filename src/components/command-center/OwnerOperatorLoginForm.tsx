'use client'

import { useState } from 'react'

export function OwnerOperatorLoginForm({ redirectTo = '/command-center' }: { redirectTo?: string }) {
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

    try {
      const res = await fetch('/api/owner-operators/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        message?: string
        errors?: { message?: string }[]
      }
      if (!res.ok) {
        const msg =
          data.errors?.[0]?.message ||
          (typeof data.message === 'string' ? data.message : null) ||
          'Invalid email or password'
        setError(msg)
        setLoading(false)
        return
      }
      // Full navigation so the next document request includes the new Set-Cookie
      // (router.push + refresh can race the cookie store on some browsers / Next RSC).
      window.location.assign(redirectTo)
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
        <label htmlFor="oo-email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          id="oo-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
        />
      </div>
      <div>
        <label htmlFor="oo-password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          id="oo-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-gray-900 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy"
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}

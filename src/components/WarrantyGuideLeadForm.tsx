'use client'

import { useState } from 'react'
import Link from 'next/link'

const INPUT_CLASS =
  'block w-full min-w-0 px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-brand-navy'

export function WarrantyGuideLeadForm() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrMsg(null)
    setStatus('sending')
    try {
      const res = await fetch('/api/warranty-guide-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          notes: notes.trim() || undefined,
          company,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setErrMsg(data.error || 'Something went wrong')
        setStatus('err')
        return
      }
      setStatus('ok')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPhone('')
      setNotes('')
      setCompany('')
    } catch {
      setErrMsg('Network error. Try again.')
      setStatus('err')
    }
  }

  return (
    <div className="card p-6 sm:p-8 bg-brand-gray/40 border-2 border-brand-navy/10">
      <h2 className="text-xl font-bold text-brand-navy mb-2">Get warranty options</h2>
      <p className="text-sm text-gray-600 mb-4">
        Share your contact info and we&apos;ll follow up. You can also go straight to the{' '}
        <Link href="/tools/warranty-quote" className="font-semibold text-brand-navy underline">
          full quote questionnaire
        </Link>
        .
      </p>
      <p className="text-xs text-gray-500 mb-4">
        By submitting, you agree we may contact you about commercial truck warranty options. This is not insurance or
        legal advice.
      </p>

      {status === 'ok' && (
        <p className="rounded-lg bg-green-50 text-green-900 text-sm px-4 py-3 mb-4 border border-green-100" role="status">
          Thanks — check your email for a confirmation and a link to the full quote tool.
        </p>
      )}
      {errMsg && (
        <p className="rounded-lg bg-red-50 text-red-900 text-sm px-4 py-3 mb-4 border border-red-100" role="alert">
          {errMsg}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        <label className="sr-only" htmlFor="wg-company">
          Company
        </label>
        <input
          id="wg-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
          aria-hidden
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="wg-fn" className="block text-sm font-medium text-gray-700 mb-1">
              First name *
            </label>
            <input
              id="wg-fn"
              required
              maxLength={80}
              className={INPUT_CLASS}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="wg-ln" className="block text-sm font-medium text-gray-700 mb-1">
              Last name *
            </label>
            <input
              id="wg-ln"
              required
              maxLength={80}
              className={INPUT_CLASS}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="wg-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="wg-email"
            type="email"
            required
            autoComplete="email"
            className={INPUT_CLASS}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="wg-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            id="wg-phone"
            type="tel"
            required
            minLength={7}
            maxLength={40}
            autoComplete="tel"
            className={INPUT_CLASS}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="wg-notes" className="block text-sm font-medium text-gray-700 mb-1">
            Truck / situation (optional)
          </label>
          <textarea
            id="wg-notes"
            rows={3}
            maxLength={2000}
            className={INPUT_CLASS}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Make, year, mileage, fleet size, or what you want covered"
          />
        </div>
        <button type="submit" disabled={status === 'sending'} className="btn-primary w-full sm:w-auto disabled:opacity-60">
          {status === 'sending' ? 'Sending…' : 'Submit'}
        </button>
      </form>
    </div>
  )
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  evaluateWarrantyQualification,
  qualificationCopy,
  type QualificationTier,
} from '@/lib/warranty-qualify'

const INPUT_CLASS =
  'block w-full min-w-0 max-w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-brand-navy'

const FORM_CLASS = 'card flex w-full min-w-0 max-w-full flex-col gap-6 p-6 sm:p-8'

type Step = 'truck' | 'result' | 'contact' | 'success'

export function WarrantyQualifyQuiz() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i)

  const [step, setStep] = useState<Step>('truck')
  const [year, setYear] = useState('')
  const [mileage, setMileage] = useState('')
  const [truckClass, setTruckClass] = useState('')
  const [usage, setUsage] = useState('')
  const [tier, setTier] = useState<QualificationTier>('maybe')
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleTruckSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!year || !mileage || !truckClass || !usage) return

    const parsedYear = parseInt(year, 10)
    const parsedMileage = parseInt(mileage.replace(/,/g, ''), 10) || 0
    const parsedClass = parseInt(truckClass, 10)

    const result = evaluateWarrantyQualification({
      year: parsedYear,
      mileage: parsedMileage,
      truckClass: parsedClass,
    })
    setTier(result)
    setStep('result')
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/warranty-qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qualification: tier,
          vehicle: {
            year: parseInt(year, 10),
            truckClass: parseInt(truckClass, 10),
          },
          mileage: parseInt(mileage.replace(/,/g, ''), 10) || 0,
          usage,
          contact: {
            firstName: contact.firstName.trim(),
            lastName: contact.lastName.trim(),
            email: contact.email.trim(),
            phone: contact.phone.trim(),
          },
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong')
      }
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'success') {
    return (
      <div className={`${FORM_CLASS} text-center`}>
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-brand-navy">We received your request</h2>
        <p className="text-gray-600">
          Check your email for confirmation. Want more detail? Complete the{' '}
          <Link href="/tools/warranty-quote" className="font-semibold text-brand-navy underline">
            full warranty quote questionnaire
          </Link>
          .
        </p>
      </div>
    )
  }

  if (step === 'result') {
    const copy = qualificationCopy[tier]
    return (
      <div className={FORM_CLASS}>
        <div
          className={`rounded-xl p-5 border-2 ${
            tier === 'likely'
              ? 'bg-green-50 border-green-200'
              : tier === 'maybe'
                ? 'bg-amber-50 border-amber-200'
                : 'bg-gray-50 border-gray-200'
          }`}
        >
          <h2 className="text-xl font-bold text-brand-navy mb-2">{copy.headline}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{copy.detail}</p>
        </div>
        <button type="button" className="btn-primary w-full" onClick={() => setStep('contact')}>
          {copy.cta}
        </button>
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-brand-navy"
          onClick={() => setStep('truck')}
        >
          ← Change my answers
        </button>
      </div>
    )
  }

  if (step === 'contact') {
    return (
      <form onSubmit={handleContactSubmit} className={FORM_CLASS}>
        <div>
          <h2 className="text-xl font-bold text-brand-navy mb-1">Almost done</h2>
          <p className="text-sm text-gray-600">
            Where should we send your eligibility follow-up?
          </p>
        </div>
        {error && (
          <p className="rounded-lg bg-red-50 text-red-900 text-sm px-4 py-3 border border-red-100" role="alert">
            {error}
          </p>
        )}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="wq-fn" className="block text-sm font-medium text-gray-700 mb-1">
              First name *
            </label>
            <input
              id="wq-fn"
              required
              maxLength={80}
              className={INPUT_CLASS}
              value={contact.firstName}
              onChange={(e) => setContact((c) => ({ ...c, firstName: e.target.value }))}
            />
          </div>
          <div>
            <label htmlFor="wq-ln" className="block text-sm font-medium text-gray-700 mb-1">
              Last name *
            </label>
            <input
              id="wq-ln"
              required
              maxLength={80}
              className={INPUT_CLASS}
              value={contact.lastName}
              onChange={(e) => setContact((c) => ({ ...c, lastName: e.target.value }))}
            />
          </div>
        </div>
        <div>
          <label htmlFor="wq-email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="wq-email"
            type="email"
            required
            autoComplete="email"
            className={INPUT_CLASS}
            value={contact.email}
            onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
          />
        </div>
        <div>
          <label htmlFor="wq-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone *
          </label>
          <input
            id="wq-phone"
            type="tel"
            required
            minLength={7}
            maxLength={40}
            autoComplete="tel"
            className={INPUT_CLASS}
            value={contact.phone}
            onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
          />
        </div>
        <p className="text-xs text-gray-500">
          By submitting, you agree we may contact you about commercial truck warranty options. This is not
          insurance or legal advice.
        </p>
        <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
          {submitting ? 'Submitting…' : qualificationCopy[tier].cta}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleTruckSubmit} className={FORM_CLASS}>
      <div>
        <h2 className="text-xl font-bold text-brand-navy mb-1">Tell us about your truck</h2>
        <p className="text-sm text-gray-600">Takes about 30 seconds — no obligation.</p>
      </div>
      <div>
        <label htmlFor="wq-year" className="block text-sm font-medium text-gray-700 mb-1">
          Model year *
        </label>
        <select
          id="wq-year"
          required
          className={INPUT_CLASS}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">Select year</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="wq-mileage" className="block text-sm font-medium text-gray-700 mb-1">
          Approximate mileage *
        </label>
        <input
          id="wq-mileage"
          required
          inputMode="numeric"
          placeholder="e.g. 425000"
          className={INPUT_CLASS}
          value={mileage}
          onChange={(e) => setMileage(e.target.value.replace(/[^\d,]/g, ''))}
        />
      </div>
      <div>
        <label htmlFor="wq-class" className="block text-sm font-medium text-gray-700 mb-1">
          Truck class *
        </label>
        <select
          id="wq-class"
          required
          className={INPUT_CLASS}
          value={truckClass}
          onChange={(e) => setTruckClass(e.target.value)}
        >
          <option value="">Select class</option>
          <option value="7">Class 7 (heavy, e.g. single axle)</option>
          <option value="8">Class 8 (semi / tractor-trailer)</option>
        </select>
      </div>
      <div>
        <label htmlFor="wq-usage" className="block text-sm font-medium text-gray-700 mb-1">
          How do you run the truck? *
        </label>
        <select
          id="wq-usage"
          required
          className={INPUT_CLASS}
          value={usage}
          onChange={(e) => setUsage(e.target.value)}
        >
          <option value="">Select one</option>
          <option value="owner-operator">Owner-operator (my truck)</option>
          <option value="lease-operator">Lease operator</option>
          <option value="small-fleet">Small fleet (2–10 trucks)</option>
          <option value="company-driver">Company driver (not my truck)</option>
        </select>
      </div>
      <button type="submit" className="btn-primary w-full">
        See if I qualify
      </button>
    </form>
  )
}

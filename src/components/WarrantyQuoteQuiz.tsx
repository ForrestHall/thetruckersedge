'use client'

import { useState } from 'react'

const TRUCK_MAKES = [
  'Freightliner',
  'Peterbilt',
  'Kenworth',
  'Volvo',
  'Mack',
  'International',
  'Western Star',
  'Navistar',
  'Hino',
  'Isuzu',
  'Ford',
  'Other',
] as const

const USAGE_OPTIONS = [
  { value: 'owner-operator', label: 'Owner-Operator' },
  { value: 'small-fleet', label: 'Small Fleet (2–10 trucks)' },
  { value: 'mid-fleet', label: 'Mid-Size Fleet (11–50 trucks)' },
  { value: 'large-fleet', label: 'Large Fleet (50+ trucks)' },
  { value: 'lease-operator', label: 'Lease Operator' },
  { value: 'other', label: 'Other' },
] as const

const INPUT_CLASS =
  'w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-brand-navy'

export interface WarrantyQuoteData {
  vehicle: { make: string; model?: string; year: number; truckClass: number }
  mileage: number
  usage: string
  contact: { firstName: string; lastName: string; email: string; phone: string }
}

type Step = 'vehicle' | 'usage' | 'searching' | 'contact' | 'success'

export function WarrantyQuoteQuiz() {
  const [step, setStep] = useState<Step>('vehicle')
  const [vehicle, setVehicle] = useState({
    make: '',
    model: '',
    year: '',
    truckClass: '',
  })
  const [usage, setUsage] = useState({ mileage: '', usageType: '' })
  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i)

  const handleVehicleNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (vehicle.make && vehicle.year && vehicle.truckClass) setStep('usage')
  }

  const handleUsageNext = (e: React.FormEvent) => {
    e.preventDefault()
    if (usage.mileage && usage.usageType) {
      setStep('searching')
      setTimeout(() => setStep('contact'), 1500)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const payload: WarrantyQuoteData = {
      vehicle: {
        make: vehicle.make,
        model: vehicle.model || undefined,
        year: parseInt(vehicle.year, 10),
        truckClass: parseInt(vehicle.truckClass, 10),
      },
      mileage: parseInt(usage.mileage.replace(/,/g, ''), 10) || 0,
      usage: usage.usageType,
      contact: {
        firstName: contact.firstName.trim(),
        lastName: contact.lastName.trim(),
        email: contact.email.trim(),
        phone: contact.phone.trim(),
      },
    }

    try {
      const res = await fetch('/api/warranty-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()

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
      <div className="card p-8 sm:p-12 text-center">
        <div className="text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-brand-navy mb-3">Quote Request Received</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          We&apos;re searching top providers and will email your personalized quote soon. Check your inbox at{' '}
          <strong>{contact.email}</strong>.
        </p>
        <p className="text-sm text-gray-500 mt-4">Questions? Reply to the confirmation email we sent you.</p>
      </div>
    )
  }

  if (step === 'searching') {
    return (
      <div className="card p-12 sm:p-16 text-center">
        <div className="animate-pulse text-4xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-brand-navy mb-2">Searching top providers...</h2>
        <p className="text-gray-500">Finding the best warranty match for your {vehicle.year} {vehicle.make}</p>
      </div>
    )
  }

  const progressPct =
    step === 'vehicle' ? 25 : step === 'usage' ? 50 : step === 'contact' ? 75 : 100

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between text-sm text-gray-500 mb-1">
          <span>Step {step === 'vehicle' ? 1 : step === 'usage' ? 2 : 3} of 3</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-yellow transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {step === 'vehicle' && (
        <form onSubmit={handleVehicleNext} className="card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-brand-navy">Tell us about your truck</h2>

          <div>
            <label htmlFor="make" className="block text-sm font-semibold text-brand-navy mb-2">
              Make
            </label>
            <select
              id="make"
              value={vehicle.make}
              onChange={(e) => setVehicle((v) => ({ ...v, make: e.target.value }))}
              className={INPUT_CLASS}
              required
            >
              <option value="">Select make...</option>
              {TRUCK_MAKES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="model" className="block text-sm font-semibold text-brand-navy mb-2">
              Model <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              id="model"
              type="text"
              placeholder="e.g. Cascadia, T680"
              value={vehicle.model}
              onChange={(e) => setVehicle((v) => ({ ...v, model: e.target.value }))}
              className={INPUT_CLASS}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="year" className="block text-sm font-semibold text-brand-navy mb-2">
                Year
              </label>
              <select
                id="year"
                value={vehicle.year}
                onChange={(e) => setVehicle((v) => ({ ...v, year: e.target.value }))}
                className={INPUT_CLASS}
                required
              >
                <option value="">Select year...</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="class" className="block text-sm font-semibold text-brand-navy mb-2">
                Truck Class
              </label>
              <select
                id="class"
                value={vehicle.truckClass}
                onChange={(e) => setVehicle((v) => ({ ...v, truckClass: e.target.value }))}
                className={INPUT_CLASS}
                required
              >
                <option value="">Select class...</option>
                {[2, 3, 4, 5, 6, 7, 8].map((c) => (
                  <option key={c} value={c}>
                    Class {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="btn-primary w-full sm:w-auto px-8 py-3">
            Continue
          </button>
        </form>
      )}

      {step === 'usage' && (
        <form onSubmit={handleUsageNext} className="card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-brand-navy">How do you use your truck?</h2>

          <div>
            <label htmlFor="mileage" className="block text-sm font-semibold text-brand-navy mb-2">
              Current Mileage (odometer)
            </label>
            <input
              id="mileage"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 250000"
              value={usage.mileage}
              onChange={(e) => setUsage((u) => ({ ...u, mileage: e.target.value }))}
              className={INPUT_CLASS}
              required
            />
          </div>

          <div>
            <label htmlFor="usageType" className="block text-sm font-semibold text-brand-navy mb-2">
              Usage Type
            </label>
            <select
              id="usageType"
              value={usage.usageType}
              onChange={(e) => setUsage((u) => ({ ...u, usageType: e.target.value }))}
              className={INPUT_CLASS}
              required
            >
              <option value="">Select...</option>
              {USAGE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('vehicle')}
              className="btn-secondary px-6 py-3"
            >
              Back
            </button>
            <button type="submit" className="btn-primary px-8 py-3">
              Continue
            </button>
          </div>
        </form>
      )}

      {step === 'contact' && (
        <form onSubmit={handleSubmit} className="card p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-brand-navy">Get your personalized quote</h2>
          <p className="text-gray-600 text-sm">
            We&apos;ll search top providers and email your quote. No spam.
          </p>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-semibold text-brand-navy mb-2">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={contact.firstName}
                onChange={(e) => setContact((c) => ({ ...c, firstName: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-semibold text-brand-navy mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={contact.lastName}
                onChange={(e) => setContact((c) => ({ ...c, lastName: e.target.value }))}
                className={INPUT_CLASS}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={contact.email}
              onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
              className={INPUT_CLASS}
              required
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy mb-2">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={contact.phone}
              onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
              className={INPUT_CLASS}
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep('usage')}
              disabled={submitting}
              className="btn-secondary px-6 py-3"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary px-8 py-3 disabled:opacity-70"
            >
              {submitting ? 'Submitting...' : 'Get My Quote'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

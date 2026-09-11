'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { QualifySpeedometerIcon } from '@/components/icons/QualifySpeedometerIcon'
import {
  ATW_EXECUTIVE_PLAN,
  buildMatchSummary,
  coverageOptionsForTruckType,
  evaluateWarrantyQualification,
  executivePlanHeadline,
  executivePlanSubhead,
  TRUCK_TYPE_OPTIONS,
  USAGE_OPTIONS,
  type CoveragePriority,
  type LeadRequestType,
  type QualificationTier,
  type TruckType,
  type TruckUsage,
} from '@/lib/warranty-qualify'

const TOTAL_STEPS = 6
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

type FunnelAnswers = {
  truckType: TruckType | ''
  year: string
  make: string
  model: string
  mileage: string
  usage: TruckUsage | ''
  coverage: CoveragePriority | ''
}

export function WarrantyQualifyQuiz() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i)

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<FunnelAnswers>({
    truckType: '',
    year: '',
    make: '',
    model: '',
    mileage: '',
    usage: '',
    coverage: '',
  })
  const [contact, setContact] = useState({ firstName: '', email: '', phone: '' })
  const [tier, setTier] = useState<QualificationTier>('maybe')
  const [summary, setSummary] = useState<string[]>([])
  const [deliveryNote, setDeliveryNote] = useState('Check your email for Executive Plan details.')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [utm, setUtm] = useState<Record<string, string>>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const captured: Record<string, string> = {}
    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
      const value = params.get(key)
      if (value) captured[key] = value
    })
    setUtm(captured)
  }, [])

  const progressPct = step >= TOTAL_STEPS ? 100 : ((step + 1) / TOTAL_STEPS) * 100
  const coverageOptions = useMemo(
    () => (answers.truckType ? coverageOptionsForTruckType(answers.truckType) : []),
    [answers.truckType],
  )

  function goNext() {
    setError(null)
    if (step === 1 && !answers.truckType) return
    if (step === 2) {
      if (!answers.year || !answers.make.trim() || !answers.model.trim() || !answers.mileage.trim()) return
    }
    if (step === 3 && !answers.usage) return
    if (step === 4 && !answers.coverage) return

    if (step === 4) {
      const parsedYear = parseInt(answers.year, 10)
      const parsedMileage = parseInt(answers.mileage.replace(/,/g, ''), 10) || 0
      const result = evaluateWarrantyQualification({
        year: parsedYear,
        mileage: parsedMileage,
        truckType: answers.truckType as TruckType,
      })
      setTier(result)
    }

    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setError(null)
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function submitLead(requestType: LeadRequestType) {
    setError(null)
    if (!contact.firstName.trim() || !contact.email.trim()) return
    if (!contact.phone.trim()) {
      setError('Phone is required.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/warranty-qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          truckType: answers.truckType,
          vehicle: {
            year: parseInt(answers.year, 10),
            make: answers.make.trim(),
            model: answers.model.trim(),
          },
          mileage: parseInt(answers.mileage.replace(/,/g, ''), 10) || 0,
          usage: answers.usage,
          coverage: answers.coverage,
          requestType,
          contact: {
            firstName: contact.firstName.trim(),
            email: contact.email.trim(),
            phone: contact.phone.trim(),
          },
          utm: Object.keys(utm).length ? utm : undefined,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        summary?: string[]
        tier?: QualificationTier
      }
      if (!res.ok) throw new Error(data.error || 'Something went wrong')

      const matchSummary =
        data.summary ||
        buildMatchSummary({
          year: answers.year,
          make: answers.make,
          model: answers.model,
          mileage: answers.mileage,
          truckType: answers.truckType as TruckType,
          usage: answers.usage as TruckUsage,
          coverage: answers.coverage as CoveragePriority,
          tier: data.tier || tier,
        })

      setSummary(matchSummary)
      setDeliveryNote(
        requestType === 'call'
          ? 'An ATW specialist will call you shortly to review your Executive Plan qualification.'
          : 'Check your email for Executive Plan details and next steps.',
      )
      setStep(6)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="warranty-funnel mx-auto w-full max-w-md relative pb-14">
      <div className="warranty-funnel-progress fixed top-0 left-0 right-0 z-50 h-0.5 bg-brand-gray">
        <div
          className="h-full bg-gradient-to-r from-brand-yellow to-brand-navy transition-all duration-300 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {step === 0 && (
        <section className="warranty-funnel-step">
          <div className="text-center mb-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-navy text-brand-yellow shadow-lg mb-4">
              <QualifySpeedometerIcon className="h-9 w-9" />
            </div>
            <h2 className="text-2xl font-bold text-brand-navy mb-3">See if your truck qualifies for coverage</h2>
            <p className="text-gray-600 leading-relaxed">
              Answer a few quick questions about your rig. We&apos;ll check whether you qualify for{' '}
              <strong>America&apos;s Trucking Warranty</strong> Executive Plan coverage — free and no
              obligation.
            </p>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Heavy duty: up to 20 years old, under 1,000,000 miles. Medium duty: 15 years or newer,
              under 500,000 miles.
            </p>
          </div>
          <button type="button" className="btn-primary w-full py-3.5" onClick={goNext}>
            Check my eligibility
          </button>
          <StepIndicator n={1} />
        </section>
      )}

      {step === 1 && (
        <section className="warranty-funnel-step">
          <h2 className="text-xl font-bold text-brand-navy mb-4">What type of truck?</h2>
          <div className="grid gap-3 mb-6">
            {TRUCK_TYPE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                name="truckType"
                value={opt.value}
                checked={answers.truckType === opt.value}
                onChange={(value) =>
                  setAnswers((a) => ({
                    ...a,
                    truckType: value as TruckType,
                    coverage: '',
                  }))
                }
                label={opt.label}
                hint={opt.hint}
              />
            ))}
          </div>
          <NavButtons onBack={goBack} onNext={goNext} />
          <StepIndicator n={2} />
        </section>
      )}

      {step === 2 && (
        <section className="warranty-funnel-step">
          <h2 className="text-xl font-bold text-brand-navy mb-4">Tell us about your rig</h2>
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Year">
                <select
                  className="funnel-input"
                  value={answers.year}
                  onChange={(e) => setAnswers((a) => ({ ...a, year: e.target.value }))}
                  required
                >
                  <option value="">Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Make">
                <select
                  className="funnel-input"
                  value={answers.make}
                  onChange={(e) => setAnswers((a) => ({ ...a, make: e.target.value }))}
                  required
                >
                  <option value="">Make</option>
                  {TRUCK_MAKES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Model">
              <input
                className="funnel-input"
                placeholder="e.g. Cascadia, T680"
                value={answers.model}
                onChange={(e) => setAnswers((a) => ({ ...a, model: e.target.value }))}
                required
              />
            </Field>
            <Field label="Mileage (odometer)">
              <input
                className="funnel-input"
                inputMode="numeric"
                placeholder="425,000"
                value={answers.mileage}
                onChange={(e) =>
                  setAnswers((a) => ({ ...a, mileage: e.target.value.replace(/[^\d,]/g, '') }))
                }
                required
              />
            </Field>
          </div>
          <NavButtons onBack={goBack} onNext={goNext} />
          <StepIndicator n={3} />
        </section>
      )}

      {step === 3 && (
        <section className="warranty-funnel-step">
          <h2 className="text-xl font-bold text-brand-navy mb-4">How is the truck utilized?</h2>
          <div className="grid gap-3 mb-6">
            {USAGE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                name="usage"
                value={opt.value}
                checked={answers.usage === opt.value}
                onChange={(value) => setAnswers((a) => ({ ...a, usage: value as TruckUsage }))}
                label={opt.label}
              />
            ))}
          </div>
          <NavButtons onBack={goBack} onNext={goNext} />
          <StepIndicator n={4} />
        </section>
      )}

      {step === 4 && (
        <section className="warranty-funnel-step">
          <h2 className="text-xl font-bold text-brand-navy mb-4">What level of protection do you want?</h2>
          <div className="grid gap-3 mb-6">
            {coverageOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                name="coverage"
                value={opt.value}
                checked={answers.coverage === opt.value}
                onChange={(value) => setAnswers((a) => ({ ...a, coverage: value as CoveragePriority }))}
                label={opt.label}
                hint={opt.hint}
              />
            ))}
          </div>
          <NavButtons onBack={goBack} onNext={goNext} />
          <StepIndicator n={5} />
        </section>
      )}

      {step === 5 && (
        <section className="warranty-funnel-step">
          <div className="text-center mb-6">
            <div className="funnel-analyzing-dots mb-3">
              <span />
              <span />
              <span />
            </div>
            <p className="text-sm font-medium text-brand-navy mb-3">Checking your eligibility…</p>
            <div className="funnel-analyzing-bar mb-4">
              <div className="funnel-analyzing-bar-fill" />
            </div>
            <p className="text-gray-700 font-semibold">
              {tier === 'unlikely'
                ? 'Your results are ready. Want an ATW specialist to review other options?'
                : 'Good news — your rig qualifies. Where should we send your Executive Plan details?'}
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 text-red-900 text-sm px-4 py-3 border border-red-100 mb-4" role="alert">
              {error}
            </p>
          )}

          <div className="space-y-3 mb-4">
            <input
              className="funnel-input"
              placeholder="First name"
              value={contact.firstName}
              onChange={(e) => setContact((c) => ({ ...c, firstName: e.target.value }))}
              required
            />
            <input
              className="funnel-input"
              type="email"
              placeholder="Email address"
              value={contact.email}
              onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
              required
            />
            <input
              className="funnel-input"
              type="tel"
              placeholder="Phone number"
              value={contact.phone}
              onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              disabled={submitting}
              className="btn-primary w-full py-3.5 disabled:opacity-60"
              onClick={() => submitLead('quote')}
            >
              {submitting ? 'Submitting…' : 'Email my qualification'}
            </button>
            <button
              type="button"
              disabled={submitting}
              className="btn-secondary w-full py-3.5 disabled:opacity-60"
              onClick={() => submitLead('call')}
            >
              Request a call
            </button>
          </div>
          <button type="button" className="mt-4 text-sm text-gray-500 hover:text-brand-navy w-full" onClick={goBack}>
            ← Back
          </button>
          <StepIndicator n={6} />
        </section>
      )}

      {step === 6 && (
        <section className="warranty-funnel-step text-center">
          <div
            className={`inline-flex h-16 w-16 items-center justify-center rounded-full text-3xl mb-4 ${
              tier === 'likely' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            {tier === 'likely' ? '✓' : '!'}
          </div>
          <h2 className="text-2xl font-bold text-brand-navy mb-2">{executivePlanHeadline(tier)}</h2>
          <p className="text-gray-600 mb-6">{executivePlanSubhead(tier)} {deliveryNote}</p>
          {tier === 'likely' && (
            <div className="text-left rounded-xl border-2 border-brand-yellow/40 bg-brand-yellow/5 p-5 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-navy/70 mb-1">
                Recommended plan
              </p>
              <h3 className="font-bold text-brand-navy text-lg mb-2">{ATW_EXECUTIVE_PLAN.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{ATW_EXECUTIVE_PLAN.tagline}</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {ATW_EXECUTIVE_PLAN.highlights.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-brand-yellow">✓</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="text-left rounded-xl border-2 border-brand-gray bg-brand-gray/30 p-5 mb-6">
            <h3 className="font-bold text-brand-navy mb-3">Your truck profile</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {summary.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-brand-yellow">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-gray-500 mb-6">
            An ATW specialist will follow up to confirm eligibility, pricing, and term options. This is not
            insurance or legal advice.
          </p>
          <Link href="/tools/warranty-quote" className="btn-primary inline-flex">
            Request a full quote
          </Link>
        </section>
      )}
    </div>
  )
}

function StepIndicator({ n }: { n: number }) {
  return (
    <p className="fixed bottom-4 left-0 right-0 text-center text-xs font-mono text-gray-400 pointer-events-none">
      {n} of {TOTAL_STEPS}
    </p>
  )
}

function NavButtons({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button type="button" className="btn-secondary w-full sm:w-auto px-6" onClick={onBack}>
        Back
      </button>
      <button type="button" className="btn-primary w-full sm:flex-1 py-3" onClick={onNext}>
        Continue
      </button>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
      {children}
    </label>
  )
}

function OptionCard({
  name,
  value,
  checked,
  onChange,
  label,
  hint,
}: {
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  label: string
  hint?: string
}) {
  return (
    <label
      className={`funnel-option-card block cursor-pointer rounded-xl border-2 p-4 transition-colors ${
        checked ? 'border-brand-yellow bg-brand-yellow/10' : 'border-gray-200 bg-white hover:border-brand-navy/30'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span className="font-semibold text-brand-navy block">{label}</span>
      {hint && <span className="text-sm text-gray-500 mt-0.5 block">{hint}</span>}
    </label>
  )
}

'use client'

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { FunnelTruckTypeIcon, FunnelUsageIcon } from '@/components/icons/funnel/FunnelOptionIcons'
import { QualifySpeedometerIcon } from '@/components/icons/QualifySpeedometerIcon'
import {
  DEFAULT_FUNNEL_COVERAGE,
  RECOMMENDED_COVERAGE,
  buildMatchSummary,
  computeQualificationScore,
  evaluateWarrantyQualification,
  HD_MAX_AGE_YEARS,
  qualificationEyebrow,
  qualificationHeadline,
  qualificationSubhead,
  scoreToStarCount,
  TRUCK_TYPE_OPTIONS,
  USAGE_OPTIONS,
  type CoveragePriority,
  type LeadRequestType,
  type QualificationTier,
  type TruckType,
  type TruckUsage,
} from '@/lib/warranty-qualify'

const TOTAL_STEPS = 5
const AUTO_ADVANCE_MS = 300
const MATCHING_MS = 1500

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
  coverage: CoveragePriority
}

type ContactPhase = 'matching' | 'contact'

export function WarrantyQualifyQuiz() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: HD_MAX_AGE_YEARS + 1 }, (_, i) => currentYear - i)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [step, setStep] = useState(0)
  const [contactPhase, setContactPhase] = useState<ContactPhase>('matching')
  const [answers, setAnswers] = useState<FunnelAnswers>({
    truckType: '',
    year: '',
    make: '',
    model: '',
    mileage: '',
    usage: '',
    coverage: DEFAULT_FUNNEL_COVERAGE,
  })
  const [contact, setContact] = useState({ firstName: '', email: '', phone: '' })
  const [website, setWebsite] = useState('')
  const [tier, setTier] = useState<QualificationTier>('maybe')
  const [qualificationScore, setQualificationScore] = useState(82)
  const [summary, setSummary] = useState<string[]>([])
  const [deliveryNote, setDeliveryNote] = useState('Check your email for qualification details.')
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

  useEffect(() => {
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (step !== 4 || contactPhase !== 'matching') return
    const timer = setTimeout(() => setContactPhase('contact'), MATCHING_MS)
    return () => clearTimeout(timer)
  }, [step, contactPhase])

  const progressPct = step >= TOTAL_STEPS ? 100 : ((step + 1) / TOTAL_STEPS) * 100

  const evaluateAndScore = useCallback((nextAnswers: FunnelAnswers) => {
    const parsedYear = parseInt(nextAnswers.year, 10)
    const parsedMileage = parseInt(nextAnswers.mileage.replace(/,/g, ''), 10) || 0
    const result = evaluateWarrantyQualification({
      year: parsedYear,
      mileage: parsedMileage,
      truckType: nextAnswers.truckType as TruckType,
    })
    setTier(result)
    setQualificationScore(
      computeQualificationScore({
        tier: result,
        year: parsedYear,
        mileage: parsedMileage,
        truckType: nextAnswers.truckType as TruckType,
        coverage: nextAnswers.coverage,
      }),
    )
    return result
  }, [])

  function goNext(fromStep = step, answerOverrides?: Partial<FunnelAnswers>) {
    setError(null)
    const a = { ...answers, ...answerOverrides }
    if (fromStep === 1 && !a.truckType) return
    if (fromStep === 2) {
      if (!a.year || !a.make.trim() || !a.model.trim() || !a.mileage.trim()) return
    }
    if (fromStep === 3 && !a.usage) return

    setStep((s) => Math.min(s + 1, TOTAL_STEPS))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setError(null)
    if (step === 4) {
      setContactPhase('matching')
    }
    setStep((s) => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function scheduleAutoAdvance(fromStep: number, answerOverrides: Partial<FunnelAnswers>) {
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    advanceTimerRef.current = setTimeout(
      () => goNext(fromStep, answerOverrides),
      AUTO_ADVANCE_MS,
    )
  }

  function selectTruckType(value: TruckType) {
    const patch = { truckType: value }
    setAnswers((a) => ({ ...a, ...patch }))
    scheduleAutoAdvance(1, patch)
  }

  function selectUsage(value: TruckUsage) {
    const patch = { usage: value, coverage: DEFAULT_FUNNEL_COVERAGE }
    const nextAnswers = { ...answers, ...patch }
    setAnswers(nextAnswers)
    evaluateAndScore(nextAnswers)
    setContactPhase('matching')
    if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    advanceTimerRef.current = setTimeout(() => {
      setStep(4)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, AUTO_ADVANCE_MS)
  }

  async function submitLead(requestType: LeadRequestType) {
    setError(null)
    if (website.trim()) return
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
          coverage: answers.coverage,
          tier: data.tier || tier,
        })

      setSummary(matchSummary)
      setDeliveryNote(
        requestType === 'call'
          ? 'A warranty specialist will call you shortly to review your qualification.'
          : 'Check your email for qualification details and next steps.',
      )
      setStep(5)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const rigLabel =
    answers.year && answers.make && answers.model
      ? `${answers.year} ${answers.make} ${answers.model}`
      : 'your truck'

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
            <h2 className="text-2xl font-bold text-brand-navy mb-3">
              Let&apos;s see if your truck qualifies for coverage
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Answer a few quick questions about your rig. We&apos;ll check whether you qualify for{' '}
              <strong>extended warranty coverage</strong> — free and no obligation.
            </p>
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
              Heavy duty: up to 20 years old, under 1,000,000 miles. Medium duty: 15 years or newer,
              under 500,000 miles.
            </p>
          </div>
          <button type="button" className="btn-primary w-full py-3.5" onClick={() => goNext(0)}>
            Check my eligibility
          </button>
          <StepIndicator n={1} />
        </section>
      )}

      {step === 1 && (
        <section className="warranty-funnel-step">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">What type of truck?</h2>
          <div className="grid gap-2 mb-6">
            {TRUCK_TYPE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                name="truckType"
                value={opt.value}
                checked={answers.truckType === opt.value}
                onChange={() => selectTruckType(opt.value)}
                label={opt.label}
                hint={opt.hint}
                icon={<FunnelTruckTypeIcon value={opt.value} className="funnel-option-icon" />}
              />
            ))}
          </div>
          <BackButton onBack={goBack} />
          <StepIndicator n={2} />
        </section>
      )}

      {step === 2 && (
        <section className="warranty-funnel-step">
          <h2 className="text-2xl font-bold text-brand-navy mb-2">Tell us about your rig</h2>
          <p className="text-sm text-gray-500 mb-4">Select year, then enter make, model, and mileage.</p>
          <div className="space-y-4 mb-6">
            <Field label="Year">
              <div className="grid max-h-48 grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4">
                {years.map((y) => {
                  const selected = answers.year === String(y)
                  return (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, year: String(y) }))}
                      className={`funnel-year-btn rounded-xl border-2 px-2 py-2.5 text-sm font-semibold transition-colors ${
                        selected
                          ? 'border-brand-yellow bg-brand-yellow/10 text-brand-navy'
                          : 'border-gray-200 bg-white text-brand-navy hover:border-brand-navy/30'
                      }`}
                    >
                      {y}
                    </button>
                  )
                })}
              </div>
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
          <NavButtons onBack={goBack} onNext={() => goNext(2)} />
          <StepIndicator n={3} />
        </section>
      )}

      {step === 3 && (
        <section className="warranty-funnel-step">
          <h2 className="text-2xl font-bold text-brand-navy mb-4">How is the truck utilized?</h2>
          <div className="grid gap-2 mb-6">
            {USAGE_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                name="usage"
                value={opt.value}
                checked={answers.usage === opt.value}
                onChange={() => selectUsage(opt.value)}
                label={opt.label}
                icon={<FunnelUsageIcon value={opt.value} className="funnel-option-icon" />}
              />
            ))}
          </div>
          <BackButton onBack={goBack} />
          <StepIndicator n={4} />
        </section>
      )}

      {step === 4 && contactPhase === 'matching' && (
        <section
          className="warranty-funnel-step funnel-matching flex flex-col items-center justify-center gap-4 py-16 text-center"
          aria-live="polite"
        >
          <div
            className="h-10 w-10 animate-spin rounded-full border-2 border-brand-yellow/30 border-t-brand-yellow"
            aria-hidden
          />
          <h2 className="text-2xl font-bold text-brand-navy">Checking your eligibility…</h2>
          <p className="max-w-xs text-sm text-gray-600">
            Reviewing coverage options for {rigLabel}.
          </p>
          <StepIndicator n={5} />
        </section>
      )}

      {step === 4 && contactPhase === 'contact' && (
        <section className="warranty-funnel-step funnel-contact-reveal">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-brand-navy mb-2">
              Where should we send your qualification?
            </h2>
            <p className="text-gray-600">
              {tier === 'unlikely'
                ? `Your results for ${rigLabel} are ready. A specialist can review other options.`
                : `Good news — ${rigLabel} looks eligible. Enter your details for a free qualification.`}
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 text-red-900 text-sm px-4 py-3 border border-red-100 mb-4" role="alert">
              {error}
            </p>
          )}

          <div className="absolute left-[-9999px] h-0 w-0 overflow-hidden" aria-hidden>
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

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
              {submitting ? 'Submitting…' : 'Get my free qualification'}
            </button>
            <button
              type="button"
              disabled={submitting}
              className="text-sm text-brand-navy hover:underline w-full disabled:opacity-60"
              onClick={() => submitLead('call')}
            >
              Prefer a call? Request a callback
            </button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-gray-500">
            By continuing, you agree to be contacted about warranty coverage options. No obligation to buy.
          </p>

          <button type="button" className="mt-4 text-sm text-gray-500 hover:text-brand-navy w-full" onClick={goBack}>
            ← Back
          </button>
          <StepIndicator n={5} />
        </section>
      )}

      {step === 5 && (
        <section className="warranty-funnel-step text-center">
          <div
            className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
              tier === 'likely' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              {tier === 'likely' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 5a7 7 0 100 14 7 7 0 000-14z" />
              )}
            </svg>
          </div>

          <p className="text-sm font-semibold uppercase tracking-wide text-brand-yellow">{qualificationEyebrow(tier)}</p>
          <h2 className="text-2xl font-bold text-brand-navy mt-2 mb-1">{qualificationHeadline(tier)}</h2>
          <p className="text-lg font-semibold text-brand-navy">Score = {qualificationScore}/100</p>
          <MatchStars count={scoreToStarCount(qualificationScore)} />
          <p className="mx-auto mt-2 mb-4 max-w-sm text-xs italic leading-relaxed text-gray-500">
            Based on your rig age, mileage, and usage
          </p>
          <p className="text-gray-600 mb-6">
            {qualificationSubhead(tier)} {deliveryNote}
          </p>

          {tier === 'likely' && (
            <div className="text-left rounded-xl border-2 border-brand-yellow/40 bg-brand-yellow/5 p-5 mb-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-navy/70 mb-1">
                Recommended plan
              </p>
              <h3 className="font-bold text-brand-navy text-lg mb-2">{RECOMMENDED_COVERAGE.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{RECOMMENDED_COVERAGE.tagline}</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                {RECOMMENDED_COVERAGE.highlights.map((line) => (
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
            A warranty specialist will follow up to confirm eligibility, pricing, and term options. This is not
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

function MatchStars({ count }: { count: number }) {
  return (
    <div className="mt-3 flex justify-center gap-0.5 text-brand-yellow" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, index) => (
        <svg
          key={index}
          className={`h-5 w-5 ${index < count ? 'fill-current' : 'fill-none stroke-current opacity-30'}`}
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
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

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button type="button" className="btn-secondary w-full sm:w-auto px-6" onClick={onBack}>
      Back
    </button>
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

function Field({ label, children }: { label: string; children: ReactNode }) {
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
  icon,
}: {
  name: string
  value: string
  checked: boolean
  onChange: () => void
  label: string
  hint?: string
  icon: ReactNode
}) {
  return (
    <label
      className={`funnel-option-card block cursor-pointer rounded-xl border-2 transition-colors ${
        checked ? 'border-brand-yellow bg-brand-yellow/10' : 'border-gray-200 bg-white hover:border-brand-navy/30'
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span className="funnel-option-card-content">
        <span className={`funnel-option-icon-wrap ${checked ? 'is-selected' : ''}`}>{icon}</span>
        <span className="funnel-option-text">
          <span className="font-semibold text-brand-navy block">{label}</span>
          {hint && <span className="text-sm text-gray-500 mt-0.5 block">{hint}</span>}
        </span>
      </span>
    </label>
  )
}

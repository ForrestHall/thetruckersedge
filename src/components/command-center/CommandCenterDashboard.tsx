'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useMemo, useState, type ReactNode } from 'react'
import type { OwnerOperator } from '@/payload-types'
import { estimatedTotalCostPerMile } from '@/lib/command-center-costs'

type Props = { initial: OwnerOperator }

const inputClass =
  'w-full min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy'

/** Keeps grid columns aligned; without min-w-0, flex/grid children overflow and break layout. */
function Field({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1.5 min-w-0 ${className}`}>
      <label className="text-sm font-medium text-gray-700 leading-snug">{label}</label>
      {children}
    </div>
  )
}

export function CommandCenterDashboard({ initial }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const [displayName, setDisplayName] = useState(initial.displayName || '')
  const [homeBaseCity, setHomeBaseCity] = useState(initial.homeBaseCity || '')
  const [homeBaseState, setHomeBaseState] = useState((initial.homeBaseState || '').toUpperCase().slice(0, 2))
  const [frequentLanes, setFrequentLanes] = useState(initial.frequentLanes || '')
  const [truckMake, setTruckMake] = useState(initial.truckMake || '')
  const [truckModel, setTruckModel] = useState(initial.truckModel || '')
  const [truckYear, setTruckYear] = useState(initial.truckYear != null ? String(initial.truckYear) : '')
  const [fuelCostPerMile, setFuelCostPerMile] = useState(
    initial.fuelCostPerMile != null ? String(initial.fuelCostPerMile) : '',
  )
  const [maintenanceCostPerMile, setMaintenanceCostPerMile] = useState(
    initial.maintenanceCostPerMile != null ? String(initial.maintenanceCostPerMile) : '',
  )
  const [insuranceMonthly, setInsuranceMonthly] = useState(
    initial.insuranceMonthly != null ? String(initial.insuranceMonthly) : '',
  )
  const [otherMonthly, setOtherMonthly] = useState(initial.otherMonthly != null ? String(initial.otherMonthly) : '')
  const [avgMilesPerMonth, setAvgMilesPerMonth] = useState(
    initial.avgMilesPerMonth != null ? String(initial.avgMilesPerMonth) : '8500',
  )

  const totalPerMile = useMemo(() => {
    return estimatedTotalCostPerMile({
      fuelCostPerMile: parseFloat(fuelCostPerMile) || 0,
      maintenanceCostPerMile: parseFloat(maintenanceCostPerMile) || 0,
      insuranceMonthly: parseFloat(insuranceMonthly) || 0,
      otherMonthly: parseFloat(otherMonthly) || 0,
      avgMilesPerMonth: parseInt(avgMilesPerMonth, 10) || 0,
    })
  }, [fuelCostPerMile, maintenanceCostPerMile, insuranceMonthly, otherMonthly, avgMilesPerMonth])

  const mechanicsHref =
    homeBaseState && /^[A-Z]{2}$/.test(homeBaseState) ? `/mechanics?state=${homeBaseState}` : '/mechanics'

  async function logout() {
    await fetch('/api/owner-operators/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
    router.push('/command-center/login')
    router.refresh()
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg(null)
    setErr(null)
    const yearNum = truckYear.trim() ? parseInt(truckYear, 10) : undefined
    const body: Record<string, unknown> = {
      displayName: displayName.trim() || null,
      homeBaseCity: homeBaseCity.trim() || null,
      homeBaseState: homeBaseState.trim() || null,
      frequentLanes: frequentLanes.trim() || null,
      truckMake: truckMake.trim() || null,
      truckModel: truckModel.trim() || null,
      truckYear: yearNum != null && !Number.isNaN(yearNum) ? yearNum : null,
      fuelCostPerMile: fuelCostPerMile.trim() ? parseFloat(fuelCostPerMile) : null,
      maintenanceCostPerMile: maintenanceCostPerMile.trim() ? parseFloat(maintenanceCostPerMile) : null,
      insuranceMonthly: insuranceMonthly.trim() ? parseFloat(insuranceMonthly) : null,
      otherMonthly: otherMonthly.trim() ? parseFloat(otherMonthly) : null,
      avgMilesPerMonth: avgMilesPerMonth.trim() ? parseInt(avgMilesPerMonth, 10) : 8500,
    }

    try {
      const res = await fetch(`/api/owner-operators/${initial.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = (await res.json().catch(() => ({}))) as { message?: string; errors?: { message?: string }[] }
      if (!res.ok) {
        setErr(data.errors?.[0]?.message || data.message || 'Could not save')
        setSaving(false)
        return
      }
      setSaveMsg('Saved.')
      setSaving(false)
      router.refresh()
    } catch {
      setErr('Network error')
      setSaving(false)
    }
  }

  const greeting = displayName.trim() || 'there'

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Command center</h1>
          <p className="text-gray-600 mt-1">
            Hi {greeting} — your saved truck, lanes, and cost assumptions in one place.
          </p>
        </div>
        <button type="button" onClick={logout} className="btn-secondary text-sm !py-2 !px-4 self-start">
          Log out
        </button>
      </div>

      <section className="card p-6 border-2 border-brand-navy/10 bg-brand-gray/30">
        <h2 className="text-lg font-bold text-brand-navy mb-2">Mobile app roadmap</h2>
        <p className="text-sm text-gray-700 leading-relaxed">
          This hub is built so we can ship <strong>iOS / Android</strong> later without redoing your data: same{' '}
          <code className="text-xs bg-white/80 px-1 rounded">owner-operators</code> account, login API, and profile
          fields. Next steps for native apps: secure token storage, optional <strong>GET /api/command-center/me</strong>{' '}
          JSON profile, push reminders (IFTA quarters, PM intervals), and offline-first edits that sync when you&apos;re
          back on network.
        </p>
      </section>

      {totalPerMile != null && (
        <section className="card p-6 bg-white border border-gray-200">
          <h2 className="text-lg font-bold text-brand-navy mb-1">Estimated operating cost / mile</h2>
          <p className="text-sm text-gray-500 mb-3">Planning number only — not tax, legal, or load-level profit.</p>
          <p className="text-3xl font-extrabold text-brand-navy">${totalPerMile.toFixed(3)}</p>
          <p className="text-xs text-gray-500 mt-2">
            Fuel + maintenance reserve + (insurance + other fixed) ÷ avg monthly miles.
          </p>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold text-brand-navy mb-4">Quick tools</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 items-stretch">
          <li className="min-w-0 flex">
            <Link
              href="/tools/service-intervals"
              className="card flex h-full w-full min-h-[3.25rem] min-w-0 items-center p-4 hover:shadow-md no-underline text-brand-navy font-semibold"
            >
              Service intervals
            </Link>
          </li>
          <li className="min-w-0 flex">
            <Link
              href="/tools/ifta-calculator"
              className="card flex h-full w-full min-h-[3.25rem] min-w-0 items-center p-4 hover:shadow-md no-underline text-brand-navy font-semibold"
            >
              IFTA calculator
            </Link>
          </li>
          <li className="min-w-0 flex">
            <Link
              href="/tools/per-diem-calculator"
              className="card flex h-full w-full min-h-[3.25rem] min-w-0 items-center p-4 hover:shadow-md no-underline text-brand-navy font-semibold"
            >
              Per diem calculator
            </Link>
          </li>
          <li className="min-w-0 flex">
            <Link
              href="/tools/truck-warranty-reviews"
              className="card flex h-full w-full min-h-[3.25rem] min-w-0 items-center p-4 hover:shadow-md no-underline text-brand-navy font-semibold"
            >
              Warranty buyer&apos;s guide
            </Link>
          </li>
          <li className="min-w-0 flex">
            <Link
              href="/tools/warranty-quote"
              className="card flex h-full w-full min-h-[3.25rem] min-w-0 items-center p-4 hover:shadow-md no-underline text-brand-navy font-semibold"
            >
              Warranty quote
            </Link>
          </li>
          <li className="min-w-0 flex">
            <Link
              href={mechanicsHref}
              className="card flex h-full w-full min-h-[3.25rem] min-w-0 items-center p-4 hover:shadow-md no-underline text-brand-navy font-semibold"
            >
              Diesel mechanic directory{homeBaseState && /^[A-Z]{2}$/.test(homeBaseState) ? ` (${homeBaseState})` : ''}
            </Link>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold text-brand-navy mb-4">Your profile</h2>
        <form onSubmit={onSave} className="card p-6 sm:p-8 max-w-full overflow-hidden">
          <div className="space-y-8">
            {saveMsg && (
              <p className="text-sm text-green-800 bg-green-50 border border-green-100 rounded-lg px-3 py-2" role="status">
                {saveMsg}
              </p>
            )}
            {err && (
              <p className="text-sm text-red-800 bg-red-50 border border-red-100 rounded-lg px-3 py-2" role="alert">
                {err}
              </p>
            )}

            <Field label="Display name">
              <input className={inputClass} value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 items-start">
              <Field label="Home base city">
                <input className={inputClass} value={homeBaseCity} onChange={(e) => setHomeBaseCity(e.target.value)} />
              </Field>
              <Field label="Home state">
                <input
                  className={`${inputClass} sm:max-w-[8rem]`}
                  value={homeBaseState}
                  onChange={(e) => setHomeBaseState(e.target.value.toUpperCase().slice(0, 2))}
                  maxLength={2}
                  placeholder="TX"
                  title="Two-letter state code"
                />
                <span className="text-xs text-gray-500">2-letter code</span>
              </Field>
            </div>

            <Field label="Frequent lanes / regions">
              <textarea
                className={inputClass}
                rows={3}
                value={frequentLanes}
                onChange={(e) => setFrequentLanes(e.target.value)}
              />
            </Field>

            <div className="border-t border-gray-100 pt-8 space-y-6">
              <h3 className="text-base font-semibold text-gray-900">Truck</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-6 items-start">
                <Field label="Make">
                  <input
                    className={inputClass}
                    value={truckMake}
                    onChange={(e) => setTruckMake(e.target.value)}
                    placeholder="Freightliner"
                  />
                </Field>
                <Field label="Model / engine">
                  <input className={inputClass} value={truckModel} onChange={(e) => setTruckModel(e.target.value)} />
                </Field>
                <Field label="Year">
                  <input
                    className={`${inputClass} sm:max-w-[7rem]`}
                    value={truckYear}
                    onChange={(e) => setTruckYear(e.target.value)}
                    inputMode="numeric"
                  />
                </Field>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 space-y-6">
              <h3 className="text-base font-semibold text-gray-900">Cost assumptions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 items-start">
                <Field label="Fuel ($/mile)">
                  <input
                    className={inputClass}
                    value={fuelCostPerMile}
                    onChange={(e) => setFuelCostPerMile(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Maintenance reserve ($/mile)">
                  <input
                    className={inputClass}
                    value={maintenanceCostPerMile}
                    onChange={(e) => setMaintenanceCostPerMile(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Insurance ($/month)">
                  <input
                    className={inputClass}
                    value={insuranceMonthly}
                    onChange={(e) => setInsuranceMonthly(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Other fixed ($/month)">
                  <input
                    className={inputClass}
                    value={otherMonthly}
                    onChange={(e) => setOtherMonthly(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
                <Field label="Avg miles / month" className="sm:col-span-2">
                  <input
                    className={`${inputClass} sm:max-w-[12rem]`}
                    value={avgMilesPerMonth}
                    onChange={(e) => setAvgMilesPerMonth(e.target.value)}
                    inputMode="numeric"
                  />
                </Field>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? 'Saving…' : 'Save profile'}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  )
}

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

  const quickTools = [
    {
      href: '/tools/service-intervals',
      title: 'Service intervals',
      desc: 'PM reminders by truck age and miles.',
    },
    {
      href: '/tools/ifta-calculator',
      title: 'IFTA calculator',
      desc: 'Rough fuel-tax estimates by jurisdiction.',
    },
    {
      href: '/tools/per-diem-calculator',
      title: 'Per diem calculator',
      desc: 'Meals & incidental expense planning.',
    },
    {
      href: '/tools/truck-warranty-reviews',
      title: "Warranty buyer's guide",
      desc: 'Coverage angles before you buy.',
    },
    {
      href: '/tools/warranty-quote',
      title: 'Warranty quote',
      desc: 'Request a follow-up on extended coverage.',
    },
    {
      href: mechanicsHref,
      title: `Diesel mechanics${homeBaseState && /^[A-Z]{2}$/.test(homeBaseState) ? ` (${homeBaseState})` : ''}`,
      desc: 'Shops filtered from your home state when set.',
    },
  ] as const

  return (
    <div className="space-y-10 sm:space-y-12">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-gray-200/90 pb-8">
        <div className="space-y-2 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-navy/70">Owner-operator hub</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-navy tracking-tight">Command center</h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl leading-relaxed">
            Hi {greeting} — your truck, lanes, and cost assumptions stay here for the tools you use every week.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="btn-secondary text-sm shrink-0 self-start lg:self-auto !py-2.5 !px-5"
        >
          Log out
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-8 space-y-10 min-w-0">
          <section aria-labelledby="quick-tools-heading">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <h2 id="quick-tools-heading" className="text-xl font-bold text-brand-navy">
                Quick tools
              </h2>
              <p className="text-sm text-gray-500 max-w-md">
                Jump into calculators and directories using the profile you save below.
              </p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {quickTools.map((t) => (
                <li key={t.href} className="min-w-0">
                  <Link
                    href={t.href}
                    className="group card flex h-full min-h-[5.5rem] flex-col justify-center gap-1 border border-gray-100 p-4 sm:p-5 no-underline transition-all hover:border-brand-navy/25 hover:shadow-md"
                  >
                    <span className="font-semibold text-brand-navy group-hover:text-brand-navy">{t.title}</span>
                    <span className="text-sm text-gray-500 leading-snug">{t.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="profile-heading">
            <h2 id="profile-heading" className="text-xl font-bold text-brand-navy mb-4">
              Your profile
            </h2>
            <form onSubmit={onSave} className="card p-6 sm:p-8 max-w-full overflow-hidden border border-gray-100 shadow-sm">
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

        <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-24 min-w-0">
          {totalPerMile != null && (
            <div className="card overflow-hidden border border-brand-navy/15 bg-gradient-to-br from-white to-slate-50/90 shadow-sm">
              <div className="border-b border-gray-100 bg-brand-navy/[0.04] px-5 py-3">
                <h2 className="text-sm font-bold uppercase tracking-wide text-brand-navy/90">
                  Est. operating cost / mile
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Planning only — not tax, legal, or load profit.</p>
              </div>
              <div className="px-5 py-5">
                <p className="text-4xl font-extrabold text-brand-navy tracking-tight">${totalPerMile.toFixed(3)}</p>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  Fuel + maintenance reserve + (insurance + other fixed) ÷ avg monthly miles from your profile.
                </p>
              </div>
            </div>
          )}

          <details className="card border border-gray-100 group open:shadow-sm">
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-brand-navy flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
              <span>Mobile app roadmap</span>
              <span
                className="text-gray-400 text-xs font-medium group-open:rotate-180 transition-transform"
                aria-hidden
              >
                ▾
              </span>
            </summary>
            <div className="px-5 pb-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-50">
              <p className="pt-4">
                Built so we can ship <strong>iOS / Android</strong> later without redoing your data: same{' '}
                <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">owner-operators</code>{' '}
                account, login API, and profile fields. Next steps: secure token storage, optional{' '}
                <strong>GET /api/command-center/me</strong>, push reminders (IFTA, PM intervals), and offline-first edits
                that sync when you&apos;re back on network.
              </p>
            </div>
          </details>
        </aside>
      </div>
    </div>
  )
}

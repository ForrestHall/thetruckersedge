'use client'

import { useState } from 'react'
import {
  PLATFORMS,
  PLATFORM_OPTIONS,
  MAINTENANCE_PHASES,
  type PlatformKey,
  type ServiceItem,
} from '@/data/service-intervals'

type IdleLevel = 'low' | 'medium' | 'high'

function applySevereService(interval: string): string {
  return interval.replace(/\d{1,3}(?:,\d{3})*/g, (match) => {
    const num = parseInt(match.replace(/,/g, ''), 10)
    return Math.round(num * 0.6).toLocaleString()
  })
}

function applyIdleAdjustment(interval: string, subtractMiles: number): string {
  return interval.replace(/\d{1,3}(?:,\d{3})*/g, (match) => {
    const num = parseInt(match.replace(/,/g, ''), 10)
    const adjusted = Math.max(0, num - subtractMiles)
    return adjusted.toLocaleString()
  })
}

function formatInterval(item: ServiceItem, severeService: boolean, idleHigh: boolean): string {
  let interval = item.interval
  if (severeService) {
    interval = applySevereService(interval)
  }
  if (idleHigh && item.isDpf) {
    interval = applyIdleAdjustment(interval, 50000)
  }
  return interval
}

const IDLE_HOURS_TO_MILES = 25

export function ServiceIntervalCalculator() {
  const [platform, setPlatform] = useState<PlatformKey | ''>('')
  const [severeService, setSevereService] = useState(false)
  const [idleLevel, setIdleLevel] = useState<IdleLevel>('low')
  const [truckMiles, setTruckMiles] = useState('')
  const [idleHours, setIdleHours] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const idleHigh = idleLevel === 'medium' || idleLevel === 'high'
  const platformData = platform ? PLATFORMS[platform] : null
  const miles = parseFloat(truckMiles.replace(/,/g, '')) || 0
  const hours = parseFloat(idleHours.replace(/,/g, '')) || 0
  const equivalentDpfMiles = hours * IDLE_HOURS_TO_MILES
  const show400kWarning = miles >= 400000

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (platform) setHasSearched(true)
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="platform" className="block text-sm font-semibold text-brand-navy mb-2">
            Engine Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform((e.target.value || '') as PlatformKey | '')}
            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-brand-navy"
            required
          >
            <option value="">Select your engine...</option>
            {PLATFORM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={severeService}
              onChange={(e) => setSevereService(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-brand-yellow focus:ring-brand-yellow"
            />
            <span className="text-sm font-medium text-brand-navy">
              Severe Service (heavy haul, logging, high-idle city) — intervals reduced 40%
            </span>
          </label>
        </div>

        <div>
          <label htmlFor="idle" className="block text-sm font-semibold text-brand-navy mb-2">
            Idle Time Factor
          </label>
          <select
            id="idle"
            value={idleLevel}
            onChange={(e) => setIdleLevel(e.target.value as IdleLevel)}
            className="w-full sm:w-auto min-w-[200px] px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-brand-navy"
          >
            <option value="low">Under 30% (normal)</option>
            <option value="medium">30–50% (moderate idle)</option>
            <option value="high">Over 50% (high idle)</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">
            1 hour of idling ≈ 25 miles of driving. High idle increases DPF loading.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="truckMiles" className="block text-sm font-semibold text-brand-navy mb-2">
              Truck Mileage (optional)
            </label>
            <input
              id="truckMiles"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 350000"
              value={truckMiles}
              onChange={(e) => setTruckMiles(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-brand-navy"
            />
            <p className="text-sm text-gray-500 mt-1">Used for high-mileage warnings.</p>
          </div>
          <div>
            <label htmlFor="idleHours" className="block text-sm font-semibold text-brand-navy mb-2">
              Total Idle Hours (optional)
            </label>
            <input
              id="idleHours"
              type="text"
              inputMode="numeric"
              placeholder="e.g. 5000"
              value={idleHours}
              onChange={(e) => setIdleHours(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-brand-navy"
            />
            <p className="text-sm text-gray-500 mt-1">Idle Hour Converter: shows equivalent DPF wear.</p>
          </div>
        </div>

        <button type="submit" className="btn-primary px-6 py-3">
          Get Intervals
        </button>
      </form>

      {hasSearched && platformData && (
        <div className="space-y-6">
          {hours > 0 && (
            <div className="card p-6 bg-brand-gray">
              <h3 className="font-semibold text-brand-navy mb-2">Idle Hour Converter</h3>
              <p className="text-sm text-gray-700">
                Your truck has <strong>{hours.toLocaleString()}</strong> idle hours. This is equivalent to{' '}
                <strong>{equivalentDpfMiles.toLocaleString()} extra miles</strong> of wear on your DPF.
              </p>
            </div>
          )}

          {show400kWarning && (
            <div className="card p-6 border-2 border-amber-400 bg-amber-50">
              <h3 className="font-semibold text-amber-900 mb-2">⚠️ Check Engine Warning</h3>
              <p className="text-sm text-amber-900 mb-4">
                At 400k+ miles, your Turbo and Water Pump are in the &quot;Failure Zone.&quot; Is your warranty still active?
              </p>
              <a href="/#email-capture" className="btn-primary inline-block">
                Get a Quote
              </a>
            </div>
          )}

          <div className="card p-6">
            <h2 className="text-xl font-bold text-brand-navy mb-1">{platformData.name}</h2>
            {platformData.subtitle && (
              <p className="text-sm text-gray-500 mb-2">{platformData.subtitle}</p>
            )}
            {platformData.fluidSpec && (
              <p className="text-sm font-medium text-brand-navy mb-6">
                Recommended oil: <span className="text-brand-yellow">{platformData.fluidSpec}</span>
              </p>
            )}

            {idleHigh && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  <strong>Idle advisory:</strong> 1 hour of idling ≈ 25 miles. If you idle more than 30%, move DPF
                  cleaning up by 50,000 miles. Intervals below reflect this adjustment for DPF.
                </p>
              </div>
            )}

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-brand-navy">System</th>
                    <th className="px-4 py-3 font-semibold text-brand-navy">Recommended Interval</th>
                    <th className="px-4 py-3 font-semibold text-brand-navy">Tech Note</th>
                  </tr>
                </thead>
                <tbody>
                  {platformData.items.map((item, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="px-4 py-3 font-medium text-brand-navy">{item.system}</td>
                      <td className="px-4 py-3 text-gray-800">
                        {formatInterval(item, severeService, idleHigh)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{item.techNote}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm font-semibold text-amber-900 mb-1">⚠️ Warranty Warning</p>
              <p className="text-sm text-amber-900">
                Most aftermarket warranties (and OEM extensions) require documented proof of these services.
                Missing a 100k-mile overhead adjustment can result in a denied claim for a dropped valve.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-brand-navy">General Maintenance Guide</h2>
            {MAINTENANCE_PHASES.map((phase) => (
              <div key={phase.id} className="card p-6">
                <h3 className="text-lg font-bold text-brand-navy mb-2">{phase.title}</h3>
                {phase.subtitle && (
                  <p className="text-sm text-gray-600 mb-4">{phase.subtitle}</p>
                )}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 font-semibold text-brand-navy">Component</th>
                        <th className="px-4 py-3 font-semibold text-brand-navy">Standard Interval</th>
                        <th className="px-4 py-3 font-semibold text-brand-navy">Expert Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phase.items.map((item, i) => (
                        <tr key={i} className="border-t border-gray-100">
                          <td className="px-4 py-3 font-medium text-brand-navy">{item.component}</td>
                          <td className="px-4 py-3 text-gray-800">{item.interval}</td>
                          <td className="px-4 py-3 text-gray-600">{item.expertNote}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-12 bg-brand-gray rounded-xl">
          <p className="text-gray-600">Select your engine platform and click Get Intervals to see recommended service schedules.</p>
          <p className="text-sm text-gray-500 mt-2">
            Covers Detroit DD13/DD15, Cummins X15, PACCAR MX-13, and Volvo D13/Mack MP8 (2018–2026 models).
          </p>
        </div>
      )}
    </div>
  )
}

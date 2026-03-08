'use client'

import { useState } from 'react'

interface StateEntry {
  state: string
  miles: string
  gallons: string
}

const US_STATES = [
  'AL','AR','AZ','CA','CO','CT','DE','FL','GA','IA','ID','IL','IN','KS',
  'KY','LA','MA','MD','ME','MI','MN','MO','MS','MT','NC','ND','NE','NH',
  'NJ','NM','NV','NY','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT',
  'VA','VT','WA','WI','WV','WY',
]

const SAMPLE_TAX_RATES: Record<string, number> = {
  GA: 0.358, AL: 0.280, FL: 0.350, TN: 0.270, SC: 0.390,
  TX: 0.200, CA: 0.784, NY: 0.432, OH: 0.385, PA: 0.741,
}
const DEFAULT_RATE = 0.350

export function IFTACalculatorClient() {
  const [totalMiles, setTotalMiles] = useState('')
  const [totalGallons, setTotalGallons] = useState('')
  const [entries, setEntries] = useState<StateEntry[]>([
    { state: 'GA', miles: '', gallons: '' },
    { state: '', miles: '', gallons: '' },
  ])
  const [result, setResult] = useState<{
    avgMpg: number
    rows: { state: string; taxableGallons: number; taxRate: number; tax: number; fuelPurchased: number; net: number }[]
    totalNet: number
  } | null>(null)

  const addRow = () => setEntries([...entries, { state: '', miles: '', gallons: '' }])
  const removeRow = (i: number) => setEntries(entries.filter((_, idx) => idx !== i))

  const updateEntry = (i: number, field: keyof StateEntry, val: string) => {
    const updated = [...entries]
    updated[i] = { ...updated[i], [field]: val }
    setEntries(updated)
  }

  const calculate = () => {
    const tm = parseFloat(totalMiles) || 0
    const tg = parseFloat(totalGallons) || 0
    if (tm === 0 || tg === 0) return

    const avgMpg = tm / tg

    const rows = entries
      .filter((e) => e.state && parseFloat(e.miles) > 0)
      .map((e) => {
        const miles = parseFloat(e.miles) || 0
        const gallonsPurchased = parseFloat(e.gallons) || 0
        const taxableGallons = miles / avgMpg
        const taxRate = SAMPLE_TAX_RATES[e.state] || DEFAULT_RATE
        const tax = taxableGallons * taxRate
        const taxOnPurchased = gallonsPurchased * taxRate
        const net = taxOnPurchased - tax
        return {
          state: e.state,
          taxableGallons: Math.round(taxableGallons * 10) / 10,
          taxRate,
          tax: Math.round(tax * 100) / 100,
          fuelPurchased: gallonsPurchased,
          net: Math.round(net * 100) / 100,
        }
      })

    const totalNet = rows.reduce((sum, r) => sum + r.net, 0)
    setResult({ avgMpg: Math.round(avgMpg * 10) / 10, rows, totalNet: Math.round(totalNet * 100) / 100 })
  }

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      {/* Fleet totals */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Total Miles This Quarter (all states)
          </label>
          <input
            type="number"
            min="0"
            value={totalMiles}
            onChange={(e) => setTotalMiles(e.target.value)}
            placeholder="e.g. 30000"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-brand-yellow"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Total Gallons Purchased This Quarter
          </label>
          <input
            type="number"
            min="0"
            value={totalGallons}
            onChange={(e) => setTotalGallons(e.target.value)}
            placeholder="e.g. 5000"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-brand-yellow"
          />
        </div>
      </div>

      {/* Per-state entries */}
      <p className="text-sm font-semibold text-brand-navy mb-3">Miles & Fuel Purchased Per State</p>
      <div className="space-y-3 mb-4">
        {entries.map((entry, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-center">
            <select
              value={entry.state}
              onChange={(e) => updateEntry(i, 'state', e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow"
            >
              <option value="">State</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Miles"
              value={entry.miles}
              onChange={(e) => updateEntry(i, 'miles', e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow"
            />
            <input
              type="number"
              placeholder="Gallons bought"
              value={entry.gallons}
              onChange={(e) => updateEntry(i, 'gallons', e.target.value)}
              className="border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-yellow"
            />
            <button
              onClick={() => removeRow(i)}
              className="text-gray-400 hover:text-red-500 transition-colors text-lg font-bold"
              aria-label="Remove row"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addRow}
        className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark mb-8 block"
      >
        + Add another state
      </button>

      <button onClick={calculate} className="btn-primary w-full justify-center text-lg py-4 mb-8">
        Calculate IFTA Report
      </button>

      {result && (
        <div className="space-y-4">
          <div className="bg-brand-gray rounded-xl p-4 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-600">Fleet Average MPG</span>
            <span className="text-xl font-bold text-brand-navy">{result.avgMpg} mpg</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="pb-2 pr-4">State</th>
                  <th className="pb-2 pr-4">Taxable Gal.</th>
                  <th className="pb-2 pr-4">Tax Rate</th>
                  <th className="pb-2 pr-4">Tax Owed</th>
                  <th className="pb-2 pr-4">Already Paid</th>
                  <th className="pb-2 font-bold">Net</th>
                </tr>
              </thead>
              <tbody>
                {result.rows.map((row) => (
                  <tr key={row.state} className="border-b border-gray-100">
                    <td className="py-2 pr-4 font-bold text-brand-navy">{row.state}</td>
                    <td className="py-2 pr-4">{row.taxableGallons}</td>
                    <td className="py-2 pr-4">${row.taxRate.toFixed(3)}</td>
                    <td className="py-2 pr-4">{fmt(row.tax)}</td>
                    <td className="py-2 pr-4">{fmt(row.fuelPurchased * row.taxRate)}</td>
                    <td className={`py-2 font-bold ${row.net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {row.net >= 0 ? '+' : ''}{fmt(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`rounded-xl p-5 flex justify-between items-center ${result.totalNet >= 0 ? 'bg-green-50' : 'bg-red-50'}`}>
            <span className="font-bold text-gray-700">
              {result.totalNet >= 0 ? 'Total Refund / Credit' : 'Total Tax Owed'}
            </span>
            <span className={`text-2xl font-extrabold ${result.totalNet >= 0 ? 'text-green-700' : 'text-red-600'}`}>
              {result.totalNet >= 0 ? '+' : ''}{fmt(result.totalNet)}
            </span>
          </div>

          <p className="text-xs text-gray-400 text-center">
            Tax rates are approximate and change quarterly. Always verify current rates with your base state DMV before filing. This tool does not substitute for official IFTA reporting software.
          </p>
        </div>
      )}
    </div>
  )
}

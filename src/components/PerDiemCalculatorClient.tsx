'use client'

import { useState } from 'react'

const STANDARD_RATE = 80
const HIGH_COST_RATE = 86
const DEDUCTIBLE_PCT = 0.8
const PARTIAL_DAY_MULTIPLIER = 0.75

export function PerDiemCalculatorClient() {
  const [fullDays, setFullDays] = useState('')
  const [partialDays, setPartialDays] = useState('')
  const [highCostDays, setHighCostDays] = useState('')
  const [result, setResult] = useState<{
    totalAllowance: number
    deductibleAmount: number
    taxSavings: { bracket22: number; bracket24: number; bracket32: number }
  } | null>(null)

  const calculate = () => {
    const full = parseFloat(fullDays) || 0
    const partial = parseFloat(partialDays) || 0
    const highCost = parseFloat(highCostDays) || 0

    const standardFull = (full - highCost) * STANDARD_RATE
    const highCostFull = highCost * HIGH_COST_RATE
    const partialAmount = partial * STANDARD_RATE * PARTIAL_DAY_MULTIPLIER

    const totalAllowance = standardFull + highCostFull + partialAmount
    const deductibleAmount = totalAllowance * DEDUCTIBLE_PCT

    setResult({
      totalAllowance,
      deductibleAmount,
      taxSavings: {
        bracket22: deductibleAmount * 0.22,
        bracket24: deductibleAmount * 0.24,
        bracket32: deductibleAmount * 0.32,
      },
    })
  }

  const fmt = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Full Days Away from Home
          </label>
          <input
            type="number"
            min="0"
            value={fullDays}
            onChange={(e) => setFullDays(e.target.value)}
            placeholder="e.g. 200"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-brand-yellow"
          />
          <p className="text-xs text-gray-400 mt-1">Full 24-hour periods away</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Partial Days (departure/return)
          </label>
          <input
            type="number"
            min="0"
            value={partialDays}
            onChange={(e) => setPartialDays(e.target.value)}
            placeholder="e.g. 24"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-brand-yellow"
          />
          <p className="text-xs text-gray-400 mt-1">Days you departed or returned home</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-brand-navy mb-2">
            Days in High-Cost Areas
          </label>
          <input
            type="number"
            min="0"
            value={highCostDays}
            onChange={(e) => setHighCostDays(e.target.value)}
            placeholder="e.g. 30"
            className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 text-lg focus:outline-none focus:border-brand-yellow"
          />
          <p className="text-xs text-gray-400 mt-1">NYC, San Francisco, etc. ($86/day)</p>
        </div>
      </div>

      <button onClick={calculate} className="btn-primary w-full justify-center text-lg py-4 mb-8">
        Calculate My Deduction
      </button>

      {result && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-brand-gray rounded-xl p-5">
              <p className="text-sm text-gray-500 mb-1">Total Per Diem Allowance</p>
              <p className="text-3xl font-extrabold text-brand-navy">{fmt(result.totalAllowance)}</p>
            </div>
            <div className="bg-brand-yellow rounded-xl p-5">
              <p className="text-sm text-brand-navy/70 mb-1 font-medium">Your Deductible Amount (80%)</p>
              <p className="text-3xl font-extrabold text-brand-navy">{fmt(result.deductibleAmount)}</p>
            </div>
          </div>

          <div className="bg-brand-gray rounded-xl p-5">
            <p className="text-sm font-semibold text-brand-navy mb-3">Estimated Tax Savings by Bracket</p>
            <div className="space-y-2">
              {[
                { label: '22% bracket', amount: result.taxSavings.bracket22 },
                { label: '24% bracket', amount: result.taxSavings.bracket24 },
                { label: '32% bracket', amount: result.taxSavings.bracket32 },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm">
                  <span className="text-gray-600">{row.label}</span>
                  <span className="font-bold text-green-700">{fmt(row.amount)} saved</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center">
            This is an estimate only. Rates: $80/day standard, $86/day high-cost areas (2026 IRS rates). Consult a tax professional for your specific situation.
          </p>
        </div>
      )}
    </div>
  )
}

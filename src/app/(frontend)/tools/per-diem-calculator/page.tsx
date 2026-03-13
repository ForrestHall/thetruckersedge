import type { Metadata } from 'next'
import { PerDiemCalculatorClient } from '@/components/PerDiemCalculatorClient'
import { getBaseUrl } from '@/lib/media'

export const metadata: Metadata = {
  title: 'Truck Driver Per Diem Calculator — 2026 Tax Deduction',
  description:
    'Calculate your truck driver per diem tax deduction for 2026. See exactly how much you can deduct for meals and incidentals based on your days away from home.',
}

export default function PerDiemCalculatorPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <a href="/tools" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
          ← All Tools
        </a>
        <h1 className="text-3xl font-extrabold text-brand-navy mt-3 mb-3">Truck Driver Per Diem Calculator</h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Find out how much you can deduct for meals and incidentals in 2026. Most OTR drivers save $3,000–$7,000 per year using per diem properly.
        </p>
      </div>

      <PerDiemCalculatorClient />

      <div className="mt-12 bg-brand-gray rounded-2xl p-6">
        <h2 className="text-xl font-bold text-brand-navy mb-3">Per Diem for Truck Drivers — The Basics</h2>
        <div className="prose-truckers text-sm text-gray-600 space-y-3">
          <p>
            The IRS allows truck drivers subject to DOT hours-of-service rules to deduct <strong>80% of the federal per diem rate</strong> for meals and incidentals while away from home overnight.
          </p>
          <p>
            <strong>2026 standard rate:</strong> $80/day for most US locations · $86/day for high-cost areas. You can deduct 80% of these amounts.
          </p>
          <p>
            <strong>Full days away:</strong> The full rate applies. <strong>Partial days</strong> (departure/return days): 75% of the full rate.
          </p>
          <p>
            <strong>Important:</strong> This calculator provides an estimate. Always consult a tax professional or CPA for your specific situation.
          </p>
        </div>
      </div>
    </div>
  )
}

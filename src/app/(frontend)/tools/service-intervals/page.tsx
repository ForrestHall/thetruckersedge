import type { Metadata } from 'next'
import Link from 'next/link'
import { ServiceIntervalCalculator } from '@/components/ServiceIntervalCalculator'

export const metadata: Metadata = {
  title: 'Truck Service Intervals Calculator',
  description:
    'Look up maintenance intervals for your truck or engine. Covers Detroit DD13/DD15, Cummins X15, PACCAR MX-13, and Volvo D13/Mack MP8 (2018–2026).',
}

export default function ServiceIntervalsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <Link href="/tools" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
          ← All Tools
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-3 mb-3">Truck Service Intervals</h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Look up maintenance intervals for your truck or engine by platform. Select your engine (Detroit, Cummins,
          PACCAR, Volvo/Mack) and adjust for severe service or idle time.
        </p>
      </div>

      <ServiceIntervalCalculator />

      <div className="mt-12 bg-brand-gray rounded-2xl p-6">
        <h2 className="text-xl font-bold text-brand-navy mb-3">Why Service Intervals Matter</h2>
        <div className="prose-truckers text-sm text-gray-600 space-y-3">
          <p>
            Following manufacturer-recommended service intervals helps extend engine life, avoid costly repairs, and
            stay compliant with warranty requirements. Intervals vary by duty cycle (idle time, fuel economy), oil
            spec, and model year — always refer to your specific manual or the source PDF for full details.
          </p>
        </div>
      </div>
    </div>
  )
}

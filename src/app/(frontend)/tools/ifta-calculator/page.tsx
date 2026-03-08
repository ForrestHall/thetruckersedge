import type { Metadata } from 'next'
import { IFTACalculatorClient } from '@/components/IFTACalculatorClient'

export const metadata: Metadata = {
  title: 'IFTA Fuel Tax Calculator — Free Quarterly Filing Tool',
  description:
    'Calculate your IFTA fuel tax report for free. Enter miles driven by state and fuel purchased to get your net tax owed or credit per jurisdiction.',
}

export default function IFTACalculatorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <a href="/tools" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
          ← All Tools
        </a>
        <h1 className="text-3xl font-extrabold text-brand-navy mt-3 mb-3">IFTA Fuel Tax Calculator</h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Enter your total miles driven and fuel purchased per state for the quarter. We&apos;ll calculate your net IFTA tax owed or credit for each jurisdiction.
        </p>
      </div>

      <IFTACalculatorClient />

      <div className="mt-12 bg-brand-gray rounded-2xl p-6">
        <h2 className="text-xl font-bold text-brand-navy mb-3">How IFTA Works</h2>
        <div className="prose-truckers text-sm text-gray-600 space-y-3">
          <p>
            IFTA (International Fuel Tax Agreement) simplifies fuel tax reporting for commercial vehicles that operate in multiple US states and Canadian provinces.
          </p>
          <p>
            Instead of filing a separate tax return in every state you drive through, you file one quarterly report with your base state. Your base state then distributes the tax money to the other jurisdictions based on miles driven there.
          </p>
          <p>
            <strong>Who needs IFTA:</strong> Vehicles with 3+ axles, or 2 axles with a gross vehicle weight over 26,000 lbs, that operate in 2 or more IFTA jurisdictions.
          </p>
          <p>
            <strong>Filing deadlines:</strong> Q1 (Jan–Mar) due April 30 · Q2 (Apr–Jun) due July 31 · Q3 (Jul–Sep) due October 31 · Q4 (Oct–Dec) due January 31.
          </p>
        </div>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { WarrantyQualifyQuiz } from '@/components/WarrantyQualifyQuiz'
import { getBaseUrl } from '@/lib/media'

const path = '/tools/warranty-qualify'
const desc =
  'See if your truck qualifies for coverage in 60 seconds. Free eligibility check for America\'s Trucking Warranty Executive Plan — no obligation.'

export const metadata: Metadata = {
  title: 'See If Your Truck Qualifies for Coverage — Free Check',
  description: desc,
  alternates: { canonical: `${getBaseUrl()}${path}` },
  openGraph: {
    title: 'See If Your Truck Qualifies for Coverage | The Truckers Edge',
    description: desc,
    url: `${getBaseUrl()}${path}`,
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Truck Warranty Match — 60 Seconds' },
}

export default function WarrantyQualifyPage() {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-brand-gray/60 to-white">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-16 sm:pt-10">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/tools" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
            ← All Tools
          </Link>
          <Link href="/tools/warranty-quote" className="text-sm text-gray-500 hover:text-brand-navy">
            Full quote →
          </Link>
        </div>

        <WarrantyQualifyQuiz />
      </div>
    </div>
  )
}

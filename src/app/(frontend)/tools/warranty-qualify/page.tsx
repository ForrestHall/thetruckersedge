import type { Metadata } from 'next'
import Link from 'next/link'
import { WarrantyQualifyQuiz } from '@/components/WarrantyQualifyQuiz'
import { getBaseUrl } from '@/lib/media'

const path = '/tools/warranty-qualify'
const desc =
  'See if your commercial truck likely qualifies for extended warranty coverage. Quick eligibility check for owner-operators and fleet owners — free, no obligation.'

export const metadata: Metadata = {
  title: 'See If You Qualify for a Truck Warranty',
  description: desc,
  alternates: { canonical: `${getBaseUrl()}${path}` },
  openGraph: {
    title: 'See If You Qualify for a Truck Warranty | The Truckers Edge',
    description: desc,
    url: `${getBaseUrl()}${path}`,
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Truck Warranty Eligibility Check' },
}

export default function WarrantyQualifyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <Link href="/tools" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
          ← All Tools
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-3 mb-3">
          See if you qualify for a warranty
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Answer a few questions about your truck and we&apos;ll tell you whether extended warranty coverage is
          likely to fit. If it looks good, we&apos;ll follow up with options matched to your rig.
        </p>
        <p className="mt-4 text-base text-gray-600 max-w-2xl">
          Already know your details? Skip straight to the{' '}
          <Link href="/tools/warranty-quote" className="font-semibold text-brand-navy underline">
            full warranty quote tool
          </Link>
          .
        </p>
      </div>

      <WarrantyQualifyQuiz />
    </div>
  )
}

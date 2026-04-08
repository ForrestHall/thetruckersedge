import type { Metadata } from 'next'
import Link from 'next/link'
import { WarrantyQuoteQuiz } from '@/components/WarrantyQuoteQuiz'
import { getBaseUrl } from '@/lib/media'

export const metadata: Metadata = {
  title: 'Truck Warranty Quote — AI-Matched Coverage',
  description:
    'Get a free truck warranty quote matched to your vehicle. Enter your truck details and we\'ll search top providers to find the best coverage for your rig.',
  alternates: { canonical: `${getBaseUrl()}/tools/warranty-quote` },
  openGraph: {
    title: 'Truck Warranty Quote — AI-Matched Coverage',
    description: 'Get a free truck warranty quote matched to your vehicle. We search top providers for the best coverage.',
    url: `${getBaseUrl()}/tools/warranty-quote`,
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Truck Warranty Quote' },
}

export default function WarrantyQuotePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10">
        <Link
          href="/tools"
          className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark"
        >
          ← All Tools
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-navy mt-3 mb-3">
          Get Your Truck Warranty Quote
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl">
          Answer a few questions about your truck and we&apos;ll match you with top warranty providers. You&apos;ll
          receive a personalized quote by email.
        </p>
        <p className="mt-4 text-base text-gray-600 max-w-2xl">
          New to extended warranties? Start with our{' '}
          <Link href="/tools/truck-warranty-reviews" className="font-semibold text-brand-navy underline">
            commercial truck warranty guide
          </Link>
          .
        </p>
      </div>

      <WarrantyQuoteQuiz />
    </div>
  )
}

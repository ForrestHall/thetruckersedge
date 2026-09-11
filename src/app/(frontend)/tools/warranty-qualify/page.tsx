import type { Metadata } from 'next'
import Link from 'next/link'
import { WarrantyQualifyQuiz } from '@/components/WarrantyQualifyQuiz'
import { warrantyQualifyMetadata } from '@/lib/warranty-qualify-meta'

const path = '/tools/warranty-qualify'

export const metadata: Metadata = warrantyQualifyMetadata(path)

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

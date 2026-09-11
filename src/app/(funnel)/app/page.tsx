import type { Metadata } from 'next'
import { WarrantyQualifyQuiz } from '@/components/WarrantyQualifyQuiz'
import { warrantyQualifyMetadata } from '@/lib/warranty-qualify-meta'

const path = '/app'

export const metadata: Metadata = warrantyQualifyMetadata(path)

export default function StandaloneQualifyPage() {
  return (
    <div className="flex-1 max-w-lg mx-auto w-full px-4 pt-8 pb-16 sm:pt-10">
      <WarrantyQualifyQuiz />
    </div>
  )
}

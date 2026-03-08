import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PracticeTestClient } from '@/components/PracticeTestClient'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'practice-tests',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })
  const test = docs[0]
  if (!test) return {}

  return {
    title: test.title,
    description: test.description || `Free CDL ${test.title}. ${test.questionCount} questions with instant feedback and explanations.`,
  }
}

export default async function PracticeTestPage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'practice-tests',
    where: { slug: { equals: slug }, status: { equals: 'published' } },
    limit: 1,
  })

  const test = docs[0]
  if (!test) notFound()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <a href="/practice-tests" className="text-brand-yellow text-sm font-semibold hover:text-brand-yellowDark">
          ← All Practice Tests
        </a>
        <h1 className="text-3xl font-extrabold text-brand-navy mt-3 mb-2">{test.title}</h1>
        {test.description && <p className="text-gray-500">{test.description}</p>}
      </div>

      <PracticeTestClient questions={test.questions as any[]} testTitle={test.title} />
    </div>
  )
}

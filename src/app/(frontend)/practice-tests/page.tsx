import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const metadata: Metadata = {
  title: 'Free CDL Practice Tests',
  description:
    'Free CDL practice tests for every endorsement — General Knowledge, Air Brakes, HazMat, Doubles & Triples, and more. Study smarter, pass faster.',
}

export const dynamic = 'force-dynamic'

const endorsementColors: Record<string, string> = {
  'general-knowledge': 'bg-blue-50 text-blue-700 border-blue-200',
  'air-brakes': 'bg-orange-50 text-orange-700 border-orange-200',
  hazmat: 'bg-red-50 text-red-700 border-red-200',
  combination: 'bg-amber-50 text-amber-800 border-amber-200',
  'doubles-triples': 'bg-green-50 text-green-700 border-green-200',
  passenger: 'bg-teal-50 text-teal-700 border-teal-200',
  'school-bus': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  tank: 'bg-indigo-50 text-indigo-700 border-indigo-200',
}

const endorsementLabels: Record<string, string> = {
  'general-knowledge': 'General Knowledge',
  'air-brakes': 'Air Brakes',
  hazmat: 'HazMat',
  combination: 'Combination Vehicles',
  'doubles-triples': 'Doubles & Triples',
  passenger: 'Passenger Transport',
  'school-bus': 'School Bus',
  tank: 'Tank Vehicles',
}

export default async function PracticeTestsPage() {
  const payload = await getPayload({ config })

  const { docs: tests } = await payload.find({
    collection: 'practice-tests',
    where: { status: { equals: 'published' } },
    sort: 'endorsement',
    limit: 50,
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-brand-navy mb-4">Free CDL Practice Tests</h1>
        <p className="text-xl text-gray-500 max-w-2xl">
          Every question is based on the official CDL knowledge test. Answer questions, get instant feedback, and see explanations for every answer.
        </p>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl font-bold text-brand-navy mb-3">Practice Tests Coming Soon</p>
          <p className="text-gray-500 mb-8">We&apos;re loading up hundreds of questions. Sign up to be notified when they go live.</p>
          <a href="/#email-capture" className="btn-primary">Get Notified</a>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {tests.map((test) => {
            const endorsement = test.endorsement as string
            const badgeClass = endorsementColors[endorsement] || 'bg-gray-50 text-gray-700 border-gray-200'
            return (
              <Link
                key={test.id}
                href={`/practice-tests/${test.slug}`}
                className="card p-6 flex flex-col gap-3"
              >
                <span className={`self-start text-xs font-semibold px-2 py-1 rounded border ${badgeClass}`}>
                  {endorsementLabels[endorsement] || endorsement}
                </span>
                <h2 className="text-xl font-bold text-brand-navy leading-snug">{test.title}</h2>
                {test.description && <p className="text-gray-500 text-sm">{test.description}</p>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-gray-400">{test.questionCount || 0} questions</span>
                  <span className="text-brand-yellow font-semibold text-sm">Start Test →</span>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

import Link from 'next/link'

export function BlogWarrantyCta() {
  return (
    <div className="mt-16 bg-brand-navy rounded-2xl p-8 text-white text-center">
      <h3 className="text-2xl font-bold mb-2">See if your truck qualifies for coverage</h3>
      <p className="text-gray-300 mb-6 max-w-xl mx-auto">
        Running your own truck? Answer a few quick questions and see if you qualify for extended
        warranty coverage.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/tools/warranty-qualify" className="btn-primary">
          Check eligibility
        </Link>
        <Link
          href="/tools/warranty-quote"
          className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
        >
          Full quote questionnaire
        </Link>
      </div>
    </div>
  )
}

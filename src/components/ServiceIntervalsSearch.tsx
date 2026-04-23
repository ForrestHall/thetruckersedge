import { getMediaUrl } from '@/lib/media'

const SECTION_LABELS: Record<string, string> = {
  engine: 'Engine',
  coolant: 'Coolant',
  exhaust: 'Exhaust / Aftertreatment',
  transmission: 'Transmission',
  chassis: 'Chassis',
  miscellaneous: 'Miscellaneous',
  other: 'Other',
}

interface IntervalRow {
  section?: string | null
  service?: string | null
  interval?: string | null
  dutyNote?: string | null
  notes?: string | null
}

interface Doc {
  id: string | number
  name?: string | null
  make?: string | null
  model?: string | null
  yearRange?: string | null
  applicability?: string | null
  intervals?: IntervalRow[] | null
  sourcePdf?: { url?: string | null } | number | null
  sourceUrl?: string | null
}

interface ServiceIntervalsSearchProps {
  defaultQuery: string
  results: Doc[]
}

export function ServiceIntervalsSearch({ defaultQuery, results }: ServiceIntervalsSearchProps) {
  const hasSearched = defaultQuery.length > 0
  const hasResults = results.length > 0

  return (
    <div className="space-y-8">
      <form method="GET" action="/tools/service-intervals" className="flex gap-3">
        <input
          type="search"
          name="q"
          defaultValue={defaultQuery}
          placeholder="e.g. Volvo, X15, MX-13, 2022, Detroit"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:border-transparent text-brand-navy"
          aria-label="Search by make, engine, or year"
        />
        <button type="submit" className="btn-primary px-6 py-3">
          Search
        </button>
      </form>

      {hasSearched && !hasResults && (
        <div className="text-center py-12 bg-brand-gray rounded-xl">
          <p className="text-gray-600 mb-2">No intervals found for &quot;{defaultQuery}&quot;</p>
          <p className="text-sm text-gray-500">
            Try searching by engine (X15, MX-13, DD13), make (Volvo, Cummins, Detroit), or year (2022).
          </p>
        </div>
      )}

      {hasResults && (
        <div className="space-y-10">
          {results.map((doc) => {
            const pdfUrl =
              doc.sourcePdf && typeof doc.sourcePdf === 'object' && doc.sourcePdf?.url
                ? getMediaUrl(doc.sourcePdf.url)
                : null

            const intervalsBySection = (doc.intervals ?? []).reduce<Record<string, IntervalRow[]>>((acc, row) => {
              const section = row.section || 'other'
              if (!acc[section]) acc[section] = []
              acc[section].push(row)
              return acc
            }, {})

            return (
              <article key={doc.id} className="card p-6 overflow-hidden">
                <div className="mb-6">
                  <div className="flex flex-wrap items-baseline gap-2 mb-2">
                    <h2 className="text-xl font-bold text-brand-navy">{doc.name}</h2>
                    {doc.make && (
                      <span className="text-sm text-gray-500">
                        {doc.make}
                        {doc.model ? ` ${doc.model}` : ''}
                      </span>
                    )}
                    {doc.yearRange && (
                      <span className="text-xs bg-brand-gray text-brand-navy font-medium px-2 py-1 rounded">
                        {doc.yearRange}
                      </span>
                    )}
                  </div>
                  {doc.applicability && (
                    <p className="text-sm text-gray-500 mb-3">{doc.applicability}</p>
                  )}
                  <div className="flex gap-3">
                    {pdfUrl && (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-yellow font-semibold hover:text-brand-yellowDark"
                      >
                        View PDF →
                      </a>
                    )}
                    {doc.sourceUrl && !pdfUrl && (
                      <a
                        href={doc.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-yellow font-semibold hover:text-brand-yellowDark"
                      >
                        View source →
                      </a>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {(['engine', 'coolant', 'exhaust', 'transmission', 'chassis', 'miscellaneous', 'other'] as const)
                    .filter((section) => intervalsBySection[section]?.length)
                    .map((section) => (
                      <div key={section}>
                        <h3 className="text-sm font-semibold text-brand-navy uppercase tracking-wide mb-3">
                          {SECTION_LABELS[section] || section}
                        </h3>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50 text-left">
                                <th className="px-4 py-2 font-medium text-brand-navy">Service</th>
                                <th className="px-4 py-2 font-medium text-brand-navy">Interval</th>
                                {intervalsBySection[section].some((r) => r.dutyNote) && (
                                  <th className="px-4 py-2 font-medium text-brand-navy">By duty</th>
                                )}
                                {intervalsBySection[section].some((r) => r.notes) && (
                                  <th className="px-4 py-2 font-medium text-brand-navy">Notes</th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {intervalsBySection[section].map((row, i) => (
                                <tr key={i} className="border-t border-gray-100">
                                  <td className="px-4 py-3 text-gray-800">{row.service}</td>
                                  <td className="px-4 py-3 font-medium">{row.interval}</td>
                                  {intervalsBySection[section].some((r) => r.dutyNote) && (
                                    <td className="px-4 py-3 text-gray-500 text-xs">{row.dutyNote || '—'}</td>
                                  )}
                                  {intervalsBySection[section].some((r) => r.notes) && (
                                    <td className="px-4 py-3 text-gray-500 text-xs max-w-xs">{row.notes || '—'}</td>
                                  )}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                </div>
              </article>
            )
          })}
        </div>
      )}

      {!hasSearched && (
        <div className="text-center py-12 bg-brand-gray rounded-xl">
          <p className="text-gray-600">Enter a search term above to look up service intervals.</p>
          <p className="text-sm text-gray-500 mt-2">
            Example: Volvo, Cummins X15, Detroit DD13, PACCAR MX-13, 2022
          </p>
        </div>
      )}
    </div>
  )
}

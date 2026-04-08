import Link from 'next/link'
import { MECHANIC_DIRECTORY_US_STATES } from '@/lib/mechanic-directory-us-states'

type Props = {
  stateValue: string
  qValue: string
}

export function MechanicsDirectorySearchForm({ stateValue, qValue }: Props) {
  return (
    <form
      className="flex flex-col sm:flex-row flex-wrap gap-3 mb-10 justify-center items-stretch sm:items-end max-w-3xl mx-auto"
      action="/mechanics"
      method="get"
      role="search"
    >
      <div className="flex flex-col text-left min-w-[140px]">
        <label htmlFor="dir-state" className="text-xs font-medium text-gray-600 mb-1">
          State
        </label>
        <select
          id="dir-state"
          name="state"
          className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 bg-white"
          defaultValue={stateValue}
        >
          <option value="">All states</option>
          {MECHANIC_DIRECTORY_US_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col text-left flex-1 min-w-[200px]">
        <label htmlFor="dir-q" className="text-xs font-medium text-gray-600 mb-1">
          Search
        </label>
        <input
          id="dir-q"
          name="q"
          type="search"
          maxLength={80}
          placeholder="Shop name, city, keywords…"
          className="rounded-lg border border-gray-300 px-3 py-2 text-gray-900 w-full"
          defaultValue={qValue}
        />
      </div>
      <div className="flex gap-2">
        <button type="submit" className="btn-primary !py-2 !px-5">
          Apply
        </button>
        {(stateValue || qValue) && (
          <Link href="/mechanics" className="btn-secondary !py-2 !px-5 inline-flex items-center justify-center">
            Clear
          </Link>
        )}
      </div>
    </form>
  )
}

import Link from 'next/link'

type Props = {
  businessName: string
}

export function MechanicVisibleBreadcrumbs({ businessName }: Props) {
  return (
    <nav aria-label="Breadcrumb" className="bg-brand-gray border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <li>
            <Link href="/" className="hover:text-brand-navy font-medium">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-gray-400">
            /
          </li>
          <li>
            <Link href="/mechanics" className="hover:text-brand-navy font-medium">
              Diesel mechanics
            </Link>
          </li>
          <li aria-hidden className="text-gray-400">
            /
          </li>
          <li className="text-gray-900 font-semibold truncate max-w-[min(100%,14rem)] sm:max-w-md" aria-current="page">
            {businessName}
          </li>
        </ol>
      </div>
    </nav>
  )
}

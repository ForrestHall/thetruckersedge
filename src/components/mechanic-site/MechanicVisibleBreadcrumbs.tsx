import Link from 'next/link'

type Props = {
  businessName: string
}

export function MechanicVisibleBreadcrumbs({ businessName }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="border-b"
      style={{
        backgroundColor: 'var(--ms-breadcrumb-bg)',
        borderColor: 'var(--ms-breadcrumb-edge)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-3">
        <ol
          className="flex flex-wrap items-center gap-2 text-sm"
          style={{ color: 'var(--ms-breadcrumb-text)' }}
        >
          <li>
            <Link
              href="/"
              className="font-medium hover:opacity-80"
              style={{ color: 'var(--ms-heading)' }}
            >
              Home
            </Link>
          </li>
          <li aria-hidden className="opacity-50">
            /
          </li>
          <li>
            <Link
              href="/mechanics"
              className="font-medium hover:opacity-80"
              style={{ color: 'var(--ms-heading)' }}
            >
              Diesel mechanics
            </Link>
          </li>
          <li aria-hidden className="opacity-50">
            /
          </li>
          <li
            className="font-semibold truncate max-w-[min(100%,14rem)] sm:max-w-md"
            style={{ color: 'var(--ms-heading)' }}
            aria-current="page"
          >
            {businessName}
          </li>
        </ol>
      </div>
    </nav>
  )
}

import Link from 'next/link'

export default function CommandCenterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-slate-100/90 via-white to-slate-50/80">
      <header className="border-b border-gray-200/90 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-baseline gap-3 min-w-0">
            <Link
              href="/"
              className="text-sm font-semibold text-brand-navy hover:text-brand-navy/80 truncate"
            >
              The Truckers Edge
            </Link>
            <span className="text-gray-300 hidden sm:inline" aria-hidden>
              /
            </span>
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 hidden sm:inline">
              Command center
            </span>
          </div>
          <nav className="flex items-center gap-5 text-sm font-medium" aria-label="Command center">
            <Link href="/tools" className="text-gray-600 hover:text-brand-navy transition-colors">
              Tools
            </Link>
            <Link href="/command-center" className="text-gray-600 hover:text-brand-navy transition-colors">
              Hub
            </Link>
            <Link href="/mechanics" className="text-gray-600 hover:text-brand-navy transition-colors">
              Mechanics
            </Link>
          </nav>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">{children}</div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'

const navLinks = [
  { href: '/practice-tests', label: 'Practice Tests' },
  { href: '/guides', label: 'Career Guides' },
  { href: '/tools', label: 'Free Tools' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-brand-navy text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-xl">
          <span className="text-brand-yellow">🚛</span>
          <span>
            The Truckers<span className="text-brand-yellow">Edge</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-300 hover:text-white font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/practice-tests" className="btn-primary !px-4 !py-2 text-sm">
            Start a Free Test
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded text-gray-300 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-brand-navyLight border-t border-white/10 px-4 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-200 hover:text-white font-medium py-2"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/practice-tests" className="btn-primary text-center" onClick={() => setMobileOpen(false)}>
            Start a Free Test
          </Link>
        </div>
      )}
    </header>
  )
}

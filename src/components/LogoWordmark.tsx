'use client'

import Link from 'next/link'
import { Barlow_Condensed } from 'next/font/google'

const logoFont = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
})

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-brand-navy rounded-sm'

export type LogoWordmarkVariant = 'header' | 'footer'

export function LogoWordmark({ variant = 'header' }: { variant?: LogoWordmarkVariant }) {
  const isFooter = variant === 'footer'

  return (
    <Link
      href="/"
      className={`${logoFont.className} ${focusRing} no-underline hover:no-underline shrink-0 min-w-0 inline-flex`}
      aria-label="The Truckers Edge — Home"
    >
      <span className="flex flex-col items-start justify-center leading-none gap-0.5 sm:gap-1">
        <span
          className={
            isFooter
              ? 'text-xs sm:text-sm font-semibold uppercase tracking-[0.22em] text-gray-300'
              : 'text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-300'
          }
        >
          The Truckers
        </span>
        <span
          className={
            isFooter
              ? 'text-3xl sm:text-4xl font-bold text-brand-yellow tracking-tight'
              : 'text-lg sm:text-xl font-bold text-brand-yellow tracking-tight'
          }
        >
          Edge
        </span>
      </span>
    </Link>
  )
}

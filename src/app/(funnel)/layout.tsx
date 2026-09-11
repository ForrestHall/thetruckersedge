import '../globals.css'
import type { Metadata } from 'next'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  robots: { index: true, follow: true },
}

export default function FunnelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="frontend-app min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-brand-gray/60 to-white">
      <main className="flex-1 min-w-0 w-full flex flex-col">{children}</main>
    </div>
  )
}

import '../globals.css'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'The Truckers Edge — CDL Test Prep & Trucking Career Guides',
    template: '%s | The Truckers Edge',
  },
  description:
    'Free CDL practice tests, trucking career guides, and tools for drivers. Get your commercial license and advance your trucking career.',
  openGraph: {
    siteName: 'The Truckers Edge',
    type: 'website',
  },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="frontend-app min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

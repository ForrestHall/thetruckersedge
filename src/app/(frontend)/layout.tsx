import '../globals.css'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://thetruckersedge.com'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'The Truckers Edge — CDL Test Prep & Trucking Career Guides',
    template: '%s | The Truckers Edge',
  },
  description:
    'Free CDL practice tests, trucking career guides, and tools for drivers. Get your commercial license and advance your trucking career.',
  keywords: ['CDL practice test', 'commercial driver license', 'trucking career', 'CDL study guide', 'owner operator', 'truck driver'],
  authors: [{ name: 'The Truckers Edge' }],
  creator: 'The Truckers Edge',
  publisher: 'The Truckers Edge',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'The Truckers Edge',
    title: 'The Truckers Edge — CDL Test Prep & Trucking Career Guides',
    description: 'Free CDL practice tests, trucking career guides, and tools for drivers. Get your commercial license and advance your trucking career.',
    url: baseUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Truckers Edge — CDL Test Prep & Trucking Career Guides',
    description: 'Free CDL practice tests, trucking career guides, and tools for drivers.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'The Truckers Edge',
  url: baseUrl,
  description: 'Free CDL practice tests, trucking career guides, and tools for drivers. Get your commercial license and advance your trucking career.',
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'The Truckers Edge',
  url: baseUrl,
  description: 'Free CDL practice tests, trucking career guides, and tools for drivers.',
  publisher: { '@type': 'Organization', name: 'The Truckers Edge' },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="frontend-app min-h-screen flex flex-col overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <Header />
      <main className="flex-1 min-w-0 w-full">{children}</main>
      <Footer />
    </div>
  )
}

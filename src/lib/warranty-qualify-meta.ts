import { getBaseUrl } from '@/lib/media'

export const WARRANTY_QUALIFY_TITLE = 'See If Your Truck Qualifies for Coverage — Free Check'

export const WARRANTY_QUALIFY_DESCRIPTION =
  'See if your truck qualifies for coverage in 60 seconds. Free eligibility check for Executive Plan extended warranty — no obligation.'

export function warrantyQualifyMetadata(path: string) {
  const url = `${getBaseUrl()}${path}`

  return {
    title: WARRANTY_QUALIFY_TITLE,
    description: WARRANTY_QUALIFY_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: 'See If Your Truck Qualifies for Coverage | The Truckers Edge',
      description: WARRANTY_QUALIFY_DESCRIPTION,
      url,
      type: 'website' as const,
    },
    twitter: { card: 'summary_large_image' as const, title: 'Truck Warranty Qualification — 60 Seconds' },
  }
}

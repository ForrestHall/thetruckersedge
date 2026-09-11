export type QualificationTier = 'likely' | 'maybe' | 'unlikely'

export function evaluateWarrantyQualification(input: {
  year: number
  mileage: number
  truckClass: number
}): QualificationTier {
  const { year, mileage, truckClass } = input
  const currentYear = new Date().getFullYear()

  if (truckClass < 7) return 'unlikely'
  if (year < 2008 || year > currentYear) return 'unlikely'
  if (mileage > 850_000) return 'unlikely'

  if (year >= 2016 && mileage <= 550_000) return 'likely'
  if (year >= 2010 && mileage <= 700_000) return 'maybe'

  return 'maybe'
}

export const qualificationCopy: Record<
  QualificationTier,
  { headline: string; detail: string; cta: string }
> = {
  likely: {
    headline: 'You likely qualify for warranty coverage',
    detail:
      'Based on your truck year and mileage, several commercial extended warranty programs may fit. Share your contact info and we will follow up with options.',
    cta: 'Get my options',
  },
  maybe: {
    headline: 'You may qualify — let us check',
    detail:
      'Your truck is in a range where coverage depends on make, engine, and how the truck is used. A quick follow-up call can confirm what is available.',
    cta: 'Request a follow-up',
  },
  unlikely: {
    headline: 'Standard plans may be limited for this rig',
    detail:
      'Most extended warranty providers cap eligibility around older years or very high mileage. We can still review specialty or fleet options if you want a second look.',
    cta: 'Contact me anyway',
  },
}

export type QualificationTier = 'likely' | 'maybe' | 'unlikely'

export type TruckType =
  | 'class8-otr'
  | 'class8-regional'
  | 'class7'
  | 'medium-duty'
  | 'other'

export type TruckUsage = 'fulltime-otr' | 'regional' | 'local' | 'fleet'

export type CoveragePriority = 'comprehensive' | 'balanced' | 'powertrain' | 'aftertreatment'

export type LeadRequestType = 'quote' | 'call'

export const TRUCK_TYPE_OPTIONS: { value: TruckType; label: string; hint: string }[] = [
  { value: 'class8-otr', label: 'Class 8 OTR', hint: 'Long-haul tractor' },
  { value: 'class8-regional', label: 'Class 8 regional', hint: 'Dedicated lanes / regional' },
  { value: 'class7', label: 'Class 7', hint: 'Heavy single-axle, vocational' },
  { value: 'medium-duty', label: 'Medium duty', hint: 'Box truck, straight truck' },
  { value: 'other', label: 'Other', hint: 'Specialty or mixed fleet' },
]

export const USAGE_OPTIONS: { value: TruckUsage; label: string }[] = [
  { value: 'fulltime-otr', label: 'Full-time OTR (200k+ mi/yr)' },
  { value: 'regional', label: 'Regional / dedicated lanes' },
  { value: 'local', label: 'Local / day cab' },
  { value: 'fleet', label: 'Fleet operation (2+ trucks)' },
]

export const COVERAGE_OPTIONS: {
  value: CoveragePriority
  label: string
  hint: string
  class8Only?: boolean
}[] = [
  {
    value: 'comprehensive',
    label: 'Exclusionary (Executive-style)',
    hint: 'Highest tier — like the ATW Executive Plan',
  },
  {
    value: 'balanced',
    label: 'Inclusionary',
    hint: 'Tiered coverage — listed components',
  },
  {
    value: 'powertrain',
    label: 'Powertrain-only',
    hint: 'Engine, transmission, rear axle',
  },
  {
    value: 'aftertreatment',
    label: 'Aftertreatment focus',
    hint: 'DPF, DEF, emissions systems',
    class8Only: true,
  },
]

const TRUCK_TYPE_LABELS: Record<TruckType, string> = {
  'class8-otr': 'Class 8 OTR',
  'class8-regional': 'Class 8 regional',
  class7: 'Class 7',
  'medium-duty': 'Medium duty',
  other: 'Other',
}

const USAGE_LABELS: Record<TruckUsage, string> = {
  'fulltime-otr': 'Full-time OTR',
  regional: 'Regional / dedicated',
  local: 'Local / day cab',
  fleet: 'Fleet operation',
}

const COVERAGE_LABELS: Record<CoveragePriority, string> = {
  comprehensive: 'Exclusionary (bumper-to-bumper style)',
  balanced: 'Inclusionary (tiered)',
  powertrain: 'Powertrain-only',
  aftertreatment: 'Aftertreatment / emissions',
}

export const ATW_EXECUTIVE_PLAN = {
  name: "America's Trucking Warranty Executive Plan",
  shortName: 'ATW Executive Plan',
  tagline: 'Highest-tier exclusionary coverage for heavy-duty trucks',
  highlights: [
    'Exclusionary-style protection — covered unless specifically excluded',
    'Engine, transmission, and major driveline components',
    'Ideal for OTR owner-operators running high annual miles',
  ],
} as const

export function executivePlanHeadline(tier: QualificationTier): string {
  if (tier === 'unlikely') {
    return 'You may qualify for the ATW Executive Plan'
  }
  return 'You qualify for the ATW Executive Plan'
}

export function executivePlanSubhead(tier: QualificationTier): string {
  if (tier === 'unlikely') {
    return 'Based on your rig details, Executive coverage from America\'s Trucking Warranty looks possible — a specialist will confirm final eligibility and pricing.'
  }
  if (tier === 'maybe') {
    return 'Based on your year, mileage, and usage, you appear eligible for America\'s Trucking Warranty Executive Plan — their top exclusionary-style coverage tier.'
  }
  return 'Based on your year, mileage, and usage, you qualify for America\'s Trucking Warranty Executive Plan — their top exclusionary-style coverage tier.'
}

export function evaluateWarrantyQualification(input: {
  year: number
  mileage: number
  truckType: TruckType
}): QualificationTier {
  const { year, mileage, truckType } = input
  const currentYear = new Date().getFullYear()
  const isHeavy = truckType === 'class8-otr' || truckType === 'class8-regional' || truckType === 'class7'

  if (!isHeavy && truckType !== 'medium-duty') return 'maybe'
  if (year < 2008 || year > currentYear) return 'unlikely'
  if (mileage > 850_000) return 'unlikely'

  if (year >= 2016 && mileage <= 550_000) return 'likely'
  if (year >= 2010 && mileage <= 700_000) return 'maybe'

  return 'maybe'
}

export function buildMatchSummary(input: {
  year: string
  make: string
  model: string
  mileage: string
  truckType: TruckType
  usage: TruckUsage
  coverage: CoveragePriority
  tier: QualificationTier
}): string[] {
  const lines = [
    `${input.year} ${input.make} ${input.model} — ${TRUCK_TYPE_LABELS[input.truckType]}`,
    `Recommended coverage: ${ATW_EXECUTIVE_PLAN.shortName}`,
    ATW_EXECUTIVE_PLAN.tagline,
  ]
  if (input.mileage) {
    lines.push(`Odometer: ${Number(input.mileage.replace(/,/g, '')).toLocaleString()} miles`)
  }
  lines.push(`Usage: ${USAGE_LABELS[input.usage]}`)
  if (input.tier === 'likely') {
    lines.push('Eligibility: strong qualification based on year and mileage')
  } else if (input.tier === 'maybe') {
    lines.push('Eligibility: preliminary qualification — specialist will confirm')
  } else {
    lines.push('Eligibility: pending specialist review')
  }
  return lines
}

export function coverageOptionsForTruckType(truckType: TruckType) {
  const isClass8 = truckType === 'class8-otr' || truckType === 'class8-regional'
  return COVERAGE_OPTIONS.filter((opt) => !opt.class8Only || isClass8)
}

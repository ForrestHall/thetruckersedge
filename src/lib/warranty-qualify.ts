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
    hint: 'Highest tier — Executive Plan style',
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

export const EXECUTIVE_PLAN = {
  name: 'Executive Plan',
  shortName: 'Executive Plan',
  tagline: 'Highest-tier exclusionary coverage for heavy-duty trucks',
  highlights: [
    'Exclusionary-style protection — covered unless specifically excluded',
    'Engine, transmission, and major driveline components',
    'Ideal for OTR owner-operators running high annual miles',
  ],
} as const

export const HD_MAX_AGE_YEARS = 20
export const HD_MAX_MILEAGE = 1_000_000
export const MD_MAX_AGE_YEARS = 15
export const MD_MAX_MILEAGE = 500_000

export function isHeavyDutyTruckType(truckType: TruckType): boolean {
  return truckType === 'class8-otr' || truckType === 'class8-regional' || truckType === 'class7'
}

export function isMediumDutyTruckType(truckType: TruckType): boolean {
  return truckType === 'medium-duty'
}

export function eligibilityRulesLabel(truckType: TruckType): string {
  if (isMediumDutyTruckType(truckType)) {
    return `Medium duty: ${MD_MAX_AGE_YEARS} years or newer, under ${MD_MAX_MILEAGE.toLocaleString()} miles`
  }
  return `Heavy duty: ${HD_MAX_AGE_YEARS} years or newer, under ${HD_MAX_MILEAGE.toLocaleString()} miles`
}

export function executivePlanHeadline(tier: QualificationTier): string {
  if (tier === 'unlikely') {
    return 'Outside standard Executive Plan eligibility'
  }
  return 'You qualify for the Executive Plan'
}

export function executivePlanSubhead(tier: QualificationTier): string {
  if (tier === 'unlikely') {
    return 'Your rig may fall outside standard eligibility — a warranty specialist can still review options or alternative coverage.'
  }
  return 'Based on your year and mileage, you qualify for Executive Plan coverage — top-tier exclusionary-style protection.'
}

export function evaluateWarrantyQualification(input: {
  year: number
  mileage: number
  truckType: TruckType
}): QualificationTier {
  const { year, mileage, truckType } = input
  const currentYear = new Date().getFullYear()

  if (year > currentYear) return 'unlikely'

  if (isMediumDutyTruckType(truckType)) {
    const minYear = currentYear - MD_MAX_AGE_YEARS
    if (year >= minYear && mileage < MD_MAX_MILEAGE) return 'likely'
    return 'unlikely'
  }

  // Heavy duty (Class 7/8) and other specialty rigs use HD rules
  if (isHeavyDutyTruckType(truckType) || truckType === 'other') {
    const minYear = currentYear - HD_MAX_AGE_YEARS
    if (year >= minYear && mileage < HD_MAX_MILEAGE) return 'likely'
    return 'unlikely'
  }

  return 'unlikely'
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
    `Recommended coverage: ${EXECUTIVE_PLAN.shortName}`,
    EXECUTIVE_PLAN.tagline,
  ]
  if (input.mileage) {
    lines.push(`Odometer: ${Number(input.mileage.replace(/,/g, '')).toLocaleString()} miles`)
  }
  lines.push(`Usage: ${USAGE_LABELS[input.usage]}`)
  lines.push(`Guideline: ${eligibilityRulesLabel(input.truckType)}`)
  if (input.tier === 'likely') {
    lines.push('Eligibility: qualifies under Executive Plan guidelines')
  } else {
    lines.push('Eligibility: outside standard guidelines — specialist review recommended')
  }
  return lines
}

export function coverageOptionsForTruckType(truckType: TruckType) {
  const isClass8 = truckType === 'class8-otr' || truckType === 'class8-regional'
  return COVERAGE_OPTIONS.filter((opt) => !opt.class8Only || isClass8)
}

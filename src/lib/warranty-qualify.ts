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
    label: 'Exclusionary',
    hint: 'Max protection — named exclusions only',
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
    `Matched with ${COVERAGE_LABELS[input.coverage]} from our provider network`,
  ]
  if (input.mileage) lines.push(`Mileage: ${Number(input.mileage.replace(/,/g, '')).toLocaleString()}`)
  if (input.usage === 'fulltime-otr') lines.push('Full-time OTR → exclusionary coverage often recommended')
  if (input.tier === 'likely') lines.push('Eligibility: strong match based on year and mileage')
  if (input.tier === 'unlikely') lines.push('Eligibility: limited — specialist review recommended')
  return lines
}

export function coverageOptionsForTruckType(truckType: TruckType) {
  const isClass8 = truckType === 'class8-otr' || truckType === 'class8-regional'
  return COVERAGE_OPTIONS.filter((opt) => !opt.class8Only || isClass8)
}

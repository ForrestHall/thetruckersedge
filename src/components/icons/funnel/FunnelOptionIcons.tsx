import type { ComponentType, ReactNode } from 'react'
import type { CoveragePriority, TruckType, TruckUsage } from '@/lib/warranty-qualify'

type IconProps = { className?: string }

function IconBase({ className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className ?? 'h-5 w-5'}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      {children}
    </svg>
  )
}

export function Class8OtrIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M2 14h20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3" y="8" width="11" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 10h5l2 4v4h-7V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="7" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function Class8RegionalIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M3 14h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="9" width="9" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13 10h4l2 3.5V14h-6V10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="7.5" cy="14" r="1.75" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="14" r="1.75" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 6l4-2 4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  )
}

export function Class7Icon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M3 14h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="8" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 9h5l2 5h-7V9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="7" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="16" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function MediumDutyIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M3 14h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="4" y="7" width="12" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="2" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function OtherTruckIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

export function FulltimeOtrIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M6 18l2-8h8l2 8" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 10l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  )
}

export function RegionalUsageIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 12c2-4 4-6 7-6s5 2 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </IconBase>
  )
}

export function LocalUsageIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M12 21s6-5.5 6-10a6 6 0 1 0-12 0c0 4.5 6 10 6 10z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function FleetUsageIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <rect x="2" y="8" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="10" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="14" y="12" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </IconBase>
  )
}

export function ExclusionaryIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path
        d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </IconBase>
  )
}

export function InclusionaryIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M12 4l3 3-3 3-3-3 3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 10l3 3-3 3-3-3 3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 16l3 3-3 3-3-3 3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </IconBase>
  )
}

export function PowertrainIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 8V4M12 20v-4M8 12H4M20 12h-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </IconBase>
  )
}

export function AftertreatmentIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M6 8h12v8H6V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 8V6M15 8V6M9 16v2M15 16v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </IconBase>
  )
}

const TRUCK_TYPE_ICONS: Record<TruckType, ComponentType<IconProps>> = {
  'class8-otr': Class8OtrIcon,
  'class8-regional': Class8RegionalIcon,
  class7: Class7Icon,
  'medium-duty': MediumDutyIcon,
  other: OtherTruckIcon,
}

const USAGE_ICONS: Record<TruckUsage, ComponentType<IconProps>> = {
  'fulltime-otr': FulltimeOtrIcon,
  regional: RegionalUsageIcon,
  local: LocalUsageIcon,
  fleet: FleetUsageIcon,
}

const COVERAGE_ICONS: Record<CoveragePriority, ComponentType<IconProps>> = {
  comprehensive: ExclusionaryIcon,
  balanced: InclusionaryIcon,
  powertrain: PowertrainIcon,
  aftertreatment: AftertreatmentIcon,
}

export function FunnelTruckTypeIcon({ value, className }: { value: TruckType; className?: string }) {
  const Icon = TRUCK_TYPE_ICONS[value]
  return <Icon className={className} />
}

export function FunnelUsageIcon({ value, className }: { value: TruckUsage; className?: string }) {
  const Icon = USAGE_ICONS[value]
  return <Icon className={className} />
}

export function FunnelCoverageIcon({ value, className }: { value: CoveragePriority; className?: string }) {
  const Icon = COVERAGE_ICONS[value]
  return <Icon className={className} />
}

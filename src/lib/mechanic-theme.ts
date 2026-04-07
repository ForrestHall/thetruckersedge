import type { MechanicSite } from '@/payload-types'

export const MECHANIC_THEME_PRESETS = [
  'classic_navy',
  'steel_slate',
  'amber_forge',
  'forest_line',
] as const

export type MechanicThemePreset = (typeof MECHANIC_THEME_PRESETS)[number]

export const MECHANIC_THEME_FORM_OPTIONS: { value: MechanicThemePreset; label: string }[] = [
  { value: 'classic_navy', label: 'Classic navy (Truckers Edge)' },
  { value: 'steel_slate', label: 'Steel & slate' },
  { value: 'amber_forge', label: 'Amber forge' },
  { value: 'forest_line', label: 'Forest line' },
]

function isPreset(v: string | null | undefined): v is MechanicThemePreset {
  return v != null && (MECHANIC_THEME_PRESETS as readonly string[]).includes(v)
}

/**
 * Root class names for public mechanic microsite (CSS variables + density).
 */
export function mechanicMicrositeRootClass(site: MechanicSite): string {
  const preset = isPreset(site.themePreset) ? site.themePreset : 'classic_navy'
  const density = site.layoutDensity === 'compact' ? 'mechanic-density-compact' : 'mechanic-density-comfortable'
  return `mechanic-microsite mechanic-theme-${preset} ${density}`
}

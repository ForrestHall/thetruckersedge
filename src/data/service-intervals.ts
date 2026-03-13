export interface ServiceItem {
  system: string
  interval: string
  techNote: string
  mileageBase?: number
  isDpf?: boolean
}

export type PlatformKey = 'detroit-dd' | 'cummins-x15' | 'paccar-mx13' | 'volvo-d13'

export interface PlatformData {
  id: PlatformKey
  name: string
  subtitle?: string
  fluidSpec?: string
  items: ServiceItem[]
}

export interface PhaseItem {
  component: string
  interval: string
  expertNote: string
}

export interface MaintenancePhase {
  id: string
  title: string
  subtitle: string
  items: PhaseItem[]
}

export const MAINTENANCE_PHASES: MaintenancePhase[] = [
  {
    id: 'engine-lubes',
    title: 'Phase 1: Engine & Lubes (The Heart)',
    subtitle: 'Bread-and-butter maintenance items. Missing these is the #1 reason warranty claims are denied.',
    items: [
      { component: 'Engine Oil & Filters', interval: '50k – 75k miles', expertNote: 'Use Oil Analysis to spot bearing wear early.' },
      { component: 'Primary/Secondary Fuel Filters', interval: 'Every Oil Change', expertNote: 'Modern injectors (HPCR) fail instantly with water/dirt.' },
      { component: 'Engine Air Filter', interval: '100k - 150k miles', expertNote: 'Change based on restriction gauge, not just miles.' },
      { component: 'Crankcase Filter (CCV)', interval: '125k – 150k miles', expertNote: 'A clogged CCV causes oil leaks and turbo seal failure.' },
      { component: 'Valve Lash (Overhead)', interval: '100k, then every 250k', expertNote: 'Keeps fuel economy high and prevents "dropped valves."' },
    ],
  },
  {
    id: 'aftertreatment',
    title: 'Phase 2: Aftertreatment & Emissions (The Lungs)',
    subtitle: 'This system is responsible for 70% of modern truck breakdowns.',
    items: [
      { component: 'DEF Pump Filter', interval: 'Every 200,000 miles', expertNote: 'If this clogs, the truck goes into "derate" (limp mode).' },
      { component: 'DPF Cleaning', interval: 'Every 250,000 – 400,000 miles', expertNote: 'Ash cannot be "burned off" by the truck; it must be pneumatically cleaned at a shop.' },
      { component: '7th Injector (Hydrocarbon Injector)', interval: 'Clean/Inspect every 100,000 miles', expertNote: 'If this gets carbon-baked, your parked regens will fail.' },
    ],
  },
  {
    id: 'drivetrain',
    title: 'Phase 3: Drivetrain & Chassis (The Bones)',
    subtitle: '',
    items: [
      { component: 'Transmission Fluid (AMT/Manual)', interval: 'Every 500,000 miles', expertNote: 'Modern synthetics last a long time, but heat cycles eventually break them down.' },
      { component: 'Differential/Axle Oil', interval: 'Every 500,000 miles', expertNote: 'Check magnetic plugs for metal shavings at every oil change.' },
      { component: 'Fifth Wheel Grease', interval: 'Every 10,000 miles or monthly', expertNote: 'Dry fifth wheels cause steering issues and tire wear.' },
      { component: 'Kingpins & Tie Rods', interval: 'Every 25,000 miles', expertNote: 'Greasing the front end is the cheapest way to avoid a $3,000 repair bill.' },
    ],
  },
  {
    id: 'cooling',
    title: 'Phase 4: Cooling & HVAC',
    subtitle: '',
    items: [
      { component: 'Coolant Flush', interval: 'Every 600,000 miles', expertNote: 'For Nitrite-Free "Red" Coolant.' },
      { component: 'Coolant Filter', interval: 'Every 150,000 miles (if equipped)', expertNote: 'Check manufacturer for equipment-specific intervals.' },
      { component: 'Belt & Tensioner Replacement', interval: 'Every 300,000 miles', expertNote: 'A snapped belt on the highway usually leads to a towed truck and an overheated engine.' },
    ],
  },
]

export const PLATFORMS: Record<PlatformKey, PlatformData> = {
  'detroit-dd': {
    id: 'detroit-dd',
    name: 'Detroit Diesel DD13 / DD15',
    subtitle: 'Freightliner & Western Star',
    fluidSpec: 'DFS 93K222 / API CK-4 or FA-4',
    items: [
      {
        system: 'Engine Oil & Filter',
        interval: '50,000 miles (Short Haul) | 75,000 miles (Long Haul)',
        techNote: 'Ultra-long intervals for line-haul. Use CK-4 or FA-4 synthetic only.',
        mileageBase: 50000,
      },
      {
        system: 'Fuel Filters',
        interval: 'Every oil change',
        techNote: 'Replace both primary and secondary filters.',
      },
      {
        system: 'Valve Lash (Overhead)',
        interval: '100,000 miles, then every 500,000 miles',
        techNote: 'Essential for fuel economy and engine life.',
        mileageBase: 100000,
      },
      {
        system: 'Coolant (Nitrite-Free)',
        interval: '600,000 miles',
        techNote: 'Check extender levels every 300,000 miles.',
        mileageBase: 600000,
      },
      {
        system: 'DPF Filter',
        interval: '300,000 – 500,000 miles',
        techNote: 'Sensor-dependent. Check DPF backpressure sensors at this mark.',
        mileageBase: 300000,
        isDpf: true,
      },
      {
        system: 'Transmission (DT12)',
        interval: '300,000 miles (Severe) | 500,000 miles (Long Haul)',
        techNote: 'Fluid and filter service per manufacturer schedule.',
        mileageBase: 300000,
      },
    ],
  },
  'cummins-x15': {
    id: 'cummins-x15',
    name: 'Cummins X15',
    subtitle: 'International, Kenworth, Peterbilt',
    fluidSpec: 'CES 20081 / API CK-4 or FA-4',
    items: [
      {
        system: 'Engine Oil & Filter',
        interval: '50,000 miles (Standard) | Up to 80,000 miles (Oil Guard)',
        techNote: 'Oil Guard program relies on oil analysis. Use CK-4 or FA-4 synthetic only.',
        mileageBase: 50000,
      },
      {
        system: 'Fuel Filters',
        interval: '50,000 – 60,000 miles',
        techNote: 'Replace both primary and secondary filters.',
        mileageBase: 50000,
      },
      {
        system: 'Valve Lash (Overhead)',
        interval: '100,000 miles, then every 250,000 miles',
        techNote: 'Essential for fuel economy and engine life.',
        mileageBase: 100000,
      },
      {
        system: 'DEF Filter',
        interval: '200,000 miles',
        techNote: 'Replace DEF filter per maintenance schedule.',
        mileageBase: 200000,
      },
      {
        system: 'Coolant',
        interval: '150,000 miles or 24 months',
        techNote: 'Whichever comes first. Check nitrite levels.',
        mileageBase: 150000,
      },
      {
        system: 'DPF Cleaning',
        interval: '250,000 – 400,000 miles',
        techNote: 'Check DPF backpressure sensors at this mark.',
        mileageBase: 250000,
        isDpf: true,
      },
    ],
  },
  'paccar-mx13': {
    id: 'paccar-mx13',
    name: 'PACCAR MX-13',
    subtitle: 'Kenworth & Peterbilt',
    fluidSpec: 'PACCAR PE-Series / API CK-4 or FA-4',
    items: [
      {
        system: 'Engine Oil & Filter',
        interval: '60,000 miles',
        techNote: 'Standard line-haul. Use CK-4 or FA-4 synthetic only.',
        mileageBase: 60000,
      },
      {
        system: 'Fuel Filters',
        interval: '60,000 miles',
        techNote: 'Replace both primary and secondary filters.',
        mileageBase: 60000,
      },
      {
        system: 'Valve Lash (Overhead)',
        interval: '150,000 miles, then every 300,000 miles',
        techNote: 'Essential for fuel economy and engine life.',
        mileageBase: 150000,
      },
      {
        system: 'Centrifugal Oil Filter',
        interval: 'Every 120,000 miles',
        techNote: 'Unique to PACCAR. Separate from main oil filter.',
        mileageBase: 120000,
      },
      {
        system: 'Coolant',
        interval: '300,000 miles / 2 years',
        techNote: 'Whichever comes first. Check nitrite levels.',
        mileageBase: 300000,
      },
      {
        system: 'DPF Filter',
        interval: '250,000 – 400,000 miles',
        techNote: 'Check DPF backpressure sensors at this mark.',
        mileageBase: 250000,
        isDpf: true,
      },
    ],
  },
  'volvo-d13': {
    id: 'volvo-d13',
    name: 'Volvo D13 / Mack MP8',
    subtitle: 'Volvo & Mack',
    fluidSpec: 'VDS-5 / API CK-4 or FA-4',
    items: [
      {
        system: 'Engine Oil & Filter',
        interval: '45,000 miles (Standard) | 60,000 miles (Long Haul)',
        techNote: 'Use CK-4 or FA-4 synthetic only.',
        mileageBase: 45000,
      },
      {
        system: 'Fuel Filters',
        interval: 'Every oil change',
        techNote: 'Replace both primary and secondary filters.',
      },
      {
        system: 'Valve Lash (Overhead)',
        interval: '125,000 miles, then every 250,000 miles',
        techNote: 'Essential for fuel economy and engine life.',
        mileageBase: 125000,
      },
      {
        system: 'Coolant',
        interval: '300,000 miles / 24 months',
        techNote: 'Whichever comes first. Volvo exchange program standard.',
        mileageBase: 300000,
      },
      {
        system: 'DPF Filter',
        interval: '250,000 miles',
        techNote: 'Volvo exchange program standard. Check backpressure sensors.',
        mileageBase: 250000,
        isDpf: true,
      },
    ],
  },
}

export const PLATFORM_OPTIONS: { value: PlatformKey; label: string }[] = [
  { value: 'detroit-dd', label: 'Detroit Diesel DD13 / DD15 (Freightliner & Western Star)' },
  { value: 'cummins-x15', label: 'Cummins X15 (International, Kenworth, Peterbilt)' },
  { value: 'paccar-mx13', label: 'PACCAR MX-13 (Kenworth & Peterbilt)' },
  { value: 'volvo-d13', label: 'Volvo D13 / Mack MP8' },
]

import type { CollectionConfig } from 'payload'

const SECTION_OPTIONS: { label: string; value: string }[] = [
  { label: 'Engine', value: 'engine' },
  { label: 'Coolant', value: 'coolant' },
  { label: 'Exhaust / Aftertreatment', value: 'exhaust' },
  { label: 'Transmission', value: 'transmission' },
  { label: 'Chassis', value: 'chassis' },
  { label: 'Miscellaneous', value: 'miscellaneous' },
  { label: 'Other', value: 'other' },
]

export const ServiceIntervals: CollectionConfig = {
  slug: 'service-intervals',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'make', 'model', 'yearRange', 'status'],
    description: 'Truck and engine service interval guidelines. One document per PDF or source.',
    group: 'Tools',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Display name, e.g. "Volvo VNL 2022+", "Cummins X15 Efficiency", "PACCAR MX-13"',
      },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Engine', value: 'engine' },
        { label: 'Truck / Vehicle', value: 'truck' },
      ],
      defaultValue: 'engine',
    },
    {
      name: 'make',
      type: 'text',
      required: true,
      admin: {
        description: 'Manufacturer: Volvo, Cummins, PACCAR, Detroit, Peterbilt, etc.',
      },
    },
    {
      name: 'model',
      type: 'text',
      admin: {
        description: 'Engine or truck model: X15, MX-13, VNL, VNR, T680, DD13, DD15',
      },
    },
    {
      name: 'yearRange',
      type: 'text',
      admin: {
        description: 'Year applicability: "2017–2020", "2021 and newer", "Model year 2011+", "Gen 5"',
      },
    },
    {
      name: 'applicability',
      type: 'textarea',
      admin: {
        description: 'EPA level, oil spec, duty definitions, or other context',
      },
    },
    {
      name: 'sourcePdf',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Attach the source PDF when available',
      },
      filterOptions: {
        mimeType: { contains: 'pdf' },
      },
    },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: {
        description: 'URL for web-only sources (e.g. DTNA Tech Lit) when no PDF',
      },
    },
    {
      name: 'intervals',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'section',
          type: 'select',
          required: true,
          options: SECTION_OPTIONS,
          defaultValue: 'engine',
        },
        {
          name: 'service',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. "Engine oil, filters, fuel filters"',
          },
        },
        {
          name: 'interval',
          type: 'text',
          required: true,
          admin: {
            description: 'e.g. "60,000 / 45,000 / 35,000 mi" or "40,000 miles"',
          },
        },
        {
          name: 'dutyNote',
          type: 'text',
          admin: {
            description: 'e.g. "Normal / Heavy / Severe" — explains interval columns',
          },
        },
        {
          name: 'notes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only published documents appear in the search tool',
      },
    },
  ],
}

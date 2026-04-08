import type { CollectionConfig } from 'payload'

/**
 * Owner-operator / driver accounts for the Command Center dashboard.
 * Auth uses the same Payload cookie pattern as mechanics; only one frontend role should be logged in per browser session.
 * Mobile app (future): reuse this collection + REST/GraphQL or a thin /api/command-center/me JSON route.
 */
export const OwnerOperators: CollectionConfig = {
  slug: 'owner-operators',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Command Center',
    description: 'Driver accounts: saved truck, lanes, and cost assumptions for the owner-operator hub.',
    defaultColumns: ['email', 'displayName', 'homeBaseState', 'updatedAt'],
  },
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (user?.collection === 'users') return true
      if (user?.collection === 'owner-operators') {
        return { id: { equals: user.id } }
      }
      return false
    },
    update: ({ req: { user } }) => {
      if (user?.collection === 'users') return true
      if (user?.collection === 'owner-operators') {
        return { id: { equals: user.id } }
      }
      return false
    },
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    {
      name: 'displayName',
      type: 'text',
      label: 'Display name',
      admin: { description: 'How we greet you on the dashboard.' },
    },
    {
      type: 'collapsible',
      label: 'Home base & lanes',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'homeBaseCity', type: 'text', label: 'Home base city' },
            { name: 'homeBaseState', type: 'text', label: 'State (e.g. TX)', admin: { description: 'Two-letter code helps pre-fill directory search.' } },
          ],
        },
        {
          name: 'frequentLanes',
          type: 'textarea',
          label: 'Frequent lanes or regions',
          admin: { description: 'e.g. I-35 Dallas–Kansas City, Southeast regional' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Truck (for tools)',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'truckMake', type: 'text', label: 'Make' },
            { name: 'truckModel', type: 'text', label: 'Model / engine family' },
            { name: 'truckYear', type: 'number', label: 'Year', min: 1990, max: 2030 },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Cost assumptions (per mile / month)',
      admin: {
        description: 'Rough planning numbers — not tax or accounting advice. Used only in your dashboard summary.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'fuelCostPerMile',
              type: 'number',
              label: 'Fuel $/mi',
              min: 0,
              admin: { step: 0.01, description: 'Example: 0.55' },
            },
            {
              name: 'maintenanceCostPerMile',
              type: 'number',
              label: 'Maintenance reserve $/mi',
              min: 0,
              admin: { step: 0.01, description: 'Set aside for PM and wear' },
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'insuranceMonthly',
              type: 'number',
              label: 'Insurance $/month',
              min: 0,
              admin: { step: 1 },
            },
            {
              name: 'otherMonthly',
              type: 'number',
              label: 'Other fixed $/month',
              min: 0,
              admin: { step: 1, description: 'ELD, software, parking, etc.' },
            },
            {
              name: 'avgMilesPerMonth',
              type: 'number',
              label: 'Avg miles / month',
              defaultValue: 8500,
              min: 1,
              admin: { description: 'Used to spread monthly fixed costs into $/mi.' },
            },
          ],
        },
      ],
    },
  ],
}

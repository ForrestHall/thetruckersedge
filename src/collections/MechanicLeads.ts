import type { CollectionConfig } from 'payload'

/**
 * Inbound contact requests from public mechanic microsites.
 * Created only via POST /api/mechanic-leads (overrideAccess). Mechanics see their own rows in the dashboard.
 */
export const MechanicLeads: CollectionConfig = {
  slug: 'mechanic-leads',
  admin: {
    useAsTitle: 'contactName',
    group: 'Mechanic Sites',
    defaultColumns: ['contactName', 'mechanicSite', 'cityOrLocation', 'createdAt'],
    description: 'Driver/fleet messages submitted from hosted mechanic pages.',
    pagination: { defaultLimit: 25 },
  },
  access: {
    create: () => false,
    read: ({ req: { user } }) => {
      if (user?.collection === 'users') return true
      if (user?.collection === 'mechanics') {
        return { mechanic: { equals: user.id } }
      }
      return false
    },
    update: () => false,
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  fields: [
    {
      name: 'mechanic',
      type: 'relationship',
      relationTo: 'mechanics',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Shop account (denormalized for access control).',
      },
    },
    {
      name: 'mechanicSite',
      type: 'relationship',
      relationTo: 'mechanic-sites',
      required: true,
      admin: { description: 'Page this lead was sent from.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'contactName', type: 'text', required: true, label: 'Name' },
        { name: 'cityOrLocation', type: 'text', label: 'City / location' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', label: 'Phone' },
        { name: 'email', type: 'email', label: 'Email' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      label: 'Message',
    },
    {
      name: 'sourcePath',
      type: 'text',
      admin: {
        description: 'Request path when submitted (optional, for debugging).',
      },
    },
  ],
}

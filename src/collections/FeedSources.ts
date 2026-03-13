import type { CollectionConfig } from 'payload'

const CATEGORY_OPTIONS = [
  { label: 'Regulations', value: 'regulations' },
  { label: 'Freight', value: 'freight' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Safety', value: 'safety' },
  { label: 'Technology', value: 'technology' },
  { label: 'General', value: 'general' },
]

export const FeedSources: CollectionConfig = {
  slug: 'feed-sources',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'feedUrl', 'category', 'enabled'],
    description: 'RSS feeds for the Truckers News page. Add or disable sources here.',
    group: 'Content',
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
        description: 'Display name, e.g. "Fleet Owner", "FMCSA"',
      },
    },
    {
      name: 'feedUrl',
      type: 'text',
      required: true,
      admin: {
        description: 'Full RSS or Atom feed URL',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: CATEGORY_OPTIONS,
      admin: {
        description: 'Optional category for grouping',
      },
    },
    {
      name: 'enabled',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Uncheck to stop fetching this feed without deleting it',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      admin: {
        description: 'Order in admin list (lower = first)',
      },
    },
  ],
}

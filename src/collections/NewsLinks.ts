import type { CollectionConfig } from 'payload'

const CATEGORY_OPTIONS = [
  { label: 'Regulations', value: 'regulations' },
  { label: 'Freight', value: 'freight' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Safety', value: 'safety' },
  { label: 'Technology', value: 'technology' },
  { label: 'General', value: 'general' },
]

export const NewsLinks: CollectionConfig = {
  slug: 'news-links',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'source', 'category', 'publishedAt', 'status'],
    description: 'Manually curated links for the Truckers News page.',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Headline text (shown as link)',
      },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        description: 'Full URL (external) or path (e.g. /blog/my-post)',
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Source label, e.g. "The Truckers Edge"',
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
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
        description: 'Used for sorting (most recent first)',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}

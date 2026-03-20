import type { CollectionConfig } from 'payload'

export const ProcessedNewsItems: CollectionConfig = {
  slug: 'processed-news-items',
  admin: {
    useAsTitle: 'originalTitle',
    defaultColumns: ['originalTitle', 'rewrittenTitle', 'viralScore', 'source', 'publishedAt'],
    description: 'AI-processed RSS items. Override headline or hide from the news page.',
    group: 'Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique URL (dedup key)',
      },
    },
    {
      name: 'originalTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'rewrittenTitle',
      type: 'text',
      admin: {
        description: 'AI-generated catchy headline',
      },
    },
    {
      name: 'viralScore',
      type: 'number',
      admin: {
        description: 'AI score 1-10 for viral potential',
      },
    },
    {
      name: 'headlineOverride',
      type: 'text',
      admin: {
        description: 'Override: when set, displayed instead of AI rewrite',
      },
    },
    {
      name: 'hidden',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Hide this item from the news page',
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'text',
      required: true,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'processedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'When AI processed this item',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'Generated with the headline for search/social; edit if needed.',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Title tag / SERP title (~50–60 characters).',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Meta description for search snippets (~150–160 characters).',
          },
        },
      ],
    },
  ],
}

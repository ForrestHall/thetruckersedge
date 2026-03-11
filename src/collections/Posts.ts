import type { CollectionConfig } from 'payload'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'publishedAt'],
    description: 'Blog posts — news, tips, and updates for truckers.',
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.title && (!data.slug || data.slug.trim() === '')) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        description: 'Auto-generated from title. Leave blank to generate from title.',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Short description for listing pages and search (150–160 chars).',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main image for the post. Shown in listings and social previews.',
      },
      filterOptions: {
        mimeType: { contains: 'image' },
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        description: 'Who wrote this post.',
      },
    },
    {
      name: 'content',
      type: 'code',
      required: true,
      admin: {
        language: 'html',
        description: 'Paste or write HTML for the post body.',
      },
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Overrides the page title in search results (60 chars max).',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Shown under the link in Google results (155 chars max).',
          },
        },
        {
          name: 'structuredData',
          type: 'json',
          label: 'Structured Data (JSON-LD)',
          admin: {
            description:
              'Paste JSON-LD schema markup (e.g. Article, FAQPage). This will be injected into the page as a <script type="application/ld+json"> tag.',
          },
        },
      ],
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
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      defaultValue: 'draft',
      required: true,
    },
  ],
}

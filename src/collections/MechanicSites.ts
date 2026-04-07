import type { CollectionConfig } from 'payload'
import { slugify } from '@/lib/slugify'

const statusOptions = [
  { label: 'Pending review', value: 'pending_review' },
  { label: 'Approved (awaiting payment)', value: 'approved' },
  { label: 'Active (live)', value: 'active' },
  { label: 'Suspended', value: 'suspended' },
  { label: 'Rejected', value: 'rejected' },
] as const

const subscriptionStatusOptions = [
  { label: 'Trialing', value: 'trialing' },
  { label: 'Active', value: 'active' },
  { label: 'Past due', value: 'past_due' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Unpaid', value: 'unpaid' },
] as const

const dayOptions = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
]

export const MechanicSites: CollectionConfig = {
  slug: 'mechanic-sites',
  admin: {
    useAsTitle: 'businessName',
    group: 'Mechanic Sites',
    description: 'Hosted one-page sites for diesel mechanics. Filter by status to review pending submissions.',
    defaultColumns: ['businessName', 'slug', 'status', 'subscriptionStatus', 'city', 'state', 'updatedAt'],
    listSearchableFields: ['businessName', 'slug', 'city', 'email'],
    pagination: {
      defaultLimit: 25,
    },
  },
  access: {
    create: async ({ req }) => {
      if (req.user?.collection === 'users') return true
      if (req.user?.collection !== 'mechanics') return false
      const { totalDocs } = await req.payload.count({
        collection: 'mechanic-sites',
        where: { mechanic: { equals: req.user.id } },
      })
      return totalDocs === 0
    },
    read: ({ req: { user } }) => {
      if (user?.collection === 'users') return true
      if (user?.collection === 'mechanics') {
        return {
          mechanic: {
            equals: user.id,
          },
        }
      }
      return false
    },
    update: ({ req: { user } }) => {
      if (user?.collection === 'users') return true
      if (user?.collection === 'mechanics') {
        return {
          mechanic: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
  hooks: {
    beforeValidate: [
      async ({ data, operation, originalDoc, req }) => {
        const next = { ...data }
        if (typeof next.businessName === 'string' && next.businessName.trim()) {
          if (operation === 'create' || !next.slug) {
            const raw =
              typeof next.slug === 'string' && next.slug.trim()
                ? next.slug
                : next.businessName
            let base = slugify(raw)
            if (!base) base = `mechanic-${Date.now()}`
            let candidate = base
            let n = 0
            for (;;) {
              const found = await req.payload.find({
                collection: 'mechanic-sites',
                where: {
                  and: [
                    { slug: { equals: candidate } },
                    ...(operation === 'update' && originalDoc?.id != null
                      ? [{ id: { not_equals: originalDoc.id } }]
                      : []),
                  ],
                },
                limit: 1,
                depth: 0,
              })
              if (found.docs.length === 0) {
                next.slug = candidate
                break
              }
              n += 1
              candidate = `${base}-${n}`
            }
          } else if (typeof next.slug === 'string') {
            next.slug = slugify(next.slug) || next.slug
          }
        }
        return next
      },
    ],
    beforeChange: [
      ({ data, operation, req }) => {
        const next = { ...data }
        if (req.user?.collection === 'mechanics') {
          delete next.stripeCustomerId
          delete next.stripeSubscriptionId
          delete next.subscriptionStatus
          delete next.subscriptionPaidThrough
          delete next.rejectionNote
          if (operation === 'update') {
            delete next.status
            delete next.mechanic
          }
          if (operation === 'create') {
            next.status = 'pending_review'
            next.mechanic = req.user!.id
          }
        }
        return next
      },
    ],
  },
  fields: [
    {
      name: 'mechanic',
      type: 'relationship',
      relationTo: 'mechanics',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Account that owns this page.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending_review',
      options: [...statusOptions],
      admin: {
        position: 'sidebar',
        description: 'Pending: awaiting review. Approved: mechanic can pay. Active: live on the site.',
      },
    },
    {
      name: 'rejectionNote',
      type: 'textarea',
      label: 'Rejection note',
      admin: {
        position: 'sidebar',
        description: 'Shown to the mechanic when status is Rejected (optional).',
        condition: (data) => data?.status === 'rejected',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'businessName',
          type: 'text',
          required: true,
          label: 'Business name',
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
          unique: true,
          label: 'URL slug',
          admin: {
            description: 'Public URL: /mechanics/your-slug',
          },
        },
      ],
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
    },
    {
      type: 'collapsible',
      label: 'Look & layout',
      admin: {
        description: 'Theme and optional hero photo for your public page.',
      },
      fields: [
        {
          name: 'themePreset',
          type: 'select',
          label: 'Color theme',
          defaultValue: 'classic_navy',
          options: [
            { label: 'Classic navy (Truckers Edge)', value: 'classic_navy' },
            { label: 'Steel & slate', value: 'steel_slate' },
            { label: 'Amber forge', value: 'amber_forge' },
            { label: 'Forest line', value: 'forest_line' },
          ],
        },
        {
          name: 'layoutDensity',
          type: 'select',
          label: 'Spacing',
          defaultValue: 'comfortable',
          options: [
            { label: 'Comfortable', value: 'comfortable' },
            { label: 'Compact', value: 'compact' },
          ],
        },
        {
          name: 'heroBackground',
          type: 'upload',
          relationTo: 'media',
          label: 'Hero background image',
          admin: {
            description: 'Optional wide photo behind the header (shop, bay, or trucks). Dark overlay is applied for readability.',
          },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'SEO (optional)',
      admin: {
        description: 'Override auto-generated title and description for Google. Leave blank to use defaults.',
      },
      fields: [
        {
          name: 'seoMetaTitle',
          type: 'text',
          label: 'Meta title',
          admin: {
            description: '~50–60 characters. Shown in search results.',
          },
        },
        {
          name: 'seoMetaDescription',
          type: 'textarea',
          label: 'Meta description',
          admin: {
            description: '~150–160 characters. Shown under the title in search results.',
          },
        },
      ],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
    },
    {
      name: 'about',
      type: 'textarea',
      label: 'About',
    },
    {
      name: 'services',
      type: 'array',
      label: 'Services',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      label: 'Certifications',
      fields: [{ name: 'label', type: 'text', required: true }],
    },
    {
      name: 'businessHours',
      type: 'array',
      label: 'Business hours',
      fields: [
        { name: 'day', type: 'select', options: [...dayOptions], required: true },
        { name: 'open', type: 'text', label: 'Opens', admin: { description: 'e.g. 8:00 AM or Closed' } },
        { name: 'close', type: 'text', label: 'Closes', admin: { description: 'e.g. 5:00 PM' } },
      ],
    },
    {
      type: 'collapsible',
      label: 'Contact & location',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'phone', type: 'text', label: 'Business phone' },
            { name: 'email', type: 'email', label: 'Public contact email' },
          ],
        },
        {
          name: 'address',
          type: 'text',
          label: 'Street address',
        },
        {
          type: 'row',
          fields: [
            { name: 'city', type: 'text' },
            { name: 'state', type: 'text', admin: { description: 'State or province' } },
            { name: 'zip', type: 'text', label: 'ZIP / postal' },
          ],
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website URL',
          admin: { description: 'Optional external site (https://...)' },
        },
      ],
    },
    {
      name: 'gallery',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Photo gallery',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaText',
          type: 'text',
          label: 'CTA button text',
          defaultValue: 'Call now',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'CTA link',
          admin: { description: 'tel:, mailto:, or https:// URL' },
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Subscription (Stripe)',
      admin: {
        description: 'Updated by Stripe webhooks and checkout.',
      },
      fields: [
        {
          name: 'stripeCustomerId',
          type: 'text',
          label: 'Stripe customer ID',
          admin: { readOnly: true },
        },
        {
          name: 'stripeSubscriptionId',
          type: 'text',
          label: 'Stripe subscription ID',
          admin: { readOnly: true },
        },
        {
          name: 'subscriptionStatus',
          type: 'select',
          label: 'Subscription status',
          options: [...subscriptionStatusOptions],
          admin: { readOnly: true },
        },
        {
          name: 'subscriptionPaidThrough',
          type: 'date',
          label: 'Paid through',
          admin: {
            readOnly: true,
            description: 'Updated when invoices are paid.',
            date: { pickerAppearance: 'dayOnly' },
          },
        },
      ],
    },
  ],
}

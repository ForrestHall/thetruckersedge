import type { CollectionConfig } from 'payload'

export const Mechanics: CollectionConfig = {
  slug: 'mechanics',
  auth: true,
  admin: {
    useAsTitle: 'email',
    group: 'Mechanic Sites',
    description: 'Diesel mechanics who can log in to manage their hosted page.',
  },
  fields: [
    {
      name: 'businessName',
      type: 'text',
      label: 'Business name',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
    },
  ],
  access: {
    create: () => true,
    read: ({ req: { user } }) => {
      if (user?.collection === 'users') return true
      if (user?.collection === 'mechanics') {
        return {
          id: {
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
          id: {
            equals: user.id,
          },
        }
      }
      return false
    },
    delete: ({ req: { user } }) => user?.collection === 'users',
  },
}

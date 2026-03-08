import type { CollectionConfig } from 'payload'

export const PracticeTests: CollectionConfig = {
  slug: 'practice-tests',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'endorsement', 'questionCount', 'status'],
    description: 'CDL practice tests grouped by endorsement type.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "CDL General Knowledge Practice Test — 100 Questions"',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'endorsement',
      type: 'select',
      required: true,
      options: [
        { label: 'General Knowledge', value: 'general-knowledge' },
        { label: 'Air Brakes', value: 'air-brakes' },
        { label: 'HazMat', value: 'hazmat' },
        { label: 'Combination Vehicles', value: 'combination' },
        { label: 'Doubles & Triples', value: 'doubles-triples' },
        { label: 'Passenger Transport', value: 'passenger' },
        { label: 'School Bus', value: 'school-bus' },
        { label: 'Tank Vehicles', value: 'tank' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Shown at the top of the test page.',
      },
    },
    {
      name: 'questions',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answers',
          type: 'array',
          required: true,
          minRows: 2,
          maxRows: 4,
          fields: [
            {
              name: 'text',
              type: 'text',
              required: true,
            },
            {
              name: 'correct',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
        {
          name: 'explanation',
          type: 'textarea',
          admin: {
            description: 'Shown after answering, explains why the correct answer is right.',
          },
        },
      ],
    },
    {
      name: 'questionCount',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Auto-calculated from questions array.',
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
  hooks: {
    beforeChange: [
      ({ data }) => {
        if (data.questions) {
          data.questionCount = data.questions.length
        }
        return data
      },
    ],
  },
}

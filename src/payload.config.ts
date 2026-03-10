import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Articles } from './collections/Articles'
import { PracticeTests } from './collections/PracticeTests'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— The Truckers Edge',
    },
  },
  collections: [Articles, PracticeTests, Categories, Media, Users],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
    },
    push: true,
  }),
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
  upload: {
    limits: {
      fileSize: 5000000,
    },
  },
})

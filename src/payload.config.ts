import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Articles } from './collections/Articles'
import { Posts } from './collections/Posts'
import { PracticeTests } from './collections/PracticeTests'
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { ServiceIntervals } from './collections/ServiceIntervals'
import { FeedSources } from './collections/FeedSources'
import { NewsLinks } from './collections/NewsLinks'
import { ProcessedNewsItems } from './collections/ProcessedNewsItems'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— The Truckers Edge',
    },
  },
  collections: [Articles, Posts, PracticeTests, Categories, Media, ServiceIntervals, FeedSources, NewsLinks, ProcessedNewsItems, Users],
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

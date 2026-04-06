import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'

import { Mechanics } from './collections/Mechanics'
import { MechanicSites } from './collections/MechanicSites'
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
import { runProcessNewsJob } from './lib/process-news-job'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— The Truckers Edge',
    },
    components: {
      beforeDashboard: ['/src/components/admin/ProcessNewsButton#ProcessNewsButton'],
    },
  },
  endpoints: [
    {
      path: '/process-news',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Not authenticated. Log in at /admin.' }, { status: 401 })
        }
        try {
          const result = await runProcessNewsJob()
          return Response.json({ processed: result.processed, error: result.error })
        } catch (err) {
          console.error('[process-news] Error:', err)
          return Response.json(
            { error: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 }
          )
        }
      },
    },
  ],
  collections: [
    Articles,
    Posts,
    PracticeTests,
    Categories,
    Media,
    ServiceIntervals,
    FeedSources,
    NewsLinks,
    ProcessedNewsItems,
    Mechanics,
    MechanicSites,
    Users,
  ],
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

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

// Tracks whether DB has been initialized in this process
let dbReady = false

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
  onInit: async (payload) => {
    if (dbReady) return
    dbReady = true

    try {
      const { Pool } = await import('pg')
      const pool = new Pool({ connectionString: process.env.DATABASE_URL })
      const result = await pool.query(`SELECT to_regclass('public.users') AS tbl`)
      await pool.end()
      const tableExists = result?.rows?.[0]?.tbl !== null

      if (!tableExists) {
        console.log('[DB Init] Fresh database detected — running migrateFresh...')
        await payload.db.migrateFresh({ forceAcceptWarning: true })
        console.log('[DB Init] Database tables created successfully.')
      } else {
        console.log('[DB Init] Database already initialized.')
      }
    } catch (err: any) {
      console.error('[DB Init] Error during auto-init:', err?.message ?? err)
    }
  },
})

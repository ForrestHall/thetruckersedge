/**
 * Run before npm start on first deploy. Triggers Payload schema push (creates tables).
 * Uses NODE_ENV=development so pushDevSchema runs.
 */
process.env.NODE_ENV = 'development'

import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  try {
    await getPayload({ config })
    console.log('[init-db] Schema push complete. Tables created.')
    process.exit(0)
  } catch (err: any) {
    console.error('[init-db] Error:', err?.message ?? err)
    process.exit(1)
  }
}

main()

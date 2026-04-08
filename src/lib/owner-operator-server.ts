import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { OwnerOperator } from '@/payload-types'

export async function getCurrentOwnerOperator(): Promise<OwnerOperator | null> {
  const h = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: h })
  if (user?.collection === 'owner-operators') {
    return user as OwnerOperator
  }
  return null
}

/**
 * Mobile app roadmap (shared types later):
 * - Reuse `owner-operators` JWT from POST /api/owner-operators/login (or refresh flow).
 * - Add GET /api/command-center/me returning this profile JSON + computed summaries (CORS + Bearer optional).
 * - Capacitor/React Native: same endpoints, secure storage for token, biometrics optional.
 */

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Mechanic } from '@/payload-types'

export async function getCurrentMechanic(): Promise<Mechanic | null> {
  const h = await headers()
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: h })
  if (user?.collection === 'mechanics') {
    return user as Mechanic
  }
  return null
}

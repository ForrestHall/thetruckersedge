import { getPayload } from 'payload'
import config from '@payload-config'
import type { Mechanic } from '@/payload-types'

export async function getMechanicFromRequest(request: Request): Promise<Mechanic | null> {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (user && user.collection === 'mechanics') {
    return user as Mechanic
  }
  return null
}

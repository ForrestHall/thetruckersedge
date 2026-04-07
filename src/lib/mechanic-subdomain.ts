import { getBaseUrl } from '@/lib/media'
import { parseMechanicSlugFromHost } from '@/lib/mechanic-subdomain-core'
import type { MechanicSite } from '@/payload-types'

export { parseMechanicSlugFromHost, getMainSiteOrigin } from '@/lib/mechanic-subdomain-core'

/**
 * Public URL for this mechanic page: subdomain when host matches `slug` + configured root domain, else path on main site.
 */
export function resolveMechanicMicrositePublicUrl(
  site: MechanicSite,
  hostHeader: string | null | undefined,
  forwardedProto: string | null | undefined,
): string {
  const base = getBaseUrl().replace(/\/$/, '')
  const pathUrl = `${base}/mechanics/${site.slug}`

  const root = process.env.MECHANIC_SUBDOMAIN_ROOT_DOMAIN?.trim()
  if (!root || !hostHeader) return pathUrl

  const host = hostHeader.split(':')[0].toLowerCase()
  const slug = parseMechanicSlugFromHost(host, root)
  if (slug !== site.slug) return pathUrl

  const rawProto = (forwardedProto || '').split(',')[0].trim().toLowerCase()
  const proto =
    rawProto === 'https' || rawProto === 'http'
      ? rawProto
      : process.env.NODE_ENV === 'production'
        ? 'https'
        : 'http'
  return `${proto}://${hostHeader}`
}

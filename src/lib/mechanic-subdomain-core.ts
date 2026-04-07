import { getBaseUrl } from '@/lib/media'

/** Subdomains that never map to a mechanic microsite. */
const RESERVED = new Set([
  'www',
  'api',
  'admin',
  'app',
  'cdn',
  'mail',
  'ftp',
  'staging',
  'test',
  'dev',
])

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * When `MECHANIC_SUBDOMAIN_ROOT_DOMAIN` is set (e.g. `localhost` for dev, `thetruckersedge.com` in prod),
 * returns the mechanic slug for `slug.rootDomain` hosts, or null for apex / www / reserved / invalid.
 */
export function parseMechanicSlugFromHost(hostnameNoPort: string, rootDomain: string): string | null {
  const h = hostnameNoPort.toLowerCase()
  const root = rootDomain.trim().toLowerCase()
  if (!root) return null
  if (h === root || h === `www.${root}`) return null
  const suffix = `.${root}`
  if (!h.endsWith(suffix)) return null
  const sub = h.slice(0, -suffix.length)
  if (!sub || sub.includes('.')) return null
  if (RESERVED.has(sub)) return null
  if (!SLUG_RE.test(sub)) return null
  return sub
}

/** Origin for the main app (admin, API from browser on primary host). */
export function getMainSiteOrigin(): string | null {
  const base = getBaseUrl().replace(/\/$/, '')
  try {
    return new URL(base).origin
  } catch {
    return null
  }
}

/**
 * Simple sliding-window rate limit by client IP (best-effort on serverless; resets per instance).
 * Not a substitute for WAF — pairs with honeypot + validation on public lead POSTs.
 */
const WINDOW_MS = 60 * 60 * 1000
const MAX_PER_WINDOW = 8

type Bucket = number[]
const globalBuckets = globalThis as typeof globalThis & { __mechanicLeadBuckets?: Map<string, Bucket> }

function buckets(): Map<string, Bucket> {
  if (!globalBuckets.__mechanicLeadBuckets) {
    globalBuckets.__mechanicLeadBuckets = new Map()
  }
  return globalBuckets.__mechanicLeadBuckets
}

export function mechanicLeadRateLimitOk(ip: string): boolean {
  const key = ip || 'unknown'
  const now = Date.now()
  const map = buckets()
  const prev = map.get(key) ?? []
  const fresh = prev.filter((t) => now - t < WINDOW_MS)
  if (fresh.length >= MAX_PER_WINDOW) {
    map.set(key, fresh)
    return false
  }
  fresh.push(now)
  map.set(key, fresh)
  return true
}

export function clientIpFromRequest(request: Request): string {
  const xf = request.headers.get('x-forwarded-for')
  if (xf) {
    const first = xf.split(',')[0]?.trim()
    if (first) return first
  }
  return request.headers.get('x-real-ip')?.trim() || ''
}

/**
 * Resolves a media URL to an absolute URL.
 * Payload may return relative paths (e.g. /media/xyz.jpg) when served locally.
 * Prepends NEXT_PUBLIC_SERVER_URL for relative URLs so images load correctly in production.
 */
export function getMediaUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''
  if (!base) return url.startsWith('/') ? url : `/${url}`

  return url.startsWith('/') ? `${base}${url}` : `${base}/${url}`
}

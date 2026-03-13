/**
 * Resolves a media URL to an absolute URL.
 * Payload may return relative paths (e.g. /media/xyz.jpg) or full URLs.
 * - Relative paths: prepends NEXT_PUBLIC_SERVER_URL so images load in production.
 * - Full URLs with localhost: replaced with NEXT_PUBLIC_SERVER_URL when set (fixes prod deploy).
 */
export function getMediaUrl(url: string | undefined | null): string | null {
  if (!url || typeof url !== 'string') return null

  const base = process.env.NEXT_PUBLIC_SERVER_URL || ''

  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (base && (url.includes('localhost') || url.includes('127.0.0.1'))) {
      const path = url.replace(/^https?:\/\/[^/]+/, '') || '/'
      return `${base.replace(/\/$/, '')}${path}`
    }
    return url
  }

  if (!base) return url.startsWith('/') ? url : `/${url}`

  return url.startsWith('/') ? `${base.replace(/\/$/, '')}${url}` : `${base.replace(/\/$/, '')}/${url}`
}

/**
 * Rewrites img src attributes in HTML so localhost/relative URLs use NEXT_PUBLIC_SERVER_URL.
 * Use for HTML content (e.g. from HtmlContent) that may contain embedded media.
 */
export function processHtmlMediaUrls(html: string): string {
  if (!html || typeof html !== 'string') return html
  return html.replace(
    /(<img[^>]+src=)(["'])([^"']+)\2/gi,
    (_, before, quote, src) => {
      const resolved = getMediaUrl(src)
      return `${before}${quote}${resolved ?? src}${quote}`
    }
  )
}

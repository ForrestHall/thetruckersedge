import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getMainSiteOrigin, parseMechanicSlugFromHost } from '@/lib/mechanic-subdomain-core'

export function middleware(request: NextRequest) {
  const root = process.env.MECHANIC_SUBDOMAIN_ROOT_DOMAIN?.trim()
  if (!root) return NextResponse.next()

  const host = request.headers.get('host') || ''
  const hostname = host.split(':')[0].toLowerCase()
  const slug = parseMechanicSlugFromHost(hostname, root)
  if (!slug) return NextResponse.next()

  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    const main = getMainSiteOrigin()
    if (main) {
      const target = new URL(pathname + request.nextUrl.search, main)
      return NextResponse.redirect(target)
    }
    return NextResponse.next()
  }

  if (pathname.startsWith('/command-center')) {
    const main = getMainSiteOrigin()
    if (main) {
      return NextResponse.redirect(new URL(pathname + request.nextUrl.search, main))
    }
    return NextResponse.next()
  }

  if (pathname !== '/') {
    const home = request.nextUrl.clone()
    home.pathname = '/'
    return NextResponse.redirect(home)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/mechanics/${slug}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:ico|svg|png|jpg|jpeg|gif|webp|woff2?)$).*)',
  ],
}

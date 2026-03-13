import { NextRequest, NextResponse } from 'next/server'

/**
 * Force logout: clears the payload-token cookie and redirects to admin.
 * Use when Payload's built-in logout fails to clear the session.
 * Visit /api/logout (e.g. when logged in, open /api/logout in a new tab).
 */
export async function GET(request: NextRequest) {
  const proto = request.headers.get('x-forwarded-proto')
  const host = request.headers.get('x-forwarded-host')
  const base =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (proto && host ? `${proto}://${host}` : 'http://localhost:3000')
  const response = NextResponse.redirect(new URL('/admin', base), 302)
  const secure = base.startsWith('https://')
  const cookie =
    `payload-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax; Max-Age=0` +
    (secure ? '; Secure' : '')
  response.headers.append('Set-Cookie', cookie)
  return response
}

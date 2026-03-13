import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { runProcessNewsJob } from '@/lib/process-news-job'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

async function verifyAuth(request: NextRequest): Promise<{ ok: boolean; error?: string }> {
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const headerSecret = request.headers.get('x-cron-secret')
  if (secret && (bearerToken === secret || headerSecret === secret)) {
    return { ok: true }
  }

  const cookieStore = await cookies()
  const cookieHeader =
    request.headers.get('cookie') ||
    cookieStore.getAll().map((c) => `${c.name}=${c.value}`).join('; ')
  if (!cookieHeader) {
    return { ok: false, error: 'No cookies. Log in at /admin first.' }
  }

  const proto = request.headers.get('x-forwarded-proto')
  const host = request.headers.get('x-forwarded-host')
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (proto && host ? `${proto}://${host}` : new URL(request.url).origin)
  const meRes = await fetch(`${baseUrl}/api/users/me`, {
    headers: {
      Cookie: cookieHeader,
      Origin: baseUrl,
      Referer: `${baseUrl}/admin`,
    },
    cache: 'no-store',
  })
  if (!meRes.ok) {
    const referer = request.headers.get('referer') || ''
    if (referer.includes('/admin')) {
      return { ok: true }
    }
    return { ok: false, error: 'Session invalid. Try logging out and back in at /admin.' }
  }
  const data = await meRes.json()
  const user = data?.user ?? data
  if (!user?.id) return { ok: false, error: 'Not authenticated.' }
  return { ok: true }
}

function adminUrl(request: NextRequest, params: Record<string, string>): string {
  const origin = new URL(request.url).origin
  const search = new URLSearchParams(params).toString()
  return `${origin}/admin${search ? `?${search}` : ''}`
}

export async function GET(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth.ok) {
    return NextResponse.redirect(adminUrl(request, { error: auth.error || 'Not authenticated' }))
  }
  try {
    const result = await runProcessNewsJob()
    const params: Record<string, string> = { processed: String(result.processed) }
    if (result.error) params.error = result.error
    if (result.feedsChecked !== undefined) params.feeds = String(result.feedsChecked)
    if (result.itemsFetched !== undefined) params.fetched = String(result.itemsFetched)
    if (result.itemsNew !== undefined) params.new = String(result.itemsNew)
    return NextResponse.redirect(adminUrl(request, params))
  } catch (err) {
    console.error('[admin/process-news] Error:', err)
    return NextResponse.redirect(adminUrl(request, { error: err instanceof Error ? err.message : 'Job failed' }))
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAuth(request)
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error ?? 'Not authenticated. Log in at /admin.' }, { status: 401 })
  }

  try {
    const result = await runProcessNewsJob()
    return NextResponse.json(result)
  } catch (err) {
    console.error('[admin/process-news] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

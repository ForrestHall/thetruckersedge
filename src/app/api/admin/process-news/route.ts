import { NextRequest, NextResponse } from 'next/server'
import { runProcessNewsJob } from '@/lib/process-news-job'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const headerSecret = request.headers.get('x-cron-secret')
  const hasCronAuth = secret && (bearerToken === secret || headerSecret === secret)

  if (!hasCronAuth) {
    const cookieHeader = request.headers.get('cookie')
    if (!cookieHeader) {
      return NextResponse.json(
        { error: 'Not authenticated. Log in at /admin or use CRON_SECRET.' },
        { status: 401 }
      )
    }

    const baseUrl = new URL(request.url).origin
    const meRes = await fetch(`${baseUrl}/api/users/me`, {
      headers: { Cookie: cookieHeader },
      cache: 'no-store',
    })

    if (!meRes.ok) {
      return NextResponse.json(
        { error: 'Not authenticated. Ensure you are logged in at /admin.' },
        { status: 401 }
      )
    }

    const data = await meRes.json()
    const user = data?.user ?? data
    if (!user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }
  }

  try {
    const result = await runProcessNewsJob()
    return NextResponse.json({ processed: result.processed, error: result.error })
  } catch (err) {
    console.error('[admin/process-news] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

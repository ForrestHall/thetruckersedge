import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { runProcessNewsJob } from '@/lib/process-news-job'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')

  if (!cookieHeader) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const proto = request.headers.get('x-forwarded-proto')
  const host = request.headers.get('x-forwarded-host')
  const baseUrl =
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (proto && host ? `${proto}://${host}` : 'http://localhost:3000')
  const meRes = await fetch(`${baseUrl}/api/users/me`, {
    headers: { Cookie: cookieHeader },
  })

  if (!meRes.ok) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const data = await meRes.json()
  const user = data?.user ?? data
  if (!user?.id) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
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

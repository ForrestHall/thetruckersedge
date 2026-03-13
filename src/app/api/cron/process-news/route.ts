import { NextResponse } from 'next/server'
import { runProcessNewsJob } from '@/lib/process-news-job'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET not configured' }, { status: 500 })
  }

  const authHeader = request.headers.get('authorization')
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
  const headerSecret = request.headers.get('x-cron-secret')

  if (bearerToken !== secret && headerSecret !== secret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await runProcessNewsJob()
    return NextResponse.json({ processed: result.processed, error: result.error })
  } catch (err) {
    console.error('[process-news] Error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

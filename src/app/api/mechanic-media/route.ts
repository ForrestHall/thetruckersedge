import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getMechanicFromRequest } from '@/lib/mechanic-from-request'

export const runtime = 'nodejs'

const MAX_BYTES = 5_000_000

export async function POST(request: Request) {
  const mechanic = await getMechanicFromRequest(request)
  if (!mechanic) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ message: 'Invalid form data' }, { status: 400 })
  }

  const entry = formData.get('file')
  if (!entry || !(entry instanceof File) || entry.size === 0) {
    return NextResponse.json({ message: 'A non-empty image file is required' }, { status: 400 })
  }

  if (entry.size > MAX_BYTES) {
    return NextResponse.json(
      { message: `File too large (max ${MAX_BYTES / 1_000_000}MB)` },
      { status: 413 }
    )
  }

  const altRaw = formData.get('alt')
  const alt = typeof altRaw === 'string' && altRaw.trim() ? altRaw.trim() : entry.name || 'Mechanic upload'

  const buffer = Buffer.from(await entry.arrayBuffer())
  const mimetype = entry.type && entry.type !== 'application/octet-stream' ? entry.type : 'image/jpeg'
  if (!mimetype.startsWith('image/')) {
    return NextResponse.json({ message: 'Only image uploads are allowed' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        mimetype,
        name: entry.name || 'upload',
        size: entry.size,
      },
      overrideAccess: true,
    })
    return NextResponse.json({ doc, message: 'Upload succeeded' })
  } catch (e) {
    console.error('[mechanic-media]', e)
    return NextResponse.json(
      { message: e instanceof Error ? e.message : 'Upload failed' },
      { status: 500 }
    )
  }
}

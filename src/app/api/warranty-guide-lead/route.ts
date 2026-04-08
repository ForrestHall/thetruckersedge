import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { clientIpFromRequest, mechanicLeadRateLimitOk } from '@/lib/mechanic-lead-rate-limit'

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(40),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
  company: z.string().optional(),
})

const SOURCE = 'Commercial truck warranty guide (/tools/truck-warranty-reviews)'

export async function POST(request: Request) {
  const ip = clientIpFromRequest(request)
  if (!mechanicLeadRateLimitOk(`warranty-guide:${ip || 'unknown'}`)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Invalid input'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  if (parsed.data.company?.trim()) {
    return NextResponse.json({ ok: true })
  }

  const { firstName, lastName, email, phone, notes } = parsed.data

  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL
  const fromEmail = process.env.WARRANTY_FROM_EMAIL

  if (!apiKey || !adminEmail || !fromEmail) {
    return NextResponse.json({ error: 'Lead capture is not configured on this server.' }, { status: 503 })
  }

  const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || ''
  const quoteUrl = `${base}/tools/warranty-quote`

  const resend = new Resend(apiKey)

  const leadText = [
    'Warranty guide lead (quick intake)',
    '================================',
    '',
    SOURCE,
    '',
    'Contact',
    '-------',
    `Name: ${firstName} ${lastName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    notes?.trim() ? `\nNotes:\n${notes.trim()}` : '',
    '',
    `Full quote questionnaire: ${quoteUrl}`,
  ]
    .filter(Boolean)
    .join('\n')

  const confirmText = [
    `Hi ${firstName},`,
    '',
    "Thanks for reaching out from our commercial truck warranty guide. We've received your details and will follow up with warranty options that may fit your operation.",
    '',
    `Want to move faster? Complete the full quote questionnaire here:\n${quoteUrl}`,
    '',
    "— The Trucker's Edge",
  ].join('\n')

  const [leadResult, confirmResult] = await Promise.all([
    resend.emails.send({
      from: `The Trucker's Edge <${fromEmail}>`,
      to: adminEmail,
      replyTo: email,
      subject: `Warranty guide lead: ${firstName} ${lastName}`,
      text: leadText,
    }),
    resend.emails.send({
      from: `The Trucker's Edge <${fromEmail}>`,
      to: email,
      subject: "We received your warranty request — The Trucker's Edge",
      text: confirmText,
    }),
  ])

  if (leadResult.error || confirmResult.error) {
    console.error('[warranty-guide-lead] Resend:', leadResult.error, confirmResult.error)
    return NextResponse.json({ error: 'Email could not be sent. Please try again later.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

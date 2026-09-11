import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { clientIpFromRequest, mechanicLeadRateLimitOk } from '@/lib/mechanic-lead-rate-limit'
import { qualificationCopy } from '@/lib/warranty-qualify'

const schema = z.object({
  qualification: z.enum(['likely', 'maybe', 'unlikely']),
  vehicle: z.object({
    year: z.number().min(1990).max(new Date().getFullYear() + 1),
    truckClass: z.number().min(2).max(8),
  }),
  mileage: z.number().min(0),
  usage: z.string().min(1),
  contact: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().trim().email(),
    phone: z.string().trim().min(7).max(40),
  }),
})

const SOURCE = 'Warranty eligibility check (/tools/warranty-qualify)'

export async function POST(request: Request) {
  const ip = clientIpFromRequest(request)
  if (!mechanicLeadRateLimitOk(`warranty-qualify:${ip || 'unknown'}`)) {
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

  const { qualification, vehicle, mileage, usage, contact } = parsed.data

  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL
  const fromEmail = process.env.WARRANTY_FROM_EMAIL

  if (!apiKey || !adminEmail || !fromEmail) {
    return NextResponse.json({ error: 'Lead capture is not configured on this server.' }, { status: 503 })
  }

  const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || ''
  const quoteUrl = `${base}/tools/warranty-quote`
  const tierLabel = qualificationCopy[qualification].headline

  const resend = new Resend(apiKey)

  const leadText = [
    'Warranty eligibility lead',
    '========================',
    '',
    SOURCE,
    '',
    `Result: ${qualification.toUpperCase()} — ${tierLabel}`,
    '',
    'Contact',
    '-------',
    `Name: ${contact.firstName} ${contact.lastName}`,
    `Email: ${contact.email}`,
    `Phone: ${contact.phone}`,
    '',
    'Truck',
    '-----',
    `Year: ${vehicle.year}`,
    `Class: ${vehicle.truckClass}`,
    `Mileage: ${mileage.toLocaleString()}`,
    `Usage: ${usage}`,
    '',
    `Full quote questionnaire: ${quoteUrl}`,
  ].join('\n')

  const confirmText = [
    `Hi ${contact.firstName},`,
    '',
    `Thanks for checking warranty eligibility with The Trucker's Edge.`,
    '',
    tierLabel,
    '',
    qualificationCopy[qualification].detail,
    '',
    `Want to go further? Complete the full quote questionnaire here:\n${quoteUrl}`,
    '',
    "— The Trucker's Edge",
  ].join('\n')

  const [leadResult, confirmResult] = await Promise.all([
    resend.emails.send({
      from: `The Trucker's Edge <${fromEmail}>`,
      to: adminEmail,
      replyTo: contact.email,
      subject: `Warranty qualify (${qualification}): ${contact.firstName} ${contact.lastName}`,
      text: leadText,
    }),
    resend.emails.send({
      from: `The Trucker's Edge <${fromEmail}>`,
      to: contact.email,
      subject: "Your warranty eligibility check — The Trucker's Edge",
      text: confirmText,
    }),
  ])

  if (leadResult.error || confirmResult.error) {
    console.error('[warranty-qualify] Resend:', leadResult.error, confirmResult.error)
    return NextResponse.json({ error: 'Email could not be sent. Please try again later.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

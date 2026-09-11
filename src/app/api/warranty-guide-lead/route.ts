import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { submitAtwLead } from '@/lib/atw-lead'
import { clientIpFromRequest, mechanicLeadRateLimitOk } from '@/lib/mechanic-lead-rate-limit'

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7).max(40),
  notes: z.string().trim().max(2000).optional().or(z.literal('')),
  company: z.string().optional(),
})

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

  try {
    const { leadId } = await submitAtwLead({
      funnel: 'warranty-guide',
      firstName,
      lastName,
      email,
      phone,
      notes: notes?.trim() ? [notes.trim()] : ['Source: truck warranty buyer guide'],
    })

    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.WARRANTY_FROM_EMAIL
    const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || ''

    if (apiKey && fromEmail) {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: `The Trucker's Edge <${fromEmail}>`,
        to: email,
        subject: "We received your warranty request — The Trucker's Edge",
        text: [
          `Hi ${firstName},`,
          '',
          "Thanks for reaching out from our commercial truck warranty guide. We've received your details and will follow up with warranty options that may fit your operation.",
          '',
          `Want to move faster? Complete the full quote questionnaire here:\n${base}/tools/warranty-quote`,
          '',
          "— The Trucker's Edge",
        ].join('\n'),
      }).catch((err) => console.error('[warranty-guide-lead] confirmation email:', err))
    }

    return NextResponse.json({ ok: true, leadId })
  } catch (err) {
    console.error('[warranty-guide-lead] ATW lead:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lead could not be submitted. Please try again.' },
      { status: 502 },
    )
  }
}

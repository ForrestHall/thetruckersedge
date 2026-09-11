import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { submitAtwLead } from '@/lib/atw-lead'
import { clientIpFromRequest, mechanicLeadRateLimitOk } from '@/lib/mechanic-lead-rate-limit'
import {
  buildMatchSummary,
  evaluateWarrantyQualification,
  type CoveragePriority,
  type LeadRequestType,
  type TruckType,
  type TruckUsage,
} from '@/lib/warranty-qualify'

const schema = z.object({
  truckType: z.enum(['class8-otr', 'class8-regional', 'class7', 'medium-duty', 'other']),
  vehicle: z.object({
    year: z.number().min(1990).max(new Date().getFullYear() + 1),
    make: z.string().trim().min(1).max(80),
    model: z.string().trim().min(1).max(80),
  }),
  mileage: z.number().min(0),
  usage: z.enum(['fulltime-otr', 'regional', 'local', 'fleet']),
  coverage: z.enum(['comprehensive', 'balanced', 'powertrain', 'aftertreatment']),
  requestType: z.enum(['quote', 'call']),
  contact: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().max(80).optional().or(z.literal('')),
    email: z.string().trim().email(),
    phone: z.string().trim().min(7).max(40),
  }),
  utm: z
    .object({
      utm_source: z.string().optional(),
      utm_medium: z.string().optional(),
      utm_campaign: z.string().optional(),
      utm_content: z.string().optional(),
      utm_term: z.string().optional(),
    })
    .optional(),
})

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

  const { truckType, vehicle, mileage, usage, coverage, requestType, contact, utm } = parsed.data

  const tier = evaluateWarrantyQualification({
    year: vehicle.year,
    mileage,
    truckType: truckType as TruckType,
  })

  const summaryLines = buildMatchSummary({
    year: String(vehicle.year),
    make: vehicle.make,
    model: vehicle.model,
    mileage: String(mileage),
    truckType: truckType as TruckType,
    usage: usage as TruckUsage,
    coverage: coverage as CoveragePriority,
    tier,
  })

  try {
    const { leadId } = await submitAtwLead({
      funnel: 'warranty-qualify',
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      mileage,
      truckType,
      usage,
      coverage,
      requestType,
      qualification: tier,
      utm,
      notes: summaryLines,
    })

    // Optional user confirmation email when Resend is configured
    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.WARRANTY_FROM_EMAIL
    if (apiKey && fromEmail) {
      const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || ''
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: `The Trucker's Edge <${fromEmail}>`,
        to: contact.email,
        subject: "Your truck warranty match — The Trucker's Edge",
        text: [
          `Hi ${contact.firstName},`,
          '',
          "Thanks for using The Trucker's Edge warranty match tool. We've received your information.",
          '',
          ...summaryLines.map((line) => `• ${line}`),
          '',
          requestType === 'call'
            ? 'A specialist will call you shortly to review your match.'
            : 'A specialist will follow up with your warranty match details.',
          '',
          `Full quote questionnaire: ${base}/tools/warranty-quote`,
          '',
          "— The Trucker's Edge",
        ].join('\n'),
      }).catch((err) => console.error('[warranty-qualify] confirmation email:', err))
    }

    return NextResponse.json({ ok: true, tier, summary: summaryLines, leadId })
  } catch (err) {
    console.error('[warranty-qualify] ATW lead:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lead could not be submitted. Please try again.' },
      { status: 502 },
    )
  }
}

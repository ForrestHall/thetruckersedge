import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { submitAtwLead } from '@/lib/atw-lead'

const schema = z.object({
  vehicle: z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().optional(),
    year: z.number().min(1990).max(new Date().getFullYear() + 1),
    truckClass: z.number().min(2).max(8),
  }),
  mileage: z.number().min(0),
  usage: z.string().min(1, 'Usage is required'),
  contact: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(1, 'Phone is required'),
  }),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Validation failed'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { vehicle, mileage, usage, contact } = parsed.data

  try {
    const { leadId } = await submitAtwLead({
      funnel: 'warranty-quote',
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      mileage,
      truckClass: vehicle.truckClass,
      usage,
      notes: [`Usage type: ${usage}`],
    })

    const apiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.WARRANTY_FROM_EMAIL
    if (apiKey && fromEmail) {
      const resend = new Resend(apiKey)
      await resend.emails.send({
        from: `The Trucker's Edge <${fromEmail}>`,
        to: contact.email,
        subject: "Your Truck Warranty Quote – The Trucker's Edge",
        text: [
          `Hi ${contact.firstName},`,
          '',
          "Thanks for requesting a truck warranty quote. We've received your details and a specialist will follow up with options.",
          '',
          "— The Trucker's Edge",
        ].join('\n'),
      }).catch((err) => console.error('[warranty-quote] confirmation email:', err))
    }

    return NextResponse.json({ success: true, leadId })
  } catch (err) {
    console.error('[warranty-quote] ATW lead:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Lead could not be submitted. Please try again.' },
      { status: 502 },
    )
  }
}

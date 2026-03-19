import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

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
  const apiKey = process.env.RESEND_API_KEY
  const adminEmail = process.env.ADMIN_EMAIL
  const fromEmail = process.env.WARRANTY_FROM_EMAIL

  if (!apiKey || !adminEmail || !fromEmail) {
    return NextResponse.json(
      { error: 'Warranty quote service is not configured' },
      { status: 503 }
    )
  }

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

  const resend = new Resend(apiKey)

  const leadBody = `
Warranty Quote Lead
==================

Contact
-------
Name: ${contact.firstName} ${contact.lastName}
Email: ${contact.email}
Phone: ${contact.phone}

Vehicle
-------
Make: ${vehicle.make}
Model: ${vehicle.model || 'N/A'}
Year: ${vehicle.year}
Class: ${vehicle.truckClass}

Usage
-----
Mileage: ${mileage.toLocaleString()}
Type: ${usage}

---
Submitted via The Trucker's Edge warranty quote tool.
`.trim()

  const confirmationBody = `
Hi ${contact.firstName},

Thanks for requesting a truck warranty quote. We're searching top providers and will email your personalized quote soon.

If you have any questions in the meantime, just reply to this email.

— The Trucker's Edge
`.trim()

  try {
    await Promise.all([
      resend.emails.send({
        from: `The Trucker's Edge <${fromEmail}>`,
        to: adminEmail,
        subject: `Warranty Quote Lead: ${contact.firstName} ${contact.lastName}`,
        text: leadBody,
      }),
      resend.emails.send({
        from: `The Trucker's Edge <${fromEmail}>`,
        to: contact.email,
        subject: "Your Truck Warranty Quote – The Trucker's Edge",
        text: confirmationBody,
      }),
    ])
  } catch (err) {
    console.error('Warranty quote email error:', err)
    return NextResponse.json(
      { error: 'Failed to send. Please try again later.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}

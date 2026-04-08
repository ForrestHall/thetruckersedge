import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
import { z } from 'zod'
import { clientIpFromRequest, mechanicLeadRateLimitOk } from '@/lib/mechanic-lead-rate-limit'
import type { MechanicSite } from '@/payload-types'

const bodySchema = z
  .object({
    siteSlug: z.string().min(1).max(200),
    contactName: z.string().trim().min(2).max(120),
    message: z.string().trim().min(10).max(4000),
    phone: z.string().trim().max(40).optional().or(z.literal('')),
    email: z.string().trim().max(320).optional().or(z.literal('')),
    cityOrLocation: z.string().trim().max(120).optional().or(z.literal('')),
    /** Honeypot — must stay empty */
    company: z.string().max(0).optional(),
  })
  .refine((d) => Boolean((d.phone && d.phone.length > 0) || (d.email && d.email.length > 0)), {
    message: 'Provide a phone number or email so the shop can reach you.',
  })
  .refine((d) => !d.email?.trim() || z.string().email().safeParse(d.email.trim()).success, {
    message: 'Invalid email address.',
  })

function mechanicIdFromSite(site: MechanicSite): number | undefined {
  const m = site.mechanic
  if (typeof m === 'number') return m
  if (m && typeof m === 'object' && typeof m.id === 'number') return m.id
  return undefined
}

export async function POST(request: Request) {
  const ip = clientIpFromRequest(request)
  if (!mechanicLeadRateLimitOk(ip)) {
    return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
  }

  let json: unknown
  try {
    json = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bodySchema.safeParse(json)
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message ?? 'Invalid input'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  const { siteSlug, contactName, message } = parsed.data
  const phone = parsed.data.phone?.trim() || undefined
  const email = parsed.data.email?.trim() || undefined
  const cityOrLocation = parsed.data.cityOrLocation?.trim() || undefined

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'mechanic-sites',
    where: {
      and: [{ slug: { equals: siteSlug.trim() } }, { status: { equals: 'active' } }],
    },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  })

  const site = docs[0] as MechanicSite | undefined
  if (!site) {
    return NextResponse.json({ error: 'Shop not found or not accepting messages.' }, { status: 404 })
  }

  const mechanicId = mechanicIdFromSite(site)
  if (mechanicId == null) {
    return NextResponse.json({ error: 'Invalid listing.' }, { status: 500 })
  }

  const url = new URL(request.url)
  const sourcePath = url.pathname || undefined

  const doc = await payload.create({
    collection: 'mechanic-leads',
    data: {
      mechanic: mechanicId,
      mechanicSite: site.id,
      contactName: contactName.trim(),
      message: message.trim(),
      phone,
      email,
      cityOrLocation,
      sourcePath,
    },
    overrideAccess: true,
  })

  const notifyTo = site.email?.trim()
  const resendKey = process.env.RESEND_API_KEY
  const fromEmail =
    process.env.MECHANIC_LEADS_FROM_EMAIL?.trim() || process.env.WARRANTY_FROM_EMAIL?.trim()
  if (resendKey && fromEmail && notifyTo) {
    try {
      const resend = new Resend(resendKey)
      const base = process.env.NEXT_PUBLIC_SERVER_URL?.replace(/\/$/, '') || ''
      const dashboardLink = `${base}/mechanics/dashboard`
      await resend.emails.send({
        from: fromEmail,
        to: notifyTo,
        subject: `New lead from The Truckers Edge — ${site.businessName}`,
        text: [
          `You have a new message from your hosted page (${site.slug}).`,
          '',
          `Name: ${contactName}`,
          phone ? `Phone: ${phone}` : null,
          email ? `Email: ${email}` : null,
          cityOrLocation ? `Location: ${cityOrLocation}` : null,
          '',
          'Message:',
          message,
          '',
          `View and manage your page: ${dashboardLink}`,
        ]
          .filter(Boolean)
          .join('\n'),
      })
    } catch (e) {
      console.error('[mechanic-leads] Resend notify failed:', e)
    }
  }

  return NextResponse.json({ ok: true, id: doc.id })
}

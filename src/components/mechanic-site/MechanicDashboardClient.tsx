'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { MechanicSite } from '@/payload-types'
import { MechanicSiteEditorForm } from '@/components/mechanic-site/MechanicSiteEditorForm'

export type MechanicDashboardLead = {
  id: number
  contactName: string
  phone?: string | null
  email?: string | null
  cityOrLocation?: string | null
  message: string
  createdAt: string
}

type Props = {
  site: MechanicSite
  leads: MechanicDashboardLead[]
  checkoutFlash?: string | null
  stripeReady: boolean
}

const statusCopy: Record<MechanicSite['status'], { label: string; detail: string }> = {
  pending_review: {
    label: 'Pending review',
    detail: 'Our team will review your page. You can still edit your details below.',
  },
  approved: {
    label: 'Approved',
    detail: 'Subscribe with a card to publish your page and keep it online.',
  },
  active: {
    label: 'Live',
    detail: 'Your page is visible on the directory and at your public URL.',
  },
  suspended: {
    label: 'Suspended',
    detail: 'Your page is hidden. Renew or fix billing in the customer portal if you had a subscription.',
  },
  rejected: {
    label: 'Rejected',
    detail: 'See the note from our team and update your submission, or contact support.',
  },
}

export function MechanicDashboardClient({ site, leads, checkoutFlash, stripeReady }: Props) {
  const router = useRouter()

  async function logout() {
    await fetch('/api/mechanics/logout', { method: 'POST', credentials: 'include' })
    router.push('/mechanics/login')
    router.refresh()
  }

  async function startCheckout() {
    const res = await fetch('/api/mechanic-subscription/checkout', {
      method: 'POST',
      credentials: 'include',
    })
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
    if (!res.ok) {
      alert(data.error || 'Checkout could not start')
      return
    }
    if (data.url) {
      window.location.href = data.url
    }
  }

  async function openPortal() {
    const res = await fetch('/api/mechanic-subscription/portal', {
      method: 'POST',
      credentials: 'include',
    })
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
    if (!res.ok) {
      alert(data.error || 'Billing portal could not open')
      return
    }
    if (data.url) {
      window.location.href = data.url
    }
  }

  const meta = statusCopy[site.status]
  const sub = site.subscriptionStatus

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-navy">Mechanic dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your hosted page and subscription.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {site.status === 'active' && (
            <Link href={`/mechanics/${site.slug}`} className="btn-secondary text-sm !py-2 !px-4">
              View live page
            </Link>
          )}
          <button type="button" onClick={logout} className="btn-secondary text-sm !py-2 !px-4">
            Log out
          </button>
        </div>
      </div>

      {checkoutFlash === 'success' && (
        <div className="rounded-lg bg-green-50 text-green-900 text-sm px-4 py-3 border border-green-100">
          Payment received. Your page should go live within a minute after Stripe confirms the subscription.
        </div>
      )}
      {checkoutFlash === 'cancel' && (
        <div className="rounded-lg bg-amber-50 text-amber-900 text-sm px-4 py-3 border border-amber-100">
          Checkout was cancelled. You can try again when you are ready.
        </div>
      )}

      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Status</h2>
        <p>
          <span className="font-semibold text-gray-800">{meta.label}</span>
          <span className="text-gray-600"> — {meta.detail}</span>
        </p>
        {site.status === 'rejected' && site.rejectionNote?.trim() && (
          <div className="rounded-lg bg-red-50 text-red-900 text-sm px-4 py-3 border border-red-100">
            <span className="font-semibold">Note: </span>
            {site.rejectionNote}
          </div>
        )}
        {sub && (
          <p className="text-sm text-gray-600">
            Billing status: <span className="font-medium text-gray-800">{sub.replace(/_/g, ' ')}</span>
            {site.subscriptionPaidThrough && (
              <>
                {' '}
                · Paid through{' '}
                <span className="font-medium">{new Date(site.subscriptionPaidThrough).toLocaleDateString()}</span>
              </>
            )}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-2">
          {site.status === 'approved' && (
            <button
              type="button"
              onClick={startCheckout}
              disabled={!stripeReady}
              className="btn-primary text-sm !py-2 !px-4 disabled:opacity-50"
            >
              Subscribe & publish
            </button>
          )}
          {site.stripeCustomerId && (
            <button type="button" onClick={openPortal} className="btn-secondary text-sm !py-2 !px-4">
              Manage billing
            </button>
          )}
        </div>
        {site.status === 'approved' && !stripeReady && (
          <p className="text-xs text-amber-800">Payments are not configured on this server yet (missing Stripe keys).</p>
        )}
      </div>

      {site.status === 'active' && (
        <div className="card p-6 space-y-4">
          <h2 className="text-lg font-bold text-brand-navy">Leads from your page</h2>
          <p className="text-sm text-gray-600">
            Messages drivers send from the &quot;Request a callback&quot; form on your public profile.
          </p>
          {leads.length === 0 ? (
            <p className="text-sm text-gray-500 py-2">No messages yet. They will appear here when someone contacts you through your page.</p>
          ) : (
            <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg max-h-[28rem] overflow-y-auto">
              {leads.map((lead) => (
                <li key={lead.id} className="p-4 text-left text-sm space-y-1">
                  <div className="flex flex-wrap justify-between gap-2">
                    <span className="font-semibold text-gray-900">{lead.contactName}</span>
                    <time className="text-xs text-gray-500" dateTime={lead.createdAt}>
                      {new Date(lead.createdAt).toLocaleString()}
                    </time>
                  </div>
                  {(lead.phone || lead.email) && (
                    <p className="text-gray-700">
                      {lead.phone && <span>{lead.phone}</span>}
                      {lead.phone && lead.email && <span className="mx-1">·</span>}
                      {lead.email && <span>{lead.email}</span>}
                    </p>
                  )}
                  {lead.cityOrLocation?.trim() && (
                    <p className="text-gray-600 text-xs">Location: {lead.cityOrLocation}</p>
                  )}
                  <p className="text-gray-700 whitespace-pre-wrap pt-1">{lead.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-brand-navy mb-4">Edit your page</h2>
        <MechanicSiteEditorForm mode="edit" siteId={site.id} initial={site} />
      </div>
    </div>
  )
}

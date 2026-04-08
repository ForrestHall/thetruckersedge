'use client'

import { useState } from 'react'

type Props = {
  siteSlug: string
  businessName: string
}

export function MechanicLeadForm({ siteSlug, businessName }: Props) {
  const [contactName, setContactName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [cityOrLocation, setCityOrLocation] = useState('')
  const [message, setMessage] = useState('')
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrMsg(null)
    setStatus('sending')
    try {
      const res = await fetch('/api/mechanic-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteSlug,
          contactName,
          phone: phone.trim() || undefined,
          email: email.trim() || undefined,
          cityOrLocation: cityOrLocation.trim() || undefined,
          message,
          company,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setErrMsg(data.error || 'Could not send message')
        setStatus('err')
        return
      }
      setStatus('ok')
      setContactName('')
      setPhone('')
      setEmail('')
      setCityOrLocation('')
      setMessage('')
      setCompany('')
    } catch {
      setErrMsg('Network error. Try again.')
      setStatus('err')
    }
  }

  return (
    <div className="mt-10 text-left max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-2 text-center" style={{ color: 'var(--ms-contact-fg)' }}>
        Request a callback
      </h3>
      <p className="text-sm text-center mb-4" style={{ color: 'var(--ms-contact-muted)' }}>
        Send a short note to {businessName}. Include how to reach you.
      </p>
      {status === 'ok' && (
        <p className="rounded-lg bg-white/10 text-sm px-4 py-3 mb-4 text-center" role="status">
          Thanks — your message was sent. The shop may reply by phone or email.
        </p>
      )}
      {(status === 'err' || errMsg) && errMsg && (
        <p className="rounded-lg bg-red-500/20 text-sm px-4 py-3 mb-4 text-center" role="alert">
          {errMsg}
        </p>
      )}
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="sr-only" htmlFor="mech-lead-company">
          Company
        </label>
        <input
          id="mech-lead-company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="absolute opacity-0 pointer-events-none h-0 w-0 overflow-hidden"
          aria-hidden
        />
        <div>
          <label htmlFor="mech-lead-name" className="block text-xs font-medium mb-1" style={{ color: 'var(--ms-contact-muted)' }}>
            Your name *
          </label>
          <input
            id="mech-lead-name"
            required
            minLength={2}
            maxLength={120}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/50"
            style={{ color: 'var(--ms-contact-fg)' }}
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="mech-lead-phone" className="block text-xs font-medium mb-1" style={{ color: 'var(--ms-contact-muted)' }}>
              Phone
            </label>
            <input
              id="mech-lead-phone"
              type="tel"
              maxLength={40}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/50"
              style={{ color: 'var(--ms-contact-fg)' }}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(555) 555-0100"
            />
          </div>
          <div>
            <label htmlFor="mech-lead-email" className="block text-xs font-medium mb-1" style={{ color: 'var(--ms-contact-muted)' }}>
              Email
            </label>
            <input
              id="mech-lead-email"
              type="email"
              maxLength={320}
              className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/50"
              style={{ color: 'var(--ms-contact-fg)' }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
        </div>
        <p className="text-xs" style={{ color: 'var(--ms-contact-muted)' }}>
          Provide at least one: phone or email.
        </p>
        <div>
          <label htmlFor="mech-lead-city" className="block text-xs font-medium mb-1" style={{ color: 'var(--ms-contact-muted)' }}>
            City / where you are (optional)
          </label>
          <input
            id="mech-lead-city"
            maxLength={120}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/50"
            style={{ color: 'var(--ms-contact-fg)' }}
            value={cityOrLocation}
            onChange={(e) => setCityOrLocation(e.target.value)}
            placeholder="e.g. Little Rock, AR"
          />
        </div>
        <div>
          <label htmlFor="mech-lead-msg" className="block text-xs font-medium mb-1" style={{ color: 'var(--ms-contact-muted)' }}>
            How can they help? *
          </label>
          <textarea
            id="mech-lead-msg"
            required
            minLength={10}
            maxLength={4000}
            rows={4}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm placeholder:text-white/50"
            style={{ color: 'var(--ms-contact-fg)' }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Truck issue, urgency, fleet size, etc."
          />
        </div>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full mechanic-cta py-3 disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
      </form>
    </div>
  )
}

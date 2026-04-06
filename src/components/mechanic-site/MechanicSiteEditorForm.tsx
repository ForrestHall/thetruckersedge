'use client'

import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import type { MechanicSite, Media } from '@/payload-types'
import { MECHANIC_DAY_OPTIONS } from '@/components/mechanic-site/mechanic-form-constants'

function relId(v: number | Media | null | undefined): number | undefined {
  if (v == null) return undefined
  if (typeof v === 'number') return v
  if (typeof v === 'object' && typeof v.id === 'number') return v.id
  return undefined
}

type ServiceRow = { name: string; description: string }
type CertRow = { label: string }
type HourRow = { day: string; open: string; close: string }

function initialFromSite(site: MechanicSite) {
  return {
    businessName: site.businessName || '',
    slug: site.slug || '',
    tagline: site.tagline || '',
    about: site.about || '',
    phone: site.phone || '',
    email: site.email || '',
    address: site.address || '',
    city: site.city || '',
    state: site.state || '',
    zip: site.zip || '',
    website: site.website || '',
    ctaText: site.ctaText || 'Call now',
    ctaLink: site.ctaLink || '',
    services:
      site.services?.map((s) => ({ name: s.name || '', description: s.description || '' })) ||
      ([{ name: '', description: '' }] as ServiceRow[]),
    certifications:
      site.certifications?.map((c) => ({ label: c.label || '' })) ||
      ([{ label: '' }] as CertRow[]),
    businessHours:
      site.businessHours?.map((h) => ({
        day: h.day || 'monday',
        open: h.open || '',
        close: h.close || '',
      })) || ([] as HourRow[]),
  }
}

async function uploadMediaFile(file: File, alt: string): Promise<number> {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('alt', alt)
  const res = await fetch('/api/media', {
    method: 'POST',
    credentials: 'include',
    body: fd,
  })
  const j = (await res.json().catch(() => ({}))) as { doc?: { id?: number }; message?: string }
  if (!res.ok) {
    throw new Error(typeof j.message === 'string' ? j.message : 'Image upload failed')
  }
  const id = j.doc?.id
  if (typeof id !== 'number') throw new Error('Invalid upload response')
  return id
}

type Props =
  | { mode: 'create' }
  | { mode: 'edit'; siteId: number; initial: MechanicSite }

export function MechanicSiteEditorForm(props: Props) {
  const router = useRouter()
  const isEdit = props.mode === 'edit'

  const defaults = useMemo(() => {
    if (props.mode === 'edit') return initialFromSite(props.initial)
    return {
      businessName: '',
      slug: '',
      tagline: '',
      about: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      website: '',
      ctaText: 'Call now',
      ctaLink: '',
      services: [{ name: '', description: '' }] as ServiceRow[],
      certifications: [{ label: '' }] as CertRow[],
      businessHours: [] as HourRow[],
    }
  }, [props])

  const [businessName, setBusinessName] = useState(defaults.businessName)
  const [slug, setSlug] = useState(defaults.slug)
  const [tagline, setTagline] = useState(defaults.tagline)
  const [about, setAbout] = useState(defaults.about)
  const [phone, setPhone] = useState(defaults.phone)
  const [email, setEmail] = useState(defaults.email)
  const [address, setAddress] = useState(defaults.address)
  const [city, setCity] = useState(defaults.city)
  const [state, setState] = useState(defaults.state)
  const [zip, setZip] = useState(defaults.zip)
  const [website, setWebsite] = useState(defaults.website)
  const [ctaText, setCtaText] = useState(defaults.ctaText)
  const [ctaLink, setCtaLink] = useState(defaults.ctaLink)
  const [services, setServices] = useState<ServiceRow[]>(defaults.services)
  const [certifications, setCertifications] = useState<CertRow[]>(defaults.certifications)
  const [businessHours, setBusinessHours] = useState<HourRow[]>(defaults.businessHours)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const existingLogoId = isEdit ? relId(props.initial.logo) : undefined
  const existingGalleryIds =
    isEdit && props.initial.gallery
      ? props.initial.gallery.map((g) => relId(g)).filter((x): x is number => typeof x === 'number')
      : []

  function setService(i: number, patch: Partial<ServiceRow>) {
    setServices((rows) => rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  }
  function addService() {
    setServices((rows) => [...rows, { name: '', description: '' }])
  }
  function removeService(i: number) {
    setServices((rows) => rows.filter((_, j) => j !== i))
  }

  function setCert(i: number, label: string) {
    setCertifications((rows) => rows.map((r, j) => (j === i ? { label } : r)))
  }
  function addCert() {
    setCertifications((rows) => [...rows, { label: '' }])
  }
  function removeCert(i: number) {
    setCertifications((rows) => rows.filter((_, j) => j !== i))
  }

  function setHour(i: number, patch: Partial<HourRow>) {
    setBusinessHours((rows) => rows.map((r, j) => (j === i ? { ...r, ...patch } : r)))
  }
  function addHour() {
    setBusinessHours((rows) => [...rows, { day: 'monday', open: '', close: '' }])
  }
  function removeHour(i: number) {
    setBusinessHours((rows) => rows.filter((_, j) => j !== i))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      let logoId = existingLogoId
      if (logoFile) {
        logoId = await uploadMediaFile(logoFile, `${businessName || 'Shop'} logo`)
      }

      const newGalleryIds: number[] = []
      for (let i = 0; i < galleryFiles.length; i++) {
        const f = galleryFiles[i]
        const id = await uploadMediaFile(f, `${businessName || 'Shop'} photo ${i + 1}`)
        newGalleryIds.push(id)
      }
      const galleryIds = [...existingGalleryIds, ...newGalleryIds]

      const servicesPayload = services
        .filter((s) => s.name.trim())
        .map((s) => ({ name: s.name.trim(), description: s.description.trim() || undefined }))
      const certsPayload = certifications
        .filter((c) => c.label.trim())
        .map((c) => ({ label: c.label.trim() }))
      const hoursPayload = businessHours
        .filter((h) => h.day)
        .map((h) => ({
          day: h.day as NonNullable<MechanicSite['businessHours']>[number]['day'],
          open: h.open.trim() || undefined,
          close: h.close.trim() || undefined,
        }))

      const body: Record<string, unknown> = {
        businessName: businessName.trim(),
        tagline: tagline.trim() || undefined,
        about: about.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        address: address.trim() || undefined,
        city: city.trim() || undefined,
        state: state.trim() || undefined,
        zip: zip.trim() || undefined,
        website: website.trim() || undefined,
        ctaText: ctaText.trim() || undefined,
        ctaLink: ctaLink.trim() || undefined,
        services: servicesPayload,
        certifications: certsPayload,
        businessHours: hoursPayload,
      }

      if (slug.trim()) {
        body.slug = slug.trim()
      }
      if (logoId != null) {
        body.logo = logoId
      }
      if (galleryIds.length > 0) {
        body.gallery = galleryIds
      }

      const url =
        isEdit ? `/api/mechanic-sites/${props.siteId}` : '/api/mechanic-sites'
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      const data = (await res.json().catch(() => ({}))) as {
        message?: string
        errors?: { message?: string }[]
        doc?: { id?: number }
      }
      if (!res.ok) {
        const msg =
          data.errors?.[0]?.message ||
          (typeof data.message === 'string' ? data.message : null) ||
          'Could not save'
        setError(msg)
        setLoading(false)
        return
      }

      router.push('/mechanics/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:ring-2 focus:ring-brand-navy focus:border-brand-navy'

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg bg-red-50 text-red-800 text-sm px-4 py-3 border border-red-100" role="alert">
          {error}
        </div>
      )}

      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Business</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Business name *</label>
          <input className={inputClass} value={businessName} onChange={(e) => setBusinessName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL slug (optional)</label>
          <input
            className={inputClass}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated from name if empty"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
          <input className={inputClass} value={tagline} onChange={(e) => setTagline(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
          <textarea className={`${inputClass} min-h-[120px]`} value={about} onChange={(e) => setAbout(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Logo image</label>
          <input
            type="file"
            accept="image/*"
            className="text-sm text-gray-600"
            onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
          />
          {isEdit && existingLogoId && !logoFile && (
            <p className="text-xs text-gray-500 mt-1">Current logo will be kept unless you choose a new file.</p>
          )}
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-brand-navy">Services</h2>
          <button type="button" onClick={addService} className="text-sm font-semibold text-brand-navy underline">
            Add service
          </button>
        </div>
        {services.map((s, i) => (
          <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-2 relative">
            <button
              type="button"
              className="absolute top-2 right-2 text-xs text-red-600"
              onClick={() => removeService(i)}
              disabled={services.length <= 1}
            >
              Remove
            </button>
            <input
              className={inputClass}
              placeholder="Service name"
              value={s.name}
              onChange={(e) => setService(i, { name: e.target.value })}
            />
            <textarea
              className={`${inputClass} min-h-[72px]`}
              placeholder="Description"
              value={s.description}
              onChange={(e) => setService(i, { description: e.target.value })}
            />
          </div>
        ))}
      </section>

      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-brand-navy">Certifications</h2>
          <button type="button" onClick={addCert} className="text-sm font-semibold text-brand-navy underline">
            Add line
          </button>
        </div>
        {certifications.map((c, i) => (
          <div key={i} className="flex gap-2">
            <input
              className={inputClass}
              placeholder="e.g. ASE Master Certified"
              value={c.label}
              onChange={(e) => setCert(i, e.target.value)}
            />
            <button type="button" className="text-sm text-red-600 shrink-0" onClick={() => removeCert(i)}>
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="card p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-brand-navy">Hours</h2>
          <button type="button" onClick={addHour} className="text-sm font-semibold text-brand-navy underline">
            Add row
          </button>
        </div>
        {businessHours.length === 0 && <p className="text-sm text-gray-500">No hours added yet.</p>}
        {businessHours.map((h, i) => (
          <div key={i} className="flex flex-wrap gap-2 items-end">
            <div className="min-w-[140px]">
              <label className="block text-xs text-gray-600 mb-1">Day</label>
              <select
                className={inputClass}
                value={h.day}
                onChange={(e) => setHour(i, { day: e.target.value })}
              >
                {MECHANIC_DAY_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="block text-xs text-gray-600 mb-1">Opens</label>
              <input className={inputClass} value={h.open} onChange={(e) => setHour(i, { open: e.target.value })} />
            </div>
            <div className="flex-1 min-w-[100px]">
              <label className="block text-xs text-gray-600 mb-1">Closes</label>
              <input className={inputClass} value={h.close} onChange={(e) => setHour(i, { close: e.target.value })} />
            </div>
            <button type="button" className="text-sm text-red-600 pb-2" onClick={() => removeHour(i)}>
              Remove
            </button>
          </div>
        ))}
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Contact & location</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Public email</label>
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
          <input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input className={inputClass} value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <input className={inputClass} value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
            <input className={inputClass} value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <input className={inputClass} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Call to action</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button text</label>
            <input className={inputClass} value={ctaText} onChange={(e) => setCtaText(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button link</label>
            <input
              className={inputClass}
              value={ctaLink}
              onChange={(e) => setCtaLink(e.target.value)}
              placeholder="tel:+1... or https://"
            />
          </div>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-navy">Gallery</h2>
        <p className="text-sm text-gray-600">Add more photos (optional). Existing photos are kept; new files are appended.</p>
        <input
          type="file"
          accept="image/*"
          multiple
          className="text-sm text-gray-600"
          onChange={(e) => setGalleryFiles(Array.from(e.target.files || []))}
        />
      </section>

      <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60">
        {loading ? 'Saving…' : isEdit ? 'Save changes' : 'Submit for review'}
      </button>
    </form>
  )
}

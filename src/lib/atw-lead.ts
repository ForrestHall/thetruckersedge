export type AtwLeadInput = {
  firstName: string
  lastName?: string
  email: string
  phone: string
  make?: string
  model?: string
  year?: number
  mileage?: number
  truckClass?: number
  truckType?: string
  usage?: string
  coverage?: string
  requestType?: string
  qualification?: string
  funnel: 'warranty-qualify' | 'warranty-quote' | 'warranty-guide'
  utm?: Record<string, string | undefined>
  notes?: string[]
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits || phone.trim()
}

function arwBaseUrl(): string {
  return (
    process.env.ARW_API_BASE_URL?.replace(/\/$/, '') ||
    process.env.ATW_API_BASE_URL?.replace(/\/$/, '') ||
    'https://americaswarranty.com'
  )
}

function arwToken(): string | undefined {
  return process.env.ARW_API_TOKEN?.trim() || process.env.ATW_LEAD_API_TOKEN?.trim()
}

function resolveInsertTruckUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/$/, '')
  if (normalized.endsWith('/api')) {
    return `${normalized}/insert/truck`
  }
  return `${normalized}/api/insert/truck`
}

/** POST lead to America's Warranty advertiser API → Salesforce. */
export async function submitAtwLead(input: AtwLeadInput): Promise<{ leadId: string }> {
  const token = arwToken()
  if (!token) {
    throw new Error('Lead API is not configured (ARW_API_TOKEN).')
  }

  const phone = normalizePhone(input.phone)
  if (!phone) {
    throw new Error('Phone is required.')
  }

  const payload = {
    firstName: input.firstName.trim(),
    lastName: input.lastName?.trim() || '.',
    email: input.email.trim(),
    phone,
    make: input.make?.trim() || 'Not provided',
    model: input.model?.trim() || 'Not provided',
    modelYear: input.year ?? new Date().getFullYear(),
    odometer: input.mileage ?? 0,
  }

  const res = await fetch(resolveInsertTruckUrl(arwBaseUrl()), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  let data: { status?: string; id?: string; message?: string } = {}
  try {
    data = await res.json()
  } catch {
    /* non-JSON body */
  }

  if (res.ok && data.status === 'success' && data.id) {
    return { leadId: data.id }
  }

  if (res.status === 401) {
    throw new Error('Lead service authentication failed.')
  }

  throw new Error(data.message || `Lead API failed (${res.status})`)
}

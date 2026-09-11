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

function gvwrFromInput(input: AtwLeadInput): string | undefined {
  if (input.truckClass) return String(input.truckClass)
  switch (input.truckType) {
    case 'class8-otr':
    case 'class8-regional':
      return '8'
    case 'class7':
      return '7'
    case 'medium-duty':
      return '6'
    default:
      return undefined
  }
}

function buildNotes(input: AtwLeadInput): string | undefined {
  const lines = [...(input.notes ?? [])]
  if (input.truckType) lines.push(`Truck type: ${input.truckType}`)
  if (input.usage) lines.push(`Usage: ${input.usage}`)
  if (input.coverage) lines.push(`Coverage priority: ${input.coverage}`)
  if (input.requestType) lines.push(`Delivery: ${input.requestType}`)
  if (input.qualification) lines.push(`Eligibility: ${input.qualification}`)
  if (!lines.length) return undefined
  return lines.join('\n')
}

function resolveAtwLeadUrl(baseUrl: string): string {
  const normalized = baseUrl.replace(/\/$/, '')
  if (normalized.endsWith('/api')) {
    return `${normalized}/leads/truckers-edge`
  }
  return `${normalized}/api/leads/truckers-edge`
}

/** POST lead to ATW Laravel → Salesforce via SForceLead::insert. */
export async function submitAtwLead(input: AtwLeadInput): Promise<{ leadId: string }> {
  const baseUrl = process.env.ATW_API_BASE_URL?.replace(/\/$/, '')
  const token = process.env.ATW_LEAD_API_TOKEN

  if (!baseUrl || !token) {
    throw new Error('ATW lead API is not configured (ATW_API_BASE_URL / ATW_LEAD_API_TOKEN).')
  }

  const payload: Record<string, string | number> = {
    FirstName: input.firstName.trim(),
    LastName: input.lastName?.trim() || '.',
    Email: input.email.trim(),
    Phone: normalizePhone(input.phone),
    funnel: input.funnel,
    RV_Class__c: 'HD Truck',
    Fuel_Type__c: 'Diesel',
  }

  if (input.make) payload.Truck_Make__c = input.make.trim()
  if (input.model) payload.Model__c = input.model.trim()
  if (input.year) payload.Model_Year__c = input.year
  if (input.mileage != null && input.mileage >= 0) payload.Odometer_Start__c = input.mileage

  const gvwr = gvwrFromInput(input)
  if (gvwr) payload.GVWR__c = gvwr

  const notes = buildNotes(input)
  if (notes) payload.pi__notes__c = notes

  if (input.utm) {
    if (input.utm.utm_source) payload.UTM_Source__c = input.utm.utm_source
    if (input.utm.utm_medium) payload.UTM_Medium__c = input.utm.utm_medium
    if (input.utm.utm_campaign) payload.UTM_Campaign__c = input.utm.utm_campaign
    if (input.utm.utm_content) payload.UTM_Content__c = input.utm.utm_content
    if (input.utm.utm_term) payload.UTM_Term__c = input.utm.utm_term
  }

  const res = await fetch(resolveAtwLeadUrl(baseUrl), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })

  const data = (await res.json().catch(() => ({}))) as { error?: string; leadId?: string }

  if (!res.ok) {
    throw new Error(data.error || `ATW lead API failed (${res.status})`)
  }

  if (!data.leadId) {
    throw new Error('ATW lead API did not return a lead ID.')
  }

  return { leadId: data.leadId }
}

import { profile } from '@/data/profile'

/**
 * Contact submission.
 *
 * Uses /api/contact in development and production. The server forwards JSON
 * to MAKE_CONTACT_WEBHOOK, kept outside the client bundle. Success requires
 * a JSON { ok: true } confirmation; a static hosting fallback is not success.
 * An explicitly empty VITE_CONTACT_ENDPOINT enables the mail-client fallback.
 */

export const ENDPOINT: string = import.meta.env.VITE_CONTACT_ENDPOINT ?? '/api/contact'
export const RECIPIENT = profile.email

export const MAX_NAME = 80
export const MAX_EMAIL = 254
export const MAX_MESSAGE = 5000

// Built from \u escapes so the source stays pure ASCII.
// Control chars U+0000-U+001F and U+007F; when newlines are allowed, tab,
// LF and CR survive. Zero-width and bidi marks always go.
// These control characters are intentionally removed from submitted text.
// eslint-disable-next-line no-control-regex
const CTRL_NO_NL = new RegExp('[\\u0000-\\u001F\\u007F]', 'g')
// eslint-disable-next-line no-control-regex
const CTRL_KEEP_NL = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g')
const ZERO_WIDTH = new RegExp('[\\u200B-\\u200F\\u202A-\\u202E\\u2060\\uFEFF]', 'g')

export function sanitize(input: string, allowNewlines = false): string {
  const controls = allowNewlines ? CTRL_KEEP_NL : CTRL_NO_NL
  return input.replace(controls, '').replace(ZERO_WIDTH, '')
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type Lead = {
  firstName: string
  lastName: string
  email: string
  message: string
  /** Honeypot. Empty for a person; your backend should drop anything else. */
  service: string
  website: string
}

export type SubmitResult = { via: 'webhook' } | { via: 'mailto' }
export type LeadField = 'firstName' | 'email' | 'message'
export type LeadErrors = Partial<Record<LeadField, string>>

function readFields(data: FormData): Lead {
  const firstName = sanitize(String(data.get('firstName') ?? '').trim()).slice(0, MAX_NAME)
  const lastName = sanitize(String(data.get('lastName') ?? '').trim()).slice(0, MAX_NAME)
  const email = sanitize(String(data.get('email') ?? '').trim()).slice(0, MAX_EMAIL)
  const message = sanitize(String(data.get('message') ?? '').trim(), true).slice(0, MAX_MESSAGE)
  const website = String(data.get('website') ?? '')
  const service = sanitize(String(data.get('service') ?? 'Other / Inquiry')).slice(0, 80)
  return { firstName, lastName, email, message, website, service }
}

function fieldErrors(lead: Lead): LeadErrors {
  const errors: LeadErrors = {}
  if (!lead.firstName) errors.firstName = 'Enter your name.'
  if (!lead.email) errors.email = 'Enter your email address.'
  else if (!EMAIL_RE.test(lead.email)) errors.email = 'Enter a valid email address, such as name@example.com.'
  if (!lead.message) errors.message = 'Enter a message about your project.'
  return errors
}

export function validateLead(data: FormData): LeadErrors {
  return fieldErrors(readFields(data))
}

/** Last name is optional; a name, valid email and message are required. */
export function readLead(data: FormData): Lead | null {
  const lead = readFields(data)
  if (Object.keys(fieldErrors(lead)).length) return null
  if (lead.website) throw new SubmitError('Unable to submit this message.')
  return lead
}

export class SubmitError extends Error {}

export async function submitLead(lead: Lead): Promise<SubmitResult> {
  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: `${lead.firstName} ${lead.lastName}`.trim(), email: lead.email, service: lead.service, message: lead.message, website: lead.website }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new SubmitError(body?.error || `The server answered ${res.status}.`)
    }
    const confirmation = await res.json().catch(() => null)
    if (confirmation?.ok !== true) {
      throw new SubmitError('The contact service did not confirm delivery. Please try again or email Jefferson directly.')
    }
    return { via: 'webhook' }
  }

  const subject = `Project inquiry from ${lead.firstName} ${lead.lastName}`
  const body = [`Name: ${lead.firstName} ${lead.lastName}`, `Email: ${lead.email}`, `Service: ${lead.service}`, '', lead.message].join('\n')
  // encodeURIComponent on every value blocks header injection (CR/LF) and
  // parameter smuggling via & or ?.
  window.location.href = `mailto:${encodeURIComponent(RECIPIENT)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  return { via: 'mailto' }
}

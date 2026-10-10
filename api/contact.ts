import { CONTACT_EMAIL } from '../shared/contact-info.mjs'
import type { IncomingMessage, ServerResponse } from 'node:http'

// Vercel parses JSON requests before invoking this function.
// The original Make endpoint stays in a server-only environment variable.
export default async function handler(
  req: IncomingMessage & { body?: unknown },
  res: ServerResponse,
) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  const reply = (status: number, error?: string) => {
    res.statusCode = status
    res.end(JSON.stringify(error ? { error } : { ok: true }))
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    reply(405, 'Use the contact form to send a message.')
    return
  }
  const endpoint = process.env.MAKE_CONTACT_WEBHOOK?.trim()
  if (!endpoint || endpoint === 'undefined') {
    reply(503, `Contact service is not configured. Email ${CONTACT_EMAIL} directly.`)
    return
  }
  try {
    if (new URL(endpoint).protocol !== 'https:') throw new Error('Invalid protocol')
  } catch {
    reply(503, 'Contact service configuration is invalid. Please email Jefferson directly.')
    return
  }
  let parsed = req.body
  if (parsed === undefined) {
    try {
      const chunks: Buffer[] = []
      let size = 0
      for await (const chunk of req) {
        const buffer = Buffer.from(chunk)
        size += buffer.length
        if (size > 16384) { reply(413, 'Your message is too large.'); return }
        chunks.push(buffer)
      }
      parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch { reply(400, 'Send a valid contact message.'); return }
  }
  const data = parsed && typeof parsed === 'object' && !Array.isArray(parsed)
    ? parsed as Record<string, unknown> : undefined
  const text = (key: string, max: number) =>
    typeof data?.[key] === 'string' ? (data[key] as string).trim().slice(0, max) : ''
  const name = text('name', 160),
    email = text('email', 254),
    service = text('service', 80),
    message = text('message', 5000)
  if (!name || !message || !service || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || data?.website) {
    reply(400, 'Add your name, a valid email, a service, and a short message.')
    return
  }
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, service, message }),
      signal: AbortSignal.timeout(15000),
      redirect: 'error',
    })
    if (!response.ok) {
      reply(
        502,
        'The contact service could not accept your message. Please email Jefferson directly.',
      )
      return
    }
    // Make's default acknowledgement is plain text. Custom JSON responses
    // must be valid and must not explicitly report a failure.
    const contentType = response.headers.get('content-type') || ''
    const acknowledgement = await response.text()
    if (contentType.includes('text/html') || /^\s*<!?html/i.test(acknowledgement)) {
      reply(502, 'The contact service returned an unexpected response. Please email Jefferson directly.')
      return
    }
    if (contentType.includes('json')) {
      let confirmation: unknown
      try { confirmation = JSON.parse(acknowledgement) } catch {
        reply(502, 'The contact service returned invalid JSON. Please email Jefferson directly.')
        return
      }
      if (confirmation && typeof confirmation === 'object') {
        const result = confirmation as Record<string, unknown>
        if (result.ok === false || result.success === false || result.error) {
          reply(502, 'The contact service could not accept your message. Please email Jefferson directly.')
          return
        }
      }
    }
    reply(200)
  } catch (error) {
    if (error instanceof Error && (error.name === 'TimeoutError' || error.name === 'AbortError')) {
      reply(504, 'The contact service timed out; acceptance could not be confirmed. Please email Jefferson directly.')
      return
    }
    reply(502, 'The contact service is unavailable. Please email Jefferson directly.')
  }
}

import { CONTACT_EMAIL } from '../src/data/contact-info.ts'
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
  const endpoint = process.env.MAKE_CONTACT_WEBHOOK
  if (!endpoint) {
    reply(503, `Contact service is not configured. Email ${CONTACT_EMAIL} directly.`)
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
    })
    if (!response.ok) {
      reply(
        502,
        'The contact service could not accept your message. Please email Jefferson directly.',
      )
      return
    }
    reply(200)
  } catch {
    reply(502, 'The contact service is unavailable. Please email Jefferson directly.')
  }
}

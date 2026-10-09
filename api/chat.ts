import type { IncomingMessage, ServerResponse } from 'node:http'
import { CHAT_ERROR, CHAT_MAX_LENGTH, normalizeChatResponse } from '../shared/chat-response.mjs'

// Best-effort per-instance protection. Use a shared rate-limit store/WAF when
// deploying across serverless instances; no conversation context lives here.
const limits = new Map<string, { count: number; expires: number }>()

export default async function handler(req: IncomingMessage & { body?: unknown }, res: ServerResponse) {
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Cache-Control', 'no-store')
  const fail = (status: number) => { res.statusCode = status; res.end(JSON.stringify({ success: false, error: CHAT_ERROR })) }
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); fail(405); return }
  const endpoint = process.env.MAKE_CHAT_WEBHOOK
  if (!endpoint) { fail(503); return }
  // Same-origin browser requests only; Make is called server-to-server.
  const origin = req.headers?.origin
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) { fail(403); return } }
    catch { fail(403); return }
  }
  let parsed = req.body
  if (parsed === undefined) {
    try {
      const chunks: Buffer[] = []
      let size = 0
      for await (const chunk of req) {
        const buffer = Buffer.from(chunk)
        size += buffer.length
        if (size > 16384) { fail(413); return }
        chunks.push(buffer)
      }
      parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))
    } catch { fail(400); return }
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) { fail(400); return }
  const data = parsed as Record<string, unknown>
  const { message, sessionId, page, timestamp, source } = data
  if (typeof message !== 'string' || !message.trim() || message.length > CHAT_MAX_LENGTH
    || typeof sessionId !== 'string' || !/^session_[a-zA-Z0-9-]{16,80}$/.test(sessionId)
    || typeof page !== 'string' || !/^\/(?!\/)[^?#\s]{0,200}$/.test(page)
    || typeof timestamp !== 'string' || timestamp.length > 40 || !Number.isFinite(Date.parse(timestamp))
    || source !== 'portfolio-chatbot') { fail(400); return }
  const now = Date.now()
  for (const [key, entry] of limits) if (entry.expires <= now) limits.delete(key)
  // IP is only an ephemeral rate-limit key, never the conversation/session ID.
  const forwarded = req.headers?.['x-forwarded-for']
  const key = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() || req.socket?.remoteAddress || sessionId
  const entry = limits.get(key) || { count: 0, expires: now + 60000 }
  if (entry.count >= 8 || (!limits.has(key) && limits.size >= 10000)) { res.setHeader('Retry-After', '60'); fail(429); return }
  entry.count++
  limits.set(key, entry)
  try {
    const upstream = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message.trim(), sessionId, page, timestamp, source }),
      signal: AbortSignal.timeout(25000), redirect: 'error',
    })
    if (!upstream.ok) { fail(502); return }
    const contentType = upstream.headers.get('content-type')?.toLowerCase() || ''
    let response: unknown
    if (contentType.includes('application/json') || contentType.includes('+json')) {
      response = await upstream.json()
    } else if (contentType.includes('text/plain')) {
      // The supplied Make scenario currently returns the assistant reply as
      // plain text. Normalize it here; the browser still receives strict JSON.
      const text = (await upstream.text()).trim()
      if (!text || /^accepted\.?$/i.test(text) || /^\s*<(?:!doctype|html)\b/i.test(text)) { fail(502); return }
      try { response = JSON.parse(text) }
      catch {
        // A malformed JSON object should not become a visible assistant reply.
        if (/^[{[]/.test(text)) { fail(502); return }
        response = { reply: text }
      }
    } else { fail(502); return }
    const normalized = normalizeChatResponse(response)
    res.statusCode = 200
    res.end(JSON.stringify(normalized))
  } catch { fail(502) }
}

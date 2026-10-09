import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { Readable } from 'node:stream'
import handler from '../api/contact.ts'

const source = fs.readFileSync(new URL('../src/lib/contact.ts', import.meta.url), 'utf8')
  .replace("import { profile } from '@/data/profile'", "const profile = { email: 'test@example.com' }")
  .replaceAll('import.meta.env', '({ VITE_CONTACT_ENDPOINT: "/api/contact" })')
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { submitLead, SubmitError } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
const originalFetch = globalThis.fetch
const originalEndpoint = process.env.MAKE_CONTACT_WEBHOOK
const lead = { firstName: 'Test', lastName: 'Person', email: 'test@example.com', service: 'Workflow Automation', message: 'Test message', website: '' }
const payload = { name: 'Test Person', email: lead.email, service: lead.service, message: lead.message, website: '' }
const response = () => ({ statusCode: 0, setHeader() {}, end(body) { this.body = JSON.parse(body) } })
try {
  globalThis.fetch = async () => ({ ok: true, json: async () => { throw new SyntaxError('HTML fallback') } })
  await assert.rejects(submitLead(lead), SubmitError)
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ received: true }) })
  await assert.rejects(submitLead(lead), SubmitError)
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ ok: true }) })
  assert.deepEqual(await submitLead(lead), { via: 'webhook' })
  globalThis.fetch = async () => ({ ok: false, status: 503, json: async () => ({ error: 'Not configured' }) })
  await assert.rejects(submitLead(lead), /Not configured/)

  process.env.MAKE_CONTACT_WEBHOOK = 'https://example.invalid/test'
  let calls = 0, forwarded
  globalThis.fetch = async (_url, options) => { calls++; forwarded = JSON.parse(options.body); return { ok: true } }
  let res = response(); await handler({ method: 'GET' }, res); assert.equal(res.statusCode, 405)
  res = response(); await handler({ method: 'POST', body: { ...payload, email: 'invalid' } }, res); assert.equal(res.statusCode, 400)
  res = response(); await handler({ method: 'POST', body: { ...payload, website: 'spam' } }, res); assert.equal(res.statusCode, 400)
  assert.equal(calls, 0)
  const req = Readable.from([JSON.stringify(payload)]); req.method = 'POST'
  res = response(); await handler(req, res); assert.equal(res.statusCode, 200)
  assert.deepEqual(forwarded, { name: payload.name, email: payload.email, service: payload.service, message: payload.message })
  const malformed = Readable.from(['not JSON']); malformed.method = 'POST'
  res = response(); await handler(malformed, res); assert.equal(res.statusCode, 400)
  const oversized = Readable.from(['x'.repeat(16385)]); oversized.method = 'POST'
  res = response(); await handler(oversized, res); assert.equal(res.statusCode, 413)
  globalThis.fetch = async () => ({ ok: false })
  res = response(); await handler({ method: 'POST', body: payload }, res); assert.equal(res.statusCode, 502)
  globalThis.fetch = async () => { throw new Error('Connection failed') }
  res = response(); await handler({ method: 'POST', body: payload }, res); assert.equal(res.statusCode, 502)
  delete process.env.MAKE_CONTACT_WEBHOOK
  res = response(); await handler({ method: 'POST', body: payload }, res); assert.equal(res.statusCode, 503)
  console.log('PASS: confirmed success, false HTML success rejected, error reporting, validation, JSON parsing, size limit, upstream failures. No real requests sent.')
} finally {
  globalThis.fetch = originalFetch
  if (originalEndpoint === undefined) delete process.env.MAKE_CONTACT_WEBHOOK
  else process.env.MAKE_CONTACT_WEBHOOK = originalEndpoint
}

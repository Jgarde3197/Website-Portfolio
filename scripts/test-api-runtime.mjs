import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import ts from 'typescript'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'))
assert.equal(config.functions['api/*.ts'].includeFiles, 'shared/*.mjs')
assert.ok(config.functions['api/*.ts'].maxDuration >= 30)
assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).engines.node, '24.x')
const fixture = fs.mkdtempSync(path.join(root, 'node_modules', '.api-runtime-test-'))
try {
  fs.mkdirSync(path.join(fixture, 'api'))
  fs.mkdirSync(path.join(fixture, 'shared'))
  fs.writeFileSync(path.join(fixture, 'package.json'), '{"type":"module"}')
  for (const name of fs.readdirSync(path.join(root, 'shared')).filter(n => n.endsWith('.mjs'))) {
    const source = fs.readFileSync(path.join(root, 'shared', name), 'utf8')
    fs.writeFileSync(path.join(fixture, 'shared', name), source)
  }
  for (const name of ['chat', 'contact']) {
    const source = fs.readFileSync(path.join(root, 'api', `${name}.ts`), 'utf8')
    const emitted = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      reportDiagnostics: true,
    })
    assert.equal(emitted.diagnostics?.length, 0)
    const ast = ts.createSourceFile(`${name}.js`, emitted.outputText, ts.ScriptTarget.ES2022, true, ts.ScriptKind.JS)
    for (const item of ast.statements) {
      if (!ts.isImportDeclaration(item)) continue
      const specifier = item.moduleSpecifier.text
      assert.ok(!/\.(?:ts|tsx|mts|cts)$/.test(specifier), `Uncompiled runtime import: ${specifier}`)
      assert.ok(!specifier.startsWith('@/') && !specifier.includes('/src/'), `Frontend-only import: ${specifier}`)
      if (specifier.startsWith('.')) {
        const target = path.resolve(fixture, 'api', specifier)
        assert.ok(fs.existsSync(target), `Missing packaged dependency: ${specifier}`)
        assert.ok(fs.readdirSync(path.dirname(target)).includes(path.basename(target)), `Case mismatch: ${specifier}`)
      } else assert.ok(specifier.startsWith('node:'), `Untraced external dependency: ${specifier}`)
    }
    fs.writeFileSync(path.join(fixture, 'api', `${name}.js`), emitted.outputText)
  }
  // There is deliberately no src/, no .ts runtime file, no node_modules and no
  // .env in the package. Child Node explicitly disables TypeScript stripping.
  fs.writeFileSync(path.join(fixture, 'smoke.mjs'), `
import assert from 'node:assert/strict'
import chat from './api/chat.js'
import contact from './api/contact.js'
import { normalizeChatResponse } from './shared/chat-response.mjs'
import { CONTACT_EMAIL } from './shared/contact-info.mjs'
const response = () => ({ statusCode: 0, setHeader() {}, end(body) { this.body = JSON.parse(body) } })
const payload = { message: 'Runtime fixture test', sessionId: 'session_00000000-0000-4000-8000-000000000000', page: '/projects', timestamp: new Date().toISOString(), source: 'portfolio-chatbot' }
delete process.env.MAKE_CHAT_WEBHOOK
delete process.env.MAKE_CONTACT_WEBHOOK
let res = response(); await chat({ method: 'POST', body: payload }, res); assert.equal(res.statusCode, 503)
res = response(); await contact({ method: 'POST', body: {} }, res); assert.equal(res.statusCode, 503); assert.ok(res.body.error.includes(CONTACT_EMAIL))
res = response(); await chat({ method: 'GET' }, res); assert.equal(res.statusCode, 405)
assert.deepEqual(normalizeChatResponse({ answer: ' One\\n- Two ' }), { success: true, reply: 'One\\n- Two' })
assert.throws(() => normalizeChatResponse({ success: false, reply: 'ignore' }))
process.env.MAKE_CHAT_WEBHOOK = 'https://example.invalid/mock-chat'
process.env.MAKE_CONTACT_WEBHOOK = 'https://example.invalid/mock-contact'
const calls = []
globalThis.fetch = async (url, options) => { calls.push({ url, body: JSON.parse(options.body) }); return new Response('Working plain-text reply', { headers: { 'Content-Type': 'text/plain' } }) }
res = response(); await chat({ method: 'POST', body: payload }, res); assert.equal(res.statusCode, 200); assert.deepEqual(res.body, { success: true, reply: 'Working plain-text reply' })
assert.deepEqual(calls[0].body, payload)
const lead = { name: 'Runtime Test', email: 'test@example.com', service: 'Workflow Automation', message: 'Fixture only' }
res = response(); await contact({ method: 'POST', body: lead }, res); assert.equal(res.statusCode, 200); assert.deepEqual(res.body, { ok: true }); assert.deepEqual(calls[1].body, lead)
console.log('PASS: compiled chat.js/contact.js load and execute with only shared .mjs files, no src tree or TypeScript runtime loader. Missing-env, method, JSON adapter, plain-text chat and contact forwarding checks passed. Mocked requests only.')
`)
  // Inherited streams avoid the restricted Windows anonymous-pipe limitation.
  const result = spawnSync(process.execPath, ['--no-experimental-strip-types', path.join(fixture, 'smoke.mjs')], { stdio: 'inherit', windowsHide: true })
  if (result.error) throw result.error
  assert.equal(result.status, 0, 'Plain Node deployment-package smoke test failed')
} finally {
  // Delete only the verified temporary fixture within this project's node_modules.
  const allowed = path.join(root, 'node_modules') + path.sep
  assert.ok(fixture.startsWith(allowed) && path.basename(fixture).startsWith('.api-runtime-test-'))
  fs.rmSync(fixture, { recursive: true, force: true })
}

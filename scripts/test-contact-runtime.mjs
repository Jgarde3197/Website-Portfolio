import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import ts from 'typescript'
const root = new URL('../', import.meta.url)
const config = JSON.parse(fs.readFileSync(new URL('vercel.json', root)))
assert.equal(config.functions['api/contact.ts'].includeFiles, 'shared/contact-info.mjs')
const route = new RegExp('^' + config.rewrites[0].source + '$')
assert.equal(route.test('/api/contact'), false)
assert.equal(route.test('/api/chat'), false)
assert.equal(route.test('/about'), true)
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), 'contact-runtime-'))
try {
  fs.mkdirSync(path.join(fixture, 'api')); fs.mkdirSync(path.join(fixture, 'shared'))
  fs.writeFileSync(path.join(fixture, 'package.json'), '{"type":"module"}')
  fs.copyFileSync(new URL('shared/contact-info.mjs', root), path.join(fixture, 'shared/contact-info.mjs'))
  const source = fs.readFileSync(new URL('api/contact.ts', root), 'utf8')
  fs.writeFileSync(path.join(fixture, 'api/contact.js'), ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText)
  fs.writeFileSync(path.join(fixture, 'check.mjs'), `
import assert from 'node:assert/strict'
import handler from './api/contact.js'
process.env.MAKE_CONTACT_WEBHOOK = 'https://example.invalid/mock'
globalThis.fetch = async () => new Response('Accepted')
const res = { setHeader(){}, end(body){this.body=JSON.parse(body)} }
await handler({method:'POST',body:{name:'Test',email:'test@example.com',service:'Other',message:'Mock'}},res)
assert.equal(res.statusCode,200);assert.deepEqual(res.body,{ok:true})
console.log('PASS: compiled contact function without src or TypeScript runtime; SPA excludes both APIs.')
`)
  const result = spawnSync(process.execPath, ['--no-experimental-strip-types', path.join(fixture, 'check.mjs')], { stdio: 'inherit', windowsHide: true })
  if(result.error) throw result.error
  assert.equal(result.status,0)
} finally {
  assert.ok(fixture.startsWith(path.join(os.tmpdir(),'contact-runtime-')))
  fs.rmSync(fixture,{recursive:true,force:true})
}

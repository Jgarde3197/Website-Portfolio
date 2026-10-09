import assert from 'node:assert/strict'
import fs from 'node:fs'
import ts from 'typescript'
import { Readable } from 'node:stream'
import handler from '../api/chat.ts'

const source = fs.readFileSync(new URL('../src/lib/chat.ts', import.meta.url), 'utf8')
  .replaceAll('import.meta.env', '({VITE_CHAT_ENDPOINT:"/api/chat"})')
  .replaceAll("'./chat-response'", JSON.stringify(new URL('../src/lib/chat-response.ts', import.meta.url).href))
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { normalizeChatResponse, sendChatMessage, getChatSessionId, CHAT_ERROR } = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`)
const originalFetch = globalThis.fetch
const originalEndpoint = process.env.MAKE_CHAT_WEBHOOK
const store = new Map()
globalThis.sessionStorage = { getItem: k => store.get(k), setItem: (k,v) => store.set(k,v) }
globalThis.window = { setTimeout, clearTimeout }
const response = () => ({ statusCode:0, setHeader() {}, end(body) { this.body = JSON.parse(body) } })
const payload = { message:'Can you automate lead qualification?', sessionId:'session_00000000-0000-4000-8000-000000000000', page:'/projects', timestamp:new Date().toISOString(), source:'portfolio-chatbot' }
try {
  for (const key of ['reply','response','message','answer']) assert.deepEqual(normalizeChatResponse({[key]:'One\n- Two'}), {success:true,reply:'One\n- Two'})
  for (const value of [null, [], 'Accepted', {}, {reply:' '}, {success:false,reply:'failure'}]) assert.throws(()=>normalizeChatResponse(value), new RegExp('automation'))
  assert.equal(normalizeChatResponse({reply:'<script>alert(1)</script>'}).reply,'<script>alert(1)</script>')
  const session = getChatSessionId(); assert.match(session,/^session_[a-f0-9-]{36}$/)
  assert.equal(store.get('portfolio_chat_session_id'),session)
  let requests = []
  globalThis.fetch = async (url, options) => { requests.push({url, data:JSON.parse(options.body)}); return {ok:true,json:async()=>({success:true,reply:'Hello\n- Workflow'})} }
  assert.equal(await sendChatMessage('  First  ','/projects'),'Hello\n- Workflow')
  await sendChatMessage('Second','/about')
  assert.equal(requests[0].data.sessionId,requests[1].data.sessionId)
  assert.equal(requests[0].data.message,'First'); assert.equal(requests[1].data.page,'/about')
  assert.equal(requests[0].url,'/api/chat'); assert.equal(requests[0].data.source,'portfolio-chatbot')
  assert.ok(Number.isFinite(Date.parse(requests[0].data.timestamp)))
  await assert.rejects(sendChatMessage(' ','/'),/automation/)
  globalThis.fetch=async()=>({ok:true,json:async()=>{throw new SyntaxError('private raw response')}})
  await assert.rejects(sendChatMessage('Test','/'),e=>e.message===CHAT_ERROR)
  globalThis.window.setTimeout=callback=>setTimeout(callback,1)
  globalThis.fetch=async (_url,options)=>new Promise((_resolve,reject)=>options.signal.addEventListener('abort',()=>reject(new Error('timeout'))))
  await assert.rejects(sendChatMessage('Timeout','/'),e=>e.message===CHAT_ERROR)
  globalThis.window.setTimeout=setTimeout

  delete process.env.MAKE_CHAT_WEBHOOK
  let res=response(); await handler({method:'POST',body:payload},res); assert.equal(res.statusCode,503)
  process.env.MAKE_CHAT_WEBHOOK='https://example.invalid/chat'
  let calls=0,forwarded
  globalThis.fetch=async (_url,options)=>{calls++; forwarded=JSON.parse(options.body);return new Response(JSON.stringify({answer:'Safe response\n- Details'}),{headers:{'Content-Type':'application/json'}})}
  res=response(); await handler({method:'GET'},res); assert.equal(res.statusCode,405)
  res=response(); await handler({method:'POST',body:{...payload,message:''}},res);assert.equal(res.statusCode,400)
  res=response(); await handler({method:'POST',headers:{host:'portfolio.test',origin:'https://other.test'},body:payload},res); assert.equal(res.statusCode,403)
  assert.equal(calls,0)
  const req=Readable.from([JSON.stringify(payload)]); req.method='POST'
  res=response(); await handler(req,res); assert.equal(res.statusCode,200)
  assert.deepEqual(forwarded,payload); assert.deepEqual(res.body,{success:true,reply:'Safe response\n- Details'})
  const large=Readable.from(['x'.repeat(16385)]); large.method='POST'
  res=response(); await handler(large,res); assert.equal(res.statusCode,413)
  const invalid=Readable.from(['not JSON']); invalid.method='POST'
  res=response(); await handler(invalid,res); assert.equal(res.statusCode,400)
  for (const data of [{}, {success:false,reply:'private'}, {reply:123}]) {
    globalThis.fetch=async()=>new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}})
    res=response(); await handler({method:'POST',body:payload},res);assert.equal(res.statusCode,502);assert.equal(res.body.error,CHAT_ERROR)
  }
  globalThis.fetch=async()=>{throw new Error('private upstream error')}
  res=response();await handler({method:'POST',body:payload},res);assert.equal(res.statusCode,502)
  globalThis.fetch=async()=>({ok:false})
  res=response();await handler({method:'POST',body:payload},res);assert.equal(res.statusCode,502)
  globalThis.fetch=async()=>new Response('Live Make plain-text reply',{headers:{'Content-Type':'text/plain; charset=utf-8'}})
  res=response();await handler({method:'POST',body:payload},res);assert.equal(res.statusCode,200)
  res=response();await handler({method:'POST',body:payload},res);assert.equal(res.statusCode,200)
  res=response();await handler({method:'POST',body:payload},res);assert.equal(res.statusCode,429)
  const textPayload={...payload,sessionId:'session_11111111-1111-4111-8111-111111111111'}
  for(const text of ['Accepted','<html>Error page</html>','{"reply":']) {
    globalThis.fetch=async()=>new Response(text,{headers:{'Content-Type':'text/plain'}})
    res=response();await handler({method:'POST',body:textPayload},res);assert.equal(res.statusCode,502)
  }
  globalThis.fetch=async()=>new Response('{"success":true,"reply":"JSON with text content type"}',{headers:{'Content-Type':'text/plain'}})
  res=response();await handler({method:'POST',body:textPayload},res);assert.deepEqual(res.body,{success:true,reply:'JSON with text content type'})
  console.log('PASS: response adapters, exact payload, anonymous session reuse, invalid input/JSON, timeout, safe errors, origin checks, size limit, rate limiting. Mocked requests only; no Make requests sent.')
} finally {
  globalThis.fetch=originalFetch
  if(originalEndpoint===undefined) delete process.env.MAKE_CHAT_WEBHOOK
  else process.env.MAKE_CHAT_WEBHOOK=originalEndpoint
}

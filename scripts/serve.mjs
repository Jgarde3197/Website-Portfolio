import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadEnv } from 'vite'
import contact from '../api/contact.ts'
import chat from '../api/chat.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
process.env.MAKE_CONTACT_WEBHOOK ||= loadEnv('production', root, '').MAKE_CONTACT_WEBHOOK
process.env.MAKE_CHAT_WEBHOOK ||= loadEnv('production', root, '').MAKE_CHAT_WEBHOOK
const dist = path.join(root, 'dist')
const mime = { '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.pdf': 'application/pdf', '.woff': 'font/woff', '.woff2': 'font/woff2', '.html': 'text/html' }
http.createServer(async (req, res) => {
  const pathname = new URL(req.url, 'http://localhost').pathname
  if (pathname === '/api/contact') { await contact(req, res); return }
  if (pathname === '/api/chat') { await chat(req, res); return }
  if (pathname.startsWith('/api/')) { res.writeHead(404); res.end(); return }
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return }
  let name
  try { name = decodeURIComponent(pathname) } catch { res.writeHead(400); res.end(); return }
  const candidate = path.resolve(dist, `.${name}`)
  if (!candidate.startsWith(dist + path.sep) && candidate !== dist) { res.writeHead(404); res.end(); return }
  const file = fs.existsSync(candidate) && fs.statSync(candidate).isFile() ? candidate : path.join(dist, 'index.html')
  res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream')
  if (req.method === 'HEAD') { res.end(); return }
  fs.createReadStream(file).on('error', () => { res.statusCode = 500; res.end() }).pipe(res)
}).listen(Number(process.env.PORT || 5183), '127.0.0.1', () => console.log('Portfolio with contact API ready on localhost'))

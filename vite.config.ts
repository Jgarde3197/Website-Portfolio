import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import contact from './api/contact.ts'
import chat from './api/chat.ts'
import type { IncomingMessage, ServerResponse } from 'node:http'

const contactMiddleware = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
  const pathname = req.url?.split('?')[0]
  if (pathname === '/api/contact') { void contact(req, res); return }
  if (pathname === '/api/chat') { void chat(req, res); return }
  next()
}

export default defineConfig({
  plugins: [react(), {
    name: 'portfolio-contact-api',
    configResolved(config) {
      process.env.MAKE_CONTACT_WEBHOOK ||= loadEnv(config.mode, config.root, '').MAKE_CONTACT_WEBHOOK
      process.env.MAKE_CHAT_WEBHOOK ||= loadEnv(config.mode, config.root, '').MAKE_CHAT_WEBHOOK
    },
    configureServer(server) { server.middlewares.use(contactMiddleware) },
    configurePreviewServer(server) { server.middlewares.use(contactMiddleware) },
  }],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    // Dev-time security headers. In production these MUST be set at the
    // reverse proxy (Nginx) along with CSP, HSTS, and a stricter
    // Permissions-Policy. Do not duplicate them in Nginx config blindly -
    // some headers (e.g. CSP) need values that differ between dev and prod.
    headers: {
      // SAMEORIGIN (not DENY) so the Funnels + SamplePlan modals can
      // iframe their own /funnels/*.html and /sample-automation-plan.html
      // documents. Cross-origin framing is still blocked.
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  build: {
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
        },
      },
    },
  },
})

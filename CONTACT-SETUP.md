# Contact delivery

The form posts JSON to `/api/contact`. This server endpoint validates the message and forwards `name`, `email`, `service`, and `message` to Make. It returns `{ "ok": true }` only after Make accepts the request. A static HTML fallback or failed webhook is never reported as success.

## Local use

Use Node 24 (or Node 22.19+). Copy `.env.example` to `.env.local`. Set `MAKE_CONTACT_WEBHOOK` to your supplied Make URL; keep `VITE_CONTACT_ENDPOINT=/api/contact`. This computer is already configured in the untracked `.env.local`.

Run `npm install`, `npm run build`, then `npm run serve` for http://127.0.0.1:5183. Development and Vite preview also mount the same API handler. The Node scripts use the operating system's trusted certificates, with TLS verification enabled.

## Vercel deployment

Upload/deploy the updated project. In Vercel Project Settings → Environment Variables, add `MAKE_CONTACT_WEBHOOK` with your supplied Make URL for Production (and Preview if needed), then redeploy. Keep the frontend endpoint at `/api/contact`. Do not prefix the webhook variable with `VITE_`; the URL belongs on the server. Environment files are excluded from the distributable ZIP.

Static-only hosting cannot execute this API function; use Vercel or the supplied Node server. Make must have an active webhook scenario, or be listening with Run once. Map `name`, `email`, `service`, and `message` from the webhook bundle to your workflow steps. Acceptance at the webhook confirms intake; downstream email/CRM actions depend on the scenario's mappings and execution history.

## Verification on 2026-10-07

The local preview previously served the app HTML for `/api/contact`, and the frontend incorrectly counted any HTTP success as delivery. That path is fixed. A clearly labelled browser form submission named “Portfolio Connection Test” was accepted by Make after enabling the system certificate store; the form showed “Got it.” The first attempts failed certificate verification and did not report success. Check Make's webhook queue or execution history for the accepted test bundle.

Regression tests cover false HTML success, success confirmation, payload validation, honeypot, JSON parsing, request size, missing configuration, and upstream failures. Run `npm run test:contact`.

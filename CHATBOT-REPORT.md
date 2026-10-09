# Portfolio chatbot implementation — October 9, 2026

## Status

The chatbot is configured locally with the supplied server-only webhook and verified with two successful live messages in a fresh anonymous session. Both replies appeared in the browser. The same session ID was reused. Make currently returns plain text, which the proxy normalizes to JSON. Airtable branch execution/record writes were not directly inspected because no execution-history or Airtable connector access was available. The contact-form webhook was not reused; the source archive excludes private environment files.

## 1. Files created and modified

Created:
- `src/components/AutomationAssistant.tsx`: persistent shell widget, compact panel, quick actions, safe message bubbles, loading/error states, keyboard controls and modal minimization.
- `src/styles/automation-assistant.css`: navy/blue/orange styling, independent message scrolling, mobile margins, safe-area/tab-bar clearance and reduced-motion support.
- `src/lib/chat.ts`: one frontend API/config module, request mapping, anonymous session ID, timeout and request handling.
- `src/lib/chat-response.ts`: shared response normalization and safe error text.
- `api/chat.ts`: server-only Make forwarding with validation, origin check, timeout, normalized responses and best-effort per-instance rate limiting.
- `scripts/test-chat.mjs`: mocked regression checks without real Make calls.
- `CHATBOT-REPORT.md`: this report.

Modified: `src/App.tsx`, `src/vite-env.d.ts`, `.env.example`, `vite.config.ts`, `scripts/serve.mjs`, `scripts/build.mjs`, `package.json`, `CONTENT-GUIDE.md`. The Windows build fallback now resolves the chat API import. The delivery packaging validator also checks any configured chat webhook for accidental inclusion. Existing contact, projects, certificates, resume and lightbox components were not changed.

## 2. Environment variables

- `MAKE_CHAT_WEBHOOK`: server-only chatbot webhook, configured in local `.env.local`. Set the same variable separately in Vercel before deploying; it is excluded from the ZIP.
- `VITE_CHAT_ENDPOINT`: optional public API path, default `/api/chat`.

The user allowed a proxy when an appropriate backend already existed; this project already has `api/contact.ts`, Vercel functions and local API middleware. Therefore the webhook is not exposed through `VITE_MAKE_CHAT_WEBHOOK_URL`. No Gemini/Airtable/Make credentials are present in client source or required by the frontend.

## 3. Exact live request contract

First successful request forwarded to Make after the response-parser fix:

```json
{
  "message": "What automation tools does Jefferson use?",
  "sessionId": "session_a6e39e30-7403-4840-bc3d-95b742a48353",
  "page": "/projects",
  "timestamp": "2026-10-09T07:53:59.980Z",
  "source": "portfolio-chatbot"
}
```

Follow-up, using exactly the same session ID:

```json
{
  "message": "Which of the tools from your previous answer would you use for lead qualification, and why?",
  "sessionId": "session_a6e39e30-7403-4840-bc3d-95b742a48353",
  "page": "/projects",
  "timestamp": "2026-10-09T07:54:17.369Z",
  "source": "portfolio-chatbot"
}
```

## 4. Exact actual Make responses

Both requests returned HTTP 200 with `Content-Type: text/plain; charset=utf-8`. **Make did not return JSON.** Exact first body:

```text
Jeff uses Make.com, Zapier, and Google Gemini AI as his primary automation and AI tools. He also integrates various CRMs and business apps like Airtable, HubSpot, Google Sheets, Slack, and Gmail to streamline workflows.
```

Exact follow-up body:

```text
Para sa lead qualification, gagamitin ni Jeff ang Zapier o Make.com kasama ang Google Gemini AI at Airtable. Ang AI ang mag-a-analyze ng info ng lead, tapos awtomatikong ise-save at ia-organize ng Make.com o Zapier ang data sa Airtable para madali silang ma-follow up.
```

The server returned normalized JSON to the browser, for example:

```json
{
  "success": true,
  "reply": "Jeff uses Make.com, Zapier, and Google Gemini AI as his primary automation and AI tools. He also integrates various CRMs and business apps like Airtable, HubSpot, Google Sheets, Slack, and Gmail to streamline workflows."
}
```

One earlier diagnostic request identified the original format mismatch. The clean verification session above then confirmed both displayed replies after the parser fix.

## 5. Session ID generation

`session_` plus `crypto.randomUUID()`, saved in `sessionStorage` under `portfolio_chat_session_id` on first send. Memory fallback handles blocked storage. No personal identifiers or fingerprinting are used. An IP may be used temporarily for server rate limiting only, never for conversation identity or in the Make payload. Visible messages survive route changes and chat minimization in React state; they are not saved permanently in localStorage.

## 6. Airtable routing

A fresh anonymous session and its subsequent message both produced live replies with exactly the same session ID. This confirms the external request/reply flow for initial and follow-up messages. The exact Airtable new-session/existing-session branches and record writes cannot be independently confirmed without Make execution history or Airtable access. No Airtable state or Make workflow was recreated or modified.

## 7. CORS

No CORS changes were made. The browser calls its own `/api/chat`; the proxy calls Make server-to-server. Browser-to-Make CORS is therefore avoided. Live upstream availability is verified. Plain-text responses are supported at the proxy; no browser-to-Make CORS changes were needed.

## 8. Production proxy recommendation

The proxy is already included using the existing backend. Keep the webhook in a server-only environment variable. Validation, controlled errors, 25-second upstream timeout, 30-second client timeout and an eight-request/minute per-instance limit are implemented. Before wider public use across serverless instances, add a hosting WAF or shared rate-limit store; the in-memory limit is not distributed abuse protection.

## 9. Make response changes

No Make changes are required for the currently working text/plain response. The proxy now recognizes this verified format and wraps the assistant reply in strict JSON before returning it to the browser. Preferred future Webhook Response remains valid JSON `{ "success": true, "reply": "Assistant response" }` with `Content-Type: application/json`. JSON replies accept root-level `reply`, `response`, `message` and `answer` strings. Nested objects, arrays, blank replies, explicit `success:false`, generic `Accepted` acknowledgments, malformed JSON and HTML fallback pages fail safely.

## Verification

- Production build and TypeScript passed; lint passed.
- `npm run test:chat` passed: four response fields, invalid JSON/shapes, exact payload, same-session reuse, nonempty/length validation, client timeout, safe errors, proxy method/origin/size checks and rate limiting.
- Existing contact tests passed; no live contact submissions were sent.
- Local browser simulation verified initial message/four quick actions, first/subsequent replies, loading state, duplicate Enter suppression, Enter sending, Shift+Enter line breaks, safe HTML-like text, controlled upstream failure, closing/reopening and route persistence.
- Project modal opened while chat was active: chat automatically minimized and hid below the modal; reopening preserved seven messages. Existing modal/lightbox code was not edited.
- Keyboard focus enters the input; Escape closes and returns focus to the launcher, including mobile.
- Tested 320, 375, 390, 430, 768, 820 and 1440px: no horizontal overflow; panel and input remain in bounds. Fixed a scrollbar-related narrow-screen margin issue; both left/right mobile margins now stay within the layout viewport.
- Short 390×430 viewport keeps input visible. The component listens to `visualViewport` resize/scroll to avoid keyboard overlap. A physical mobile keyboard was not exercised; on-device verification is still advised.
- Chat uses native independent scrolling and does not lock body/page scroll. No continuous launcher animation; hover lift is disabled with OS/site reduced-motion settings.
- No JavaScript exceptions were observed. Deliberately unconfigured/simulated-failing requests return expected 503/502 statuses; those may appear as failed network requests in developer tools, but only the controlled message appears in the UI.

Live Make receipt and both browser-displayed replies were verified after configuration. Browser console captured no errors in the clean live session. Updated plain-text/JSON-response regression checks, TypeScript production build and lint passed. The webhook was scanned to ensure it is absent from the production bundle and delivery ZIP. Airtable internals and Vercel environment configuration remain outside the verified local frontend/request flow.

# Contact deployment repair — 11 October 2026

## Findings and root cause boundary

The user confirmed Vercel uses the outer project folder. This ZIP also contains a different, newer project in Website-Portfolio/. That nested copy is preserved byte-for-byte (excluding generated files and private environment files). Deploy the OUTER folder containing package.json, api/, shared/, src/ and vercel.json.

The outer project already had a Vercel-compatible POST handler in api/contact.ts. The existing SPA rewrite excludes /api/; it was not intercepting the contact route. Production probes on https://jeffgarde.vercel.app/api/contact returned GET 405 and POST with empty JSON 400, with the expected JSON errors. These probes cannot deliver a message. The earlier 404 was not reproduced; the deployed commit, Vercel settings and logs were not accessible, so its historical cause cannot be established.

The exact text "Unable to submit this message." originates in readLead when the hidden website honeypot is nonempty. In the outer form that exception occurred outside try/catch, before fetch, explaining how this source can fail with no network request. The source cause is verified; browser-extension/autofill involvement in the user's incident is a hypothesis, not reproduced evidence.

Other verified defects: last name was required; submission had no synchronous guard; local environment loading could turn absent configuration into the literal string "undefined"; contact's emitted JavaScript retained a src/data/contact-info.ts import. The packaging repair removes that contact dependency without touching chatbot code.

## Exact changes

- api/contact.ts: import existing shared/contact-info.mjs; validate server configuration; prevent redirects; distinguish timeout 504, upstream/network 502 and configuration 503; reject HTML, invalid JSON and explicit failed JSON acknowledgements. Preserve existing name/email/service/message payload and plain-text Make acceptance.
- src/lib/contact.ts: optional last name; service validation; explain honeypot rejection; actionable network/timeout errors; browser timeout 20 seconds allows the server's 15-second timeout to respond.
- src/components/ContactGrid.tsx: catch validation exceptions; readonly empty honeypot reduces unintended user/autofill entry; synchronous duplicate guard; Sending...; reset only after confirmed API success; keep entries on failures or mail-app handoff. No styling changes.
- scripts/serve.mjs and vite.config.ts: assign the contact environment variable only when a value exists. Chat environment handling unchanged.
- vercel.json: contact-only shared module inclusion and 30-second function duration. Existing SPA rewrite unchanged.
- scripts/test-contact.mjs: extend mocked coverage for missing fields, optional last name, honeypot, invalid upstream responses, missing/invalid configuration and timeouts.
- scripts/test-contact-runtime.mjs (new): compiled contact function test without src or TypeScript runtime support, plus SPA exclusion checks.
- CONTACT-DEPLOYMENT.md (new): this document.

## Deployment

Keep MAKE_CONTACT_WEBHOOK server-side in the existing Vercel project's Production environment. The user reports it is already configured; its value was neither accessed nor changed. For Preview testing, configure the separate Preview scope too. Do not change MAKE_CHAT_WEBHOOK. Do not put webhook values in VITE_ variables.

Use the outer project root, the existing Vite preset/build command npm run build and dist output. Commit api/, shared/, vercel.json and the source changes, then create a fresh deployment. Merely uploading dist deploys no API source. Leave VITE_CONTACT_ENDPOINT unset or set it to /api/contact; an empty value retains the preexisting mail-app fallback. Do not deploy the nested copy accidentally.

The outer copy has no Loom introduction component; the Loom video exists only in Website-Portfolio/. This task preserves both copies rather than silently replacing unrelated content. Selecting the outer root will continue to use its existing About page.

Vercel reference: https://vercel.com/docs/functions/runtimes/node-js and https://vercel.com/docs/project-configuration/vercel-json

## Actual verification results

- npm run build: PASS (TypeScript and Vite). Existing Windows fallback used; nonfatal React Router directive notices.
- npm run lint: PASS.
- npm run test:contact: PASS. All webhook responses mocked.
- npm run test:chat: PASS; request/session payload, adapters, validation, timeouts and rate limits. No chat file modified.
- node scripts/test-contact-runtime.mjs: PASS. Compiled function runs with only its shared JavaScript dependency; /api/contact and /api/chat excluded from SPA fallback.
- node scripts/test-api-runtime.mjs: FAIL. Preexisting outer test assumes functions['api/*.ts'], Node engines and shared chat imports from the newer nested copy. The original outer configuration already lacked these prerequisites. Preserved rather than altering protected chatbot packaging or weakening that test. The dedicated contact runtime check passes. This is a known overall-check limitation.
- Production route probes: GET 405; empty POST 400. No valid production message sent.
- Browser against production build with actual local contact handler and mocked upstream: required-input validation, 1800ms pending state, disabled Sending..., click plus immediate Enter yields one upstream request, backend failure preserves values, keyboard Enter success, cleared form after confirmed success, mobile 375x812 success with optional blank last name. Exactly three requests were recorded for three intentional submissions. Browser console error list empty.
- No physical mobile device, keyboard overlay, extension autofill reproduction, real Vercel function packaging/build, live Make delivery or exhaustive unrelated-feature retest. Existing CSS/assets/FAQ/navigation/chat/Loom files hash-verified unchanged.

## Live acceptance test after deployment

1. Open the contact form with DevTools Network Fetch/XHR visible. Submit one message you intend to deliver.
2. Confirm one POST /api/contact, response HTTP 200 and JSON {"ok":true}, followed by the success message. A GET 405 confirms route startup only.
3. In Make, inspect the CONTACT scenario execution history and confirm the received name, email, service and message. Check all intended downstream actions; HTTP acceptance alone does not prove they completed.
4. For errors, inspect the JSON response and Vercel function logs. 400 means input validation; 503 means configuration; 502 means upstream rejection/network/unexpected response; 504 means timeout with acceptance uncertain. Check Make history before retrying an uncertain timeout.
5. If the production 404 reappears, inspect deployed commit and Root Directory, confirm the function appears in that deployment, and ensure the full source (not just dist) was deployed. Do not connect contact to the chatbot webhook.

No successful live Make.com delivery is claimed.

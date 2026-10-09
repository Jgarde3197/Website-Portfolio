# Vercel API module resolution fix — October 9, 2026

## Result and verification boundary

Both API functions now import runtime-ready JavaScript utilities. All local checks passed. No Vercel deployment was performed: Preview and Production verification remains pending the user's upload to `portfolio-v2` in `Jgarde3197/Website-Portfolio`, connected to the existing `website-portfolio` Vercel project.

## Cause and corrected files

The reported compiled `api/chat.js` tried to load `src/lib/chat-response.ts`, which was absent from its deployed function package. The contact API had the same class of dependency on `src/data/contact-info.ts`. Vite builds the browser application; its successful frontend build alone does not establish that those runtime TypeScript imports exist inside a Vercel function.

- `shared/chat-response.mjs`: canonical pure ESM response adapter, safe error text and message limit. It preserves the existing normalization behavior.
- `shared/contact-info.mjs`: canonical public contact email, unchanged.
- `shared/chat-response.d.mts` and `shared/contact-info.d.mts`: TypeScript declarations for the JavaScript modules.
- `api/chat.ts` and `api/contact.ts`: import the shared `.mjs` files instead of runtime TypeScript files under `src`. Their only other imports are erased Node type imports. Request validation, anonymous session handling, response normalization, timeout handling and Make forwarding are preserved.
- `src/lib/chat-response.ts` and `src/data/contact-info.ts`: compatibility re-exports preserve existing frontend import paths without duplicating logic or changing interface behavior.
- `vercel.json`: explicitly includes `shared/*.mjs` in both API function packages and sets a 30-second function duration, accommodating the existing 25-second chat upstream timeout. The existing SPA rewrite still excludes `/api/`.
- `package.json` and `package-lock.json`: pin Node major `24.x`, matching the tested local runtime, and add `test:api-runtime`.
- `eslint.config.js`: includes the new shared JavaScript utilities in linting.
- `scripts/test-api-runtime.mjs`: regression test for compiled functions running without source TypeScript files.
- `CONTENT-GUIDE.md` and `CHATBOT-REPORT.md`: clarify runtime utility locations and deployment verification status.

No unrelated website components, styling, animations, assets or content were changed. `MAKE_CHAT_WEBHOOK` and `MAKE_CONTACT_WEBHOOK` remain server-side environment variables. The archive excludes private environment files, generated frontend output and installed dependencies.

Vercel documents [`functions.includeFiles` and duration configuration](https://vercel.com/docs/project-configuration/vercel-json) and [supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

## Actual local test results

Runtime: Node.js `v24.21.0`.

| Check | Actual result |
| --- | --- |
| `npm run build` | Passed: TypeScript no-emit check and Vite production build; 4,683 modules transformed. |
| `npm run lint` | Passed, no lint errors or warnings. |
| `npm run test:chat` | Passed: response adapters, payload/session reuse, validation, origin, timeout, controlled errors and rate limit. |
| `npm run test:contact` | Passed: successful forwarding, validation, size limits and rejection of false HTML success. |
| `npm run test:api-runtime` | Passed: compiled chat/contact functions load and execute with only shared `.mjs` dependencies, no `src` tree and TypeScript runtime loading disabled. |
| `npx --no-install tsc --allowJs --checkJs --noEmit --target ES2022 --module NodeNext --moduleResolution NodeNext --skipLibCheck shared/chat-response.mjs shared/contact-info.mjs` | Passed. |

The production build used the existing Windows file-based esbuild fallback after a pipe permission warning. Existing React Router `use client` notices were nonfatal. Build exited successfully.

The runtime test transpiles the actual API entry files to JavaScript, audits every emitted runtime import for unresolved paths and TypeScript/source-tree dependencies, then runs both functions in an isolated package under Node with `--no-experimental-strip-types`. It verifies missing environment configuration, unsupported methods, JSON response normalization, plain-text chat forwarding and contact forwarding. Requests are mocked: no real Make executions were triggered by these tests. This is a local packaging simulation, not an actual Vercel build or deployment test.

## Upload and Preview verification

1. Extract the ZIP and upload the contents of its `Jefferson-Garde-Portfolio-V2` folder to the existing repository's `portfolio-v2` branch. Include the entire `shared/` directory, API files, package lock and `vercel.json`; retain the existing project root setting at the folder containing `package.json`.
2. Ensure `MAKE_CHAT_WEBHOOK` and `MAKE_CONTACT_WEBHOOK` are configured for Vercel **Preview**. Production needs its own environment scope when deployed there. Never place either value in a `VITE_` variable or frontend file.
3. After the Preview deployment finishes, send a message through the existing chatbot and submit a contact message you intend to send. Check response bodies and function logs, and confirm the intended Make scenarios receive the original fields. Send a second chat message to verify session ID reuse.
4. Confirm the previous missing-module error is absent. A browser GET to either POST-only endpoint should return 405; that confirms startup but does not verify webhook forwarding. A controlled 503 indicates missing server environment configuration.

Vercel Preview and Production success are not yet confirmed. The user will provide deployment results if further debugging is needed.

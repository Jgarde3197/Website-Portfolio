# Portfolio V2 targeted fixes — 9 October 2026

## Scope

Three targeted fixes. No copy, project details, resume, certifications, images,
dependencies, Make.com webhook, API implementation, Vercel configuration, or
environment-variable configuration changed.

## 1. Page scrolling

The desktop shell's `data-fixed` CSS disabled scrolling for Home and Projects.
Projects additionally put the extended project grid inside its own scrolling
area. Wheel input was therefore dependent on the region under the pointer.
Lenis referenced `panel.firstElementChild`, which React replaces on navigation
and during lazy-route loading. Its size observer could remain attached to a
detached route and retain outdated limits. This lifecycle defect is established
from the code; the initial Services browser check did scroll successfully.

The main panel now allows overflow on every route. Projects retains the same
card columns and dimensions, but its content expands within the main scrolling
panel instead of creating another vertical scroll container. Home still fits
one viewport where its content permits; no artificial extra scroll space was
added. Lenis observes the persistent panel and reads live scroll bounds using
the installed version's `naiveDimensions` option. Legitimate nested scrolling
areas can scroll natively. The existing chatbot Lenis exclusion is retained.
ScrollTrigger defaults return to the document below the desktop breakpoint.
Native mobile scrolling and the existing reduced-motion bypass are retained.
No custom wheel/touch interception was added and no animations were removed.

## 2. Mobile chatbot

Normal narrow-width inspection did not find a blocking overlay or z-index
defect: the Send button was hit-testable. Reduced-height testing did expose
the panel itself scrolling when the browser focused the textarea. Because the
panel used `overflow:hidden`, it was still a programmatic scroll container;
its header and composer could shift out of the visible panel. The old height
calculation also reserved 118 pixels even when the keyboard had reduced the
visual viewport.

The panel now uses `overflow:clip`, leaving scrolling to the message log. Its
mobile height accounts for the visual viewport and the actual space reserved
below it, and compact padding/composer height makes better use of small visible
heights. Non-mouse pointer-down on Send preserves textarea focus so keyboard
blur does not move the button between pointer-down and click. Submission still
uses the existing form handler; Enter, Shift+Enter and IME composition handling
remain intact, with `enterKeyHint="send"` added.

Session creation/storage, history state, `/api/chat`, request fields, response
normalization and desktop submission logic are unchanged. Physical-phone
keyboard/touch behavior was not tested; the touch focus safeguard is a targeted
mitigation, not a claim of verified device behavior.

## 3. Services workflow Error label

Services uses `Autopilot.tsx`. The Error label was positioned using the average
of its cable endpoints with an arbitrary vertical offset. That position did
not track the curved Error branch near the AI error destination. Only this
label now uses a point at 90% of the actual SVG path length, with a small offset
to keep the text beside the branch. Paths, nodes, colors, signal movement and
other labels are unchanged. Coordinates stay in the SVG's design units.

## Modified source files

- `src/hooks/useLenis.ts`
- `src/lib/scrolltrigger.ts`
- `src/styles/shell.css`
- `src/components/ProjectsGrid.tsx`
- `src/styles/portfolio.css`
- `src/components/AutomationAssistant.tsx`
- `src/styles/automation-assistant.css`
- `src/components/Autopilot.tsx`

This report is the only additional project file.

## Automated checks

All passed with Node 24.21.0 and the dependencies in the supplied lockfile:

- Production build: TypeScript `--noEmit` plus `scripts/build.mjs`, exactly the
  commands underlying `npm run build`.
- Lint: `node node_modules/eslint/bin/eslint.js .`, equivalent to `npm run lint`.
- Existing chat tests: `node --experimental-strip-types scripts/test-chat.mjs`.
- Existing contact tests: `node --experimental-strip-types scripts/test-contact.mjs`.
- Existing deployment API tests: `node scripts/test-api-runtime.mjs`.

Build used the project's existing Windows file-based esbuild fallback because
this environment denied esbuild service pipes. Existing React Router `use client`
warnings were nonfatal. No build-script changes were needed.

Chat/contact/runtime tests used mocks: session reuse, exact payload forwarding,
response adapters, invalid inputs, timeouts, origin/size/rate limits, missing
configuration, methods and the compiled deployment package all passed. No live
Make.com request was sent.

## Browser checks actually performed

The production build was served locally and tested in the Codex in-app Chromium
browser. These were browser interactions and DOM geometry checks, not physical
device testing.

- Desktop 1440 × 900: navigation through Home, Projects, Services, Experience,
  About, Featured Workflow and Contact. Wheel-style browser scrolling moved
  the main panel on overflowing routes. Home and Contact fit the viewport.
  Projects' nested grid overflow is now `visible`.
- Desktop and mobile-width chat: Send click, Enter submission, received replies
  and continued conversations against a separate local `/api/chat` mock server.
  This server is a test fixture outside the project and is not included in the
  delivered ZIP. Browser requests retained the same anonymous session ID and
  the existing page/source/message/timestamp fields.
- Narrow layout: 320 × 640. Short visible height: 375 × 300, approximating a
  keyboard-reduced viewport. After the clipping fix, the panel scroll position
  remained zero, and Send's center hit the Send button. An actual on-screen
  keyboard was not opened by these viewport overrides.
- Chat message log scrolled independently without moving the underlying page
  or panel. Whitespace-only input kept Send disabled.
- Workflow: desktop 1440px, tablet 768px and mobile 375px. Error coordinates
  stayed with the same branch; the mobile canvas's existing horizontal scrolling
  was used to inspect the AI error node and label.
- Site accessibility Reduce motion option: Lenis removed its classes and native
  main-panel scrolling worked. OS-level `prefers-reduced-motion` switching was
  not separately emulated; its existing hook and bypass remain in the source.

## Remaining verification limits

Real iOS/Android keyboards, touch taps/swipes, hardware touchpad inertia and
Safari were not verified. Test those on devices after deployment. The local
mock conversations do not prove a live Make.com/Vercel connection. API runtime
and forwarding tests passed, and their implementation/configuration is unchanged.
The delivered project has not been deployed to Vercel.

The ZIP excludes `.git`, `node_modules`, `dist`, test-server intermediates and
private environment files; the original `.env.example` template is retained.

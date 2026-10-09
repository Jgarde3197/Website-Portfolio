# Jefferson Garde portfolio: content guide

The V2 React, TypeScript, and Vite template remains the foundation. Most content is in `src/data/`. Files inside `public/` are served from the site root: `public/projects/example/image-01.webp` becomes `/projects/example/image-01.webp`.

## Run locally and build

Open a terminal in this project folder, then run:

```sh
npm install
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`). To check and build:

```sh
npm run lint
npm run build
npm run preview
```

`npm run build` checks TypeScript and builds with Vite. On restricted Windows sessions, the build script automatically uses the same installed esbuild compiler with file-based input/output when Windows denies service pipes. Normal environments, including Vercel, use the original Vite build configuration. This fallback does not replace the website architecture. Development mode still uses Vite's normal service; if that is restricted by Windows, use a regular local terminal or inspect the production output with `npm run preview`.

## Add a project and screenshots

1. Create `public/projects/new-project-name/`.
2. Add real screenshots, preferably WebP, named `image-01.webp`, `image-02.webp`, etc. Keep the aspect ratio and remove private information before publishing.
3. Open `src/data/projects.ts` and copy one complete object in the `projects` array.
4. Give it a unique `id` matching your new folder. Edit every field using verified information. Use `Self-built portfolio project` when appropriate.
5. Add images with their actual pixel dimensions, meaningful alternative text, and captions. Add workflow steps and tools supported by the build.
6. Run `npm run build` and open Projects to check the case study.

Example entry (replace the sample content before adding it):

```ts
{
  id: 'new-project-name',
  title: 'Your verified project title',
  shortTitle: 'A concise card title',
  platform: 'Make.com', // or 'Zapier'
  type: 'Self-built portfolio project',
  overview: 'A short summary of the actual automation.',
  problem: 'The business problem.',
  workflow: 'The trigger and actual workflow.',
  implementation: 'The real routing and automation logic.',
  safeguards: 'Verified reliability handling, or state that it is not documented.',
  value: 'The intended business value; do not invent metrics.',
  steps: ['Actual trigger', 'Actual processing step', 'Actual output'],
  tools: ['Make.com'],
  images: [{
    src: '/projects/new-project-name/image-01.webp',
    alt: 'Describe what the screenshot shows',
    caption: 'Explain the relevant workflow detail',
    width: 1600, // replace with actual image width
    height: 900, // replace with actual image height
  }],
},
```

Projects, dialogs, Home's screenshot reel, and the project count read this one array. No unrelated components need edits. The desktop grid adds rows and can scroll when more projects are added. To change the featured workflow, update the selected project in `src/views/ShowcaseView.tsx`; this is optional when adding an ordinary project.

## Edit a project

Find its `id` in `src/data/projects.ts`. Change its fields or its `images` array. Keep its folder name and image paths in sync. To add a screenshot to an existing project, put the file in that project's folder and add one image object.

## Add, edit, or remove an FAQ

Open `src/data/faqs.ts`. Each object has `q` (question) and `a` (answer).

```ts
{ q: 'Your question?', a: 'A concise answer supported by your portfolio information.' },
```

Copy an object to add a question, change its text to edit it, or remove the complete object to delete it. The contact accordion updates automatically. Do not add prices, turnaround promises, or service claims without a factual source.

## Add a certificate

Add the original file and a preview image to `public/certificates/`. Open `src/data/certifications.ts` and add:

```ts
{ id: 'unique-credential-id', title: 'Actual training title', issuer: 'Actual issuer', type: 'Certificate of Completion', date: 'Actual date', category: 'Automation Training', description: 'Verified training description', preview: '/certificates/your-preview.png', file: '/certificates/your-original.pdf', format: 'pdf' },
```

The About page now displays Zapier and Make.com completion credentials under Automation Training and Epson under Technical Training. Categories are derived from the data and appear only when populated. Optional `icon` must reference a local asset; otherwise a neutral certificate icon is shown. Use `format: 'image'` for image-only documents. Certificate previews preserve aspect ratio and offer the original file as a download.

## Add a Loom walkthrough

In `src/data/projects.ts`, add optional `video: { url, embedUrl, description }` metadata to the matching project. Use the Loom share URL for `url` and the Loom `/embed/` URL for `embedUrl`. Do not add an autoplay parameter. `VideoWalkthrough.tsx` renders the player after Business Value and before Workflow Screenshots, with lazy loading and an external Watch walkthrough link. The customer-support and featured Zapier lead-qualification projects already contain their supplied videos.

## Replace the resume

Replace `public/resume/Jefferson_Garde_Resume.pdf`, keeping the exact spelling and capitalization. Replace `public/resume/resume-preview-page1.png` with a preview of the new first page. All PDF links use `resumeUrl` in `src/data/profile.ts`; edit that value only if you change the filename. Run a build and check both download and open links.

## Change profile information, photo, or social links

Open `src/data/profile.ts` to edit the name, title, location, hero text, and social links. The email is centralized in `src/data/contact-info.ts`. Add your real photo at **`src/assets/jefferson-profile.png`**, then restart development or rebuild. `ProfileImage.tsx` discovers that file at build time and uses it on About and in the desktop sidebar; until then it uses the existing JG initials graphic without requesting a missing file. The image uses the original cutout styling with `object-fit: contain`, the rail glow, and a lower-edge fade and has the alt text `Jefferson Garde - AI Automation Specialist`. To change a social link, edit its `href`; to remove one, remove its object.

Local SVG paths and categories are centralized in `src/data/tools.ts`; the first nine entries populate the featured tool strip. `ToolLogo.tsx` provides xs (16px), sm (20px), md (28px), and lg (40px) sizes. Keep nearby readable labels and use decorative mode to avoid duplicate screen-reader announcements. See `LOGO-SOURCES.md` for asset provenance. Employment dates remain centralized in `src/data/experience.ts`.

Other data files: `tools.ts` (stack and marquee), `experience.ts` (accurate employment history), `services.ts` (service cards), and `workflow-tools.ts` (the illustrated workflow's tool labels). The animated illustration's actual nodes and cables are in `src/components/Autopilot.tsx`.

## Contact form and calendar

The contact form uses the original field contract: `name`, `email`, `service`, `message`. In production it calls `api/contact.ts`, which forwards to Make. Set **MAKE_CONTACT_WEBHOOK** in Vercel to the original contact-form webhook from your existing portfolio. Private endpoint values are excluded from the delivery ZIP and browser bundle. If you keep a local `.env.local`, keep it Git-ignored. Never use the chatbot webhook for this setting.

`VITE_CONTACT_ENDPOINT` is optional and defaults to `/api/contact` in production. `npm run dev` uses an email-app fallback when it is unset; that fallback prepares an email and does not claim delivery. To test the server function locally, use Vercel's local environment with your server variable. The Google Calendar scheduling URL is `schedulingUrl` in `src/data/profile.ts`; bookings continue on the real Google Calendar page.

## Automation assistant

The persistent app shell mounts `src/components/AutomationAssistant.tsx`. Its visible conversation lives in React state, surviving route navigation and minimizing/reopening; reload resets visible messages. The anonymous ID survives reloads within the tab through `sessionStorage` under `portfolio_chat_session_id`, and is created on the first send with `crypto.randomUUID()`. No name, email, IP or fingerprint identifies a conversation.

Set server-only `MAKE_CHAT_WEBHOOK` to the **chatbot** Make custom webhook in Vercel and local `.env.local`. Keep the contact webhook separate. `VITE_CHAT_ENDPOINT=/api/chat` is the optional public API path; never prefix the private webhook with `VITE_`. Restart the local server after changing server environment variables. Run `npm run serve` after `npm run build`, or use Vite dev/preview; both serve `/api/chat`. Vercel serves `api/chat.ts` automatically. A static-only host needs a server/function for this route.

The frontend API/config lives in `src/lib/chat.ts`; change `mapChatRequest()` there if the contract needs different names, and update the proxy validation/forwarding accordingly. The shared reply adapter lives in `src/lib/chat-response.ts` and accepts root-level nonempty `reply`, `response`, `message` or `answer` strings. The configured Make scenario currently returns `text/plain`; `api/chat.ts` supports that format and returns strict JSON to the browser. Generic Accepted acknowledgments, HTML and malformed JSON are rejected. Recommended Make Webhook Response: JSON `{ "success": true, "reply": "Assistant response" }` with `Content-Type: application/json`. Use JSON encoding for generated strings so quotes/newlines cannot break JSON.

The browser uses same-origin `/api/chat`; the existing server layer forwards only message/sessionId/page/timestamp/source to Make. It validates requests, enforces a 25-second upstream timeout and returns only normalized replies or controlled errors. The client aborts after 30 seconds, prevents duplicate submissions, preserves multiline text safely and never renders webhook HTML. Best-effort rate limiting allows eight requests per minute per client per running server instance. For multiple/serverless instances, configure a shared rate-limit store or hosting WAF before broader public exposure. The Make scenario remains responsible for Gemini, Airtable routing and conversation persistence.

Run `npm run test:chat` for mocked adapter/session/API/timeout/validation/rate-limit tests. No real Make messages are sent by this script. See `CHATBOT-REPORT.md` for tested behavior, successful live response bodies and remaining limits on verifying Airtable internals.

## Deploy to the existing Vercel project

1. Put the finished source in the Git repository connected to your existing Vercel project. Keep the supplied LICENSE. Do not commit `node_modules`, `dist`, `.env.local`, or credentials.
2. In Vercel, choose **Vite**, set the project Root Directory to the folder containing `package.json`, Build Command to `npm run build`, and Output Directory to `dist`.
3. Set `MAKE_CONTACT_WEBHOOK` for the Production environment. Redeploy after changing environment variables.
4. Deploy the repository. `vercel.json` retains client-side routing and leaves `/api/` for the contact function.
5. Check `/projects`, `/about`, `/contact`, every screenshot, the PDF, both themes, and a real contact submission you intend to send.

The site has title, description, author, Open Graph text, and a JG favicon. Canonical URL and an absolute social share image are intentionally omitted until the final deployment URL is confirmed. Add them to `index.html` when the destination is fixed; do not use a guessed domain.

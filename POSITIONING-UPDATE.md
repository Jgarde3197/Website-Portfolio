# Automation positioning update

The existing React/TypeScript portfolio has been updated without changing its navy, blue, orange, and white identity, sidebar, routes, original motion components, project screenshots, or supplied resume PDF.

## Copy and content

- Hero uses the permitted shorter headline “Connect systems. Automate the work.”, the supplied Make/Zapier workflow body, and “Discuss your workflow”.
- The featured strip presents the requested nine tools in order. About groups all 15 demonstrated tools by platform, AI, data/CRM, intake, collaboration, and integration.
- All five project titles and subtitles are updated; the Zapier sales-routing project is clearly Flagship / Featured. Its case study includes the requested business problem, nine steps, qualification/routing logic, safeguards, six screenshot captions, and explicit design-goal disclaimer rather than measured results.
- The main services are Workflow Automation, AI Workflow Integration, and Workflow Auditing & Optimization. Map / Connect / Test, About, experience responsibilities, contact copy, six FAQs, and SEO/social metadata use the supplied positioning.
- JTI is Oct 2017–Jul 2018; Epson is Oct 2018–Jun 2021, as confirmed by the user. No new certifications, paid-client claims, or numerical results were added.

## Assets and photo

No SVG assets require manual supply. See LOGO-SOURCES.md for provenance, normalized monochrome treatment, and the Zapier mark used beside AI by Zapier. All 17 supplied project WebP screenshots remain present, with their original dimensions and bytes.

Place the photo at `src/assets/jefferson-profile.webp` inside this project and rebuild. The absolute path in this workspace is:

`C:\Users\ADMIN\Documents\Codex\2026-10-05\files-mentioned-by-the-user-portfolio\outputs\Jefferson-Garde-Portfolio-V2\Jefferson-Garde-Portfolio-V2\src\assets\jefferson-profile.webp`

The photo is the only intentionally absent asset. The current JG placeholder loads normally, including on About and the desktop sidebar, with no broken-image request. No other missing or broken referenced assets were found.

The supplied resume PDF is byte-for-byte unchanged. Its previously noted date inconsistencies are not corrected in this task, as requested; the website uses the confirmed dates above. No remaining website date clarification is needed. Real photo and verified certificates must be supplied before adding them. Deployment URL and social preview image remain unconfigured rather than guessed.

## Verification

- ESLint, TypeScript checking, and production build passed. Restricted Windows esbuild pipes use the existing file-based fallback; React Router's dependency-level “use client” directive warnings do not prevent the build.
- All seven routes checked at 375, 768, 1100, 1280, and 1440 pixels: no horizontal page overflow or loaded broken images. Project card content fits its bounds at these sizes. Desktop, tablet, and mobile pages were visually inspected.
- Local SVGs render, About tool logos use the shared size classes, profile fallback works, and resume open/download URLs still point to the supplied PDF.
- Project dialogs open via Enter, focus their close control, close with Escape, and return focus. FAQ expansion works by keyboard. Desktop rail switches to the existing floating navigation on smaller screens.
- Site Reduce motion was toggled: the track animation became `none`. Restored the preference afterward. Existing OS reduced-motion rules, live subscriptions, original shader, reel/chip motion, fan behavior, and hover rules are retained; the earlier full template comparison is documented in MOTION-AUDIT.md.
- Browser console contained no errors or warnings in the checked production routes. Email, social, calendar, project, and resume destinations were inspected; no real contact submission or booking was sent.
- Contact fields retain name/email/service/message. Service labels now come from the shared service data. A deployed end-to-end Make submission still depends on the existing server-side webhook configuration.

## Modified source and asset files

- `CONTENT-GUIDE.md`
- `api/contact.ts`
- `index.html`
- `public/logos/ai-by-zapier.svg`
- `public/logos/airtable.svg`
- `public/logos/asana.svg`
- `public/logos/calendly.svg`
- `public/logos/gemini.svg`
- `public/logos/github.svg`
- `public/logos/gmail.svg`
- `public/logos/google-drive.svg`
- `public/logos/google-forms.svg`
- `public/logos/google-sheets.svg`
- `public/logos/linkedin.svg`
- `public/logos/make.svg`
- `public/logos/slack.svg`
- `public/logos/telegram.svg`
- `public/logos/typeform.svg`
- `public/logos/upwork.svg`
- `public/logos/webhooks.svg`
- `public/logos/whatsapp.svg`
- `public/logos/zapier.svg`
- `src/components/AboutGrid.tsx`
- `src/components/ContactGrid.tsx`
- `src/components/ExperienceGrid.tsx`
- `src/components/Home.tsx`
- `src/components/HomeBento.tsx`
- `src/components/ProfileImage.tsx`
- `src/components/ProjectCaseStudy.tsx`
- `src/components/ProjectsGrid.tsx`
- `src/components/Rail.tsx`
- `src/components/ServicesGrid.tsx`
- `src/components/ToolLogo.tsx`
- `src/components/ToolsMarquee.tsx`
- `src/data/contact-info.ts`
- `src/data/experience.ts`
- `src/data/faqs.ts`
- `src/data/profile.ts`
- `src/data/projects.ts`
- `src/data/services.ts`
- `src/data/tools.ts`
- `src/styles/portfolio.css`

Additional documentation: `LOGO-SOURCES.md`, `POSITIONING-UPDATE.md`.

Final follow-up: the hero headline/CTA sizing was corrected after checking element bounds at 1440px; the CTA now ends at the container's right edge. The new src/assets/README.md explains the photo slot. Current production track transforms changed between observations for the marquee, vertical Projects reel, and both AI rows; the original canvas mounted at 1440x900 with pointer-events none and no console errors.

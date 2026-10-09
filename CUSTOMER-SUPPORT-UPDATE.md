# Project interaction and Customer Support update

## Changed source files
- `src/components/ProjectsGrid.tsx`: the whole project card is one native button. Its preview, title, arrow and card surface share the same `setOpen(project)` handler. Removed the preview's direct gallery state and ImageLightbox mount. This component caused the incorrect behavior.
- `src/data/projects.ts`: appended Customer Support as project 06; added the supplied details, 11 workflow steps, eight tool badges, troubleshooting copy, three screenshot records, gallery options, and a separate card subtitle. Existing featured lead-qualification project remains at index 4.
- `src/components/ProjectCaseStudy.tsx`: optional troubleshooting section uses existing headings and copy styles; passes gallery options.
- `src/components/WorkflowGallery.tsx`: supports a full-width first screenshot and the simple viewer for this project.
- `src/components/ImageLightbox.tsx`: optional actual-size control; omitted for the new project's requested minimal viewer. Existing projects retain their viewer behavior.
- `src/components/ToolLogo.tsx`: local HubSpot/Trello paths; Storage and Filter reuse the existing Zapier brand SVG.
- `src/styles/portfolio.css`: new gallery's first screenshot spans both columns; one-column mobile remains intact; main preview cursor is pointer; supplied paragraphs retain line breaks.
- `GALLERY-LIGHTBOX.md`: corrected its description of Projects card behavior.

## Added screenshots and vector assets
Three PNG files were copied byte-for-byte to `public/projects/customer-support/image-01.png`, `image-02.png`, and `image-03.png`. Order is Complete Customer Support Workflow, Structured Support Ticket, Urgent Support Alert. The available workflow file in the supplied project folder is named `AI-Powered Customer Support & Ticket Management Automation.png`; no `(1).png` version was found. All supplied redactions remain unchanged. No customer/demo information was transcribed into visible page text.

Added `public/logos/hubspot.svg` and `public/logos/trello.svg`, from the maintained Simple Icons repository:
- https://github.com/simple-icons/simple-icons/blob/develop/icons/hubspot.svg
- https://github.com/simple-icons/simple-icons/blob/develop/icons/trello.svg

Dedicated Storage by Zapier and Filter by Zapier SVG symbols are still missing. Their labelled tool badges use the existing local Zapier brand SVG; no external image hotlinks or raster replacements are used.

## Verification
All six previews, titles and arrows opened full project details and never opened the screenshot viewer directly. Keyboard Enter opened the new card. Screenshot buttons inside every project's detail modal opened the lightbox and returned to the parent modal on close. The new viewer displayed all three images and matching counters, supported Previous/Next and Left/Right, and closed with X, Escape and outside-overlay click. Closing it preserved the detail scroll position exactly (2008px in the desktop check).

At 320, 375, 390, 430, 768, 820 and 1440px widths, the new detail modal reached its bottom, all three PNGs loaded and no horizontal overflow occurred. Title and badges wrapped. Desktop/tablet gallery has a full-width workflow above Trello/Slack; mobile stacks all three. Phone lightbox controls remain touch sized. Existing card hover styles and reduced-motion rules are retained; no autoplay was introduced. Featured Workflow remains AI-Powered Lead Qualification & Sales Routing. Browser console had no errors. Lint, TypeScript and production build passed.

Packaging validates all 17 existing screenshots unchanged plus the three new PNGs against their supplied originals, and excludes local webhook secrets.

# Loom walkthroughs and training credentials — October 9, 2026

This update supersedes the original report's statement that certificate assets were missing. The current site includes all three newly supplied credentials.

## Files changed

- `src/data/projects.ts`: optional video metadata and both supplied Loom share/embed URLs.
- `src/components/ProjectCaseStudy.tsx`: mounts the video after Business Value and before Workflow Screenshots.
- `src/components/VideoWalkthrough.tsx`, `src/styles/video-walkthrough.css`: responsive 16:9 native Loom iframe, lazy loading, no autoplay, and a Watch walkthrough link.
- `src/data/certifications.ts`: centralized credential records, category, issuer, type, date, description, preview, original file, format, and optional local icon/program.
- `src/components/AboutGrid.tsx`: mounts Certifications & Training after Automation Stack.
- `src/components/Certifications.tsx`, `src/components/CertificatePreview.tsx`, `src/styles/certifications.css`: reusable categorized cards and accessible single-document native dialogs.
- `public/certificates/`: original Make.com and Zapier PDFs, their rendered first-page PNGs, and the original Epson certificate PNG.
- `CONTENT-GUIDE.md` and this report: maintenance instructions and verification results.

## Display and behavior

Zapier and Make.com appear as Tara AI Community+ Certificates of Completion under Automation Training. Epson appears as Technical Training under Technical Training. No vendor-certification claims or invented verification IDs are used. Empty future categories are omitted. The grid supports three desktop columns, two tablet columns and one mobile column; populated categories currently contain two and one cards respectively.

PDFs use static previews rendered with Poppler, with download links to the untouched original PDFs. Epson uses the supplied image unchanged. Each lightbox contains only the title, issuer/date, preview, close button and original-file download. Native modal isolation, focus entry/return, Tab wrapping, X/Escape/outside-click closing and exact About scroll restoration were verified. Clicking the document does not close it. Portrait previews can scroll inside the frame on tablet and mobile; the close button stays visible.

## Production verification

- `npm run build` passed TypeScript and produced the production bundle; the existing file-based Windows build fallback handled esbuild service-pipe restrictions. Existing React Router bundling notices are non-fatal.
- `npm run lint` passed.
- Both Loom players loaded inside their corresponding case studies and played after clicking Play. DOM-backed checks confirmed `paused: false`, advancing playback time and `readyState: 4`; neither player starts automatically.
- Both project modals reached their bottom at 320, 375, 390, 430, 768, 820 and desktop widths. Rechecked 375px after lazy screenshot loading completed. Loom containers preserve 16:9 and remain within the modal with no horizontal overflow.
- About cards and certificate dialogs tested at the same widths: correct column counts, loaded images, `object-fit: contain`, no horizontal overflow, visible close buttons, and tablet portrait scrolling.
- All three certificate previews visually inspected; both source PDFs contain one page. Original certificate PDFs/image copied byte-for-byte.
- No captured browser console errors during the checks. No new routes or missing credential assets.

Existing homepage behavior, profile/resume, project screenshots and contact configuration remain unchanged. No video files were downloaded or self-hosted, and no new runtime dependencies were added.

# Screenshot viewer

The entire Projects card, including its preview, title and arrow, opens full project details. Only the Workflow screenshots gallery inside those details (and Featured Workflow) opens the shared native-dialog lightbox. Screenshot metadata lives in `src/data/projects.ts`.

Controls: Previous/Next, Left/Right, Home/End, Escape, close button, and outside-overlay dismissal. Navigation wraps at either end. Actual size enables internal scrolling; changing images or reopening resets to fit. Image and details clicks keep the viewer open.

Focus enters the viewer, cycles through its controls, and returns to the opener. Background scrolling is locked while open. Opening a screenshot over a case study leaves that case study open when the viewer closes. The OS reduced-motion CSS and existing site Reduce motion setting disable viewer transitions.

Validation: lint, TypeScript, and production build passed. Browser QA opened all 17 case-study images, all five Projects previews, and all six Featured Workflow thumbnails; each loaded. Visually checked tall and wide images, desktop and 375px mobile layouts, viewport resizing while open, fit/actual-size, keyboard navigation and wrapping, focus cycling and return, image/details non-dismissal, close button, Escape, and overlay dismissal. The site Reduce motion setting produced no viewer animations. Console had no errors. The Featured Workflow page retained its URL and shell scroll position of 2100px after opening and closing its last screenshot. All 17 original screenshot assets were preserved.

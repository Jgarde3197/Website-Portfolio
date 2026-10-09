# Motion parity audit — 6 October 2026

The supplied V2 ZIP was extracted again as the reference. Jefferson's content, destinations, palette, page structure, and project images remain unchanged. No animation library or replacement background was added.

| Motion | Original supplied behavior | Final behavior / verification |
|---|---|---|
| Daily Drivers | 80-second linear horizontal marquee, doubled items, pause on hover | Same timing and hover pause. Two identical groups eliminate the padding/gap seam error. Visually moving on desktop and 390px mobile; both copy widths equal (2652.58px desktop, 1170px mobile). |
| Projects | 22-second upward drift on desktop; 26-second horizontal drift below 1100px; starts on hover | Original keyframes, speeds, clipping, browser-window treatment, and actual Jefferson images retained. Now continuously moving with hover/focus pause, as requested. Added trailing gap for an exact repeated period. Narrow horizontal CSS behavior visually exercised with a test-only bento mount. |
| AI Builds | Two 26-second chip tracks in opposite directions, starts on hover | Same timing, masks, spacing, direction, and tools. Now continuous with hover/focus pause. Trailing gap fixes the loop boundary. Temporal transforms and visible screenshots confirm movement. |
| About | Original fanned stack with a subtle hover rotation/spread/lift | Original CSS retained; focus-visible also activates the original base interaction. Fan visually confirmed; hover emulated in the audit fixture using the actual CSS selectors, not a different animation. |
| Background | Lazy Three.js full-screen contour shader, aspect-corrected simplex noise, cursor response, 30fps drift; skips reduced motion/touch-only devices and low performance tier | Original shader, constants, opacity/intensity, pace and theme blending are byte-for-byte unchanged. Broad touch-presence detection replaced with actual coarse-pointer/no-hover detection. Live motion preferences now mount/unmount correctly. Canvas confirmed at 1440×900, fixed behind content, z-index 0, pointer-events none. Background-only comparison region changed 1260 pixels between captured frames. |
| Other cards | Resume/badge scale and rotation, Services row/icon feedback, review-column hover drift, card arrow/title/icon interactions | Preserved original styles and timing; focus-visible shares the existing bento interactions. Experience keeps the original review-column hover-driven behavior; its trailing loop gap was corrected. |
| Reveal / intro | Original intersection reveals, Web Animations workflow intro and headline handoff | Retained. Original reveal styles/hooks and intro choreography were not removed during customization. No extra reveals added. |
| Navigation/buttons | Original rail icon/active feedback, CTA transitions, mobile press feedback and 260ms route rise | Retained. Mobile Home → Contact navigation confirmed `has-navigated` and `route-rise`; current labels and destinations preserved. |
| Accessibility | OS reduced motion, site switch, keyboard focus, native touch scrolling, performance tiers | Both OS and site preference paths tested. Site switch immediately removes the canvas and stops all tracks; turning it off remounts the canvas. Lenis now also responds to preference changes during a visit. Original performance fallback and native touch behavior remain. |

## Findings and intentional differences

Most original motion CSS and the canvas component were already present. The largest apparent missing-motion cause in this browser was its **OS reduced-motion preference**: it reports `reduce`, so production correctly suppresses decorative animation. No user/browser/OS preference was changed. The original also held the Projects and AI rows until hover; their continuous default drift and pause-on-hover are intentional changes requested in this audit, rather than a claim that the ZIP already did that.

Below 1100px, both original and customized Home render the **Explore shelf instead of the bento**. That mobile layout is preserved. Projects/AI/About bento cards are not newly inserted into mobile Home. The original narrow horizontal reel CSS remains and was exercised separately through a test-only mount.

## Browser validation

Compared original and restored production bundles side by side, with both desktop frame widths fixed at 1440px and mobile frames at 390px. Captured moving marquee, Projects reel, AI rows, original contour background, and fan states. Desktop track transforms changed between observations; AI rows use normal/reverse directions. Keyboard focus pauses the Projects reel. Hover pause states for marquee, Projects, and both AI rows were confirmed through explicit hover emulation; the browser automation surface does not provide a pointer-hover method. No console errors or warnings were captured in the normal-motion comparison, mobile preview, or unmodified production preview.

Normal motion was tested through **isolated local preview fixtures** that emulate `no-preference` for JS and CSS, because this browser reports OS reduced motion. Fixture controls and emulation live only under `work/`; they are excluded from the deliverable and ZIP. The real production preview, without emulation, confirmed OS reduce → no track animations and no canvas. Physical touch hardware was not available; touch-only gating was source-audited, while responsive widths were visually tested.

## Build result

`npm run lint`: passes, zero errors/warnings.

`npm run build`: passes TypeScript and Vite production compilation, 4661 modules. The restricted Windows environment uses the previously supplied file-based esbuild fallback. The harmless React Router ignored `use client` directive warnings remain; no TypeScript/build errors remain.

## Changed source files

- `src/components/ToolsMarquee.tsx`: equal repeated groups.
- `src/styles/sections.css`, `home.css`, `mobile-pass.css`: group gaps and original insets without shifting the animation seam.
- `src/styles/bento.css`: continuous requested reels, hover/focus holds, trailing period gaps, focus micro-interactions.
- `src/components/HeroCanvasV2.tsx`: precise touch gate and graceful unsupported-WebGL fallback; original shader unchanged.
- `src/App.tsx`: live OS/site preference and pointer listeners, cancellable deferred canvas loading, cleanup.
- `src/hooks/useReducedMotion.ts`, `useLenis.ts`: live motion preference subscription and smooth-scroll teardown/restart.

All portfolio data files and factual content remain unchanged. The updated source archive includes this report. The side-by-side PNG is supplied separately as visual evidence.

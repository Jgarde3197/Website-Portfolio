# Requested fixes — 2026-10-07

Source files changed:
- `src/hooks/useLenis.ts`: observe the existing 1100px desktop shell breakpoint and recreate/destroy the smooth-scroll controller when it changes.
- `src/data/experience.ts`: shared ACLC education date is now `2015 – 2016`; About consumes this value. The supplied resume and preview already use 2015–2016 and remain unchanged.
- `src/styles/portfolio.css`: hide only `.hprofile__avatar` at the existing 650px mobile breakpoint. The flex header closes the space naturally. Tablet/desktop and About photos remain visible.
- `src/data/faqs.ts`: rewrote four questions to “What services do you offer?”, “What automation tools do you use?”, “Can you connect tools I already use?”, and “Can I discuss a project with you?”. Other questions and all answers retain their meaning. No “How can I contact Jefferson?” question exists in this site's FAQ data.

Scrolling cause: the responsive CSS already changes from the desktop scroll panel to document scrolling below 1100px, but the Lenis hook previously ran only when reduced-motion settings changed. A controller created on desktop stayed attached to the now non-scrolling panel after resizing to tablet/mobile, intercepted wheel input, and prevented natural document scrolling. Reproduced at 820px with a lingering `shell__panel lenis` class and document scroll stuck at zero. No persistent modal scroll lock was present.

The fix tracks the same desktop breakpoint reactively. Below it Lenis is destroyed and the document scrolls natively; returning to desktop creates the panel controller again. No new inner scrollbar or layout redesign was needed.

Browser verification against the production build: Featured Workflow reached the true document bottom at 320×740, 375×812, 390×844, 430×932, 768×1024, 820×1180, and landscape 820×430. All six images loaded and the last caption remained reachable. Desktop 1440×900 reached the panel bottom after returning from mobile. Closing the image viewer restored scrolling. No horizontal overflow was detected at these sizes.

Verified mobile homepage identity without avatar or an empty image slot, retained tablet avatar and About portrait, updated About education, FAQ accordion open/close, and unchanged contact fields. Projects, Services, Experience, and About routes loaded without broken images or horizontal overflow. Browser console had no errors. Lint, TypeScript, production build, and offline contact regression tests passed. This report is the only additional documentation file for this pass.

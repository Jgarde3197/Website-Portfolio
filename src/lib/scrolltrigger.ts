import { SCROLLER_ID } from '@/hooks/useLenis'

type ST = { defaults: (config: Record<string, unknown>) => unknown }

/**
 * Point ScrollTrigger at the shell's scrolling panel.
 *
 * From 1100px up the document does not scroll - `#main-content` does - so any
 * trigger created against the window reads a position that never changes and
 * pins fire at the wrong time or not at all. Every place that imports
 * ScrollTrigger has to call this BEFORE creating its first trigger.
 *
 * Below the breakpoint the shell dissolves and the document scrolls again,
 * so reset the default to window when the desktop integration is cleaned up.
 */
export function applyShellScroller(ScrollTrigger: ST) {
  if (typeof window === 'undefined') return
  const scroller = document.getElementById(SCROLLER_ID)
  ScrollTrigger.defaults({ scroller: window.innerWidth >= 1100 && scroller ? scroller : window })
}

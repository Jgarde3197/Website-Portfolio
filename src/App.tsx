import { lazy, Suspense, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import TabBar from '@/components/TabBar'
import QuickMenu from '@/components/QuickMenu'
import Rail from '@/components/Rail'
import IntroOverlay from '@/components/IntroOverlay'
import CursorRing from '@/components/CursorRing'
import AccessMenu from '@/components/AccessMenu'
import AutomationAssistant from '@/components/AutomationAssistant'
import { motionReduced, A11Y_EVENT } from '@/lib/a11y'
import { useLenis, SCROLLER_ID } from '@/hooks/useLenis'
import { useIsPhone } from '@/hooks/useMediaQuery'
import { getPerfTier, watchFrameHealth, PERF_TIER_EVENT } from '@/lib/perf'

// Lazy-load HeroCanvas so the 118KB Three.js bundle is fetched only
// when actually needed. Mobile + reduced-motion users skip the import
// entirely - the .hero-canvas CSS fallback (background:var(--cream))
// handles the visual baseline. PageSpeed showed Three.js had 76.6 KiB
// of unused JS; not loading it at all on mobile is the cleaner fix.
const HeroCanvas = lazy(() => import('@/components/HeroCanvasV2'))

/**
 * The shell. It owns everything that outlives a route change: the contour
 * shader, the intro, the profile rail and the one scrolling panel. Each route
 * renders its view into that panel through the Outlet.
 *
 * Home is the route that shaped the layout: it is sized to the panel box and
 * must not scroll, which is what `data-fixed` switches off. Projects,
 * Experience, About and Contact are built to the same budget and join it.
 */
export default function App() {
  useLenis()

  const { pathname } = useLocation()
  const FIXED_ROUTES = ['/', '/projects']
  const isFixed = FIXED_ROUTES.includes(pathname)
  // Below the shell breakpoint the rail is gone: a bottom tab bar navigates,
  // the QuickMenu (theme + accessibility) floats top-right on every page but
  // Home (whose profile header carries it), and the visits widget folds into
  // that header.
  const phone = useIsPhone()
  const panelRef = useRef<HTMLElement>(null)

  // The panel is the scroller, so a route change has to reset it by hand -
  // the browser only restores scroll on the document.
  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0, behavior: 'auto' })
  }, [pathname])

  // From the first route change on, a page that mounts rises into place
  // (mobile-pass.css). Not on the first load: the intro owns that arrival.
  // Layout effect: set before paint, or the new page shows for one frame at
  // full opacity and then jumps back to start its rise.
  const firstPath = useRef(pathname)
  useLayoutEffect(() => {
    if (pathname !== firstPath.current) document.documentElement.classList.add('has-navigated')
  }, [pathname])

  // The page measures its own frame health once the intro clears and steps
  // the design down if it cannot hold it - see lib/perf.ts. `low` is the tier
  // where the shader itself has to go.
  const [perfTier, setPerfTier] = useState(getPerfTier)
  useEffect(() => {
    const onTier = (e: Event) => setPerfTier((e as CustomEvent).detail)
    window.addEventListener(PERF_TIER_EVENT, onTier)
    void watchFrameHealth()
    return () => window.removeEventListener(PERF_TIER_EVENT, onTier)
  }, [])

  const [shouldLoadCanvas, setShouldLoadCanvas] = useState(false)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const touch = window.matchMedia('(pointer: coarse) and (hover: none)')
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    let pending: number | undefined
    let disposed = false
    const cancel = () => {
      if (pending === undefined) return
      if (typeof w.requestIdleCallback === 'function') w.cancelIdleCallback?.(pending)
      else window.clearTimeout(pending)
      pending = undefined
    }
    const update = () => {
      cancel()
      if (reduced.matches || touch.matches || motionReduced()) {
        setShouldLoadCanvas(false)
        return
      }
      const mount = () => {
        pending = undefined
        if (!disposed && !reduced.matches && !touch.matches && !motionReduced()) {
          setShouldLoadCanvas(true)
        }
      }
      pending = typeof w.requestIdleCallback === 'function'
        ? w.requestIdleCallback(mount, { timeout: 3000 })
        : window.setTimeout(mount, 1500)
    }
    reduced.addEventListener('change', update)
    touch.addEventListener('change', update)
    window.addEventListener(A11Y_EVENT, update)
    window.addEventListener('load', update, { once: true })
    if (document.readyState === 'complete') update()
    return () => {
      disposed = true
      cancel()
      reduced.removeEventListener('change', update)
      touch.removeEventListener('change', update)
      window.removeEventListener(A11Y_EVENT, update)
      window.removeEventListener('load', update)
    }
  }, [])

  return (
    <>
      <IntroOverlay />
      <CursorRing />
      <a href={`#${SCROLLER_ID}`} className="skip-link">Skip to main content</a>
      {shouldLoadCanvas && perfTier !== 'low' && (
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      )}
      {phone && pathname !== '/' && <QuickMenu className="qmenu--float" />}
      <div className="shell">
        <Rail />
        <main
          ref={panelRef}
          id={SCROLLER_ID}
          className="shell__panel"
          data-fixed={isFixed ? 'true' : 'false'}
        >
          <Suspense fallback={null}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      {phone && <TabBar />}
      <AccessMenu />
      <AutomationAssistant />
    </>
  )
}


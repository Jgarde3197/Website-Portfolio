import { useEffect, useState } from 'react'
import { A11Y_EVENT, motionReduced } from '@/lib/a11y'

/** Both the OS preference and the site's switch remain live during a visit. */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches || motionReduced(),
  )
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches || motionReduced())
    media.addEventListener('change', update)
    window.addEventListener(A11Y_EVENT, update)
    return () => {
      media.removeEventListener('change', update)
      window.removeEventListener(A11Y_EVENT, update)
    }
  }, [])
  return reduced
}

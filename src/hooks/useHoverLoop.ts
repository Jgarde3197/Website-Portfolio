import { useEffect, useRef, type MouseEvent, type FocusEvent } from 'react'
import { useReducedMotion } from './useReducedMotion'

/** Continuous preview only during interaction; restore the resting position on exit. */
export function useHoverLoop(duration: number) {
  const reduced = useReducedMotion()
  const running = useRef<{ element: HTMLElement; animation: Animation }[]>([])
  const stop = () => {
    for (const { element, animation } of running.current) {
      const position = getComputedStyle(element).transform
      element.style.transition = 'none'
      element.style.transform = position
      animation.cancel()
      void element.offsetWidth
      element.style.transition = ''
      element.style.transform = ''
    }
    running.current = []
  }
  const start = (event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
    if (reduced || running.current.length) return
    for (const element of event.currentTarget.querySelectorAll<HTMLElement>('.bento__hover-loop')) {
      const axis = getComputedStyle(element).getPropertyValue('--loop-axis').trim() || 'X'
      const reverse = element.closest('[data-dir="right"]') !== null
      const frames = [ { transform: `translate${axis}(0)` }, { transform: `translate${axis}(-50%)` } ]
      if (reverse) frames.reverse()
      const animation = element.animate(frames, { duration, iterations: Infinity, easing: 'linear' })
      running.current.push({ element, animation })
    }
  }
  useEffect(() => {
    const clear = () => {
      for (const { element, animation } of running.current) {
        animation.cancel()
        element.style.transform = ''
        element.style.transition = ''
      }
      running.current = []
    }
    if (reduced) clear()
    return clear
  }, [reduced])
  return { onMouseEnter: start, onMouseLeave: stop, onFocus: start, onBlur: stop }
}

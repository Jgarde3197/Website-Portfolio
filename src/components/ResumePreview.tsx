import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { resumeUrl } from '@/data/profile'
import '@/styles/resume-preview.css'

export default function ResumePreview({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const title = useId()
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const pagePosition = { left: window.scrollX, top: window.scrollY }
    const panel = document.getElementById('main-content')
    const panelPosition = panel?.scrollTop ?? 0
    const element = dialog.current!
    document.body.style.overflow = 'hidden'
    element.showModal()
    element.querySelector<HTMLButtonElement>('button')?.focus()
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      window.scrollTo({ ...pagePosition, behavior: 'instant' })
      if (panel) panel.scrollTop = panelPosition
      opener?.focus({ preventScroll: true })
    }
  }, [])
  return createPortal(<dialog ref={dialog} className="resume-preview" role="dialog" aria-modal="true"
    aria-labelledby={title} data-lenis-prevent
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}
    onKeyDown={event => {
      if (event.key !== 'Tab') return
      const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button, a[href]'))
      const first = items[0], last = items.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }}>
    <div className="resume-preview__panel">
      <header className="resume-preview__header">
        <h2 id={title}>Resume Preview</h2>
        <button type="button" aria-label="Close resume preview" onClick={onClose}>×</button>
      </header>
      <div className="resume-preview__image" onClick={event => { if (event.target === event.currentTarget) onClose() }}>
        <img src="/resume/resume-preview-page1.png" alt="First page of Jefferson Garde’s supplied resume" />
      </div>
      <a className="portfolio-link resume-preview__download" href={resumeUrl} download="Jefferson_Garde_Resume.pdf">Download resume PDF ↓</a>
    </div>
  </dialog>, document.body)
}

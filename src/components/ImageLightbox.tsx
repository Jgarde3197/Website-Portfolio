import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ProjectImage } from '@/data/projects'

export default function ImageLightbox({ images, initialIndex, onClose, allowActualSize = true }: {
  images: ProjectImage[]; initialIndex: number; onClose: () => void; allowActualSize?: boolean
}) {
  const [index, setIndex] = useState(initialIndex)
  const [actualSize, setActualSize] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const descriptionId = useId()
  const image = images[index]
  const select = (next: number) => {
    setIndex((next + images.length) % images.length)
    setActualSize(false)
    frame.current?.scrollTo(0, 0)
  }
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    const element = dialog.current!
    document.body.style.overflow = 'hidden'
    element.showModal()
    element.querySelector<HTMLButtonElement>('[aria-label="Close image viewer"]')?.focus()
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
      opener?.focus({ preventScroll: true })
    }
  }, [])

  return createPortal(<dialog ref={dialog} className="image-lightbox" role="dialog" aria-modal="true"
    aria-labelledby={titleId} aria-describedby={descriptionId} data-lenis-prevent
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => { if (event.target === event.currentTarget) onClose() }}
    onKeyDown={event => {
      if (event.key === 'Tab') {
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
        const first = controls[0], last = controls.at(-1)
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
      const actions: Record<string, number> = { ArrowLeft: index - 1, ArrowRight: index + 1, Home: 0, End: images.length - 1 }
      if (event.key in actions) { event.preventDefault(); event.stopPropagation(); select(actions[event.key]) }
    }}>
    <div className="image-lightbox__panel">
      <header className="image-lightbox__controls">
        <span className="image-lightbox__count" aria-live="polite">{index + 1} / {images.length}</span>
        {allowActualSize && <button type="button" aria-label={actualSize ? 'Fit image' : 'View actual size'} aria-pressed={actualSize}
          onClick={() => { setActualSize(!actualSize); frame.current?.scrollTo(0, 0) }}>
          {actualSize ? 'Fit image' : 'Actual size · 100%'}
        </button>}
        <button type="button" className="image-lightbox__close" aria-label="Close image viewer" onClick={onClose}>×</button>
      </header>
      <div ref={frame} className={`image-lightbox__frame${actualSize ? ' image-lightbox__frame--actual' : ''}`}>
        <img key={image.src} src={image.src} alt={image.alt} width={image.width} height={image.height}
          style={actualSize ? { width: image.width, height: image.height } : undefined} decoding="async" />
      </div>
      <footer className="image-lightbox__footer">
        <div className="image-lightbox__details" aria-live="polite">
          <h2 id={titleId}>{image.title}</h2>
          <p id={descriptionId}>{image.description}</p>
          {(image.step || image.tool) && <p className="image-lightbox__meta">{[image.step, image.tool].filter(Boolean).join(' · ')}</p>}
        </div>
        <nav className="image-lightbox__navigation" aria-label="Screenshot navigation">
          <button type="button" aria-label="Previous screenshot" disabled={images.length < 2} onClick={() => select(index - 1)}>← Previous</button>
          <button type="button" aria-label="Next screenshot" disabled={images.length < 2} onClick={() => select(index + 1)}>Next →</button>
        </nav>
      </footer>
    </div>
  </dialog>, document.body)
}

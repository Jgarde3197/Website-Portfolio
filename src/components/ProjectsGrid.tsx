import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, X, CursorClick } from '@/components/slab'
import { projects, type AutomationProject } from '@/data/projects'
import { useIsPhone } from '@/hooks/useMediaQuery'
import ProjectCaseStudy from './ProjectCaseStudy'

// Template portal and dismissal, with keyboard focus trapping and focus return.
function ProjectModal({ project, onClose }: { project: AutomationProject; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    const root = document.getElementById('root')
    const previousOverflow = document.body.style.overflow
    if (root) root.inert = true
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (document.querySelector('.image-lightbox[open]')) return
      if (e.key === 'Escape') onClose()
      if (e.key !== 'Tab') return
      const items = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex="0"]') ?? [],
      )
      const first = items[0],
        last = items.at(-1)
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      if (root) root.inert = false
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])
  return createPortal(
    <div
      ref={modalRef}
      className="pmodal"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="pmodal__close"
        onClick={onClose}
        aria-label="Close project"
      >
        <X size={18} weight="bold" />
      </button>
      <div className="pmodal__stage" data-lenis-prevent>
        <ProjectCaseStudy project={project} />
      </div>
    </div>,
    document.body,
  )
}
export default function ProjectsGrid() {
  const phone = useIsPhone()
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState<AutomationProject | null>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => trigger.current?.focus())
  }, [])
  const visible = projects.filter((p) => filter === 'All' || p.platform === filter)
  return (
    <section className="pgrid pgrid--projects" aria-labelledby="projects-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Portfolio projects</span>
        <h1 className="pgrid__title" id="projects-title">
          Business problems. Connected workflows.
        </h1>
        <p className="pgrid__lede">
          Self-built automations. Open a case study for the logic, safeguards, and real screenshots.
        </p>
      </header>
      {phone && (
        <div className="pfilter" role="group" aria-label="Filter projects">
          {['All', 'Make.com', 'Zapier'].map((f) => (
            <button
              className="pfilter__btn"
              key={f}
              aria-pressed={filter === f}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      )}
      <div className="home__glass pgrid__glass">
        <span className="pgrid__hint" aria-hidden="true">
          <CursorClick size={14} />
          Open a case study
        </span>
        <div className={`bento portfolio-projects${visible.length > 5 ? ' portfolio-projects--extended' : ''}`}>
          {visible.map((p) => (
            <button
              type="button"
              className={`bento__card bento__card--btn portfolio-projects__card${p.featured ? ' portfolio-project--featured' : ''}`}
              key={p.id}
              aria-label={`Open project: ${p.shortTitle}`}
              aria-haspopup="dialog"
              onClick={(e) => { trigger.current = e.currentTarget; setOpen(p) }}
            >
              <span className="bento__head">
                <span className="bento__kicker">
                  {String(projects.indexOf(p) + 1).padStart(2, '0')} / {p.platform} · {p.featured ? 'Flagship / Featured' : 'Portfolio project'}
                </span>
                <span className="bento__title">{p.shortTitle}</span>
                <span className="bento__desc">{p.cardOverview ?? p.overview}</span>
                <ArrowUpRight size={15} className="bento__arrow" aria-hidden="true" />
              </span>
              <span className="bento__media portfolio-projects__preview">
                <img src={p.images[0].src} alt={p.images[0].alt} width={p.images[0].width} height={p.images[0].height} loading="lazy" decoding="async" />
              </span>
            </button>
          ))}
        </div>
      </div>
      {open && <ProjectModal project={open} onClose={close} />}
    </section>
  )
}

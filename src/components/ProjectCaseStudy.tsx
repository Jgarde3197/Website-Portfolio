import WorkflowGallery from './WorkflowGallery'
import VideoWalkthrough from './VideoWalkthrough'
import '@/styles/image-lightbox.css'
import ToolLogo from './ToolLogo'
import type { AutomationProject } from '@/data/projects'
export default function ProjectCaseStudy({ project: p }: { project: AutomationProject }) {
  return (
    <article className="portfolio-case" aria-labelledby={`case-${p.id}`}>
      <span className="pgrid__eyebrow">
        {p.type} · {p.platform}
      </span>
      <h1 id={`case-${p.id}`}>{p.title}</h1>
      <p>{p.overview}</p>
      <div className="portfolio-stack" aria-label="Project tools">
        {p.tools.map((t) => (
          <span className="portfolio-chip" key={t}>
            <ToolLogo name={t} size="xs" decorative /> {t}
          </span>
        ))}
      </div>
      <h2>Business problem</h2>
      <p>{p.problem}</p>
      <h2>Trigger & workflow</h2>
      <p>{p.workflow}</p>
      <ol className="portfolio-workflow" aria-label="Workflow steps">
        {p.steps.map((s, i) => (
          <li key={s}>
            <b>{String(i + 1).padStart(2, '0')}</b> {s}
          </li>
        ))}
      </ol>
      <div className="portfolio-columns">
        <div>
          <h2>Automation logic</h2>
          <p>{p.implementation}</p>
        </div>
        <div>
          <h2>Reliability & safeguards</h2>
          <p>{p.safeguards}</p>
        </div>
      </div>
      {p.troubleshooting && <section>
        <h2>Troubleshooting a Trigger Loop</h2>
        <p>{p.troubleshooting}</p>
      </section>}
      <h2>Business value</h2>
      <p>{p.value}</p>
      <p className="portfolio-disclaimer">{p.disclaimer ?? 'Built as a self-directed portfolio project. Business benefits are design goals, not measured client results.'}</p>
      {p.video && <VideoWalkthrough video={p.video} title={p.title} />}
      <h2>Workflow screenshots</h2>
      <p>
        Real screenshots from this portfolio build. Open an image to inspect it at full resolution.
      </p>
      <WorkflowGallery images={p.images} featuredFirst={p.galleryLayout === 'featured-first'} simpleLightbox={p.simpleLightbox} />
    </article>
  )
}

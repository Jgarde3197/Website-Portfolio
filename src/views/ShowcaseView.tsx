import { projects } from '@/data/projects'
import ProjectCaseStudy from '@/components/ProjectCaseStudy'
export default function ShowcaseView() {
  return (
    <section className="pgrid portfolio-page" aria-label="Featured workflow">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Featured workflow</span>
        <p className="pgrid__lede">
          A closer look at AI-powered lead qualification and sales routing.
        </p>
      </header>
      <ProjectCaseStudy project={projects[4]} />
    </section>
  )
}

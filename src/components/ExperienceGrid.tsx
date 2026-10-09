import { experience } from '@/data/experience'
export default function ExperienceGrid() {
  return (
    <section className="pgrid portfolio-page" aria-labelledby="experience-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Work experience</span>
        <h1 className="pgrid__title" id="experience-title">
          Where the process discipline was built.
        </h1>
        <p className="pgrid__lede">Hands-on production and industrial automation experience shaped how I approach modern business workflows: map the process, validate inputs and outputs, monitor exceptions, and troubleshoot the system end to end.</p>
      </header>
      <div className="home__glass portfolio-sheet portfolio-body">
        {experience.map((e) => (
          <article key={e.employer} className="portfolio-experience">
            {e.dates && <p className="pgrid__eyebrow">{e.dates}</p>}
            <h2>{e.role}</h2>
            <h3>{e.employer}</h3>
            <p>{e.department}</p>
            <ul>
              {e.responsibilities.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

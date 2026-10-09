import { Link } from 'react-router-dom'
import { useState } from 'react'
import ResumePreview from './ResumePreview'
import { profile, resumeUrl } from '@/data/profile'
import { tools, toolCategories } from '@/data/tools'
import ToolLogo from './ToolLogo'
import ProfileImage from './ProfileImage'
import Certifications from './Certifications'
import { education, training } from '@/data/experience'
export default function AboutGrid() {
  const [resumeOpen, setResumeOpen] = useState(false)
  return (
    <section className="pgrid portfolio-page" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          Process discipline meets business automation.
        </h1>
        <p className="pgrid__lede">
          I bring process-control discipline from industrial automation into modern business workflow automation.
        </p>
      </header>
      <div className="home__glass portfolio-sheet portfolio-body">
        <div className="portfolio-columns portfolio-about-top">
          <div className="portfolio-about-intro">
            <ProfileImage variant="about" />
            <div className="portfolio-about-copy">
            <h2>Hi, I’m {profile.firstName}.</h2>
            <p>I'm Jefferson Garde, an AI Automation Specialist focused on connecting business tools, automating repetitive processes, and building workflows that are easier to operate and troubleshoot.</p>
            <p>My approach comes from previous hands-on exposure to industrial automation and process-controlled environments. At Epson Precision, I supported engineering teams working with automated equipment, process logic, input/output checks, and troubleshooting. At Japan Tobacco International, I worked within a SCADA-monitored production environment where process continuity and operational discipline mattered.</p>
            <p>Today I apply the same mindset to Make.com and Zapier workflows: understand the process, map the logic, connect the applications, validate the data, plan for exceptions, and test the workflow end to end.</p>
            <Link className="portfolio-link" to="/experience">
              View my work experience ↗
            </Link>
            <div className="portfolio-stack">
              <span className="portfolio-chip">{profile.location}</span>
              <span className="portfolio-chip">Philippine Time · UTC+8</span>
            </div>
            </div>
          </div>
          <div>
            <h2>Resume</h2>
            <button
              type="button"
              className="resume-thumbnail"
              aria-label="Open resume preview"
              aria-haspopup="dialog"
              onClick={() => setResumeOpen(true)}
            >
              <img
                className="portfolio-resume"
                src="/resume/resume-preview-page1.png"
                alt="First page of Jefferson Garde’s supplied resume"
                loading="lazy"
              />
            </button>
            <p>
              <a className="portfolio-link" href={resumeUrl} download="Jefferson_Garde_Resume.pdf">
                Download resume PDF ↓
              </a>
            </p>
          </div>
        </div>
        <div className="portfolio-columns">
          <section><h2>Education</h2><h3>{education.institution}</h3><p>{education.program} · {education.dates}</p></section>
          <section><h2>Technical training</h2><ul>{training.map(t => <li key={t}>{t}</li>)}</ul></section>
        </div>
        <h2>Automation stack</h2>
        <div className="portfolio-stack-categories">
          {toolCategories.map(category => <section key={category}>
            <h3>{category}</h3>
            <div className="portfolio-tools">
              {tools.filter(t => t.category === category).map(t => <span key={t.name}><ToolLogo name={t.name} decorative />{t.name}</span>)}
            </div>
          </section>)}
        </div>
        <Certifications />
      </div>
      {resumeOpen && <ResumePreview onClose={() => setResumeOpen(false)} />}
    </section>
  )
}

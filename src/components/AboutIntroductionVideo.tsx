import { useState } from 'react'
import '@/styles/video-walkthrough.css'
import '@/styles/about-introduction.css'

const VIDEO_URL = 'https://www.loom.com/share/610990f6542445b68d117ffce4eb01df'
const EMBED_URL = 'https://www.loom.com/embed/610990f6542445b68d117ffce4eb01df'

export default function AboutIntroductionVideo() {
  const [loaded, setLoaded] = useState(false)
  return <section className="video-walkthrough about-introduction" aria-labelledby="about-introduction-title">
    <h2 id="about-introduction-title">Get to Know Me</h2>
    <p>Watch my introduction to learn more about my background, skills, and approach to AI and workflow automation.</p>
    <div className="video-walkthrough__embed">
      {!loaded && <span className="about-introduction__loading" role="status">Loading introduction video…</span>}
      <iframe className={loaded ? 'is-loaded' : undefined} src={EMBED_URL} title="Jefferson Garde — professional self-introduction video" loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen onLoad={() => setLoaded(true)} />
    </div>
    <a className="portfolio-link video-walkthrough__link" href={VIDEO_URL} target="_blank" rel="noopener noreferrer">Watch introduction on Loom ↗<span className="sr-only"> (opens in a new tab)</span></a>
  </section>
}

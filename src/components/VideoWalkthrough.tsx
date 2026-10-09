import type { AutomationProject } from '@/data/projects'
import '@/styles/video-walkthrough.css'

export default function VideoWalkthrough({ video, title }: { video: NonNullable<AutomationProject['video']>; title: string }) {
  return <section className="video-walkthrough" aria-label="Video walkthrough">
    <h2>Video Walkthrough</h2>
    <p>{video.description}</p>
    <div className="video-walkthrough__embed">
      <iframe src={video.embedUrl} title={`${title} — Loom video walkthrough`} loading="lazy" allow="fullscreen; picture-in-picture" allowFullScreen />
    </div>
    <a className="portfolio-link video-walkthrough__link" href={video.url} target="_blank" rel="noopener noreferrer">Watch walkthrough ↗<span className="sr-only"> (opens Loom in a new tab)</span></a>
  </section>
}

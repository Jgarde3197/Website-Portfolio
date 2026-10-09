import { Link } from 'react-router-dom'
import { CaretRight, Stack, Coffee } from '@/components/slab'
import { profile } from '@/data/profile'
import QuickMenu from './QuickMenu'
import profilePhoto from '@/assets/jefferson-profile.png'

/**
 * Home on a phone, the parts the rail and the bento used to carry:
 *
 *   HomeProfile  avatar, name, verified mark, handle and the QuickMenu
 *                (theme + accessibility) - the rail's identity block, laid flat
 *   HomeStats    three proof facts (profile.stats), each named by a glyph so
 *                it reads at a glance
 *   HomeExplore  one shelf card per rail view in a snap row, then the first
 *                testimonial as a video stage
 */

export function HomeProfile() {
  return (
    <header className="hprofile">
      <img className="hprofile__avatar" src={profilePhoto} alt="Jefferson Garde" width={56} height={56} />
      <div className="hprofile__who">
        <span className="hprofile__name">
          {profile.name}
        </span>
        <span className="hprofile__handle">
          {profile.handle} · {profile.role}
        </span>
      </div>
      <QuickMenu className="hprofile__menu" />
    </header>
  )
}

export function HomeStats() {
  return (
    <ul className="hstats" role="list">
      {profile.stats.map(({ value, label, Icon }, i) => (
        <li key={i}>
          <Icon className="hstats__icon" size={18} weight="duotone" aria-hidden="true" />
          <b className="hstats__value">{value}</b>
          <span className="hstats__label">{label}</span>
        </li>
      ))}
    </ul>
  )
}

const TILES = [
  { n: '01', label: 'Projects', to: '/projects', title: 'Business workflows', desc: 'Self-built automation case studies.', img: '/projects/dental-appointment/image-01.webp' },
  { n: '02', label: 'Services', to: '/services', title: 'Connect your tools', desc: 'Workflow automation and AI integration.', Icon: Stack },
  { n: '03', label: 'Featured', to: '/showcase', title: 'AI lead qualification', desc: 'From Typeform intake to routed sales follow-up.', Icon: Coffee, accent: true },
  { n: '04', label: 'Experience', to: '/experience', title: 'Process discipline', desc: 'Industrial automation and production experience.', Icon: Stack },
  { n: '05', label: 'About', to: '/about', title: `Hi, I'm ${profile.firstName}.`, desc: 'Industrial systems to business workflows.', img: profile.avatarSrc },
] as const

export function HomeExplore() {
  return (
    <>
      <div className="hsec">
        <h2 className="hsec__title">Explore</h2>
      </div>
      <ul className="htiles" role="list">
        {TILES.map((t) => (
          <li key={t.to}>
            <Link to={t.to} className={`htile${'accent' in t && t.accent ? ' htile--accent' : ''}`}>
              {'img' in t ? (
                <span className="htile__media"><img className="htile__img" src={t.img} alt="" loading="lazy" /></span>
              ) : (
                <span className="htile__media htile__glyph"><t.Icon size={52} weight="duotone" aria-hidden="true" /></span>
              )}
              <span className="htile__body">
                <span className="htile__n">{t.n} {t.label}</span>
                <span className="htile__title">{t.title}</span>
                <span className="htile__desc">{t.desc}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* A header that links carries its chevron on the title itself. */}
      <div className="hsec">
        <h2 className="hsec__title">
          <Link to="/showcase" className="hsec__link">
            Inside the workflow
            <CaretRight size={16} weight="bold" aria-hidden="true" />
          </Link>
        </h2>
      </div>
      <Link to="/showcase" className="hproof" aria-label="Explore the AI lead qualification portfolio project">
        <span className="hproof__stage">
          <img src="/projects/ai-lead-qualification-sales-routing/image-01.webp" alt="" loading="lazy" />
          
          
        </span>
        <span className="hproof__copy">
          <span className="hproof__title">AI-powered lead qualification & sales routing</span>
          <span className="hproof__meta">Self-built portfolio project · Zapier</span>
        </span>
      </Link>
    </>
  )
}

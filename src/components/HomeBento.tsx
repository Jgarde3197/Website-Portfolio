import { useHoverLoop } from '@/hooks/useHoverLoop'
import ToolLogo from './ToolLogo'
import type React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FolderOpen,
  User,
  Robot,
  Medal,
  Stack,
  Quotes,
  Gear,
} from '@/components/slab'
import { projects } from '@/data/projects'
import { services } from '@/data/services'
import { experience } from '@/data/experience'
import { tools } from '@/data/tools'
import { profile } from '@/data/profile'

/**
 * Home's showcase: one card per rail view, each an index of what that view
 * holds, each built from content the portfolio already ships. Every card is
 * a link. Nothing here invents a fact - the funnels, the tools, the clients
 * and the credentials are the same records the views render in full.
 *
 * Motion is transform-only on a clipped inner track, so a card never adds
 * height and Home stays a single viewport.
 */

const PROJECT_SHOTS = projects.map(p => p.images[0])
const OFFERS = services.map(s => ({ Icon: Gear, title: s.title, note: s.description }))
const CLIENTS = experience.map(e => ({ name: e.employer, role: e.role, work: e.dates }))
const PHOTOS = [profile.avatarSrc, '/resume/resume-preview-page1.png', projects[0].images[0].src]
const AI_BUILDS = tools.map((t, i) => ({ id: String(i), name: t.name, Icon: Robot, status: 'built' }))

function CardHead({
  Icon,
  title,
  desc,
}: {
  Icon: typeof FolderOpen
  title: string
  desc: string
}) {
  return (
    <header className="bento__head">
      <span className="bento__label">
        <span className="bento__icon">
          <Icon size={20} weight="fill" aria-hidden="true" />
        </span>
        <h3 className="bento__title">{title}</h3>
      </span>
      <p className="bento__desc">{desc}</p>
      <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
    </header>
  )
}

export default function HomeBento() {
  const projectHover = useHoverLoop(22000)
  const aiHover = useHoverLoop(26000)
  const half = Math.ceil(AI_BUILDS.length / 2)
  const toolRows = [AI_BUILDS.slice(0, half), AI_BUILDS.slice(half)]

  return (
    <nav className="bento" aria-label="Explore the portfolio">
      {/* Projects: the preview shifts only while the card is hovered or focused. */}
      <Link to="/projects" className="bento__card bento__card--projects" {...projectHover}>
        <CardHead Icon={FolderOpen} title="Projects" desc="Business problems, connected workflows." />
        <div className="bento__media bento__reel" aria-hidden="true">
          <div className="bento__reel-track bento__hover-loop">
            {[...PROJECT_SHOTS, ...PROJECT_SHOTS].map((f, i) => (
              <span key={i} className="bento__shot">
                <img src={f.src} alt="" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* About: a fanned stack of photos. */}
      <Link to="/about" className="bento__card bento__card--about">
        <CardHead Icon={User} title="About" desc="From industrial systems to business automation." />
        <div className="bento__media bento__fan" aria-hidden="true">
          {PHOTOS.map((src, i) => (
            <span key={src} className="bento__photo" style={{ ['--i' as string]: i }}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </Link>

      {/* AI builds: the systems from the Projects tree, two chip rows
          using the shared hover shift. */}
      <Link to="/projects" className="bento__card bento__card--ai" {...aiHover}>
        <CardHead Icon={Robot} title="AI Builds" desc="AI qualification, classification, and extraction." />
        <div className="bento__media bento__chips" aria-hidden="true">
          {toolRows.map((row, r) => (
            <div key={r} className="bento__chip-row" data-dir={r ? 'right' : 'left'}>
              <div className="bento__chip-track bento__hover-loop">
                {[...row, ...row].map((n, i) => (
                  <span key={`${n.id}-${i}`} className="bento__chip" data-status={n.status}>
                    <ToolLogo name={n.name} size="xs" decorative />
                    {n.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Link>

      {/* Credentials: the badge that matters, on its plate. */}
      <Link to="/about" className="bento__card bento__card--creds">
        <CardHead Icon={Medal} title="Resume" desc="Background, capabilities, and projects." />
        <div className="bento__media bento__badge" aria-hidden="true">
          <span className="bento__badge-ring">
            <img src="/favicon.svg" alt="" width={72} height={72} />
          </span>
          <span className="bento__badge-tag">
            <Medal size={14} weight="fill" />
            View resume
          </span>
        </div>
      </Link>

      {/* Services: the five offers as a compact index. */}
      <Link to="/services" className="bento__card bento__card--services">
        <CardHead Icon={Stack} title="Services" desc="Workflow automation and AI integration." />
        <ul className="bento__media bento__offers" role="list">
          {OFFERS.map(({ Icon, title, note }, i) => (
            <li key={title} className="bento__offer" style={{ '--i': i } as React.CSSProperties}>
              <span className="bento__offer-tile">
                <Icon size={15} weight="duotone" aria-hidden="true" />
              </span>
              <span className="bento__offer-text">
                <span className="bento__offer-title">{title}</span>
                <span className="bento__offer-note">{note}</span>
              </span>
              <span className="bento__offer-num" aria-hidden="true">
                0{i + 1}
              </span>
            </li>
          ))}
        </ul>
      </Link>

      {/* Experience: both employers remain visible in a stationary column. */}
      <Link to="/experience" className="bento__card bento__card--quotes">
        <CardHead Icon={Quotes} title="Experience" desc="The foundation of my process discipline." />
        <div className="bento__media bento__reviews" aria-hidden="true">
          <div className="bento__reviews-track">
            {CLIENTS.map((c, i) => (
              <span key={i} className="bento__review bento__hover-shift">
                <span className="bento__review-top">
                  <Gear size={14} weight="fill" />
                  <b>{c.name}</b>
                </span>
                <span className="bento__review-role">{c.role}</span>
                <span className="bento__review-work">{c.work}</span>
              </span>
            ))}
          </div>
        </div>
      </Link>
    </nav>
  )
}

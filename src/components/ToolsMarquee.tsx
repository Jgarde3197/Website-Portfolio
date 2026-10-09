import { featuredTools as tools } from '@/data/tools'
import ToolLogo from './ToolLogo'
export default function ToolsMarquee() {
  return <section className="tools-marquee" aria-label="Tools I work with" data-reveal>
    <div className="tools-marquee__track" aria-hidden="true">
      {[0, 1].map(copy => <div className="tools-marquee__group" key={copy}>
        {tools.map(tool => <div className="tools-marquee__item" key={tool.name}>
          <span className="tools-marquee__tile"><ToolLogo name={tool.name} decorative className="tools-marquee__img" /></span>
          <span className="tools-marquee__label">{tool.name}</span>
        </div>)}
      </div>)}
    </div>
    <ul className="sr-only">{tools.map(t => <li key={t.name}>{t.name}</li>)}</ul>
  </section>
}

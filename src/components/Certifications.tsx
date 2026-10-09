import { useState } from 'react'
import { Certificate } from '@phosphor-icons/react'
import { certifications, type Certification } from '@/data/certifications'
import CertificatePreview from './CertificatePreview'
import '@/styles/certifications.css'

export default function Certifications() {
  const [selected, setSelected] = useState<Certification | null>(null)
  const categories = [...new Set(certifications.map(c => c.category))]
  if (!certifications.length) return null
  return <section className="certifications" aria-labelledby="certifications-title">
    <h2 id="certifications-title">Certifications &amp; Training</h2>
    {categories.map(category => <section className="certifications__category" key={category}>
      <h3>{category}</h3>
      <div className="certifications__grid">
        {certifications.filter(c => c.category === category).map(c => <article className="credential" key={c.id}>
          <div className="credential__icon" aria-hidden="true">
            {c.icon ? <img src={c.icon} alt="" width="28" height="28" loading="lazy" /> : <Certificate size={28} />}
          </div>
          <h4>{c.title}</h4>
          <p className="credential__issuer">{c.issuer}</p>
          <span className="credential__type">{c.type}</span>
          <p className="credential__date">{c.date}</p>
          <p className="credential__description">{c.description}</p>
          <button type="button" className="portfolio-link" aria-label={`View certificate: ${c.title}`} aria-haspopup="dialog" onClick={() => setSelected(c)}>View certificate ↗</button>
        </article>)}
      </div>
    </section>)}
    {selected && <CertificatePreview certificate={selected} onClose={() => setSelected(null)} />}
  </section>
}

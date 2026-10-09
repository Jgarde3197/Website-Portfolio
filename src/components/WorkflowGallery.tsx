import { useState } from 'react'
import type { ProjectImage } from '@/data/projects'
import ImageLightbox from './ImageLightbox'

export default function WorkflowGallery({ images, featuredFirst = false, simpleLightbox = false }: { images: ProjectImage[]; featuredFirst?: boolean; simpleLightbox?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null)
  return <>
    <div className={`portfolio-gallery${featuredFirst ? ' portfolio-gallery--featured-first' : ''}`}>
      {images.map((image, index) => <figure key={image.src}>
        <button type="button" className="workflow-gallery__thumbnail" aria-label={`View screenshot: ${image.title}`}
          aria-haspopup="dialog" onClick={() => setSelected(index)}>
          <img src={image.src} alt={image.alt} width={image.width} height={image.height} loading="lazy" decoding="async" />
          <span className="workflow-gallery__view" aria-hidden="true">View ↗</span>
        </button>
        <figcaption>{image.caption}</figcaption>
      </figure>)}
    </div>
    {selected !== null && <ImageLightbox images={images} initialIndex={selected} allowActualSize={!simpleLightbox} onClose={() => setSelected(null)} />}
  </>
}

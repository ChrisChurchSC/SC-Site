import { useState } from 'react'
import { useParams, NavLink, Navigate } from 'react-router-dom'
import styles from './LandingPage.module.css'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { LANDING_PAGE_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'
import LazyVideo from '../components/LazyVideo'

export default function LandingPage() {
  const { slug } = useParams()
  const { data: page, loading } = useSanity(LANDING_PAGE_QUERY, { slug })
  const [openFaq, setOpenFaq] = useState(null)

  const faqSchema = page?.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faqs.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  } : null

  useMeta(page ? {
    title: page.seoTitle || `${page.heroHeadline} | Super Conscious`,
    description: page.seoDescription || page.heroAnswer?.slice(0, 155) || '',
    path: `/lp/${slug}`,
    schema: faqSchema,
  } : {})

  if (loading) return null
  if (!page) return <Navigate to="/404" replace />

  return (
    <main className={styles.main}>

      {/* Hero */}
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Super Conscious Studio</p>
        <h1 className={styles.headline}>{page.heroHeadline}</h1>
        {page.heroAnswer && <p className={styles.answer}>{page.heroAnswer}</p>}
      </section>

      {/* Body */}
      {page.body?.length > 0 && (
        <section className={styles.body}>
          {page.body.map((block, i) => {
            if (block._type === 'paragraphBlock') return (
              <p key={block._key || i} className={styles.para}>{block.text}</p>
            )
            if (block._type === 'headingBlock') return (
              <h2 key={block._key || i} className={styles.h2}>{block.heading || block.text}</h2>
            )
            if (block._type === 'imageBlock') return (
              <figure key={block._key || i} className={styles.figure}>
                <img src={sanityImg(block.imageUrl, { w: 1400 })} alt={block.alt || ''} loading="lazy" />
              </figure>
            )
            return null
          })}
        </section>
      )}

      {/* Process */}
      {page.processSteps?.length > 0 && (
        <section className={styles.process}>
          <p className={styles.sectionLabel}>{page.processLabel || 'How we approach it'}</p>
          <div className={styles.steps}>
            {page.processSteps.map((step, i) => (
              <div key={i} className={styles.step}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, '0')}</span>
                <div className={styles.stepContent}>
                  <p className={styles.stepLabel}>{step.label}</p>
                  {step.description && <p className={styles.stepDesc}>{step.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related work */}
      {page.relatedWork?.length > 0 && (
        <section className={styles.work}>
          <p className={styles.sectionLabel}>Related work</p>
          <div className={styles.workGrid}>
            {page.relatedWork.map(p => (
              <NavLink key={p.slug} to={`/work/${p.slug}`} className={styles.workCard}>
                <div className={styles.workThumb}>
                  {p.thumbnailVideo
                    ? <LazyVideo src={p.thumbnailVideo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : p.thumbnail
                    ? <img src={sanityImg(p.thumbnail, { w: 800 })} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : null
                  }
                </div>
                <div className={styles.workMeta}>
                  <span className={styles.workNum}>{p.n}</span>
                  <p className={styles.workName}>{p.name}</p>
                  {p.tagline && <p className={styles.workTagline}>{p.tagline}</p>}
                </div>
              </NavLink>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {page.faqs?.length > 0 && (
        <section className={styles.faq}>
          <p className={styles.sectionLabel}>{page.faqLabel || 'Common questions'}</p>
          <div className={styles.faqList}>
            {page.faqs.map((f, i) => (
              <div key={i} className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}>
                <button className={styles.faqQ} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{f.question}</span>
                  <span className={styles.faqToggle}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <p className={styles.faqA}>{f.answer}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.cta}>
        <p className={styles.ctaHeading}>{page.ctaHeading || 'Ready to build?'}</p>
        {page.ctaBody && <p className={styles.ctaBody}>{page.ctaBody}</p>}
        <NavLink to="/contact" className={styles.ctaBtn}>Start a project</NavLink>
      </section>

    </main>
  )
}

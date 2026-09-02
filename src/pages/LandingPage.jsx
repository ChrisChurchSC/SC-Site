import { useState } from 'react'
import { useParams, NavLink, Navigate } from 'react-router-dom'
import { useCalDrawer } from '../context/CalDrawerContext'
import styles from './LandingPage.module.css'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { LANDING_PAGE_QUERY } from '../lib/queries'
import { sanityImg, sanityImgProps } from '../lib/sanityImg'
import LazyVideo from '../components/LazyVideo'
import { MOCK_PAGES, RELATED_SLUGS } from '../lib/mockLandingPages'
import LogoWordmark from '../components/LogoWordmark'

export default function LandingPage() {
  const { slug } = useParams()
  const { open: openCalDrawer } = useCalDrawer()
  const { data: page, loading } = useSanity(LANDING_PAGE_QUERY, { slug })
  const [openFaq, setOpenFaq] = useState(null)

  const mockPage = MOCK_PAGES[slug] || null

  const p = page || mockPage


  const relatedPages = (p?.relatedSlugs || RELATED_SLUGS[slug] || [])
    .map(s => ({ slug: s, headline: MOCK_PAGES[s]?.heroHeadline }))
    .filter(r => r.headline)

  useMeta(p ? {
    title: p.seoTitle || `${p.heroHeadline} | Super Conscious`,
    description: p.seoDescription || p.heroAnswer?.slice(0, 155) || '',
    path: `/lp/${slug}`,
  } : {})

  if (loading && !p) return null
  if (!p) return <Navigate to="/404" replace />

  return (
    <main className={styles.main}>

      {/* Back nav */}
      <nav className={styles.topNav}>
        <NavLink to="/" className={styles.backBtn}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 7H4M4 7L7 4M4 7L7 10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </NavLink>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.logotype}>
          <LogoWordmark fill="rgba(255,255,255,0.3)" />
        </div>
        <h1 className={styles.headline}>{p.heroHeadline}</h1>
        {p.heroAnswer && <p className={styles.answer}>{p.heroAnswer}</p>}
      </section>

      {/* Body */}
      {p.body?.length > 0 && (
        <section className={styles.body}>
          {p.body.map((block, i) => {
            if (block._type === 'paragraphBlock') return (
              <p key={block._key || i} className={styles.para}>{block.text}</p>
            )
            if (block._type === 'headingBlock') return (
              <h2 key={block._key || i} className={styles.h2}>{block.heading || block.text}</h2>
            )
            if (block._type === 'imageBlock') return (
              <figure key={block._key || i} className={styles.figure}>
                <img {...sanityImgProps(block.imageUrl, { w: 1400 })} alt={block.alt || ''} />
              </figure>
            )
            return null
          })}
        </section>
      )}

      {/* Process */}
      {p.processSteps?.length > 0 && (
        <section className={styles.process}>
          <p className={styles.sectionLabel}>{p.processLabel || 'How we approach it'}</p>
          <div className={styles.steps}>
            {p.processSteps.map((step, i) => (
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
      {p.relatedWork?.length > 0 && (
        <section className={styles.work}>
          <p className={styles.sectionLabel}>Related work</p>
          <div className={styles.workGrid}>
            {p.relatedWork.map(item => (
              <NavLink key={item.slug} to={`/work/${item.slug}`} className={styles.workCard}>
                <div className={styles.workThumb}>
                  {item.thumbnailVideo
                    ? <LazyVideo src={item.thumbnailVideo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : item.thumbnail
                    ? <img src={sanityImg(item.thumbnail, { w: 800 })} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    : null
                  }
                </div>
                <div className={styles.workMeta}>
                  <span className={styles.workNum}>{item.n}</span>
                  <p className={styles.workName}>{item.name}</p>
                  {item.tagline && <p className={styles.workTagline}>{item.tagline}</p>}
                </div>
              </NavLink>
            ))}
          </div>
        </section>
      )}

      {/* FAQ */}
      {p.faqs?.length > 0 && (
        <section className={styles.faq}>
          <p className={styles.sectionLabel}>{p.faqLabel || 'Common questions'}</p>
          <div className={styles.faqList}>
            {p.faqs.map((f, i) => (
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

      {/* Related questions */}
      {relatedPages.length > 0 && (
        <section className={styles.related}>
          <p className={styles.sectionLabel}>Related questions</p>
          <div className={styles.relatedList}>
            {relatedPages.map(r => (
              <NavLink key={r.slug} to={`/lp/${r.slug}`} className={styles.relatedLink}>
                <span>{r.headline}</span>
                <svg className={styles.relatedIcon} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 16L16 4M16 4H8M16 4V12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </NavLink>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className={styles.cta}>
        <p className={styles.ctaHeading}>{p.ctaHeading || 'Ready to build?'}</p>
        {p.ctaBody && <p className={styles.ctaBody}>{p.ctaBody}</p>}
        <NavLink to="/contact" className={styles.ctaBtn}>{p.ctaBtn || 'Start a project'}</NavLink>
        <button
          type="button"
          className={styles.ctaBook}
          onClick={() => {
            window.gtag?.('event', 'cta_click', { cta_location: 'landing_page' })
            openCalDrawer()
          }}
        >Book a discovery call →</button>
      </section>

    </main>
  )
}

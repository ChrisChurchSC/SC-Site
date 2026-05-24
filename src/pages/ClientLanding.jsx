import { useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { useSanity } from '../hooks/useSanity'
import { useMeta } from '../hooks/useMeta'
import { CLIENT_LANDING_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'
import LazyVideo from '../components/LazyVideo'
import { buildPackages, buildCapabilities } from '../data/buildPackages'
import styles from './ClientLanding.module.css'
import homeStyles from './Home.module.css'

const formatPrice = (n) => `$${n.toLocaleString('en-US')}`

export default function ClientLanding() {
  const { slug } = useParams()
  const { data, loading } = useSanity(CLIENT_LANDING_QUERY, { slug })

  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [manualUnlock, setManualUnlock] = useState(false)

  const sessionKey = `client_unlocked_${slug}`
  const sessionUnlocked = typeof sessionStorage !== 'undefined'
    && sessionStorage.getItem(sessionKey) === '1'
  const unlocked = manualUnlock || sessionUnlocked

  useMeta({
    title: data ? `${data.clientName} | Super Conscious` : 'Super Conscious',
    description: data?.headline ?? data?.intro?.slice(0, 155),
    path: `/clients/${slug}`,
    noindex: true,
  })

  const handleUnlock = (e) => {
    e.preventDefault()
    if (data && pw === data.password) {
      sessionStorage.setItem(sessionKey, '1')
      setManualUnlock(true)
    } else {
      setError(true)
      setPw('')
      setTimeout(() => setError(false), 600)
    }
  }

  if (loading) return <main className={styles.main} />
  if (!data) return (
    <main className={styles.main}>
      <p className={styles.notFound}>Page not found.</p>
    </main>
  )

  if (!unlocked) return (
    <main className={styles.main}>
      <div className={styles.gate}>
        <div className={styles.gateInner}>
          <p className={styles.gateLabel}>Private</p>
          <h1 className={styles.gateName}>{data.clientName}</h1>
          <p className={styles.gateSubtext}>This page is shared with you privately.</p>
          <form className={styles.gateForm} onSubmit={handleUnlock}>
            <input
              className={`${styles.gateInput}${error ? ` ${styles.gateInputError}` : ''}`}
              type="password"
              placeholder="Password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              autoFocus
            />
            <span className={styles.gateError}>{error ? 'Incorrect password.' : ''}</span>
            <button type="submit" className={styles.gateSubmit}>Enter →</button>
          </form>
        </div>
      </div>
    </main>
  )

  return (
    <main className={styles.main}>
      {/* Hero */}
      <header className={styles.header}>
        <p className={styles.eyebrow}>For {data.clientName}</p>
        {data.headline && <h1 className={styles.headline}>{data.headline}</h1>}
        {data.intro && <p className={styles.intro}>{data.intro}</p>}
      </header>

      {/* Why */}
      {(data.whyHeading || data.whyBody) && (
        <section className={styles.section}>
          {data.whyHeading && <h2 className={styles.sectionHeading}>{data.whyHeading}</h2>}
          {data.whyBody && <p className={styles.body}>{data.whyBody}</p>}
        </section>
      )}

      {/* Selected work — homepage block style */}
      {data.caseStudies?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Selected work</h2>
          <div className={styles.workGrid}>
            {data.caseStudies.map((cs, i) => (
              <NavLink
                key={cs.slug}
                to={`/work/${cs.slug}`}
                className={`${homeStyles.block} ${homeStyles.r45} ${homeStyles.blockLink}`}
              >
                {cs.thumbnailVideo ? (
                  <LazyVideo src={cs.thumbnailVideo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : cs.thumbnail ? (
                  <img src={sanityImg(cs.thumbnail, { w: 1200 })} alt="" loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : null}
                <span className={homeStyles.label}>{cs.n || String(i + 1).padStart(3, '0')}</span>
                <span className={homeStyles.csTag}>Case Study</span>
                {cs.subCount > 1 && <span className={homeStyles.workBadge}>+{cs.subCount} PROJECTS</span>}
                <p className={homeStyles.blockTitle}>{cs.name}</p>
              </NavLink>
            ))}
          </div>
        </section>
      )}

      {/* Where to start — Build packages */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>{data.packagesHeading || 'Where to start.'}</h2>
        {data.packagesIntro && <p className={styles.bodySmall}>{data.packagesIntro}</p>}
        <div className={styles.packageGrid}>
          {buildPackages.map(pkg => (
            <NavLink key={pkg.slug} to={`/contact?package=${pkg.slug}`} className={styles.packageCard}>
              <p className={styles.packageName}>{pkg.name}</p>
              <p className={styles.packageGoal}>{pkg.goal}</p>
              <p className={styles.packagePrice}>Starting at {formatPrice(pkg.price)}</p>
            </NavLink>
          ))}
        </div>
      </section>

      {/* Capabilities — what Build means */}
      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>{data.capabilitiesHeading || 'What Build means.'}</h2>
        <div className={styles.capGrid}>
          {buildCapabilities.map(cap => (
            <div key={cap.heading}>
              <p className={styles.capHeading}>{cap.heading}</p>
              <ul className={styles.capList}>
                {cap.items.map(item => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Selected thinking */}
      {data.featuredThoughts?.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionHeading}>Selected thinking</h2>
          <div className={styles.thoughtsGrid}>
            {data.featuredThoughts.map(t => (
              <NavLink key={t.slug} to={`/thoughts/${t.slug}`} className={styles.thoughtCard}>
                <p className={styles.thoughtTitle}>{t.title}</p>
                {t.excerpt && <p className={styles.thoughtExcerpt}>{t.excerpt}</p>}
                <span className={styles.thoughtArrow}>Read →</span>
              </NavLink>
            ))}
          </div>
        </section>
      )}

      {/* Founder testimonial */}
      {data.testimonialQuote && (
        <section className={styles.testimonial}>
          <p className={styles.testimonialQuote}>“{data.testimonialQuote}”</p>
          {data.testimonialAttribution && <p className={styles.testimonialAttr}>— {data.testimonialAttribution}</p>}
        </section>
      )}

      {/* How we'd work together */}
      {(data.approachHeading || data.approachBullets?.length > 0) && (
        <section className={styles.section}>
          {data.approachHeading && <h2 className={styles.sectionHeading}>{data.approachHeading}</h2>}
          {data.approachBullets?.length > 0 && (
            <ul className={styles.approachList}>
              {data.approachBullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </section>
      )}

      {/* Trust strip */}
      {data.trustLogos?.length > 0 && (
        <section className={styles.trustStrip}>
          {data.trustLogos.map((logo, i) => (
            <span key={i} className={styles.trustItem}>{logo}</span>
          ))}
        </section>
      )}

      {/* CTA */}
      {(data.signoff || (data.ctaHref && data.ctaText)) && (
        <footer className={styles.cta}>
          {data.signoff && <p className={styles.signoff}>{data.signoff}</p>}
          {data.ctaHref && data.ctaText && (
            data.ctaHref.startsWith('/') ? (
              <NavLink to={data.ctaHref} className={styles.ctaBtn}>{data.ctaText} →</NavLink>
            ) : (
              <a href={data.ctaHref} className={styles.ctaBtn} target={data.ctaHref.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{data.ctaText} →</a>
            )
          )}
          {data.closingLinkText && data.closingLinkHref && (
            data.closingLinkHref.startsWith('/') ? (
              <NavLink to={data.closingLinkHref} className={styles.closingLink}>{data.closingLinkText} →</NavLink>
            ) : (
              <a href={data.closingLinkHref} className={styles.closingLink} target="_blank" rel="noopener noreferrer">{data.closingLinkText} →</a>
            )
          )}
        </footer>
      )}
    </main>
  )
}

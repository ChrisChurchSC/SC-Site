import { useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { useSanity } from '../hooks/useSanity'
import { useMeta } from '../hooks/useMeta'
import { CLIENT_LANDING_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'
import LazyVideo from '../components/LazyVideo'
import styles from './ClientLanding.module.css'

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
      <header className={styles.header}>
        <p className={styles.eyebrow}>For {data.clientName}</p>
        {data.headline && <h1 className={styles.headline}>{data.headline}</h1>}
        {data.intro && <p className={styles.intro}>{data.intro}</p>}
      </header>

      {data.caseStudies?.length > 0 && (
        <section className={styles.grid}>
          {data.caseStudies.map((cs, i) => (
            <NavLink key={cs.slug} to={`/work/${cs.slug}`} className={styles.card}>
              {cs.thumbnailVideo ? (
                <LazyVideo src={cs.thumbnailVideo} className={styles.cardThumb} />
              ) : cs.thumbnail ? (
                <img src={sanityImg(cs.thumbnail, { w: 900 })} alt="" loading="lazy" className={styles.cardThumb} />
              ) : null}
              <span className={styles.cardNum}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.cardName}>{cs.name}</p>
              {cs.tagline && <p className={styles.cardTagline}>{cs.tagline}</p>}
              <span className={styles.cardArrow}>→</span>
              <div className={styles.cardOverlay} />
            </NavLink>
          ))}
        </section>
      )}

      {data.ctaHref && data.ctaText && (
        <footer className={styles.cta}>
          {data.ctaHref.startsWith('/') ? (
            <NavLink to={data.ctaHref} className={styles.ctaBtn}>{data.ctaText} →</NavLink>
          ) : (
            <a href={data.ctaHref} className={styles.ctaBtn} target={data.ctaHref.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">{data.ctaText} →</a>
          )}
        </footer>
      )}
    </main>
  )
}

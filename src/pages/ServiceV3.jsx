import { NavLink, Navigate, useParams } from 'react-router-dom'

import styles from './ServiceV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { services, serviceBySlug } from '../data/services'
import { deliverableNotes } from '../data/deliverables'

/**
 * One page per service, from one template.
 *
 * FOUR PAGES OR ONE COMPONENT. They differ in their words and not in their
 * shape, so a component per service would be four files diverging quietly —
 * the kind of thing where Build gets a fix and Represent does not. The route
 * is /services/:slug and the data is src/data/services.js.
 *
 * BUILD AND GROW ARE CHRIS'S WORDS. Support and Represent are drafts of
 * mine, and the page says so on those two rather than only in a comment: a
 * visitor reading an unsigned-off description of a service should be able to
 * tell, and so should whoever ships this.
 *
 * NO PRICE IS INVENTED. Build and Grow carry the figures that are on the
 * pricing page because both read the same numbers. Support and Represent
 * have no published rate, so they say that instead of guessing one.
 *
 * AN UNKNOWN SLUG REDIRECTS rather than rendering an empty shell — there are
 * exactly four services, and /services/anything-else is a typo.
 */
export default function ServiceV3() {
  const { slug } = useParams()
  const cal = useCalDrawer()
  const service = serviceBySlug(slug)

  useMeta({
    title: service ? `${service.name} | Super Conscious` : 'Services | Super Conscious',
    description: service?.tagline,
  })

  if (!service) return <Navigate to="/services" replace />

  const others = services.filter((s) => s.slug !== slug)

  return (
    <main className={styles.page}>
      <V3Nav />

      <header className={styles.hero}>
        <p className={styles.eyebrow}>[ {service.name} ]</p>
        <h1 className={styles.headline}>{service.tagline}</h1>

        {service.draft && (
          /* On the page, not only in the source. Someone reading this should
             be able to tell that nobody has signed it off yet. */
          <p className={styles.draftFlag}>
            Draft — this description has not been signed off yet.
          </p>
        )}

        <p className={styles.intro}>{service.intro}</p>

        <div className={styles.heroActions}>
          <button className={styles.ctaFilled} onClick={cal.open}>Book a demo</button>
          <NavLink className={styles.ctaGhost} to="/pricing">See pricing</NavLink>
        </div>
      </header>

      <section className={styles.block} aria-labelledby="covers">
        <div className={styles.blockHead}>
          <h2 className={styles.blockName} id="covers">What it covers</h2>
          <p className={styles.blockIntro}>{service.pillarsIntro}</p>
        </div>

        <div className={styles.pillars}>
          {service.pillars.map(({ n, name, items, why }) => (
            <article key={n} className={styles.pillar}>
              <span className={styles.pillarNum}>{n}</span>
              <h3 className={styles.pillarName}>{name}</h3>
              {why && <p className={styles.why}>{why}</p>}

              <ul className={styles.pills}>
                {items.map((i) => (
                  /* Same hover notes as the pricing page, from the same map.
                     A name with no entry gets no tooltip rather than an empty
                     bubble. */
                  <li key={i} className={styles.pill} data-tip={deliverableNotes[i] || undefined}>
                    {i}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.price}>
        <div>
          <p className={styles.priceLabel}>What it costs</p>
          {service.priceLead
            ? <p className={styles.priceLead}>{service.priceLead}</p>
            : <p className={`${styles.priceLead} ${styles.priceNone}`}>Talk to us</p>}
          <p className={styles.priceNote}>{service.priceNote}</p>
        </div>
        <NavLink className={styles.ctaGhost} to="/pricing">See full pricing</NavLink>
      </section>

      <section className={styles.others} aria-labelledby="others">
        <h2 className={styles.blockName} id="others">The other three</h2>
        <div className={styles.otherGrid}>
          {others.map((s) => (
            <NavLink key={s.slug} to={`/services/${s.slug}`} className={styles.otherCard}>
              <span className={styles.otherName}>{s.name}</span>
              <span className={styles.otherTagline}>{s.tagline}</span>
            </NavLink>
          ))}
        </div>
      </section>

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}

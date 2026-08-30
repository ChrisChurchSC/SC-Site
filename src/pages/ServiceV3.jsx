import { NavLink, Navigate, useParams } from 'react-router-dom'

import styles from './ServiceV3.module.css'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FlowDiagram from '../components/FlowDiagram'
import ClientStrip from '../components/ClientStrip'
import PlatformIntro from '../components/PlatformIntro'
import PlatformOutputs from '../components/PlatformOutputs'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { serviceBySlug } from '../data/services'

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


  return (
    <main className={styles.page}>
      <V3Nav />

      {/* The hero and its diagram share one ground, so the dot field runs
          behind both rather than stopping where the copy ends. They were
          siblings and the texture belonged to the diagram alone, which drew
          a line across the page at exactly the point the eye is still
          reading. */}
      <div className={styles.top}>
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

        {/* THE REPO IS THE MIDDLE, not the service.

            The first version put the service name in the centre, which drew
            the wrong picture: it said the inputs become Build, and Build
            becomes a brand. What actually happens is that everything goes into
            the repo, and the outputs come out of it — the service is the work
            around that, not a stage in the middle of it. Putting the platform
            there is also the argument the rest of the site makes.

            The right column is this service's four pillars, from services.js.
            It used to be echoed by a "What it covers" section underneath;
            that is cut, so this diagram is now the only place the pillars
            appear on the page. */}
        <FlowDiagram
          centre="Repo"
          outputs={service.pillars.map(({ name, items, outputs }) => ({
            name,
            /* A pillar that names its own outputs uses them; the rest fall
               back to the first three deliverables, which read as outputs
               already. */
            items: (outputs ?? items).slice(0, 3),
          }))}
        />
      </div>

      {/* Under the hero, not inside it: the block above carries the gradient
          and the dot field, and pulling the strip into that would put client
          names on top of the texture. Out here it does the job a strip does,
          which is to end the hero. Full bleed, so its rules run the width of
          the page rather than stopping at the reading margin. */}
      <div className={styles.clients}>
        <ClientStrip banner />
      </div>

      <PlatformIntro />

      <PlatformOutputs />

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}

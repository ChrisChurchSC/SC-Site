import home from './Home.module.css'
import v3 from './HomeV3.module.css'
import styles from './Disciplines.module.css'
import FooterCard from '../components/FooterCard'
import StatementCard from '../components/StatementCard'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import V3Signoff from '../components/V3Signoff'
import { useMeta } from '../hooks/useMeta'
import { NavLink } from 'react-router-dom'
import { DISCIPLINES } from './Services'
import { LIVE } from './Discipline'
import { disciplineSlug } from '../lib/disciplineSlug'

/**
 * ALL DISCIPLINES — a hero and twelve 4:5 cards.
 *
 * THE LIST IS THE SERVICES PAGE'S. DISCIPLINES is the same array the nav
 * panel and the footer column render from, so a discipline renamed on
 * /services renames here, in the panel and in the footer together. Nothing
 * on this page is written for this page: the hero headline is the first
 * "What You Get" heading on /services and its support line is that section's
 * lead. Both are already claims the site makes; this page does not add one.
 *
 * WHY IT EXISTS. The nav's Services panel closes on "View all disciplines",
 * which pointed at /services — a page whose disciplines are one section of
 * nine. A link that says "all disciplines" should land on all disciplines.
 *
 * A CARD IS A LINK ONLY WHEN ITS PAGE EXISTS. Discipline.jsx's LIVE set says
 * which do — one, to start. The others stay text, on the footer's own rule:
 * an entry with nowhere to go is not a link. Same markup either way, so the
 * grid does not shift when a discipline goes live; only the cursor and the
 * hover lift say which cards go somewhere.
 */
const HEADLINE = 'Twelve disciplines, one bench.'
const SUPPORT = 'A whole department, at the fraction of it you actually use.'

export default function Disciplines() {
  useMeta({
    title: 'Disciplines | Super Conscious',
    description: 'Twelve disciplines, one bench: creative direction, writing, design, illustration, film, 3D and motion, animation, editing, production, media, search and engineering.',
    path: '/disciplines',
  })

  return (
    <main className={`${home.main} ${v3.stack}`}>
      <V3Nav />

      {/* The careers page's hero shape: display, not tall, so the cards start
          inside the first screen rather than under a screen of black. */}
      <StatementCard
        eyebrow="[ Disciplines ]"
        statement={HEADLINE}
        support={SUPPORT}
        as="h1"
        display
        bare
        inset
        supportSerif
        rule={false}
      />

      <section className={styles.section} aria-label="All disciplines">
        <ul className={styles.grid}>
          {DISCIPLINES.map(({ name, body }, i) => {
            const slug = disciplineSlug(name)
            const inner = (
              <>
                <span className={styles.n}>{String(i + 1).padStart(2, '0')}</span>
                <h2 className={styles.name}>{name}</h2>
                <p className={styles.body}>{body}</p>
              </>
            )
            return (
              <li key={name}>
                {LIVE.has(slug)
                  ? <NavLink to={`/disciplines/${slug}`} className={`${styles.card} ${styles.cardLink}`}>{inner}</NavLink>
                  : <div className={styles.card}>{inner}</div>}
              </li>
            )
          })}
        </ul>
      </section>

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}

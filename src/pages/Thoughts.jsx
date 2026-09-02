import styles from './Home.module.css'
import v3 from './HomeV3.module.css'
import ContactCTA from '../components/ContactCTA'
import FooterCard from '../components/FooterCard'
import StatementCard from '../components/StatementCard'
import ThoughtsIndex from '../components/ThoughtsIndex'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import V3Signoff from '../components/V3Signoff'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
<<<<<<< HEAD
=======
import { useSanity } from '../hooks/useSanity'
import { THOUGHTS_INDEX_QUERY } from '../lib/queries'
import { sanityImgProps } from '../lib/sanityImg'
>>>>>>> origin/main

/**
 * THOUGHTS, ON THE CASE-STUDIES PAGE'S SHAPE.
 *
 * It was the last page still running the old chrome — no V3Nav, no footer,
 * its own header and its own card grid — on a site where every other route a
 * visitor reaches from the nav is v3. Same shell now: the bar, a statement,
 * the index, the ask, the footer, the sign-off.
 *
 * NO FEATURED POST. That is the one difference from /work, and it is a
 * decision rather than an omission: the lead card there is a written case
 * study with a cover, and a thought is not more of a thought for being the
 * most recent. Every post gets the same cell — see ThoughtsIndex.
 *
 * NOT TALL, AND BARE. /work's hero holds the page open above a grid that is
 * the whole site's work; this one sits above four posts, and the same drop
 * left most of a screen of nothing between the headline and the first card.
 *
 * Dropping tall cost the hero its transparency — that variant is what sets
 * background: none, so without it the card's own #161616 came back as a grey
 * panel behind the headline. bare is the variant that means no ground, and
 * rule={false} suppresses the hairline it would otherwise draw above a hero
 * that has only the nav above it.
 *
 * THE WORDS ARE THE PAGE'S OWN. "Thoughts" and "Ideas, notes, and process."
 * were the header of the version this replaced, and the second is also the
 * descriptor the nav card uses for this route.
 */
const CLOSING = 'It might change your life. At minimum, we can answer your burning marketing questions.'

export default function Thoughts() {
  const cal = useCalDrawer()

  useMeta({
    title: 'Studio Notes & Ideas | Super Conscious',
    description: 'Ideas, notes, and process from the Super Conscious studio. Brand strategy, creative practice, and content thinking.',
    path: '/thoughts',
  })

<<<<<<< HEAD
  return (
    <main className={`${styles.main} ${v3.stack}`}>
      <V3Nav />

      <StatementCard
        eyebrow="[ Thoughts ]"
        statement="Ideas, notes, and process."
        support={null}
        as="h1"
        center
        display
        bare
        rule={false}
      />

      <ThoughtsIndex />

      <hr className={v3.divider} />

      {/* The same ask the work page closes on, for the same reason: the page
          has done its job and the one thing to do next is talk to someone. */}
      <ContactCTA sub={CLOSING} form={false} bare>
        <button className={v3.contactCta} onClick={cal.open}>Start a project</button>
      </ContactCTA>

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
=======
      <section className={styles.grid}>
        {items.map(({ _id, title, slug, excerpt, publishedAt, order, heroUrl }) => {
          const n = String(order ?? 0).padStart(3, '0')
          return (
            <NavLink key={_id} to={`/thoughts/${slug}`} className={styles.card}>
              <div className={styles.cardThumb}>
                {heroUrl && <img {...sanityImgProps(heroUrl, { w: 900 })} alt="" />}
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.cardNum}>{n}</span>
                <span className={styles.cardDate}>{fmtDate(publishedAt)}</span>
              </div>
              <h2 className={styles.cardTitle}>{title}</h2>
              {excerpt && <p className={styles.cardExcerpt}>{excerpt}</p>}
            </NavLink>
          )
        })}
      </section>
>>>>>>> origin/main
    </main>
  )
}

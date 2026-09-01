import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './AudienceCards.module.css'
import { WORK_BY_INDUSTRY } from './V3Nav'

/**
 * "Who we work with" — the three kinds of brand, three-up under the offer.
 *
 * The one section on the homepage variant that has no equivalent on the live
 * page, so it is the only thing here that had to be built rather than
 * reordered. It deliberately borrows BuildGrowCards' card: same border, same
 * radius, same hover, same mono CTA — three of them instead of two, and no
 * artwork, because there is none for these and an empty media layer would
 * read as a card that failed to load.
 *
 * Copy is the design canvas's, verbatim.
 *
 * Every card links to /work rather than a filtered view. The canvas implies
 * three filtered routes — new brands, pivots, underdogs — and none of them
 * exists; a link to a page that is not there is worse than a broader one.
 * When they exist, change `href` here and nothing else changes.
 */
const AUDIENCES = [
  {
    id: 'new',
    name: 'New',
    body: 'A brand that needs to be defined from scratch: identity, visual system, voice.',
    /* The row layout puts the line beside the name rather than under it, so
       it has a fraction of the width the card gives it. These are the same
       sentences compressed, not new ones. */
    line: 'Define it from scratch.',
    cta: 'See work for new brands',
    href: '/work',
  },
  {
    id: 'pivoting',
    name: 'Pivoting',
    body: 'An existing brand reworking what it has — a facelift, or a full-scale overhaul to retain and amplify relevancy.',
    line: 'Rework what is already there.',
    cta: 'See work for pivots',
    href: '/work',
  },
  {
    id: 'underdog',
    name: 'Underdog',
    body: 'A brand in a crowded category that needs to stand out.',
    line: 'Stand out in a crowded category.',
    cta: 'See work for underdogs',
    href: '/work',
  },
]

/* TWO WAYS TO ASK "IS THIS FOR ME". The brand's situation is the one this
   section was built on; industry is the other way a visitor describes
   themselves. WORK_BY_INDUSTRY drives the Case Studies menu too, so the tabs
   and the nav cannot describe the studio's coverage differently.

   BY STAGE WAS HERE AND IS CUT. Founder-led / seed / scale-up / enterprise
   is a question about budget wearing a question about fit, and the four had
   nothing written about them either. WORK_BY_STAGE still drives the nav.

   BOTH VIEWS RENDER THE SAME 4:5 CARD. A dense variant existed for industry
   for a version, on the reasoning that six name-only cards was a lot of page
   for six names — but two card sizes in one section made switching tab
   change the weight of everything under it, which is worse than the space.

   THERE IS NO BODY COPY FOR INDUSTRIES anywhere in the repo, so those cards
   carry a name and a link. Inventing a sentence per category to fill them
   would be the other way to solve it, and it is not better.

   EVERY LINK GOES TO /work, as the situation cards already do — there is no
   filtered route for any of these. Turning them into real destinations needs
   one tag per project. See the note on the situation cards. */
/* SUB-INDUSTRIES, READ OFF THE CLIENT LIST rather than invented. Every one
   of these is a category the studio has actually shipped into — Zbiotics and
   Hylands under supplements and personal care, Photon and Heard under
   digital health, Path Projects and Soft Science under apparel and footwear,
   J.Jill under retail, Smashburger and Einstein Bagels under restaurants,
   Smallhold and Big Buoy under packaged food, Arbitrum and Offchain under
   crypto, Google under technology.

   They also give the industry card something to hold. Without them it is a
   name and a link in a 4:5 box, which is why a dense variant kept getting
   proposed for this view. THE GROUPINGS ARE MINE AND UNAPPROVED. */
/* Keyed to the industries that exist. Consumer & Retail went when the pages
   were built — nothing in the roster evidenced it — and Culture & Nonprofit
   arrived, so its key was missing and its card rendered without pills. */
const SUB_INDUSTRIES = {
  'Food & Beverage': ['Restaurants', 'Packaged food', 'Beverage', 'Hospitality'],
  'Health & Wellness': ['Supplements', 'Digital health', 'Personal care', 'Fitness'],
  'Technology & Web3': ['SaaS', 'Crypto', 'Developer tools', 'Fintech'],
  'Culture & Nonprofit': ['Nonprofit', 'Impact', 'Arts', 'Education'],
}

const VIEWS = [
  { id: 'situation', label: 'By situation' },
  { id: 'industry', label: 'By industry' },
]

/**
 * `rows` swaps the three cards for a list: name, line, and an arrow that
 * appears on the row you are on. Off by default — /v2 uses the cards.
 *
 * The reference fills the hovered row and fades the rest, which is the whole
 * behaviour: it is not a hover state on three separate cards, it is one list
 * with a focus. On a light page that fill is black; here it is the card grey,
 * because a dark fill on a dark page is invisible.
 */
export default function AudienceCards({
  eyebrow = '[ Who We Work With ]',
  cards = AUDIENCES,
  rows = false,
  headline = 'Three kinds of brand, one way of working.',
  /* THE VIEW TOGGLE IS OPTIONAL. On a service page it is the point — the same
     roster read two ways. On an industry page it would offer to re-sort the
     page by industry, which is the page. */
  toggle = true,
}) {
  const [view, setView] = useState('situation')

  /* Industry comes from V3Nav, mapped into the shape the card already takes
     so there is one loop rather than two.

     IT IS { label, href } NOW, not a string. When the industry pages were
     built WORK_BY_INDUSTRY became a list of objects so the nav could link to
     them, and this destructures accordingly — rendering the object threw
     "Objects are not valid as a React child" and took the whole By industry
     view down on both service pages. The href is the industry's own page
     rather than the wall, which is the point of it having one. */
  const shown = view === 'situation'
    ? cards
    : WORK_BY_INDUSTRY.map(({ label, href }) => ({
      id: label,
      name: label,
      body: null,
      pills: SUB_INDUSTRIES[label] ?? [],
      cta: 'See work',
      href,
    }))

  if (rows) {
    return (
      <section className={styles.section}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.headline}>{headline}</h2>

        <div className={styles.list}>
          {cards.map(({ id, name, line, body, href }) => (
            <NavLink key={id} to={href} className={styles.listRow}>
              <span className={styles.listName}>{name}</span>
              <span className={styles.listLine}>{line ?? body}</span>
              <span className={styles.listArrow} aria-hidden="true">→</span>
            </NavLink>
          ))}
        </div>

        <NavLink to="/work" className={styles.listAll}>See all work →</NavLink>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        {toggle && <div className={styles.views}>
          {VIEWS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={id === view ? styles.viewOn : styles.view}
              aria-pressed={id === view}
              onClick={() => setView(id)}
            >
              {label}
            </button>
          ))}
        </div>}
      </div>

      <div className={styles.row}>
        {shown.map(({ id, name, body, pills, cta, href }) => (
          <NavLink key={id} to={href} className={styles.card}>
            <h2 className={styles.name}>{name}</h2>
            {body && <p className={styles.body}>{body}</p>}
            {pills?.length > 0 && (
              <span className={styles.chips}>
                {pills.map((p) => <span key={p} className={styles.chip}>{p}</span>)}
              </span>
            )}
            <span className={styles.cta}>{cta} →</span>
          </NavLink>
        ))}
      </div>
    </section>
  )
}

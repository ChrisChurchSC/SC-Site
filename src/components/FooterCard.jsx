import { NavLink } from 'react-router-dom'

import styles from './FooterCard.module.css'

/**
 * The big footer card.
 *
 * IT DOES NOT KNOW ITS OWN LINKS. The columns come in as a prop, built by
 * the page from the very same constants the nav bar renders from —
 * SERVICE_ROWS, WORK_BY_INDUSTRY, COMPANY_COLS. A footer
 * that keeps its own copy of the site's structure is a footer that is wrong
 * within a month; rename a service once and it changes in the nav panel, on
 * the cards, and down here, together.
 *
 * The page cannot be imported from here to get them — the page imports this
 * component, and that is a cycle — so they arrive as a prop instead.
 *
 * SOME ENTRIES ARE NOT LINKS, and that is on purpose rather than an
 * oversight. Most of the /v3 information architecture has no page behind it
 * yet: there is no Brand Repository page, no Support page, no page per
 * industry. The nav panels already handle this the same way — the heading
 * links, the items under it are text. The alternative is thirty links all
 * pointing at /services, which is not depth, only the appearance of it.
 * When the pages exist, give the entry an href and nothing else here
 * changes.
 *
 * LEGAL IS NOT FROM THE NAV. Privacy and Terms are not in the nav bar and
 * should not be — but they are the two links a footer genuinely owes a
 * visitor, so they are the component's own and sit on their own row.
 *
 * WHAT IS STILL NOT HERE: a newsletter field, a language picker, an address,
 * and a copyright line with a year in it. The first two do not exist, the
 * third is not published anywhere on this site, and a hard-coded year is a
 * small lie with a scheduled start date.
 */
const LEGAL = {
  tag: 'Legal',
  links: [
    { label: 'Privacy policy', href: '/privacy' },
    { label: 'Terms of service', href: '/terms' },
  ],
}

function Column({ tag, links }) {
  return (
    <div className={styles.col}>
      <h2 className={styles.tag}>{tag}</h2>
      <ul className={styles.list}>
        {links.map(({ label, href, external }) => (
          <li key={label}>
            {!href
              ? <span className={styles.plain}>{label}</span>
              : external
                ? (
                  /* noreferrer alongside noopener: the tab this opens should
                     not be able to reach back, and should not carry where it
                     came from. */
                  <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
                    {label}
                  </a>
                )
                : <NavLink className={styles.link} to={href}>{label}</NavLink>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function FooterCard({ columns = [] }) {
  return (
    /* <nav> rather than <footer>: the page's closing wordmark follows this,
       and a document should not carry two competing footers. The label is
       what tells a screen reader which navigation this is. */
    <nav className={styles.card} aria-label="Footer">
      {/* ONE GRID, TWO ROWS. The row-2 columns used to sit in a grid of their
          own, which gave them their own tracks: with two items in an auto-fit
          grid they spread across the width, so Disciplines landed at x=736
          against Case studies at x=387. Same grid means the same tracks by
          construction, and auto-placement drops them into columns one and two
          under Services and Case studies — no explicit row or column, so
          adding a sixth top-row column re-flows both rows together. */}
      <div
        className={styles.grid}
        /* The number of top-row columns, so the grid has exactly that many
           tracks and the row-2 columns wrap under the first two. In the
           stylesheet it would be a hard-coded five that goes wrong the day a
           column is added. */
        style={{ '--footer-cols': columns.filter(col => !col.row).length }}
      >
        {columns.filter(col => !col.row).map(col => <Column key={col.tag} {...col} />)}
        {columns.filter(col => col.row === 2).map(col => <Column key={col.tag} {...col} />)}
      </div>

      {/* Legal, and any column that asked to sit beside it. */}
      <div className={styles.legalRow}>
        <Column {...LEGAL} />
        {columns.filter(col => col.row === 3).map(col => <Column key={col.tag} {...col} />)}
      </div>
    </nav>
  )
}

import { NavLink } from 'react-router-dom'

import styles from './FooterCard.module.css'

/**
 * The big footer card: the site's routes, grouped, in one panel.
 *
 * EVERY href HERE IS A ROUTE THAT EXISTS. The list was taken from the route
 * table in App.jsx rather than written from memory, because a footer is the
 * one place on a site where nobody notices a dead link for months — it is
 * below the fold, it is rarely clicked, and it is exactly where crawlers
 * look. If a route is removed, remove it here in the same change.
 *
 * TWO OF THESE POINT SOMEWHERE OTHER THAN THEIR NAME SUGGESTS, deliberately
 * and consistently with the rest of the site: Careers has no route of its
 * own on this branch and the About page carries it, which is where Nav.jsx
 * sends Careers too. Better a link that lands on the page holding the
 * content than a link to a 404, or a heading with nothing under it.
 *
 * WHAT IS NOT HERE: a newsletter field, a language picker, an address, and a
 * copyright line with a year in it. The first two do not exist, the third is
 * not published anywhere on this site, and a hard-coded year is a small lie
 * with a scheduled start date. The wordmark below the card already signs the
 * page.
 */
const COLUMNS = [
  {
    tag: 'What we do',
    links: [
      { label: 'Services', href: '/services' },
      { label: 'Brand systems', href: '/brand-systems' },
      { label: 'Content programs', href: '/content-programs' },
      { label: 'Digital products', href: '/digital-products' },
      { label: 'Landing pages', href: '/landing-pages' },
    ],
  },
  {
    tag: 'Capabilities',
    links: [
      { label: 'All capabilities', href: '/capabilities' },
      { label: 'For agencies', href: '/agency-capabilities' },
      { label: 'Content packages', href: '/content-packages' },
    ],
  },
  {
    tag: 'Work',
    links: [
      { label: 'Case studies', href: '/work' },
    ],
  },
  {
    tag: 'Company',
    links: [
      { label: 'About', href: '/about-us' },
      // No Careers route on this branch; About carries it, as Nav.jsx does.
      { label: 'Careers', href: '/about-us' },
      { label: 'Thoughts', href: '/thoughts' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    tag: 'Social',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/_super_conscious/', external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/super-conscious/', external: true },
    ],
  },
]

/* Sits on its own row under the rest, as in the reference. */
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
            {external
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

export default function FooterCard() {
  return (
    /* <nav> rather than <footer>: the page's closing wordmark follows this,
       and a document should not carry two competing footers. The label is
       what tells a screen reader which navigation this is. */
    <nav className={styles.card} aria-label="Footer">
      <div className={styles.grid}>
        {COLUMNS.map(col => <Column key={col.tag} {...col} />)}
      </div>

      <div className={styles.legalRow}>
        <Column {...LEGAL} />
      </div>
    </nav>
  )
}

import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Users, Briefcase, PenLine, Mail, ArrowUpRight } from 'lucide-react'

import styles from '../pages/Home.module.css'
import v3 from '../pages/HomeV3.module.css'
import LogoWordmark from './LogoWordmark'
import { useCalDrawer } from '../context/CalDrawerContext'

/**
 * The /v3 navigation bar, and the information architecture behind it.
 *
 * IT LIVES HERE SO MORE THAN ONE PAGE CAN HAVE IT. It was inline in
 * HomeV3.jsx, which was fine while /v3 was the only page using it and
 * useless the moment /pricing needed the same bar. The constants moved with
 * it because the footer columns are derived from them too, and a second copy
 * would disagree with the first inside a week.
 *
 * No cycle: pages import this; this imports nothing from a page.
 */

/* The panel's columns are the real discipline lists off the Services page —
   imported, not retyped, so they cannot drift from what that page shows.

   WHAT THE PANEL CANNOT DO YET: the discipline NAME is the link, and the
   items under it are text. Every one of them would otherwise point at
   /services, because that is the only destination that exists — the page has
   no section ids to anchor to and there are no per-discipline pages. Thirty
   links to one URL is not depth, it is the appearance of depth. When the
   anchors or the pages exist, give each item an href and nothing else here
   changes. */
export const NAV_LINKS = [
  // Active now, and behaves like a menu heading: still no href, because there
  // is no platform page to send anyone to, but it opens its panel on hover
  // like Services and Company and is no longer dimmed. The chevron says it
  // does something.
  { label: 'Platform', href: null, panel: 'platform' },
  { label: 'Services', href: '/services', panel: 'services' },
  { label: 'Case Studies', href: '/work', panel: 'work' },
  { label: 'Company', href: '/about-us', panel: 'company' },
  // Points at /services, where the rates actually are: the Build and Grow
  // cards quote them and every package on that page carries a price. Not a
  // pricing page, and landing mid-page is not ideal — but a live link to the
  // real numbers beats the dead label it was.
  //
  // There WAS a /pricing page, built on figures Chris supplied directly and
  // scrapped on request. It is in the history on this branch if it is ever
  // wanted back: see 110265f and the four commits before it.
  { label: 'Pricing', href: '/pricing' },
]

/* The two columns of the Case Studies panel: by industry, and by company
 * size.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * THESE TWO TAXONOMIES DO NOT EXIST IN THE DATA. NOBODY HAS SIGNED THEM OFF.
 *
 * There is no industry field on a project and no size field either — not in
 * Sanity (a project has comingSoon, descriptor, name, order, password,
 * published, relationship, slug, type, year), not in projects.js, nowhere.
 * Both lists below were written to fill this menu because they were asked
 * for, and they are a proposal, not a record.
 *
 * They are grounded in the client roster rather than pulled from the air —
 * food and drink, crypto, consumer health, retail and technology are all
 * plainly represented in clientLogos — but WHICH categories the studio wants
 * to be found under is positioning, and that is not a code decision.
 *
 * What is deliberately NOT done here: no client is filed under any category.
 * Listing the labels is a proposal about how work might be grouped; saying
 * "Smashburger is Food & Beverage" on the studio's own site is a statement
 * about a client, and that needs someone to have decided it.
 *
 * Confirm or replace the two lists, and give each entry an href once /work
 * can filter. Nothing else here changes.
 * ───────────────────────────────────────────────────────────────────────── */
export const WORK_BY_INDUSTRY = [
  'Consumer & CPG',
  'Food & Beverage',
  'Crypto & Web3',
  'Health & Wellness',
  'Technology & SaaS',
  'Retail & Apparel',
]

export const WORK_BY_SIZE = [
  'Founder-led',
  'Seed to Series A',
  'Scale-up',
  'Enterprise',
]

/* PLATFORM. STILL A PROPOSAL — there is no platform in this repo, no route
 * for one, nothing in Sanity, and no part of the site a client logs into. A
 * nav item with six children is a claim to have built a thing; that claim is
 * currently untrue and every row below stays unlinked until it is not.
 *
 * REWRITTEN, though. The first six were Overview / Brand system / Asset
 * library / Requests / Reporting / Access — the shelves every SaaS nav has,
 * which described no studio in particular and gave a visitor no reason to
 * care. A platform is only worth a nav item if it does something this studio
 * does and others do not.
 *
 * So these are built on what the studio has actually already built, which is
 * a brand held as a system rather than as a deck:
 *
 *   Repo
 *              — THE STRUCTURE, NOT ITS CONTENTS. This is the correction
 *                worth keeping: the repository is not the strategy, the
 *                verbal, the visual and the agents. Those are what goes in
 *                it. The repository is what holds them so they can be found,
 *                versioned and actually used — which is the part nobody else
 *                sells, because everyone else hands over the contents and
 *                calls it done. Describing it by listing its folders sells a
 *                filing cabinet by naming the paper.
 *                SC-Brand is the working instance of it.
 *   Agents     — six brand-trained subagents exist today, and their defining
 *                property is the one worth selling: each refuses to invent
 *                the thing it would be most tempting to invent, and marks
 *                the gap instead.
 *   Reviews    — the sync CLI already works this way. A push opens a numbered
 *                review and writes nothing live; merging is a person's job.
 *   Guardrails — the same discipline as the '––' placeholders on this site:
 *                a claim without a source does not ship.
 *
 * Library and Measurement stay, because a brand system needs somewhere for
 * the output to live and some account of whether it worked — but they are the
 * two least differentiated of the six and the first to cut if this shortens.
 */
export const PLATFORM_PAGES = [
  { name: 'Repo', note: 'The structure that holds everything the brand is made of, and keeps it usable.' },
  { name: 'Agents', note: 'Trained on your brand. They draft in your voice and refuse to invent claims.' },
  { name: 'Memory', note: 'What was decided, what shipped, and why — so nothing is reinvented twice.' },
  { name: 'Reviews', note: 'Every change is proposed, and a person approves it.' },
  { name: 'Library', note: 'Every asset we have made, in use and findable.' },
  { name: 'Measurement', note: 'What shipped, and what it moved.' },
]

/* Company's panel, in three columns.
 *
 * Every destination here is real and every one resolves. What the reference
 * has that this does not:
 *
 *   Open roles — no route. Sanity has an openRole schema and a careersPage,
 *                but nothing renders them; careers live on /about-us, which
 *                Careers already points at. A second link to the same page
 *                under a different name is not a second destination.
 *   Blog       — this site calls it Thoughts, and that is what the nav card,
 *                the footer and the route all say. Renaming it in one menu
 *                would be the only place on the site that called it a blog.
 *   Press      — no page, nothing to put on one.
 *   YouTube    — the studio has Instagram and LinkedIn. Those two are in
 *                Nav.jsx and in the homepage's schema.org sameAs; there is no
 *                YouTube account anywhere in the repo to link to.
 */
export const COMPANY_COLS = [
  {
    tag: 'Our company',
    links: [
      { label: 'About', href: '/about-us', Icon: Users },
      // Careers is not its own route on this branch — the About page carries
      // it, which is where Nav.jsx sends Careers too.
      { label: 'Careers', href: '/about-us', Icon: Briefcase },
      { label: 'Thoughts', href: '/thoughts', Icon: PenLine },
    ],
  },
  {
    tag: 'Get in touch',
    links: [
      { label: 'Contact', href: '/contact', Icon: Mail },
    ],
  },
  {
    tag: 'Socials',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/_super_conscious/', Icon: ArrowUpRight, external: true },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/company/super-conscious/', Icon: ArrowUpRight, external: true },
    ],
  },
]

/* ── The canvas's copy ─────────────────────────────────────────────────── */

/* The hero. Carries the h1, which is why the statement below it is an h2 —
   the live homepage has that the other way round because it has no headline
   above the statement. */
export const HERO_EYEBROW = '[ Creative + Marketing, One Embedded Team ]'
/* Warmer than "We're Super-Conscious. We build and grow brands.", which
   introduced the studio and then described the transaction. This keeps the
   build/grow structure — it is the whole offer, and the two cards below run
   on it — but puts the reason first: belief, then reach. "Impossible to
   ignore" is not a flourish either; it is the underdog case this page
   already makes further down, in the brand "in a crowded category that needs
   to stand out". */
/* WRITTEN, NOT SOURCED — a proposal, like the Support and Represent lines.
 *
 * On the shape of Air's "Air keeps track. So you keep creating.", not its
 * words: an eyebrow that names the category, then two beats — what we do,
 * then what that frees the reader to do. The turn is the whole line; the
 * second beat has to be about them or the sentence is just a boast with a
 * conjunction in it.
 *
 * Both halves are the site's own: Build says "we make your brand and its
 * assets", Grow says "we take that brand to market and run it". Run it is
 * their word, not a new claim.
 *
 * NO SUPPORTING LINE. The hero is the eyebrow, the headline and the actions.
 * The line that was here explained the offer before anyone had asked; the
 * headline says it in two beats and the Who we are block further down says
 * it in full. Saying it three times was the problem.
 *
 * NOTE — THIS IS A DIFFERENT MOVE FROM THE LAST ONE. The previous headline
 * stated the problem ("Your brand is stitched together from vendors who never
 * meet."), which made the reader recognise something before we claimed
 * anything. This one leads with what we do and pays it off with what they
 * get. Both are in the history; neither is more correct, and which one is
 * right depends on whether the page is for people who already know they have
 * the problem. */
export const HERO = "We build the brand and run it. So you can run the business."

/* THE FOUR SERVICES, as cards.
 *
 * Build and Grow were two large cards carrying film. It is four now, at a
 * smaller size, and none of them carries artwork: four films on one row is a
 * lot of motion in a section whose job is to be read, and the two new
 * services have no artwork of their own — two cards with film and two without
 * would read as two finished and two unfinished.
 *
 * NO PRICES AND NO CTAS. The two that had them now match the two that never
 * could: Support and Represent have no rate anybody has set and no page to link
 * to, so a row where half the cards quoted a number and offered a way in read
 * as two real services beside two placeholders. The rates are still on
 * /services, which the nav's Pricing item now points at.
 *
 * The footnote — 'Most clients do both, but you can start wherever you are' —
 * goes with them. It was written about two services; with four it is no
 * longer true as stated.
 *
 * The lines are one clause each. At four across, a card is roughly a quarter
 * of the row and the long Build and Grow bodies — which listed everything in
 * the service after a colon — filled it top to bottom and turned four cards
 * into four paragraphs. The list belongs on /services; the card only has to
 * say what the service is.
 *
 * Support and Represent are STILL UNDEFINED. Their lines were written to fill
 * this out and have not been signed off; both are also unlinked, because
 * neither has a page. Same standing note as the nav panel they share.
 */
export const OFFER = [
  {
    id: 'build',
    name: 'Build',
    /* Names the brand platform, which is a real service — 'Brand platform'
       is one of the named services in serviceConstants, alongside brand
       strategy, brand sprint, brand refresh and brand system. It is the
       strategy deliverable, not the software one in the Platform section
       below; the two share a word and are not the same thing, which is worth
       watching if this page ever says both out loud in the same breath.

       40 characters, dropping the 'its'. Measured rather than guessed: the
       card body box is 294px and wraps past about 41 characters — Grow sits
       on one line at 40, this was 44 and ran to two. */
    body: 'We build your brand platform and assets.',
    price: null,
    cta: null,
    href: '/services/build',
  },
  {
    id: 'grow',
    name: 'Grow',
    body: 'We take that brand to market and run it.',
    price: null,
    cta: null,
    href: '/services/grow',
  },
  {
    id: 'support',
    name: 'Support',
    body: 'We look after what is live.',
    price: null,
    cta: null,
    href: '/services/support',
  },
  {
    id: 'represent',
    name: 'Represent',
    /* Shortened to fit one line rather than forced onto one with nowrap: at a
       quarter of the row the card is about 285px inside its padding, and 41
       characters at this size does not fit. nowrap would have made it fit by
       letting it overflow the card instead. This is 33, which is the length
       Build already sets on one line.
       
       Still unsigned-off copy either way — see the note above. */
    body: 'We speak for the brand in public.',
    price: null,
    cta: null,
    href: '/services/represent',
  },
]

/* The Services nav panel's rows, derived from OFFER so the menu and the cards
   cannot say different things about the same four services.
 *
 * IT WAS DELETED BY ACCIDENT. Restructuring OFFER from two cards to four cut
 * from the comment above it to the constant below, and this sat in between.
 * Nothing failed at build time and nothing failed on load: the panel only
 * renders on hover, so the ReferenceError was waiting for the first person to
 * point at SERVICES. Derived rather than retyped, which is also why it is
 * cheap to restore correctly. */
export const SERVICE_ROWS = OFFER.map(({ name, body, href }) => ({ name, note: body, href }))

/* The footer's columns, built from the same constants the nav bar renders
   from, so the two cannot disagree. Anything without an href renders as
   text rather than as a link to the nearest page that happens to exist —
   the nav panels already behave this way. */
export const FOOTER_COLS = [
  { tag: 'Platform', links: PLATFORM_PAGES.map(({ name }) => ({ label: name })) },
  {
    tag: 'Services',
    links: [
      ...SERVICE_ROWS.map(({ name, href }) => ({ label: name, href })),
      // The nav's own Pricing item, and its destination, unchanged.
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    tag: 'Case studies',
    links: [
      { label: 'All case studies', href: '/work' },
      ...WORK_BY_INDUSTRY.map(label => ({ label })),
    ],
  },
  { tag: 'By company size', links: WORK_BY_SIZE.map(label => ({ label })) },
  ...COMPANY_COLS.map(({ tag, links }) => ({
    tag,
    links: links.map(({ label, href, external }) => ({ label, href, external })),
  })),
]

export default function V3Nav() {
  const cal = useCalDrawer()
  const [openMenu, setOpenMenu] = useState(null)
  /* CLOSING IS DELAYED; OPENING IS NOT.

     Leaving the bar used to close the panel on the same frame, which made the
     panel awkward in the ordinary case: the cursor travels diagonally from a
     link toward the item it is aiming at, and that path leaves the trigger
     before it reaches the panel. The panel is a DOM child of the shell, so
     moving INTO it is not a leave at all — but there was a 6px gap between
     the two where the cursor is over neither, and that fired the close.

     The gap is bridged in CSS as well. This grace period is the part that
     matters, because it also covers a path that swings wide of the panel
     before coming back to it. 260ms is long enough to cross the gap and
     short enough that a panel never feels stuck open. */
  const closeTimer = useRef(null)
  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }
  const openPanel = (panel) => {
    cancelClose()
    setOpenMenu(panel ?? null)
  }
  const closeSoon = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpenMenu(null), 260)
  }
  useEffect(() => cancelClose, [])
  /* Small screens only. The panels open on hover, which a touch screen does
     not have, so below the breakpoint the bar collapses to one button and a
     list — the whole navigation on a phone rather than a convenience. */
  const [menuOpen, setMenuOpen] = useState(false)

  return (
        <section className={`${styles.row12} ${styles.introRow} ${v3.topBar}`}>
          <div
            className={v3.navShell}
            style={{ gridColumn: '1 / span 12' }}
            onMouseLeave={closeSoon}
            onMouseEnter={cancelClose}
          >
            <div className={`${styles.cornerNote} ${v3.barCard}`}>
              {/* Back to the v3 homepage, not the live one — every page carrying this
                bar belongs to that family, and a wordmark that jumps to a
                different design of the same site is a dead end dressed as a
                home button. */}
            <NavLink to="/v3" className={styles.cornerWordmark} aria-label="Super Conscious, home">
                <LogoWordmark fill="rgba(255,255,255,0.7)" />
              </NavLink>

              <nav className={v3.navLinks} aria-label="Main">
                {NAV_LINKS.map(({ label, href, panel }) => {
                  const open = panel && openMenu === panel
                  const inner = (
                    <>
                      {label}
                      {panel && <span className={`${v3.chev}${open ? ' ' + v3.chevOpen : ''}`} aria-hidden="true" />}
                    </>
                  )
                  const shared = {
                    className: `${v3.navLink}${open ? ' ' + v3.navLinkOpen : ''}`,
                    onMouseEnter: () => openPanel(panel),
                    onFocus: () => openPanel(panel),
                  }
                  return href
                    ? <NavLink key={label} to={href} {...shared} aria-expanded={panel ? open : undefined}>{inner}</NavLink>
                    : <span key={label} {...shared}>{inner}</span>
                })}
              </nav>

              {/* THE SMALL-SCREEN MENU BUTTON. Below 860px the link row is
                  display: none, and until now nothing replaced it — Services,
                  Case Studies, Company and Pricing were simply unreachable from
                  this page on a phone. A wordmark and a Book a demo button is
                  not navigation. */}
              <button
                type="button"
                className={v3.navToggle}
                aria-expanded={menuOpen}
                aria-controls="v3-mobile-nav"
                onClick={() => setMenuOpen(o => !o)}
              >
                <span className={v3.srOnly}>{menuOpen ? 'Close menu' : 'Open menu'}</span>
                <span className={v3.burger} aria-hidden="true" />
              </button>

              <div className={v3.navActions}>
                {/* Log in, as in the reference: a quiet text link beside the
                    filled CTA.

                    IT DOES NOT GO ANYWHERE, because there is nowhere for it to
                    go. This site has no accounts and no auth route — the only
                    credential-protected thing on it is DeckGate, a single
                    shared password ('sc-preview') in front of the deck pages,
                    which is a preview gate rather than a login. Pointing this
                    at that would hand a visitor a password prompt for something
                    they did not ask for.

                    So it renders unlinked and dim, the same treatment Platform
                    and Pricing get. Give it an href when there is a client area
                    to log in to. */}
                <span className={`${v3.navLink} ${v3.navLinkFlat}`} onMouseEnter={() => openPanel(null)}>Log in</span>
                <button className={v3.navCta} onClick={cal.open} onMouseEnter={() => openPanel(null)}>Book a demo</button>
              </div>
            </div>

            {openMenu === 'services' && (
              /* Statement on the left, numbered services on the right, as in the
                 reference. The promo card comes off this panel: the reference
                 has no room for one, and the left column is doing that job. */
              <div className={`${v3.panel} ${v3.panelService}`}>
                <div className={v3.svcIntro}>
                  <p className={v3.panelTag}>[ The Service ]</p>
                  {/* The site's own descriptor for Services — the wording the
                      nav card uses on / and /v2. Not a new claim written for a
                      menu. */}
                  <p className={v3.svcStatement}>Build the brand, then grow it.</p>
                  <NavLink to="/contact" className={v3.svcIntroCta}>Talk to us →</NavLink>
                </div>

                <div className={v3.svcGrid}>
                  {SERVICE_ROWS.map(({ name, note, href }, i) => {
                    const inner = (
                      <>
                        <span className={v3.svcNum}>{String(i + 1).padStart(2, '0')}</span>
                        <span className={v3.svcBody}>
                          <span className={v3.svcName}>{name}</span>
                          {note
                            ? <span className={v3.svcNote}>{note}</span>
                            /* Dev only — a gap to be filled, never shipped. */
                            : import.meta.env.DEV && <span className={v3.svcNoteMissing}>[ line needed ]</span>}
                        </span>
                      </>
                    )
                    return href
                      ? <NavLink key={name} to={href} className={v3.svcRow}>{inner}</NavLink>
                      /* No page yet, so no link and no hover — the treatment
                         the client strip and the featured set already use. */
                      : <span key={name} className={`${v3.svcRow} ${v3.svcRowFlat}`}>{inner}</span>
                  })}
                </div>
              </div>
            )}

            {openMenu === 'platform' && (
              <div className={`${v3.panel} ${v3.panelService}`}>
                <div className={v3.svcIntro}>
                  <p className={v3.panelTag}>[ The Platform ]</p>
                  <p className={v3.svcStatement}>One place to run the brand.</p>
                  {/* Unlinked, like everything else in this panel. */}
                  <span className={`${v3.svcIntroCta} ${v3.svcIntroCtaFlat}`}>Coming soon</span>
                </div>

                <div className={v3.svcGrid}>
                  {PLATFORM_PAGES.map(({ name, note }, i) => (
                    <span key={name} className={`${v3.svcRow} ${v3.svcRowFlat}`}>
                      <span className={v3.svcNum}>{String(i + 1).padStart(2, '0')}</span>
                      <span className={v3.svcBody}>
                        <span className={v3.svcName}>{name}</span>
                        <span className={v3.svcNote}>{note}</span>
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {openMenu === 'company' && (
              <div className={`${v3.panel} ${v3.panelCompany}`}>
                {COMPANY_COLS.map(({ tag, links }) => (
                  <div key={tag} className={v3.coCol}>
                    <p className={v3.panelTag}>{tag}</p>
                    {links.map(({ label, href, Icon, external }) => {
                      const inner = (
                        <>
                          <span className={v3.coIcon} aria-hidden="true"><Icon size={14} strokeWidth={1.5} /></span>
                          <span className={v3.coLabel}>{label}</span>
                        </>
                      )
                      return external
                        ? <a key={label} href={href} target="_blank" rel="noreferrer" className={v3.coLink}>{inner}</a>
                        : <NavLink key={label} to={href} className={v3.coLink}>{inner}</NavLink>
                    })}
                  </div>
                ))}
              </div>
            )}

            {openMenu === 'work' && (
              <div className={`${v3.panel} ${v3.panelService}`}>
                <div className={v3.svcIntro}>
                  <p className={v3.panelTag}>[ Proof ]</p>
                  {/* The site's own descriptor for Work — the line the nav card
                      already uses — rather than a headline written for a menu. */}
                  <p className={v3.svcStatement}>Selected case studies.</p>
                  <NavLink to="/work" className={v3.svcIntroCta}>View all case studies →</NavLink>
                </div>

                <div className={v3.proofBody}>
                  {/* THE NUMBERS ARE ABSENT ON PURPOSE. featuredCaseStudies
                      carries '––' for every stat and says in its own header not
                      to ship invented ones: there is no source for these
                      anywhere in the repo or in Sanity. The layout is real and
                      the figures are visibly missing, which is the same thing
                      the featured section further down this page does. */}
                  <div className={v3.statCards}>
                    {featuredCaseStudies.slice(0, 3).map(({ slug, name, stats }, i) => {
                      /* A different measure per card. Taking stats[0] for all
                         three printed "Audience growth" three times, which
                         reads as one metric repeated rather than as three
                         things the work moved. The set is the same across every
                         case study, so the index is what varies. */
                      const stat = stats[i] ?? stats[0]
                      return (
                        <div key={slug} className={v3.statCard}>
                          <p className={v3.statValue}>{stat.value}</p>
                          <p className={v3.statNote}>{stat.label}</p>
                          <p className={v3.statClient}>{name}</p>
                        </div>
                      )
                    })}
                  </div>

                  <div className={v3.proofCols}>
                    <div className={v3.proofCol}>
                      <p className={v3.panelTag}>By industry</p>
                      {WORK_BY_INDUSTRY.map(i => (
                        /* /work cannot filter yet, so every one of these lands
                           on the wall. Unlinked would be worse here than
                           repetitive: these are categories a visitor is meant
                           to browse, and the wall is the honest answer to all
                           of them until the filters exist. */
                        <NavLink key={i} to="/work" className={v3.proofLink}>{i}</NavLink>
                      ))}
                    </div>
                    <div className={`${v3.proofCol} ${v3.proofColRuled}`}>
                      <p className={v3.panelTag}>By company size</p>
                      {WORK_BY_SIZE.map(s => (
                        <NavLink key={s} to="/work" className={v3.proofLink}>{s}</NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {menuOpen && (
              <div className={v3.mobileNav} id="v3-mobile-nav">
                {NAV_LINKS.map(({ label, href }) => (
                  href
                    ? (
                      <NavLink
                        key={label}
                        to={href}
                        className={v3.mobileLink}
                        onClick={() => setMenuOpen(false)}
                      >
                        {label}
                      </NavLink>
                    )
                    /* Platform has no route on the wide bar either — it opens a
                       panel there, and there is no page behind it. Rendered as
                       text rather than as a link to nowhere, the same way the
                       footer treats every entry without a destination. */
                    : <span key={label} className={v3.mobileText}>{label}</span>
                ))}
              </div>
            )}
          </div>
        </section>
  )
}

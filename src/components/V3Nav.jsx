import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Users, Briefcase, PenLine, Mail, ArrowUpRight,
  FolderGit2, Bot, BookMarked, CheckCheck, LayoutGrid, ChartNoAxesColumn,
  Hammer, Sprout,
} from 'lucide-react'

import styles from '../pages/Home.module.css'
import v3 from '../pages/HomeV3.module.css'
/* The twelve disciplines, from the Services page's own COPY — the same
   export DepartmentPanel renders. Services does not import this file, so
   there is no cycle. */
import { DISCIPLINES } from '../pages/Services'
import { disciplineSlug } from '../lib/disciplineSlug'
import { industries } from '../data/industries'
import { outcomes as outcomeRecords } from '../data/outcomes'
import { stages } from '../data/stages'
import LogoWordmark from './LogoWordmark'
import { useCalDrawer } from '../context/CalDrawerContext'
import { featuredCaseStudies } from '../data/featuredCaseStudies'

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
/* SUPERSEDED. This described four labels combined down from six, and
   assigned clients to them in prose — Google and Offchain to technology, Big
   Buoy to food and beverage. None of that was ever in data, and some of it
   disagrees with the mapping that now is: Big Buoy is tagged technology on
   the evidence of its own descriptor. The list and the assignments both live
   in src/data/industries.js, which quotes the evidence for each.

   THIS DRIVES TWO SURFACES — the Case Studies menu in this nav and the "By
   industry" view on /services/build — so both follow that file. */
/* THE FOUR LABELS ARE GONE, replaced by the industries that have work behind
   them — see src/data/industries.js, which is also where the client mapping
   lives. These used to be four strings with no data under them, and every
   one linked at /work because there was nothing to link to. */
export const WORK_BY_INDUSTRY = industries.map(({ name, slug }) => ({
  label: name,
  href: `/industries/${slug}`,
}))

/* STAGE, NOT SIZE. Founder-led, Seed to Series A, Scale-up and Enterprise
   describe where a company is in its life, which is what a visitor is
   actually placing themselves against — headcount is a different question and
   these were never answering it. */
/* THE FOUR STAGES, LINKED WHERE THERE IS A PAGE. Only the ones written up in
   stages.js get an href; the rest render as text, the same way the footer and
   the nav already treat any entry without a destination. Add a record there
   and the link appears in both places without touching this list.

   The labels stay here rather than moving into stages.js: they are the
   site's vocabulary for company size, used by the nav and the footer whether
   or not a page exists behind each one. */
export const WORK_BY_STAGE = [
  'Founder-led',
  'Seed to Series A',
  'Scale-up',
  'Enterprise',
].map((label) => {
  const written = stages.find((s) => s.name === label)
  return written ? { label, href: `/stages/${written.slug}` } : { label }
})

/* The Platform menu, its six pages and the argument for them were removed
   when the platform was cut from this site. It is its own product now and
   lives in its own repository; a studio site carrying a nav for something it
   does not sell was the thing to fix. See git history for what was here. */

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
      /* About has its own page now. Careers keeps /about-us, which is what
         that page actually is — what it is like to work here, the realities,
         the open roles and the freelancer signup. */
      { label: 'About', href: '/studio', Icon: Users },
      /* The twelve disciplines, on their own page. It sat under Services as
         the panel's "View all" line; it is a page about the studio rather
         than a service, so it lives with About. */
      { label: 'Disciplines', href: '/disciplines', Icon: LayoutGrid },
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
/* THE PLAINEST VERSION, and Chris's call.
 *
 * The history is worth keeping because this line has been round the houses.
 * It has been the problem stated back ("Your brand is stitched together from
 * vendors who never meet."), then a two-beat turn on the shape of Air's "Air
 * keeps track. So you keep creating." — "We build the brand and run it. So
 * you can run the business." Both are in git.
 *
 * This keeps the two-beat turn but names the offer plainly in the first
 * beat: what we do, then what it frees them to do. "Focus on" rather than
 * "run" — they are running the business either way; what they get back is
 * their attention.
 *
 * Both halves are still the site's own: Build "makes your brand and its
 * assets", Grow "takes that brand to market and runs it".
 *
 * NO SUPPORTING LINE. The hero is the eyebrow and the headline. */
/* Chris's line, 2026-09-02, replacing "We build and grow brands. So you
   can focus on the business." It is the positioning statement itself — the
   same sentence the Services panel opens with — so the first thing on the
   site and the first thing in the menu agree. */
export const HERO = 'Your fractional creative and marketing department.'

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
    Icon: Hammer,
    name: 'Build',
    /* Names the brand platform, which is a real service — 'Brand platform'
       is one of the named services in serviceConstants, alongside brand
       strategy, brand sprint, brand refresh and brand system. It is the
       strategy deliverable. It used to collide with the software product of
       the same name in the Platform menu; that menu is gone, so the word is
       unambiguous here again.

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
    Icon: Sprout,
    name: 'Grow',
    body: 'We take that brand to market and run it.',
    price: null,
    cta: null,
    href: '/services/grow',
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
export const SERVICE_ROWS = OFFER.map(({ name, body, href, Icon }) => ({ name, note: body, href, Icon }))

/* The footer's columns, built from the same constants the nav bar renders
   from, so the two cannot disagree. Anything without an href renders as
   text rather than as a link to the nearest page that happens to exist —
   the nav panels already behave this way. */
/* OUTCOMES, WHICH IS WHAT THEY ALREADY WERE. The column was headed "Use
   cases" and every entry under it is a result somebody wants — more leads, a
   better win rate, a shorter cycle. A use case is a way of using the thing;
   these are reasons for buying it, so the heading now says so.

   The list itself does not change. Nor does what it claims: these are the
   outcomes clients come for, not outcomes we have published evidence of
   producing — proof-points.md grades that kind of statement, and nothing here
   attaches a figure to any of them. */
const OUTCOMES = [
  'Get more leads',
  'Improve your win rate',
  'Shorten the sales cycle',
  'Lower cost per acquisition',
  'Launch faster',
  'Enter a new market',
].map((label) => {
  const written = outcomeRecords.find((o) => o.name === label)
  return written ? { label, href: `/outcomes/${written.slug}` } : { label }
})

export const FOOTER_COLS = [
  {
    tag: 'Services',
    links: [
      ...SERVICE_ROWS.map(({ name, href }) => ({ label: name, href })),
      // The nav's own Pricing item, and its destination, unchanged.
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  /* After Services, because an outcome is a way into the same four. */
  { tag: 'By outcome', row: 2, links: OUTCOMES },
  /* WHAT IS ACTUALLY IN THE DEPARTMENT. Services and By outcome both say what
     you buy; this says what the studio can do, which is the one thing the
     footer never listed. Read from Services' COPY rather than retyped, so
     renaming a discipline changes it on /services, in DepartmentPanel and
     here at once.

     LINKED, since 2026-09-02: every discipline has a page at
     /disciplines/<slug>, so the footer's rule — an entry with nowhere to go
     is text — now puts a link on each. Before that they were text. */
  /* LINKED NOW (2026-09-02): every discipline has a page at
     /disciplines/<slug>, and the slug is derived from the name the same way
     the pages are, so a rename on /services moves the link with it. The
     "no links" rule above held while there were no pages. */
  { tag: 'Disciplines', row: 2, links: DISCIPLINES.map(({ name }) => ({ label: name, href: `/disciplines/${disciplineSlug(name)}` })) },
  {
    tag: 'Case studies',
    links: [
      { label: 'All case studies', href: '/work' },
      ...WORK_BY_INDUSTRY,
    ],
  },
  { tag: 'By company stage', links: WORK_BY_STAGE },
  /* ALL THREE COMPANY COLUMNS SIT ON THE BOTTOM ROW, beside Legal. It was
     only Socials down there; Our company and Get in touch were in the top row
     with the service and work links, which put four short columns of
     wayfinding beside two long ones. Everything about the company is in one
     band now, and the top row is what the site sells. */
  ...COMPANY_COLS.map(({ tag, links }) => ({
    tag,
    row: 3,
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

  const barRef = useRef(null)
  const [barHeight, setBarHeight] = useState(0)
  const [scrolledUp, setScrolledUp] = useState(true)

  useEffect(() => {
    const el = barRef.current
    if (!el) return
    const measure = () => setBarHeight(el.offsetHeight)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* One read per frame, and state only set when the answer changes — a
     scroll listener that sets state per event is a re-render per frame for
     nothing. */
  useEffect(() => {
    let frame = 0
    let last = window.scrollY
    let shown = true

    const read = () => {
      frame = 0
      const y = window.scrollY
      /* Ignore the wobble: a couple of pixels either way is not a direction,
         and without this the bar flickers on any small jitter. */
      if (Math.abs(y - last) < 6) return
      const next = y < last || y < 80
      last = y
      if (next !== shown) { shown = next; setScrolledUp(next) }
    }

    const onScroll = () => { if (!frame) frame = requestAnimationFrame(read) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  /* Shown when scrolling up, at the top of the page, or while a panel is
     open — a menu hanging off a bar that has just slid away is the one state
     that would look broken. */
  const navShown = scrolledUp || Boolean(openMenu)

  /* Small screens only. The panels open on hover, which a touch screen does
     not have, so below the breakpoint the bar collapses to one button and a
     list — the whole navigation on a phone rather than a convenience. */
  const [menuOpen, setMenuOpen] = useState(false)

  /* ESCAPE CLOSES IT. The toggle is reachable again, but a menu that covers
     most of a phone screen should not need the right pixel to get out of —
     and this is the one thing a keyboard user has. */
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  return (
        <section className={`${styles.row12} ${styles.introRow} ${v3.topBar}`}>
          <div
            ref={barRef}
            className={`${v3.navShell} ${v3.navFloat}${navShown ? '' : ' ' + v3.navHidden}`}
            style={{
              gridColumn: '1 / span 12',
              /* Holds the space the fixed bar leaves. */
              ...(barHeight ? { minHeight: barHeight } : null),
              /* And tells the panel how far down to start. */
              ...(barHeight ? { '--bar-h': `${barHeight}px` } : null),
            }}
            onMouseLeave={closeSoon}
            onMouseEnter={cancelClose}
          >
            <div className={`${styles.cornerNote} ${v3.barCard}`}>
              {/* Back to the v3 homepage, not the live one — every page carrying this
                bar belongs to that family, and a wordmark that jumps to a
                different design of the same site is a dead end dressed as a
                home button. */}
            <NavLink to="/" className={styles.cornerWordmark} aria-label="Super Conscious, home">
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
                  /* A panel makes it a heading; without one it is a link. */
                  return href && !panel
                    ? <NavLink key={label} to={href} {...shared}>{inner}</NavLink>
                    : <span key={label} {...shared} aria-expanded={panel ? open : undefined}>{inner}</span>
                })}
              </nav>

              {/* THE SMALL-SCREEN MENU BUTTON. Below 860px the link row is
                  display: none, and until now nothing replaced it — Services,
                  Case Studies, Company and Pricing were simply unreachable from
                  this page on a phone. A wordmark and a Start a project button is
                  not navigation. */}
              <button
                type="button"
                className={v3.navToggle}
                aria-expanded={menuOpen}
                aria-controls="v3-mobile-nav"
                onClick={() => setMenuOpen(o => !o)}
              >
                <span className={v3.srOnly}>{menuOpen ? 'Close menu' : 'Open menu'}</span>
                <span
                  className={`${v3.burger}${menuOpen ? ' ' + v3.burgerOpen : ''}`}
                  aria-hidden="true"
                />
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
                <button className={v3.navCta} onClick={cal.open} onMouseEnter={() => openPanel(null)}>Start a project</button>
              </div>
            </div>

            {openMenu === 'services' && (
              /* Statement on the left, numbered services on the right, as in the
                 reference. The promo card comes off this panel: the reference
                 has no room for one, and the left column is doing that job. */
              <div className={`${v3.panel} ${v3.panelService}`}>
                <div className={v3.svcIntro}>
                  <p className={v3.panelTag}>[ The Service ]</p>
                  {/* Chris's line, already the headline of the "How we work"
                      section on both /services/build and /services/grow —
                      not a new claim written for a menu. It replaced "Build
                      the brand, then grow it.", which said what the two
                      services are and is still what the numbered rows on the
                      right of this panel say; this says what the studio is,
                      which is the thing the rows cannot.

                      THE OLD LINE IS STILL IN Nav.jsx, on the legacy nav's
                      Services card. The two navs now disagree. That one is not
                      on the v3 routes, so it is left alone rather than edited
                      blind — but it is the other place this sentence lives. */}
                  <p className={v3.svcStatement}>Your fractional creative and marketing department.</p>
                  {/* A button, not a link: the ask is the booking, the same
                      drawer the bar's own button opens. The disciplines page
                      this line used to point at is under Company now. */}
                  <button type="button" className={v3.svcIntroCta} onClick={() => { openPanel(null); cal.open() }}>Start a project →</button>
                </div>

                <div className={v3.svcGrid}>
                  {SERVICE_ROWS.map(({ name, note, href, Icon }) => {
                    const inner = (
                      <>
                        <span className={v3.svcIcon}>
                          {Icon && <Icon size={16} strokeWidth={1.5} aria-hidden="true" />}
                        </span>
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


            {openMenu === 'company' && (
              /* SAME SHAPE AS CASE STUDIES: a statement on the left, the
                 links on the right. It was columns alone, which made it the
                 one panel that opened without saying what it was — the other
                 two both lead with a tag, a line and a way in.

                 THE LINE IS WAYFINDING, NOT A CLAIM. There is no descriptor
                 for Company anywhere in the repo the way there is for
                 Services and Work, and inventing one would be inventing
                 positioning in a menu. This says what is behind the menu and
                 nothing more. */
              <div className={`${v3.panel} ${v3.panelService}`}>
                <div className={v3.svcIntro}>
                  <p className={v3.panelTag}>[ The Studio ]</p>
                  <p className={v3.svcStatement}>Who we are, and how to reach us.</p>
                  <NavLink to="/about-us" className={v3.svcIntroCta}>About the studio →</NavLink>
                </div>

                <div className={v3.coCols}>
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
                  {/* THE NUMBERS ARE INVENTED AND THE TAG SAYS SO. This
                      comment used to claim featuredCaseStudies carried '––'
                      for every stat. It does not, and has not for a while: it
                      carries +38%, +29% and 27% under OpenText, iScribe and
                      Arbitrum, and its own header says in capitals that those
                      values are invented, are not these clients' results, and
                      must not ship without the tag FeaturedWall renders.

                      This panel had no tag, so the menu was publishing
                      invented percentages attributed to named companies.
                      Replace the values with sourced figures and delete the
                      tag in the same change — see featuredCaseStudies.js. */}
                  <span className={`${v3.panelTag} ${v3.proofLinkFlat}`}>Placeholder figures</span>
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
                      {/* Each goes to its own page now. */}
                      {WORK_BY_INDUSTRY.map(({ label, href }) => (
                        <NavLink key={label} to={href} className={v3.proofLink}>{label}</NavLink>
                      ))}
                    </div>
                    <div className={`${v3.proofCol} ${v3.proofColRuled}`}>
                      <p className={v3.panelTag}>By company stage</p>
                      {WORK_BY_STAGE.map(({ label, href }) => (
                        href
                          ? <NavLink key={label} to={href} className={v3.proofLink}>{label}</NavLink>
                          /* No page yet — text rather than a link to the wall,
                             which is what every other undestined entry does. */
                          : <span key={label} className={`${v3.proofLink} ${v3.proofLinkFlat}`}>{label}</span>
                      ))}
                    </div>
                    {/* THE THIRD WAY IN. The footer has had these under "By
                        outcome" all along; the menu offered only industry and
                        stage, so somebody who knows what they want out of it
                        had nowhere to start. Unlinked, like the footer's copy
                        of the same list: there is no page per outcome, and
                        six more links to the wall is not depth. */}
                    <div className={`${v3.proofCol} ${v3.proofColRuled}`}>
                      <p className={v3.panelTag}>By outcome</p>
                      {OUTCOMES.map(({ label, href }) => (
                        href
                          ? <NavLink key={label} to={href} className={v3.proofLink}>{label}</NavLink>
                          : <span key={label} className={`${v3.proofLink} ${v3.proofLinkFlat}`}>{label}</span>
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

                {/* THE CTA MOVES IN HERE below the breakpoint. On the wide
                    bar it sits beside "Log in"; on a phone that pair was
                    191px of content in a 390px bar and ran off the right
                    edge. The bar is now the logo and the menu button, and
                    the one action worth keeping is the last thing in the
                    menu rather than a second thing competing with it.

                    LOG IN DOES NOT COME WITH IT. It is an unlinked span on
                    the wide bar too — there is no client area to log into —
                    so on a phone it is a word taking up room for nothing. */}
                <button
                  className={v3.mobileCta}
                  onClick={() => { setMenuOpen(false); cal.open() }}
                >
                  Start a project
                </button>
              </div>
            )}
          </div>
        </section>
  )
}

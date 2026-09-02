import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
/* lucide-react is already a dependency of this project, so the icons are a
   real stroke set at the hairline weight the bars are drawn with — not emoji
   tiles, which the reference uses and which this site has no vocabulary for.
   NOTE: lucide v1 dropped its brand icons; there is no Instagram, LinkedIn or
   YouTube glyph any more, so the socials take ArrowUpRight, which says the
   true thing about them — they leave the site. */
import { Users, Briefcase, PenLine, Mail, ArrowUpRight } from 'lucide-react'
import styles from './Home.module.css'
import v3 from './HomeV3.module.css'
import LogoWordmark from '../components/LogoWordmark'
import LazyVideo from '../components/LazyVideo'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { SITE_CONFIG_QUERY } from '../lib/queries'
import { buildDisciplines } from '../data/buildPackages'
import { growDisciplines } from '../data/growPackages'
import { featuredCaseStudies } from '../data/featuredCaseStudies'
import ContactCTA from '../components/ContactCTA'
import FooterCard from '../components/FooterCard'
import V3Nav, { FOOTER_COLS, HERO_EYEBROW, HERO } from '../components/V3Nav'
import DotNav from '../components/DotNav'
import V3Signoff from '../components/V3Signoff'
import TestimonialWall from '../components/TestimonialWall'
import FeaturedThoughts from '../components/FeaturedThoughts'
import WorkIndex from '../components/WorkIndex'
import StatementCard from '../components/StatementCard'

/**
 * Homepage v3 — a third direction, alongside / and /v2.
 *
 * IT STARTS AS AN EXACT COPY OF /v2, deliberately. A variant that begins from
 * a blank page cannot be compared with the one it is meant to be an
 * alternative to; starting from where v2 landed means every difference from
 * here is a decision rather than an accident of what got rebuilt.
 *
 * It has its OWN stylesheet — HomeV3.module.css, also a copy — so the two can
 * diverge without either one moving the other. The shared components they
 * both render (StatementCard, BuildGrowCards, AudienceCards,
 * FeaturedCaseStudies, ContactCTA) take their copy and
 * their variants as props, so v3 changes what it passes rather than what
 * they contain — which is what keeps / and /v2 untouched as this moves.
 *
 * noindex, and absent from the sitemap.
 */

let didLoad = false

/* The bar is the only navigation on this page, so it carries the site's
   actual routes rather than a shortened set. Every one of these resolves —
   see App.jsx. Careers is not a route of its own on this branch (the About
   page carries it), so it is not listed as though it were. */

const CLOSING = 'It might change your life. At minimum, we can answer your burning marketing questions.'

/* The Labelled wrapper is gone with the last section that used one. It put
   an eyebrow above a passage; every section left on this page — the hero,
   the work index, the comparison, the testimonials — renders its own. */

export default function HomeV3() {
  const cal = useCalDrawer()
  const { data: siteConfig } = useSanity(SITE_CONFIG_QUERY)
  // noindex: a messaging variant to look at, not a page to be found.
  /* The site's own title and path, now this is the homepage rather than a
     canvas beside it — and indexed, which the canvas was not. */
  useMeta({ title: 'Creative Studio for Brand, Content & Digital Products | Super Conscious', path: '/' })

  const [openMenu, setOpenMenu] = useState(null)
  /* Small screens only. The wide bar's panels open on hover, and a touch
     screen has no hover to open them with, so below the breakpoint the whole
     row collapses to one button and a list. */
  const [menuOpen, setMenuOpen] = useState(false)

  // Escape closes the nav panel as well as the reel — a hover panel with no
  // keyboard way out is a trap for anyone who opened it by tabbing into it.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpenMenu(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <main className={`${styles.main} ${v3.stack}`}>

      {/* The nav. It is the only navigation on the page — the side nav is
          gone — so it carries the routes, the booking CTA, and the panel. */}
      <V3Nav />

      {/* THE PAGE IS THE CASE STUDIES NOW.

          The hero stays and everything under it went: the email field it
          carried, the client wall, and the featured-work rail. That was three
          screens of claim before the page showed a single thing the studio
          had made. The claim now sits directly on top of the evidence.

          NO CAPTURE FIELD. The hero carried an email capture control; the
          nav's Start a project is the ask now, and the page's job above the fold
          is the sentence rather than a form. (Naming that component here in
          prose would re-enrol this file as one of its consumers — the style
          test discovers them by scanning for the name.) */}
      {/* THE HERO IS HERO, THE STRING. It used to be split into JSX so
          "build" and "grow" could link to the two service pages; the line
          is the positioning statement now (2026-09-02) and has no verbs to
          link. The nav above carries both services. */}
      <StatementCard
        eyebrow={HERO_EYEBROW}
        statement={HERO}
        support={null}
        as="h1"
        tall
        center
        display
        className={v3.heroHome}
      />

      {/* The whole roster, the same component /work renders — one source, so
          the two pages cannot drift. */}
      <WorkIndex controls={false} />


      {/* WHAT USED TO SIT BETWEEN THE WORK AND THE TESTIMONIALS, all cut:
          the Services cards (the hero's verbs and the nav both go to those
          two pages), the platform section (its own product now, its own
          repository), the Who we are long read, the reel, and the
          competitive-alternatives table — that one still runs on both
          service pages, where somebody is already weighing an option.

          The divider that opened the last of them went too. Two rules with a
          page gap and nothing between them is a blank band, which is what
          this was. */}

      {/* 9 — The ask */}
      <hr className={v3.divider} />

      {/* Carries its own label, so it is not wrapped. */}
      <TestimonialWall />

      <hr className={v3.divider} />

      {/* The newest three thoughts, after the people who worked with us and
          before the ask: the work, the word on it, the thinking, then the
          door. Carries its own label and heading, so it is not wrapped. */}
      <FeaturedThoughts />

      <hr className={v3.divider} />

      {/* No label and no card. This is the end of the page rather than another
          section of it: the headline says what it is, and a label above a
          closing line reads as filing it under something.

          No capture fields either — the page asks for the booking instead of
          running a form and a button at the same visitor. The form and the
          card both still run on / and /v2. */}
      <ContactCTA sub={CLOSING} form={false} bare>
        {/* The nav carries this too. It asks for the thing the page is for
            rather than a demo — there is no product to demo on a page that
            is now the work. */}
        <button className={v3.contactCta} onClick={cal.open}>Start a project</button>
      </ContactCTA>

      {/* The site's routes, grouped, between the ask and the sign-off. It
          goes after the CTA because the CTA is the one thing this page wants;
          a wall of links above it would give a reader somewhere else to go
          at the exact moment they were being asked to book. */}
      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />

      {/* A fixed overlay, so it sits at the end of the document rather than
          in the flow — and after the sign-off, so the last thing in the
          source order is the last thing on the page.

          THE PLATFORM PROMO CARD THAT SAT BESIDE IT IS GONE (2026-09-02). It
          was a fixed card in the bottom-right corner pitching the platform,
          which is its own product in its own repository now; the homepage
          already ends on the one ask it wants. The component still exists
          for any page that has a reason to use it. */}
      <DotNav />

    </main>
  )
}

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
import PromoCard from '../components/PromoCard'
import DotNav from '../components/DotNav'
import V3Signoff from '../components/V3Signoff'
import TestimonialWall from '../components/TestimonialWall'
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
  useMeta({ title: 'Super Conscious — homepage v3', path: '/v3', noindex: true })

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
      {/* THE TWO VERBS ARE THE TWO SERVICES, so they are the links to them.
          HERO in V3Nav stays the plain string — it is the source of the words
          and anything needing the sentence as text still has it — but the
          rendered version splits it so "build" and "grow" go where they say.
          They are also the only navigation above the fold now the capture
          field is gone. */}
      <StatementCard
        eyebrow={HERO_EYEBROW}
        statement={
          <>
            We <NavLink className={v3.heroLink} to="/services/build">build</NavLink>
            {' '}and{' '}
            <NavLink className={v3.heroLink} to="/services/grow">grow</NavLink> brands.
            <br />So you can focus on the business.
          </>
        }
        support={null}
        as="h1"
        tall
        center
        display
      />

      {/* The whole roster, the same component /work renders — one source, so
          the two pages cannot drift. */}
      <WorkIndex />


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

      {/* Both are fixed overlays, so they sit at the end of the document
          rather than in the flow — and after the sign-off, so the last thing
          in the source order is the last thing on the page. */}
      <DotNav />
      <PromoCard onBook={cal.open} />

    </main>
  )
}

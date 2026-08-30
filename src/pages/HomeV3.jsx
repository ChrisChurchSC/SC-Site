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
import TrustMosaic from '../components/TrustMosaic'
import ContactCTA from '../components/ContactCTA'
import EmailCaptureForm from '../components/EmailCaptureForm'
import FooterCard from '../components/FooterCard'
import V3Nav, { OFFER, FOOTER_COLS, HERO_EYEBROW, HERO } from '../components/V3Nav'
import PromoCard from '../components/PromoCard'
import DotNav from '../components/DotNav'
import V3Signoff from '../components/V3Signoff'
import TestimonialWall from '../components/TestimonialWall'
import StatementCard from '../components/StatementCard'
import BuildGrowCards from '../components/BuildGrowCards'
import ComparisonTable from '../components/ComparisonTable'
import PlatformCards from '../components/PlatformCards'
import FeaturedWall from '../components/FeaturedWall'

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

/**
 * A section and the label that names it. Every passage on this page carries
 * one, so the page can be read by its labels alone.
 *
 * StatementCard and AudienceCards render their own eyebrow — they already
 * had one — so they are NOT wrapped in this; wrapping them would print two.
 */
function Labelled({ label, children, center = false }) {
  return (
    <div className={`${v3.labelled}${center ? ' ' + v3.labelledCenter : ''}`}>
      <p className={v3.eyebrow}>{label}</p>
      {children}
    </div>
  )
}

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

      {/* 1 — The canvas leads on the claim, not the reel */}
      <StatementCard
        eyebrow={HERO_EYEBROW}
        statement={HERO}
        support={null}
        as="h1"
        tall
        center
        display
      >
        <div className={v3.heroActions}>
          {/* AN EMAIL FIELD, NOT TWO BUTTONS. "Book a demo" and "See our
              work" asked a first-time visitor to pick, and the second option
              is the one that does not generate a lead. One field asks for
              one thing.

              It reuses EmailCaptureForm rather than posting on its own: there
              is a single submission path through submitLead.js, and a test
              holds every host to defining the six classes the compact variant
              renders — a page that defines only some of them ships a bare
              white box on a dark background, which is exactly what happened
              on /about-us once.

              NO INCENTIVE. The reference for this pattern offers $150 for
              taking a demo; we are not paying that, so the button asks for
              the demo on its own terms. */}
          <EmailCaptureForm
            styles={v3}
            variant="compact"
            placeholder="What's your work email?"
            submitLabel="Book a demo"
            subject="Homepage v3 — demo request"
            requestType="v3-hero-demo"
            confirmMessage="Thanks — we will send over a couple of times to talk."
          />
          {/* Operational promise, deliberately minimal: it says what the form
              does and nothing about how fast anyone replies. Anything about
              response time is comms-writer's to write and Chris's to keep. */}
          <p className={v3.heroFormNote}>We'll follow up by email.</p>
        </div>
      </StatementCard>

      {/* 2 — Who we have done it for */}
      {/* Closes the hero. The page's other sections are divided by the rule
          on the bare Who we are block; the hero had nothing under it, so it
          ran straight into the wall. Same hairline, same full width. */}
      <hr className={v3.divider} />

      {/* The client wall, at the top where the proof belongs.

          It replaces the card bar that used to sit here. That bar was the
          same twenty names this wall shows, and printing the client list
          twice on one page halves what either instance is worth — the bar
          scrolled them past you, the wall lets you read them. */}
      <TrustMosaic />

      {/* 3 — The offer, in two halves, with the price lines */}
      <hr className={v3.divider} />

      <Labelled label="[ Services ]" center><BuildGrowCards cards={OFFER} compact /></Labelled>

      {/* The platform, after the offer it supports and before the longer
          read about who we are. Card layout only — the previews are empty
          wells; see PlatformCards. */}
      <hr className={v3.divider} />

      <PlatformCards />

      {/* Who we are is cut. It was the page's one long read — a headline and
          three paragraphs — and everything around it had become short: four
          service cards of a clause each, a wall of names, cards with no copy
          in them yet. It had stopped matching the page it was on. The full
          version still runs on / and /v2. */}

      {/* 5 — Who it is for. The one section the live page has no version of */}
      <hr className={v3.divider} />

      {/* Replaces Who we work with. That section sorted the audience by what
          kind of brand they are; this one answers the question they are
          actually asking at this point on the page, which is why you rather
          than the two alternatives. AudienceCards still runs on /v2. */}
      {/* The work, directly under the platform that made it: the platform
          section is the only part of this page selling something unbuilt, and
          following it with six real clients is what keeps it from reading as
          a pitch deck slide. */}
      <hr className={v3.divider} />

      <FeaturedWall />

      <hr className={v3.divider} />

      <ComparisonTable />

      {/* 6 — The reel, demoted from hero: the page says it, then shows it */}
      {/* The reel is cut. It was a full-width film in the middle of a page
          that now opens on a client wall and carries film nowhere else — the
          one moving thing on a still page, taking every eye on the way past.
          It still plays on / and /v2. */}

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
        <button className={v3.contactCta} onClick={cal.open}>Book a demo</button>
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

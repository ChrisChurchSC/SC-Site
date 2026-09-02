import home from './Home.module.css'
import v3 from './HomeV3.module.css'
import styles from './AboutUs.module.css'
import { User } from 'lucide-react'
import tc from '../components/TestimonialCard.module.css'
import { useMeta } from '../hooks/useMeta'
import ContactCTA from '../components/ContactCTA'
import FooterCard from '../components/FooterCard'
import StatementCard from '../components/StatementCard'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import V3Signoff from '../components/V3Signoff'
import { useSanity } from '../hooks/useSanity'
import { CAREERS_PAGE_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'
import { useCalDrawer } from '../context/CalDrawerContext'

/* Section labels on this site are written "[ Like This ]". The hero's already
   is; the section ones were not, and half a convention reads as a mistake.
   Wrapped here rather than edited into the fallbacks, because these strings
   come from Sanity — an editor who types "Open Roles" should still get a
   label that matches the page, and one who types the brackets should not get
   them twice. */
const bracket = (t) =>
  !t ? t : /^\[.*\]$/.test(t.trim()) ? t : `[ ${t.trim()} ]`
const FALLBACK = {
  headerLabel: '[ Working Here ]',
  headline: 'Small team. Real work.',
  intro: "We're a tight group of strategists, creatives, and builders. Everyone is close to the work. Thinking and making happen together, by the same people.",
  photos: [
    { caption: 'Philadelphia, PA, 2024' },
    { caption: 'The team, offsite 2024' },
  ],
  whatItsLikeLabel: "What It's Like",
  whatItsLikeBody: "You'll work directly with clients from day one. You'll have opinions on strategy, execute on creative, and be involved across the full lifecycle of a project.",
  /* Bracketed on purpose: nobody has been named as saying this, and every
     testimonial component here treats brackets as "not a real person". It
     renders in dev only. Replace with a real name and role, or leave it and
     the card ships with no attribution row at all. */
  whatItsLikeAttribution: '[Name], [Role]',
  realitiesLabel: 'The Realities',
  realities: [
    { label: 'Location',   value: 'Philadelphia, PA' },
    { label: 'Team size',  value: 'Small, on purpose' },
    { label: 'Structure',  value: 'No departments, no account managers' },
    { label: 'Clients',    value: 'Founders and marketing leads' },
    { label: 'Work',       value: 'Strategy, content, brand, product' },
    { label: 'Hours',      value: '10hr days, 4 days a week' },
  ],
  traitsLabel: 'Who Fits Here',
  traits: [
    { heading: 'You think, then make.',    body: "We don't separate strategy from execution. Everyone here has opinions on the work and the ability to act on them." },
    { heading: 'You communicate clearly.', body: 'Good thinking shared badly is still bad thinking. We write well, talk straight, and keep each other informed without being performative about it.' },
    { heading: 'You take ownership.',      body: 'No one is waiting to be told what to do next. If something needs doing, you do it. If something is broken, you fix it.' },
    { heading: 'You care about the work.', body: "Not in a precious way. In the way where you'd rather redo something than ship it knowing it's not right." },
  ],
  openRolesLabel: 'Open Roles',
  applyEmail: 'contact@super-conscious.studio',
}

/* The homepage's closing line, word for word — it is the same block. */
const CLOSING = 'It might change your life. At minimum, we can answer your burning marketing questions.'

/* Fewest frames a pass carries. Six 4:5 frames at the desktop width is a
   little over one and a half screens, so the window is never empty and a
   frame is never on screen twice at once. */
const RAIL_MIN = 6
const railFrames = (photos = []) =>
  photos.length >= RAIL_MIN
    ? photos
    : [...photos, ...Array.from({ length: RAIL_MIN - photos.length }, () => ({ caption: '' }))]

export default function AboutUs() {
  const cal = useCalDrawer()
  const { data: pageData } = useSanity(CAREERS_PAGE_QUERY)
  const cfg = pageData ?? FALLBACK

  useMeta({
    title: 'Join the Team | Super Conscious',
    description: 'Join a small team of strategists, creatives, and builders. Everyone is close to the work. Philadelphia, PA.',
    path: '/about-us',
  })
  return (
    /* THE SAME SHELL /studio USES. This page was on the old layout — its own
       main with 305px reserved on the right for the side nav, a slide-up
       animation, and no top bar — which made it read as a different site one
       click from the About page. The stack supplies the page margins now, so
       the sections below have had their own horizontal padding taken off. */
    <main className={`${home.main} ${v3.stack}`}>
      <V3Nav />

      {/* The hero is StatementCard rather than a hand-built header, with the
          same flags /studio's carries, so the two pages open on the same line
          at the same size. The words still come from Sanity — this is the
          layout changing, not the copy.

          NOT tall. tall gives the hero a 78vh floor, which on this page put
          a full screen of black between the bar and the photo rail. display
          on its own keeps the headline at the same step and lets the card be
          as tall as its text and padding. bottom went with it — it only
          decided where the copy sat inside the height tall added. */}
      <StatementCard
        eyebrow={cfg.headerLabel}
        statement={cfg.headline}
        support={cfg.intro}
        as="h1"
        display
        bare
        inset
        supportSerif
        rule={false}
      />

      {/* A ROTATING RAIL OF 4:5 FRAMES. The same marquee as the testimonial
          and client strips: two identical passes on one track, the track
          slides to -50%, and the loop lands on a frame that looks exactly like
          the one it started on. Masked edges, paused on hover, still under
          reduced motion — all in the stylesheet.

          The rail is padded to RAIL_MIN frames when Sanity carries fewer,
          because a marquee of two pictures is two pictures crossing an empty
          stage. The padding frames are empty placeholders, not repeats: a
          repeated photo would read as a bug the moment a real one is in it.
          It is a fixed pad, not a random one — the page is prerendered and a
          render that differs between server and client is a hydration
          mismatch. */}
      <section className={styles.photoSection} aria-label="Photos">
        <div className={styles.railWindow}>
          <div className={styles.railTrack}>
            {[0, 1].map((pass) => (
              <div key={pass} className={styles.railPass} aria-hidden={pass === 1 || undefined}>
                {railFrames(cfg.photos).map(({ caption, imageUrl, videoUrl }, i) => (
                  <div key={i} className={styles.photoBlock}>
                    {videoUrl ? (
                      <video src={videoUrl} autoPlay muted loop playsInline className={styles.photoMedia} />
                    ) : imageUrl ? (
                      <img src={sanityImg(imageUrl, { w: 1200 })} alt={caption} loading="lazy" className={styles.photoMedia} />
                    ) : (
                      <div className={styles.photoPlaceholder} />
                    )}
                    <p className={styles.photoCaption}>{caption}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PASSAGE AS A TESTIMONIAL CARD, in the same pale card the service
          pages end on — its stylesheet is borrowed rather than the component,
          because TestimonialCard picks its own quote from Sanity and this one
          is the page's. The one light thing on this dark page, which is what
          makes it read as emphasis rather than as a theme change.

          The attribution is the awkward part: the passage was written as the
          studio speaking, not as a quote from a person, and a card in this
          shape implies a person. It shows the bracketed placeholder in dev so
          it cannot be forgotten, and nothing in production — a real quote
          wants a real name, and an invented one is worse than none. */}
      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{bracket(cfg.whatItsLikeLabel)}</p>
        <figure className={`${tc.card} ${styles.quoteCard}`}>
          <blockquote className={tc.quote}>“{cfg.whatItsLikeBody}”</blockquote>
          {(() => {
            const who = cfg.whatItsLikeAttribution
            const real = who && !/\[|\]/.test(who)
            if (!real && !import.meta.env.DEV) return null
            return (
              <figcaption className={tc.foot}>
                <span className={tc.avatar}><User size={18} strokeWidth={1.5} /></span>
                <span className={real ? tc.who : `${tc.who} ${tc.whoPlaceholder}`}>{who}</span>
              </figcaption>
            )
          })()}
        </figure>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{bracket(cfg.realitiesLabel)}</p>
        <div className={styles.realitiesGrid}>
          {cfg.realities?.map(({ label, value }) => (
            <div key={label} className={styles.realityRow}>
              <span className={styles.realityLabel}>{label}</span>
              <span className={styles.realityValue}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{bracket(cfg.traitsLabel)}</p>
        <div className={styles.traitsGrid}>
          {cfg.traits?.map(({ heading, body }, i) => (
            <div key={heading} className={styles.traitCard}>
              <span className={styles.traitN}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.traitHeading}>{heading}</p>
              <p className={styles.traitBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* THE SAME CLOSE AS THE HOMEPAGE, and for the same reason it is last:
          the one thing the site wants from anyone still reading. No form:
          the page's roster form was cut, and the site's one enquiry path is
          the booking drawer this button opens. If a careers-specific capture
          ever comes back it needs its own subject and request type — sharing
          the enquiry one is how freelancers were once filed as pricing
          leads. */}
      <ContactCTA sub={CLOSING} form={false} bare>
        <button className={v3.contactCta} onClick={cal.open}>Start a project</button>
      </ContactCTA>

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}

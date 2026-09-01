import { NavLink } from 'react-router-dom'
import styles from './AboutUs.module.css'
import own from './AboutStudio.module.css'
import { useMeta } from '../hooks/useMeta'

/**
 * The About page.
 *
 * Built on the Careers layout — it imports AboutUs.module.css directly rather
 * than restating two hundred lines of it, the same way ContentPrograms and
 * BrandSystems both render through Capabilities.module.css. Only the pieces
 * Careers has no equivalent for live in AboutStudio.module.css: the
 * disciplines list, the two client lists, and a CTA that is a link rather than
 * an email capture form.
 *
 * On the URL: /about is the Capabilities page (which the nav now labels
 * "Services") and /about-us is Careers, so both of the obvious slugs were
 * taken. /who-we-are is a placeholder that avoids displacing an indexed page.
 * Moving it to /about means deciding where Capabilities goes.
 */
const WHY = [
  {
    lead: 'Hire in-house',
    body: "and you're committing to salaries, benefits, and headcount for a team you may only need at full capacity a few months a year. Recruiting alone takes a quarter. A single senior creative director costs more than most of our engagements.",
  },
  {
    lead: 'Hire a traditional agency',
    body: "and you're paying for layers — account managers relaying your notes to junior staff, minimum retainers that don't flex, and a percentage of your media spend that grows whether or not the work does.",
  },
  {
    lead: 'Go fractional',
    body: "and you get the senior talent without either problem. We scale up when you're launching and scale down when you're not. Our media management fee is flat, never a percentage of your buy.",
  },
]

const PRACTICE = [
  {
    heading: 'We are creatives who are also marketers.',
    body: "We all started out as writers, designers, illustrators, animators, filmmakers, and developers, then built our marketing and media chops through years in-house and at agencies. That combination is the whole point of a fractional team — you're not hiring a creative shop and a media agency and hoping they talk to each other. We make beautiful brands and we know how to take them to market.",
  },
  {
    heading: "We're not an extension of your team. We are your team.",
    body: "We embed into your workflow, your tools, your standups. On-demand access to world-class design, copy, and marketing talent for a fraction of your typical overhead. Whether you're supplementing staff or adding capabilities you've never had, we're ready to get into your weeds.",
  },
  {
    heading: 'We scale to your needs.',
    body: 'Our infrastructure is flexible and our fees are competitive for one simple reason: every client has unique needs. We partner with you on the right mix of services and team support based on your goals, budgets, and timelines. Nothing at Super-Conscious is off the shelf.',
  },
]

const BENCH = [
  'Brand strategy', 'Art direction', 'Copywriting', 'Illustration', 'Design',
  'Motion design', 'Film & video production', 'Web & app development',
  'Paid media', 'Organic social', 'Email & SMS', 'Analytics',
]

const PEDIGREE = ['Kettle', 'Digitas', 'Buck', 'Huge', 'Madwell', 'Condé Nast', 'Time Inc.', 'Net-A-Porter', 'Amazon', 'J.Jill', "Victoria's Secret"]

const CLIENTS = ['Smallhold', 'Wonderwerk', 'Google', 'Big Buoy', 'Oxyle', 'Path Projects', 'Hylands', 'ZBiotics', 'Talos', 'Photon', 'Soft Science', 'Offchain', 'Entropy', 'Smashburger', '21cv', 'J.Jill']

export default function AboutStudio() {
  useMeta({
    title: 'About | Super Conscious',
    description:
      'A fractional creative and marketing department — brand, copy, design, development, media — that plugs into your company at a fraction of the cost of building it in-house.',
    path: '/who-we-are',
  })

  return (
    <main className={styles.main}>

      <section className={styles.header}>
        <p className={styles.headerLabel}>[ About ]</p>
        <h1 className={styles.headline}>Your fractional creative marketing team.</h1>
        <p className={styles.sub}>
          Not a vendor. Not a freelancer you have to manage. A full creative and marketing
          department — brand, copy, design, development, media — that plugs into your
          company at a fraction of the cost of building it in-house.
        </p>
        <p className={own.kicker}>You get the senior people. You just don't get the payroll.</p>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>Why Fractional</p>
        <p className={styles.statement}>Most growing companies face the same bad choice.</p>
        <div className={styles.traitsGrid}>
          {WHY.map(({ lead, body }) => (
            <div key={lead} className={styles.traitCard}>
              {/* No number on these three — they are alternatives being weighed,
                  not steps in an order. The numbered treatment belongs to the
                  section below, where the sequence is the point. */}
              <p className={styles.traitHeading}>{lead}</p>
              <p className={styles.traitBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>What That Looks Like In Practice</p>
        <div className={styles.traitsGrid}>
          {PRACTICE.map(({ heading, body }, i) => (
            <div key={heading} className={styles.traitCard}>
              <span className={styles.traitN}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.traitHeading}>{heading}</p>
              <p className={styles.traitBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>The Bench You're Hiring</p>
        <ul className={own.bench}>
          {BENCH.map(d => <li key={d} className={own.benchItem}>{d}</li>)}
        </ul>
        <p className={own.benchNote}>
          Use one discipline or all of them. The mix can change quarter to quarter.
        </p>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>Where We've Worked</p>
        <p className={own.roster}>{PEDIGREE.join(' · ')}</p>

        <p className={`${styles.sectionLabel} ${own.rosterLabel}`}>Select Clients</p>
        <p className={own.roster}>{CLIENTS.join(' · ')}</p>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaCard} style={{ alignItems: 'center', textAlign: 'center' }}>
          <p className={styles.ctaHeading}>Talk to a Super-Conscious human.</p>
          <p className={styles.ctaSub}>
            It might change your life. At minimum, we can probably answer some of your
            burning marketing questions.
          </p>
          <NavLink to="/contact" className={own.ctaLink}>Get in touch →</NavLink>
        </div>
      </section>

    </main>
  )
}

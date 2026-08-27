import { NavLink } from 'react-router-dom'
import styles from './About.module.css'
import { useMeta } from '../hooks/useMeta'
import EmailCaptureForm from '../components/EmailCaptureForm'
import { useSanity } from '../hooks/useSanity'
import { ABOUT_PAGE_QUERY } from '../lib/queries'
import { LP_CATEGORIES } from '../lib/lpCategories'
import { MOCK_PAGES } from '../lib/mockLandingPages'

const FALLBACK = {
  headerLabel: '[ Capabilities ]',
  headline: 'Creative Strategy & Production Partner',
  intro: 'We help founders and marketing teams decide what to make, why it matters, and bring it to life.',
  embeddedPoints: [
    { heading: 'No long contracts.', body: 'Month to month, rate card that works for both sides. No surprises.' },
    { heading: 'Plugged into your team.', body: 'Your Slack, your meetings, your tools. Multiple team members, one shared goal.' },
    { heading: 'In-house output.', body: 'The output of an in-house creative team without the cost of building one.' },
  ],
  services: [
    { tag: 'What to make', name: 'Define', deliverables: ['Creative strategy', 'Brand positioning & messaging', 'Campaign and concept development'] },
    { tag: 'Why it matters', name: 'Amplify', deliverables: ['Marketing strategy & planning', 'Channel strategy (social, paid, etc.)', 'Measurement framework & data setup'] },
    { tag: 'Bringing to life', name: 'Develop', deliverables: ['Content production (video, social, design)', 'Asset creation & execution', 'Post-production & delivery'] },
  ],
  pricingLabel: 'Get Pricing',
  pricingSub: "Drop your email and we'll send over rates and availability.",
  clientsLabel: 'Selected Clients',
  clients: ['World Within', 'Oxyle', 'Mindmatter', 'Big Buoy', 'Deep Dive Films', 'Concis Labs', 'Joon', 'Transcend', 'Halfday', 'Overland', 'Pollen', 'Vessel'],
}

export default function About() {
  const { data } = useSanity(ABOUT_PAGE_QUERY)
  const cfg = data ?? FALLBACK
  const faqSchema = cfg.faqs?.length ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  } : null
  useMeta({
    title: 'Brand Systems, Content Programs & Digital Products | Super Conscious',
    description: 'A creative production & engineering studio for brands, content, and digital products. Embedded with founders and marketing teams, month to month, no long contracts.',
    path: '/about',
    schema: faqSchema,
  })

  return (
    <main className={styles.main}>

      <section className={styles.header}>
        <p className={styles.headerLabel}>{cfg.headerLabel}</p>
        {/* Falls back at the FIELD level, not the object level.
            `cfg = data ?? FALLBACK` only substitutes when Sanity returns
            nothing at all. Sanity returns an aboutPage document whose
            `headline` is null, so the whole FALLBACK was skipped and this
            guard suppressed the heading — /about shipped with no <h1>.

            Applied to this field alone, on purpose. A blanket merge would
            mean an editor could never remove anything: clearing a field in
            the Studio would silently resurrect the hardcoded value. A page
            heading is structural rather than editorial — it should always
            exist — so it is the one field that gets a guaranteed default. */}
        <h1 className={styles.headline}>{cfg.headline || FALLBACK.headline}</h1>
        {cfg.intro?.split(/\n\n+/).map((para, i) => (
          <p key={i} className={styles.sub}>{para}</p>
        ))}
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>Embedded Partnership</p>
        <div className={styles.embeddedGrid}>
          {cfg.embeddedPoints?.map((p, i) => (
            <div key={i} className={styles.embeddedPoint}>
              <span className={styles.embeddedN}>{String(i + 1).padStart(2, '0')}</span>
              <p className={styles.embeddedHeading}>{p.heading}</p>
              <p className={styles.embeddedBody}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>What We Do</p>
        {cfg.servicesIntro && <p className={styles.servicesIntro}>{cfg.servicesIntro}</p>}
        <div className={styles.servicesGrid}>
          {cfg.services?.map(({ tag, name, deliverables }) => (
            <div key={name} className={styles.serviceCol}>
              <p className={styles.serviceTag}>{tag}</p>
              <p className={styles.serviceName}>{name}</p>
              <ul className={styles.serviceList}>
                {deliverables?.map(d => (
                  <li key={d} className={styles.serviceItem}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {cfg.roles?.length > 0 && (
        <section className={styles.textSection}>
          <p className={styles.sectionLabel}>{cfg.rolesLabel || 'Roles'}</p>
          {cfg.rolesIntro && <p className={styles.rolesIntro}>{cfg.rolesIntro}</p>}
          <div className={styles.rolesGrid}>
            {cfg.roles.map(r => {
              const name = typeof r === 'string' ? r : r.name
              const description = typeof r === 'string' ? null : r.description
              return (
                <div key={name} className={styles.roleCard}>
                  <p className={styles.roleName}>{name}</p>
                  {description && <p className={styles.roleDesc}>{description}</p>}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* The 22 /lp pages had no visible inbound link from anywhere on the
          site — every link into them came from another /lp page, and the only
          bridge from the main site was a display:none div the prerender
          injected into the homepage. That is hidden text and links, and it
          was only ever a stopgap for an empty #root, which the SSG work fixed.
          This section replaces it: real links, on the page whose subject they
          actually extend. */}
      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>Answers</p>
        <div className={styles.lpGrid}>
          {LP_CATEGORIES.map(({ label, slugs }) => (
            <div key={label} className={styles.lpCol}>
              <p className={styles.lpCatLabel}>{label}</p>
              <ul className={styles.lpList}>
                {slugs.map(slug => MOCK_PAGES[slug] && (
                  <li key={slug}>
                    <NavLink to={`/lp/${slug}`} className={styles.lpLink}>
                      {MOCK_PAGES[slug].heroHeadline}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {cfg.faqs?.length > 0 && (
        <section className={styles.textSection}>
          <p className={styles.sectionLabel}>{cfg.faqLabel || 'FAQ'}</p>
          <div className={styles.faqList}>
            {cfg.faqs.map(({ question, answer }) => (
              <details key={question} className={styles.faqItem}>
                <summary className={styles.faqQ}>
                  <span>{question}</span>
                  <span className={styles.faqToggle} aria-hidden="true" />
                </summary>
                <p className={styles.faqA}>{answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      <section className={styles.pricingSection}>
        <div className={styles.pricingCard}>
          <p className={styles.pricingLabel}>{cfg.pricingLabel}</p>
          <p className={styles.pricingSub}>{cfg.pricingSub}</p>
          <EmailCaptureForm
            styles={styles}
            submitLabel="Get rates →"
            confirmMessage="Thanks — we'll send rates over shortly."
            subject="Pricing request from super-conscious.studio"
            requestType="pricing"
          />
        </div>
      </section>

    </main>
  )
}

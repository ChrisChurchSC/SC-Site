import styles from './Services.module.css'
import { useMeta } from '../hooks/useMeta'
import EmailCaptureForm from '../components/EmailCaptureForm'
import { useSanity } from '../hooks/useSanity'
import { ABOUT_PAGE_QUERY } from '../lib/queries'

const FALLBACK = {
  headerLabel: '[ Services ]',
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

/**
 * The studio's services page, at /services.
 *
 * It was called Capabilities and lived at /about until this rename; the old
 * URL is 301'd in vercel.json (and mapped client-side in App.jsx, since a
 * Vercel redirect never runs on an in-app navigation).
 *
 * The CMS side deliberately did NOT follow. The Sanity type is still
 * `aboutPage`, doc id `about-page`, queried through ABOUT_PAGE_QUERY —
 * renaming a type in Sanity does not migrate the documents stored under the
 * old name, so it would orphan every field the client has edited. The names
 * differ on purpose: /services is what the visitor sees, aboutPage is where
 * the content is kept.
 */
export default function Services() {
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
    path: '/services',
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
            guard suppressed the heading — the page shipped with no <h1>.

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

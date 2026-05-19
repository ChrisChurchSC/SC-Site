import styles from './About.module.css'
import { useMeta } from '../hooks/useMeta'
import KitForm from '../components/KitForm'
import { useSanity } from '../hooks/useSanity'
import { ABOUT_PAGE_QUERY } from '../lib/queries'

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
  useMeta({
    title: 'Capabilities | Super Conscious',
    description: 'Creative strategy and production partner for founders and marketing teams. Brand, content, and product, embedded month to month, no long contracts.',
  })
  const { data } = useSanity(ABOUT_PAGE_QUERY)
  const cfg = data ?? FALLBACK

  return (
    <main className={styles.main}>

      <section className={styles.header}>
        <p className={styles.headerLabel}>{cfg.headerLabel}</p>
        <h1 className={styles.headline}>{cfg.headline}</h1>
        <p className={styles.sub}>{cfg.intro}</p>
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

      {cfg.packages?.length > 0 && (
        <section className={styles.textSection}>
          <p className={styles.sectionLabel}>{cfg.packagesLabel || 'Packages'}</p>
          {cfg.packagesIntro && <p className={styles.packagesIntro}>{cfg.packagesIntro}</p>}
          {['Build', 'Grow'].map(track => {
            const items = cfg.packages.filter(p => p.track === track)
            if (!items.length) return null
            return (
              <div key={track} className={styles.packagesTrack}>
                <p className={styles.packagesTrackLabel}>{track}</p>
                <div className={styles.packagesGrid}>
                  {items.map(p => (
                    <div key={p.name} className={styles.packageCard}>
                      <p className={styles.packageName}>{p.name}</p>
                      {p.goal && <p className={styles.packageGoal}>{p.goal}</p>}
                      {p.metric && (
                        <p className={styles.packageMetric}>
                          <span className={styles.packageMetricLabel}>Tracked together — </span>{p.metric}
                        </p>
                      )}
                      {p.price ? <p className={styles.packagePrice}>From ${Number(p.price).toLocaleString()}</p> : null}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </section>
      )}

      <section className={styles.pricingSection}>
        <div className={styles.pricingCard}>
          <p className={styles.pricingLabel}>{cfg.pricingLabel}</p>
          <p className={styles.pricingSub}>{cfg.pricingSub}</p>
          <KitForm />
        </div>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{cfg.clientsLabel || 'Selected Clients'}</p>
        <div className={styles.clientsGrid}>
          {cfg.clients?.map(c => (
            <span key={c} className={styles.clientName}>{c}</span>
          ))}
        </div>
      </section>

    </main>
  )
}

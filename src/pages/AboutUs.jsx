import styles from './AboutUs.module.css'
import { useMeta } from '../hooks/useMeta'
import { useSanity } from '../hooks/useSanity'
import { OPEN_ROLES_QUERY, CAREERS_PAGE_QUERY } from '../lib/queries'
import { sanityImg } from '../lib/sanityImg'

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

// No roles are listed unless we are actively hiring. Live openings come
// from Sanity (openRole docs); the empty state below covers the rest.
const fallbackOpenRoles = []

export default function AboutUs() {
  const { data: sanityRoles } = useSanity(OPEN_ROLES_QUERY)
  const { data: pageData } = useSanity(CAREERS_PAGE_QUERY)
  const cfg = pageData ?? FALLBACK
  const roles = sanityRoles?.length ? sanityRoles : fallbackOpenRoles

  useMeta({
    title: 'Join the Team | Super Conscious',
    description: 'Join a small team of strategists, creatives, and builders. Everyone is close to the work. Philadelphia, PA.',
    path: '/about-us',
  })
  return (
    <main className={styles.main}>

      <section className={styles.header}>
        <p className={styles.headerLabel}>{cfg.headerLabel}</p>
        <h1 className={styles.headline}>{cfg.headline}</h1>
        <p className={styles.sub}>{cfg.intro}</p>
      </section>

      <section className={styles.photoSection}>
        <div className={styles.photoGrid}>
          {cfg.photos?.map(({ caption, imageUrl, videoUrl }) => (
            <div key={caption} className={styles.photoBlock}>
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
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{cfg.whatItsLikeLabel}</p>
        <p className={styles.statement}>{cfg.whatItsLikeBody}</p>
      </section>

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{cfg.realitiesLabel}</p>
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
        <p className={styles.sectionLabel}>{cfg.traitsLabel}</p>
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

      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>{cfg.openRolesLabel}</p>
        {roles.length > 0 ? (
          <div className={styles.rolesGrid}>
            {roles.map(({ title, type, location, level, description }) => (
              <div key={title} className={styles.roleCard}>
                <div className={styles.roleHeader}>
                  <p className={styles.roleTitle}>{title}</p>
                  <div className={styles.roleMeta}>
                    <span className={styles.roleTag}>{type}</span>
                    <span className={styles.roleTag}>{level}</span>
                    <span className={styles.roleLocation}>{location}</span>
                  </div>
                </div>
                <p className={styles.roleDescription}>{description}</p>
                <a href={`mailto:${cfg.applyEmail || 'contact@super-conscious.studio'}`} className={styles.roleApply}>Apply</a>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.rolesEmpty}>No open roles right now. We're always glad to meet talented people, so say hello below.</p>
        )}
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.ctaCard} style={{ alignItems: 'center', textAlign: 'center' }}>
          <p className={styles.ctaHeading}>{cfg.signupLabel || 'Stay in touch'}</p>
          <p className={styles.ctaSub}>{cfg.signupSub || "Drop your email and we'll let you know when new roles open up."}</p>
          <a className={styles.pricingSubmit} href="/contact">Request pricing &rarr;</a>
        </div>
      </section>

    </main>
  )
}

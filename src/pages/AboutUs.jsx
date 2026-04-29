import styles from './AboutUs.module.css'
import { useMeta } from '../hooks/useMeta'

const traits = [
  {
    n: '01',
    heading: 'You think, then make.',
    body: "We don't separate strategy from execution. Everyone here has opinions on the work and the ability to act on them.",
  },
  {
    n: '02',
    heading: 'You communicate clearly.',
    body: "Good thinking shared badly is still bad thinking. We write well, talk straight, and keep each other informed without being performative about it.",
  },
  {
    n: '03',
    heading: 'You take ownership.',
    body: "No one is waiting to be told what to do next. If something needs doing, you do it. If something is broken, you fix it.",
  },
  {
    n: '04',
    heading: 'You care about the work.',
    body: "Not in a precious way. In the way where you'd rather redo something than ship it knowing it's not right.",
  },
]

const realities = [
  { label: 'Location',   value: 'Philadelphia, PA' },
  { label: 'Team size',  value: 'Small, on purpose' },
  { label: 'Structure',  value: 'No departments, no account managers' },
  { label: 'Clients',    value: 'Founders and marketing leads' },
  { label: 'Work',       value: 'Strategy, content, brand, product' },
  { label: 'Hours',      value: '10hr days, 4 days a week' },
]

const openRoles = [
  {
    title: 'Design Intern',
    type: 'Internship',
    location: 'Philadelphia, PA',
    description: "Work across brand, digital, and content. You'll be hands-on from day one, concepting, designing, and refining real client work. Strong eye, curious mind, and a point of view on what makes things good.",
  },
  {
    title: 'Motion Intern',
    type: 'Internship',
    location: 'Philadelphia, PA',
    description: "Help bring campaigns and content to life through motion. You'll work on social content, brand films, and everything in between. Comfortable in After Effects, interested in the full creative process.",
  },
]

const photos = [
  { caption: 'Philadelphia, PA — 2024' },
  { caption: 'The team, offsite 2024'  },
]

export default function AboutUs() {
  useMeta({
    title: 'Careers — Super Conscious',
    description: 'Join a small team of strategists, creatives, and builders. Everyone is close to the work. Philadelphia, PA.',
  })
  return (
    <main className={styles.main}>

      {/* Header */}
      <section className={styles.header}>
        <p className={styles.headerLabel}>[ Working Here ]</p>
        <h1 className={styles.headline}>Small team.<br />Real work.</h1>
        <p className={styles.sub}>We're a tight group of strategists, creatives, and builders. Everyone is close to the work. Thinking and making happen together, by the same people.</p>
      </section>

      {/* Photo grid */}
      <section className={styles.photoSection}>
        <div className={styles.photoGrid}>
          {photos.map(({ caption, ratio }) => (
            <div key={caption} className={`${styles.photoBlock} ${styles[ratio]}`}>
              <div className={styles.photoPlaceholder} />
              <p className={styles.photoCaption}>{caption}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What it's like */}
      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>What It's Like</p>
        <p className={styles.statement}>You'll work directly with clients from day one. You'll have opinions on strategy, execute on creative, and be involved across the full lifecycle of a project. It moves fast and the feedback loop is short. That's the point.</p>
      </section>

      {/* The realities */}
      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>The Realities</p>
        <div className={styles.realitiesGrid}>
          {realities.map(({ label, value }) => (
            <div key={label} className={styles.realityRow}>
              <span className={styles.realityLabel}>{label}</span>
              <span className={styles.realityValue}>{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Who fits */}
      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>Who Fits Here</p>
        <div className={styles.traitsGrid}>
          {traits.map(({ n, heading, body }) => (
            <div key={n} className={styles.traitCard}>
              <span className={styles.traitN}>{n}</span>
              <p className={styles.traitHeading}>{heading}</p>
              <p className={styles.traitBody}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open roles */}
      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>Open Roles</p>
        <div className={styles.rolesGrid}>
          {openRoles.map(({ title, type, location, description }) => (
            <div key={title} className={styles.roleCard}>
              <div className={styles.roleHeader}>
                <p className={styles.roleTitle}>{title}</p>
                <div className={styles.roleMeta}>
                  <span className={styles.roleTag}>{type}</span>
                  <span className={styles.roleLocation}>{location}</span>
                </div>
              </div>
              <p className={styles.roleDescription}>{description}</p>
              <a href="mailto:chris@super-conscious.studio" className={styles.roleApply}>Apply</a>
            </div>
          ))}
        </div>
      </section>


    </main>
  )
}

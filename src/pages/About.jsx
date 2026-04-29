import { useState } from 'react'
import styles from './About.module.css'
import { useMeta } from '../hooks/useMeta'

const KIT_API_URL = 'https://api.kit.com/v4/subscribers'
const KIT_API_KEY = 'kit_2df81d6b7f67f9b4512769af18bd29be'

const services = [
  {
    tag: 'What to make',
    name: 'Define',
    deliverables: [
      'Creative strategy',
      'Brand positioning & messaging',
      'Campaign and concept development',
    ],
  },
  {
    tag: 'Why it matters',
    name: 'Amplify',
    deliverables: [
      'Marketing strategy & planning',
      'Channel strategy (social, paid, etc.)',
      'Measurement framework & data setup',
    ],
  },
  {
    tag: 'Bringing to life',
    name: 'Develop',
    deliverables: [
      'Content production (video, social, design)',
      'Asset creation & execution',
      'Post-production & delivery',
    ],
  },
]

const clients = [
  'World Within', 'Oxyle', 'Mindmatter', 'Big Buoy',
  'Deep Dive Films', 'Concis Labs', 'Joon', 'Transcend',
  'Halfday', 'Overland', 'Pollen', 'Vessel',
]

export default function About() {
  useMeta({
    title: 'Capabilities — Super Conscious',
    description: 'Creative strategy and production partner for founders and marketing teams. Brand, content, and product — embedded month to month, no long contracts.',
  })
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch(KIT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Kit-Api-Key': KIT_API_KEY,
        },
        body: JSON.stringify({ email_address: email }),
      })
    } catch (_) {}
    setDone(true)
    setEmail('')
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <main className={styles.main}>

      {/* Header */}
      <section className={styles.header}>
        <p className={styles.headerLabel}>[ Capabilities ]</p>
        <h1 className={styles.headline}>Creative Strategy<br />& Production Partner</h1>
        <p className={styles.sub}>We help founders and marketing teams decide what to make, why it matters, and bring it to life.</p>
      </section>

      {/* Embedded partnership */}
      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>Embedded Partnership</p>
        <div className={styles.embeddedGrid}>
          <div className={styles.embeddedPoint}>
            <span className={styles.embeddedN}>01</span>
            <p className={styles.embeddedHeading}>No long contracts.</p>
            <p className={styles.embeddedBody}>Month to month, rate card that works for both sides. No surprises.</p>
          </div>
          <div className={styles.embeddedPoint}>
            <span className={styles.embeddedN}>02</span>
            <p className={styles.embeddedHeading}>Plugged into your team.</p>
            <p className={styles.embeddedBody}>Your Slack, your meetings, your tools. Multiple team members, one shared goal.</p>
          </div>
          <div className={styles.embeddedPoint}>
            <span className={styles.embeddedN}>03</span>
            <p className={styles.embeddedHeading}>In-house output.</p>
            <p className={styles.embeddedBody}>The output of an in-house creative team without the cost of building one.</p>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>What We Do</p>
        <div className={styles.servicesGrid}>
          {services.map(({ tag, name, deliverables }) => (
            <div key={name} className={styles.serviceCol}>
              <p className={styles.serviceTag}>{tag}</p>
              <p className={styles.serviceName}>{name}</p>
              <ul className={styles.serviceList}>
                {deliverables.map(d => (
                  <li key={d} className={styles.serviceItem}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className={styles.pricingSection}>
        <div className={styles.pricingCard}>
          <p className={styles.pricingLabel}>Get Pricing</p>
          <p className={styles.pricingSub}>Drop your email and we'll send over rates and availability.</p>
          {done ? (
            <p className={styles.pricingConfirm}>We'll be in touch.</p>
          ) : (
            <form className={styles.pricingForm} onSubmit={handleSubmit}>
              <input
                className={styles.pricingInput}
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button className={styles.pricingSubmit} type="submit">Send</button>
            </form>
          )}
        </div>
      </section>

      {/* Clients */}
      <section className={styles.textSection}>
        <p className={styles.sectionLabel}>Selected Clients</p>
        <div className={styles.clientsGrid}>
          {clients.map(c => (
            <span key={c} className={styles.clientName}>{c}</span>
          ))}
        </div>
      </section>

    </main>
  )
}

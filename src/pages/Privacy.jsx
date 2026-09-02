import { useMeta } from '../hooks/useMeta'
import V3Frame from '../components/V3Frame'
import styles from './Privacy.module.css'

export default function Privacy() {
  useMeta({
    title: 'Privacy Policy | Super Conscious',
    description: 'How Super Conscious collects, uses, and protects your information.',
    path: '/privacy',
    noindex: true,
  })

  return (
    <V3Frame><div className={styles.main}>
      <div className={styles.inner}>
        <h1 className={styles.headline}>Privacy Policy</h1>
        <p className={styles.updated}>Last updated: June 1, 2026</p>

        <p className={styles.body}>
          Super Conscious Studio LLC ("Super Conscious," "we," "us") operates super-conscious.studio. This policy explains what information we collect, how we use it, and your choices.
        </p>

        <h2 className={styles.h2}>Information we collect</h2>

        <h3 className={styles.h3}>Information you provide</h3>
        <p className={styles.body}>
          When you submit the contact form, we collect your name, email address, company name, and project description. This information is stored in our CRM (Attio) and used to respond to your inquiry.
        </p>

        <h3 className={styles.h3}>Usage data</h3>
        <p className={styles.body}>
          We use Google Analytics 4 and Vercel Analytics to collect anonymized data about how visitors use the site, including pages visited, time on site, and general location (country or city level). This data is aggregated and does not identify you personally.
        </p>

        <h2 className={styles.h2}>How we use your information</h2>
        <p className={styles.body}>
          We use the information we collect to respond to inquiries and understand how our site is used. We do not sell your data to third parties.
        </p>

        <h2 className={styles.h2}>Email</h2>
        <p className={styles.body}>
          If you submit the contact form, we may send you a confirmation or follow-up email using Resend. We do not add you to marketing lists without your consent.
        </p>

        <h2 className={styles.h2}>Cookies</h2>
        <p className={styles.body}>
          Google Analytics uses cookies to distinguish visitors. Vercel Analytics does not use cookies. You can disable cookies in your browser settings or use browser extensions to opt out of Google Analytics tracking.
        </p>

        <h2 className={styles.h2}>Data retention</h2>
        <p className={styles.body}>
          Contact form submissions are retained in our CRM until you request deletion. Analytics data is retained per each provider's default settings (26 months for Google Analytics).
        </p>

        <h2 className={styles.h2}>Your rights</h2>
        <p className={styles.body}>
          You may request access to, correction of, or deletion of any personal information we hold about you by emailing <a href="mailto:chris@super-conscious.studio" className={styles.link}>chris@super-conscious.studio</a>.
        </p>

        <h2 className={styles.h2}>Contact</h2>
        <p className={styles.body}>
          Super Conscious Studio LLC<br />
          chris@super-conscious.studio
        </p>
      </div>
    </div></V3Frame>
  )
}

import { useMeta } from '../hooks/useMeta'
import styles from './Privacy.module.css'

export default function Terms() {
  useMeta({
    title: 'Terms of Service | Super Conscious',
    description: 'Terms of service for Super Conscious Studio LLC.',
    path: '/terms',
    noindex: true,
  })

  return (
    <main className={styles.main}>
      <div className={styles.inner}>
        <h1 className={styles.headline}>Terms of Service</h1>
        <p className={styles.updated}>Last updated: June 1, 2026</p>

        <p className={styles.body}>
          These terms govern your use of super-conscious.studio and any engagement with Super Conscious Studio LLC ("Super Conscious," "we," "us"). By using this site or engaging our services, you agree to these terms.
        </p>

        <h2 className={styles.h2}>Services</h2>
        <p className={styles.body}>
          Super Conscious is a creative production studio providing brand systems, content programs, and digital products. Specific deliverables, timelines, and fees for each engagement are defined in a separate proposal or statement of work, which takes precedence over these general terms.
        </p>

        <h2 className={styles.h2}>Payment</h2>
        <p className={styles.body}>
          Payment terms are defined in each proposal. Work does not begin until a signed agreement and any required deposit are received. Late payments may result in work being paused until the account is current. All fees are in US dollars.
        </p>

        <h2 className={styles.h2}>Intellectual property</h2>
        <p className={styles.body}>
          Upon receipt of full payment, Super Conscious assigns to the client all rights to the final deliverables produced under that engagement. Super Conscious retains the right to display the work in its portfolio and marketing materials unless the client requests otherwise in writing.
        </p>
        <p className={styles.body} style={{ marginTop: '12px' }}>
          Work product created during the engagement but not included in final deliverables, as well as tools, templates, and processes developed by Super Conscious, remain the property of Super Conscious.
        </p>

        <h2 className={styles.h2}>Confidentiality</h2>
        <p className={styles.body}>
          Both parties agree to keep confidential any non-public information shared during the engagement. This obligation survives the end of the engagement.
        </p>

        <h2 className={styles.h2}>Limitation of liability</h2>
        <p className={styles.body}>
          Super Conscious is not liable for indirect, incidental, or consequential damages arising from the use of our services or deliverables. Our total liability for any claim is limited to the fees paid for the specific engagement giving rise to the claim.
        </p>

        <h2 className={styles.h2}>No warranties</h2>
        <p className={styles.body}>
          This website and its content are provided "as is" without warranties of any kind. We do not guarantee that the site will be uninterrupted or error-free.
        </p>

        <h2 className={styles.h2}>Governing law</h2>
        <p className={styles.body}>
          These terms are governed by the laws of the Commonwealth of Pennsylvania, United States. Any disputes will be resolved in the courts of Philadelphia County, Pennsylvania.
        </p>

        <h2 className={styles.h2}>Changes</h2>
        <p className={styles.body}>
          We may update these terms from time to time. Continued use of this site after changes constitutes acceptance of the updated terms.
        </p>

        <h2 className={styles.h2}>Contact</h2>
        <p className={styles.body}>
          Super Conscious Studio LLC<br />
          <a href="mailto:chris@super-conscious.studio" className={styles.link}>chris@super-conscious.studio</a>
        </p>
      </div>
    </main>
  )
}

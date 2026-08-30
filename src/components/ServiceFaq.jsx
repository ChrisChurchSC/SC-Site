import styles from './ServiceFaq.module.css'
import { faqs } from '../data/pricingTabs'

/**
 * THE FAQ, from the pricing page's own list.
 *
 * Read rather than rewritten: these are commercial answers — how a project is
 * priced, how the subscription is billed, whether media spend is included —
 * and a service page answering them differently from /pricing is worse than
 * not answering them at all.
 *
 * Native <details>/<summary> rather than a state hook. It is open/closed and
 * nothing else, the browser already does the keyboard and the semantics, and
 * one of these can be linked to and found by in-page search while collapsed.
 */
export default function ServiceFaq() {
  return (
    <section className={styles.section} aria-labelledby="faq">
      <p className={styles.eyebrow}>[ Questions ]</p>
      <h2 className={styles.headline} id="faq">The ones we get asked.</h2>

      <div className={styles.list}>
        {faqs.map(({ q, a }) => (
          <details key={q} className={styles.item}>
            <summary className={styles.q}>
              {q}
              <span className={styles.sign} aria-hidden="true" />
            </summary>
            <p className={styles.a}>{a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

import styles from './ServiceFaq.module.css'
import { faqs } from '../data/pricingTabs'

/**
 * THE FAQ, from the pricing page's own list.
 *
 * `items` overrides the list. The pricing FAQ is the right one on a service
 * page and the wrong one on a page about agents — that page passes its own.
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
export default function ServiceFaq({ items, eyebrow = '[ Questions ]', headline = 'The ones we get asked.' }) {
  const list = items ?? faqs

  return (
    <section className={styles.section} aria-labelledby="faq">
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline} id="faq">{headline}</h2>

      <div className={styles.list}>
        {list.map(({ q, a }) => (
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

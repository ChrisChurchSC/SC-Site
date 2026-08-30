import styles from './PlatformOutputs.module.css'

/**
 * WHAT THE PLATFORM MAKES — the section under it.
 *
 * Three functions rather than four service pillars. The hero diagram already
 * shows the pillars, so listing them again here would answer a question the
 * page answered two screens ago; Product, Marketing and Sales are the people
 * the output is FOR, which is a different cut of the same store.
 *
 * The names are Chris's. The notes and the chips under them are mine and are
 * not signed off.
 */
const MAKES = [
  {
    name: 'Product',
    note: 'Naming, positioning and the words that ship alongside it.',
    items: ['Naming', 'Positioning', 'Launch copy', 'Site pages', 'Release notes'],
  },
  {
    name: 'Marketing',
    note: 'Campaigns, and the channels they run on.',
    items: ['Campaigns', 'Social', 'Email', 'Ads', 'Landing pages'],
  },
  {
    name: 'Sales',
    note: 'The deck, the one-pager and the follow-up, on message.',
    items: ['Decks', 'One-pagers', 'Case studies', 'Outreach', 'Proposals'],
  },
]

export default function PlatformOutputs() {
  return (
    <section className={styles.section} aria-labelledby="what-it-makes">
      <p className={styles.eyebrow}>[ What it makes ]</p>
      <h2 className={styles.headline} id="what-it-makes">
        One store, and everything that comes out of it.
      </h2>

      <div className={styles.grid}>
        {MAKES.map(({ name, note, items }) => (
          <article key={name} className={styles.card}>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.note}>{note}</p>
            <div className={styles.chips}>
              {items.map((i) => <span key={i} className={styles.chip}>{i}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

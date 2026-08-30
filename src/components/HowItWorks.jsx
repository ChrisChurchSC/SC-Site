import styles from './HowItWorks.module.css'

/**
 * HOW IT WORKS — the operating loop, on Grow.
 *
 * The four words are Chris's. The line under each is mine and is not signed
 * off.
 *
 * IT IS A LOOP, NOT A LIST, which is the whole point of the fourth step:
 * compounding is what happens when the measurement from one month is the
 * starting position of the next. The rule that runs under the row carries a
 * return leg back to the first step rather than stopping at the fourth,
 * because a row of four arrows pointing right says the work ends.
 *
 * Nothing here claims a result. "Compound" describes how the work is
 * organised — what was learned stays and gets reused — not an outcome anyone
 * is promised.
 */
const STEPS = [
  {
    n: '01',
    name: 'Ship',
    note: 'The work gets made and goes out — drafted out of the repo, so it already sounds like you.',
  },
  {
    n: '02',
    name: 'Distribute',
    note: 'It goes where your audience actually is. The channels are set up and fed, not just posted to.',
  },
  {
    n: '03',
    name: 'Measure',
    note: 'What it did comes back into the platform, against the asset that did it.',
  },
  {
    n: '04',
    name: 'Compound',
    note: 'Next month starts from what worked. Nothing gets rebuilt, and nothing gets guessed twice.',
  },
]

export default function HowItWorks() {
  return (
    <section className={styles.section} aria-labelledby="how-it-works">
      <p className={styles.eyebrow}>[ How it works ]</p>
      <h2 className={styles.headline} id="how-it-works">
        Ship, distribute, measure — and start the next one further along.
      </h2>

      <ol className={styles.steps}>
        {STEPS.map(({ n, name, note }) => (
          <li key={n} className={styles.step}>
            {/* The dot sits on the rule that runs behind the row. */}
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.num}>{n}</span>
            <h3 className={styles.name}>{name}</h3>
            <p className={styles.note}>{note}</p>
          </li>
        ))}
      </ol>

      <p className={styles.loop}>
        <span className={styles.loopMark} aria-hidden="true">↺</span>
        And again the following month, from a better starting position.
      </p>
    </section>
  )
}

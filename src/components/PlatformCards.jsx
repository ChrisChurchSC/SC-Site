import styles from './PlatformCards.module.css'

/**
 * The platform section: a headline, two actions, then two large cards and
 * three smaller ones.
 *
 * THE LAYOUT IS THE DELIVERABLE HERE. The cards' contents were explicitly not
 * in scope, so each one has its headline, its arrow, and an empty well where
 * the preview goes. The well is deliberately empty rather than filled with a
 * drawn approximation of a UI: a fake screenshot of software that does not
 * exist is the most convincing lie a page like this can tell, and it would
 * have to be thrown away the moment a real one exists.
 *
 * AND THE PLATFORM ITSELF DOES NOT EXIST — same standing note as the nav
 * panel it shares its copy with. No route, nothing in Sanity, no surface a
 * client logs into. The headlines below are the ones already written for that
 * panel, so the two cannot drift apart; the arrows do not link anywhere yet.
 *
 * The reference splits each headline in two weights — the subject in full
 * white, the rest muted — which is what lets a two-line headline still read
 * as one phrase. `lead` and `rest` are that split.
 */
const CARDS = [
  {
    id: 'brand-repository',
    lead: 'Brand Repository',
    rest: 'that everyone works from',
    size: 'large',
  },
  {
    id: 'agents',
    lead: 'Agents',
    rest: 'trained on your brand, not on the internet',
    size: 'small',
  },
  {
    id: 'reviews',
    lead: 'Reviews',
    rest: 'where a person still approves the work',
    size: 'small',
  },
  {
    id: 'measurement',
    lead: 'Measurement',
    rest: 'of what shipped and what it moved',
    size: 'small',
  },
]

/* Two of the nav panel's six are not cards here.

   Guardrails is cut. Library was already out. Both still appear in the
   Platform dropdown, which is the fuller list — the section is the argument,
   the menu is the index, and they do not have to be the same length.

   Agents moved down to the second row, which leaves Brand Repository alone
   first. It takes the whole width there rather than sitting at half with a
   hole beside it: one card in a two-column row is a gap, and a gap in a
   section this sparse reads as something failing to load. */

/**
 * The Brand Repository card's preview: the product's own UI, rebuilt in
 * markup.
 *
 * MARKUP RATHER THAN A SCREENSHOT. A PNG of a dark UI on a dark page has to
 * be colour-matched by hand and re-shot every time the app changes a border;
 * this inherits the page's own tokens, stays sharp at any density, weighs
 * nothing, and reflows instead of squashing. It is also the only version
 * that can be read in a light theme later without being re-exported.
 *
 * THE NUMBERS ARE REAL, AND THAT IS THE PART TO WATCH. Counts, ages and the
 * composition split are Chris's actual SC-Brand workspace as of this build.
 * That is what makes it worth showing, and it is also why it will be wrong
 * eventually — a screenshot goes stale the same way, but silently. They are
 * all in REPO below so it is one edit, and nothing here is load-bearing:
 * if they drift, the card is dated, not incorrect.
 *
 * DECORATIVE. It sits inside the well, which is already aria-hidden — the
 * card's heading is what carries the meaning. Nothing in here is focusable,
 * so a keyboard skips it entirely rather than tabbing a fake file list.
 */
const REPO = {
  folders: [
    { name: 'Agents', count: 7, age: '1d' },
    { name: 'Data', count: 1, age: '1d' },
    { name: 'Strategy', count: 9, age: '22h' },
    { name: 'Verbal', count: 3, age: '20h' },
    { name: 'Visual', count: 7, age: '22h' },
  ],
  stats: [
    { value: '68', label: 'assets' },
    { value: '1', label: 'editor' },
    { value: '0', label: 'not published' },
  ],
  /* Ordered biggest first, as the app shows it. The shares are the app's, not
     recomputed from the counts above — assets are not evenly sized, so a
     folder with 7 of them can be most of the repository by weight. */
  composition: [
    { name: 'Visual', pct: 63.2 },
    { name: 'Strategy', pct: 17.6 },
    { name: 'Agents', pct: 10.3 },
    { name: 'Verbal', pct: 7.4 },
    { name: 'Data', pct: 1.5 },
  ],
}

function FolderIcon() {
  return (
    <svg className={styles.uiFolder} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M1.5 3.5h4l1.4 1.6h7.6v7.4a1 1 0 0 1-1 1h-12a1 1 0 0 1-1-1z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function RepoPreview() {
  return (
    <div className={`${styles.ui} ${styles.uiZoomed}`}>
      <div className={styles.uiTop}>
        <span className={styles.uiCrumbMuted}>Super Conscious</span>
        <span className={styles.uiSlash}>/</span>
        <span className={styles.uiCrumb}>SC-Brand</span>
        <span className={styles.uiPrivate}>Private</span>
      </div>

      <div className={styles.uiBody}>
        <div className={styles.uiTree}>
          <span className={styles.uiTreeRoot}><FolderIcon />SC-Brand</span>
          {REPO.folders.map(({ name, count }) => (
            <span key={name} className={styles.uiTreeRow}>
              <FolderIcon />
              <span className={styles.uiTreeName}>{name}</span>
              <span className={styles.uiCount}>{count}</span>
            </span>
          ))}
        </div>

        <div className={styles.uiMain}>
          <div className={styles.uiTabs}>
            <span className={styles.uiTabOn}>Files</span>
            <span className={styles.uiTab}>Pull requests</span>
            <span className={styles.uiTab}>Activity</span>
            <span className={styles.uiTab}>Usage</span>
          </div>
          <div className={styles.uiList}>
            {REPO.folders.map(({ name, age }) => (
              <span key={name} className={styles.uiRow}>
                <FolderIcon />
                <span className={styles.uiRowName}>{name}</span>
                <span className={styles.uiAge}>{age}</span>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.uiAside}>
          <span className={styles.uiAsideHead}>About</span>
          {REPO.stats.map(({ value, label }) => (
            <span key={label} className={styles.uiStat}>
              <b className={styles.uiStatValue}>{value}</b> {label}
            </span>
          ))}

          <span className={styles.uiAsideHead}>Composition</span>
          <span className={styles.uiBar}>
            {REPO.composition.map(({ name, pct }, i) => (
              <span
                key={name}
                className={styles.uiSeg}
                /* One accent stepped down in opacity rather than five hues:
                   a stacked bar in five unrelated colours reads as a legend
                   to decode, not as one quantity split up. */
                style={{ width: `${pct}%`, opacity: 1 - i * 0.17 }}
              />
            ))}
          </span>
          <span className={styles.uiKeys}>
            {REPO.composition.slice(0, 3).map(({ name, pct }) => (
              <span key={name} className={styles.uiKey}>{name} {pct}%</span>
            ))}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * The Measurement card's preview: the performance dashboard.
 *
 * WHAT THE NUMBERS ARE, AND WHAT THEY ARE NOT. The repository preview above
 * shows real data, because SC-Brand exists and can be read. This one cannot:
 * the platform is COMING SOON, and there is no dashboard to screenshot. So
 * everything here is illustrative — the shape of the product, not a record
 * of anything.
 *
 * WHICH IS WHY IT COUNTS THINGS RATHER THAN CLAIMING RESULTS. Every value is
 * a count of work: assets shipped, assets in review, channels live, output
 * per week. Not one of them is a lift, a conversion rate, a revenue figure
 * or a percentage with a plus sign in front of it. That is deliberate and it
 * is the line worth holding: a made-up count of drafts is obviously a mock,
 * while a made-up "+284% engagement" is a performance claim, and a visitor
 * has no way to tell an illustrative one from a real one. This site already
 * refuses that trade in the case-study cards, which carry '––' rather than
 * numbers nobody has sourced.
 *
 * SO THE OUTCOME METRIC IS EMPTY ON PURPOSE. The card's own headline says
 * "what shipped and what it moved". The dashboard can show the first half
 * honestly and cannot show the second, so the second reads '––', the same
 * placeholder the case studies use. It is not an oversight and it should not
 * be filled in with a plausible figure — it is filled in when there is a
 * real one, from a real client, that someone has signed off.
 *
 * Decorative, like the other preview: it sits in the aria-hidden well and
 * nothing inside is focusable.
 */
const DASH = {
  stats: [
    { value: '42', label: 'shipped' },
    { value: '6', label: 'in review' },
    /* Not a number, and not to be made one. See above. */
    { value: '––', label: 'lift', empty: true },
  ],
  /* Assets out per week. Relative heights only — the panel has no y-axis and
     asserts no scale, because it is a shape, not a reading. */
  bars: [38, 52, 44, 61, 49, 72, 58, 80],
  channels: [
    { name: 'Paid social', pct: 42 },
    { name: 'Email', pct: 31 },
    { name: 'Organic', pct: 27 },
  ],
}

function DashPreview() {
  const peak = Math.max(...DASH.bars)

  return (
    <div className={styles.ui}>
      <div className={styles.uiTop}>
        <span className={styles.uiCrumb}>Performance</span>
        <span className={styles.uiSlash}>/</span>
        <span className={styles.uiCrumbMuted}>Last 8 weeks</span>
      </div>

      <div className={styles.dash}>
        <div className={styles.dashStats}>
          {DASH.stats.map(({ value, label, empty }) => (
            <span key={label} className={styles.dashStat}>
              <b className={`${styles.dashValue}${empty ? ' ' + styles.dashValueEmpty : ''}`}>{value}</b>
              <span className={styles.dashLabel}>{label}</span>
            </span>
          ))}
        </div>

        <div className={styles.dashChart}>
          {DASH.bars.map((v, i) => (
            /* Keyed by position: these are eight weeks, and two of them can
               legitimately hold the same value. */
            <span key={i} className={styles.dashBar} style={{ height: `${(v / peak) * 100}%` }} />
          ))}
        </div>

        <div className={styles.dashRows}>
          {DASH.channels.map(({ name, pct }) => (
            <span key={name} className={styles.dashRow}>
              <span className={styles.dashRowName}>{name}</span>
              <span className={styles.dashTrack}>
                <span className={styles.dashFill} style={{ width: `${pct}%` }} />
              </span>
              <span className={styles.dashPct}>{pct}%</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function Card({ id, lead, rest, size }) {
  return (
    <div className={`${styles.card} ${size === 'large' ? styles.cardLarge : styles.cardSmall}`}>
      <div className={styles.cardHead}>
        <h3 className={styles.cardTitle}>
          <span className={styles.lead}>{lead}</span>{' '}
          <span className={styles.rest}>{rest}</span>
        </h3>
        {/* Not a link yet — there is nowhere for it to go. It is here because
            it is part of the card's shape; give it an href with the page. */}
        <span className={styles.arrow} aria-hidden="true">↗</span>
      </div>
      {/* The well. The repository card fills it with the product's own UI;
          the rest stay empty on purpose — see the note at the top. */}
      <div className={styles.well} aria-hidden="true">
        {id === 'brand-repository' ? <RepoPreview /> : null}
        {id === 'measurement' ? <DashPreview /> : null}
      </div>
    </div>
  )
}

export default function PlatformCards({ eyebrow = '[ The Platform ]' }) {
  const large = CARDS.filter(c => c.size === 'large')
  const small = CARDS.filter(c => c.size === 'small')

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 className={styles.headline}>One place to run the brand.</h2>

      <div className={styles.actions}>
        <span className={styles.cta}>Coming soon</span>
        <span className={styles.ghost}>Take a tour</span>
      </div>

      <div className={`${styles.rowTwo}${large.length === 1 ? ' ' + styles.rowOne : ''}`}>
        {large.map(c => <Card key={c.id} {...c} />)}
      </div>

      <div className={styles.rowThree}>
        {small.map(c => <Card key={c.id} {...c} />)}
      </div>
    </section>
  )
}

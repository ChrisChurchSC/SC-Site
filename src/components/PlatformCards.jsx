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
 * THE THREE SMALL PREVIEWS ARE NOT WINDOWS.
 *
 * The repository card shows the product's actual UI, so it is framed and
 * chromed like the application it is. These three are not screenshots of
 * anything — there is no agents screen, no approvals screen and no dashboard
 * to photograph, because the platform is Coming Soon. Dressing them in the
 * same window chrome claimed four products exist and made the row read as
 * one app repeated four times.
 *
 * So they sit directly on the card: a small label, then the content. What
 * they show is true — the agents, their sources, the approval flow — without
 * the frame implying a screen that has been built.
 */

/**
 * Measurement: the counts, the output chart, the channel split.
 *
 * EVERY VALUE IS A COUNT OF WORK. Assets shipped, assets in review, output
 * per week, share per channel. Not one is a lift, a conversion rate, a
 * revenue figure or a percentage with a plus in front of it. A made-up count
 * of drafts is obviously a mock; a made-up "+284% engagement" is a
 * performance claim, and a visitor cannot tell an illustrative one from a
 * real one.
 *
 * WHICH IS WHY THE LIFT READS '––'. The card promises "what shipped and what
 * it moved". This can show the first half honestly and cannot show the
 * second, so the second carries the placeholder the case-study cards use.
 * Fill it when there is a real figure from a real client that someone has
 * signed off — not with a plausible one.
 */
const DASH = {
  stats: [
    { value: '42', label: 'shipped' },
    { value: '6', label: 'in review' },
    { value: '––', label: 'lift', empty: true },
  ],
  /* Relative heights only. No axis and no gridlines: there is nothing to
     read off it, and an axis would invite a measurement it has not earned. */
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
    <div className={styles.panel}>
      <span className={styles.panelLabel}>Output · last 8 weeks</span>

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
          /* Keyed by position: eight weeks, two of which can hold the same
             value. */
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
  )
}

/**
 * Agents: what each one reads from, and one of them refusing.
 *
 * A CONNECTED SYSTEM, NOT A LIST. Six agents wired to one repository — the
 * ring says the thing the card is actually claiming, which is that they all
 * read from the same place. A column of names could describe any wrapper
 * around a chat model, and a column of names with files under each said the
 * agents have sources without saying they share them.
 *
 * THE SOURCES ARE STILL WRITTEN OUT, under the ring, because a graph shows
 * that there is a knowledge base and cannot show what is in it.
 *
 * THE FILENAMES ARE THE REPOSITORY'S OWN. Strategy/positioning.md and
 * Verbal/tone-of-voice.md are named in the brand's notes; verticals/ is a
 * real folder and Data/ holds a metrics CSV. audience.md, proof-points.md
 * and copy-standards.md describe material those notes say lives in Strategy
 * and Verbal, but the exact filenames are not confirmed — they are the
 * plausible half of this panel, and the one to check before it ships.
 *
 * ALL SIX ARE ON THE RING NOW. The chip layout only had room for three; the
 * ring holds every one of them, which matters because "six trained" is a
 * claim the panel should be able to back up by counting.
 *
 * IT ENDS ON A REFUSAL. [CLAIM NEEDED: …] is a marker these agents genuinely
 * write, and the brand's notes call those markers the product rather than
 * boilerplate. A mock of an agent producing beautiful copy would say what
 * every AI panel on every site says; asked for a number nobody has sourced,
 * this one marks the gap and hands it back.
 */
const AGENTS = [
  { name: 'brand-strategist', files: ['positioning.md', 'audience.md'] },
  { name: 'comms-writer', files: ['tone-of-voice.md'], drafting: true },
  { name: 'media-strategist', files: ['verticals/', 'metrics.csv'] },
  { name: 'design-critic', files: [] },
  { name: 'sales-analyst', files: [] },
  { name: 'studio-ops', files: [] },
]

/* Ring geometry. Computed from the roster rather than hand-placed, so a
   seventh agent redistributes the ring instead of landing on top of a
   neighbour. Starts at the top and goes clockwise. */
const RING = { w: 340, h: 200, cx: 170, cy: 100, r: 72, hub: 20 }

function ringNode(i, total) {
  const angle = (i / total) * Math.PI * 2 - Math.PI / 2
  return { x: RING.cx + Math.cos(angle) * RING.r, y: RING.cy + Math.sin(angle) * RING.r, angle }
}

function AgentsPreview() {
  const nodes = AGENTS.map((a, i) => ({ ...a, ...ringNode(i, AGENTS.length) }))
  const sources = [...new Set(AGENTS.flatMap(a => a.files))]

  return (
    <div className={styles.panel}>
      <span className={styles.panelLabel}>{AGENTS.length} trained · one source</span>

      {/* Decorative: the roster and the sources are both written out below in
          real text, so nothing here is the only copy of anything. */}
      <svg
        className={styles.graph}
        viewBox={`0 0 ${RING.w} ${RING.h}`}
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        {/* Edges first, so the nodes sit on top of them rather than being
            crossed by their own lines. */}
        {nodes.map(({ name, x, y }) => (
          <line key={name} className={styles.edge} x1={RING.cx} y1={RING.cy} x2={x} y2={y} />
        ))}

        <circle className={styles.hub} cx={RING.cx} cy={RING.cy} r={RING.hub} />
        <text className={styles.hubText} x={RING.cx} y={RING.cy + 2.4} textAnchor="middle">SC-Brand</text>

        {nodes.map(({ name, x, y, drafting }) => {
          /* Labels lean away from the hub: the two on the flanks read
             outward, the ones at top and bottom are centred. Anything else
             puts a name across the ring. */
          const side = Math.abs(x - RING.cx) < 1 ? 'mid' : x > RING.cx ? 'right' : 'left'
          const anchor = side === 'mid' ? 'middle' : side === 'right' ? 'start' : 'end'
          const dx = side === 'mid' ? 0 : side === 'right' ? 9 : -9
          const dy = side === 'mid' ? (y < RING.cy ? -11 : 15) : 3

          return (
            <g key={name}>
              <circle
                className={drafting ? styles.nodeLive : styles.node}
                cx={x}
                cy={y}
                r={4}
              />
              <text className={styles.nodeText} x={x + dx} y={y + dy} textAnchor={anchor}>{name}</text>
            </g>
          )
        })}
      </svg>

      {/* The knowledge base, as text. The graph says the agents are wired to
          one source; this says what is in it. */}
      <span className={styles.agentFiles}>
        {sources.map(file => (
          <span key={file} className={styles.agentFile}>{file}</span>
        ))}
      </span>

      {/* The sentence around the marker is deliberately dull. The marker is
          the content. */}
      <div className={styles.agentDraft}>
        <span className={styles.agentDraftHead}>comms-writer · draft</span>
        <span className={styles.agentDraftBody}>
          Teams ship in half the time with{' '}
          <span className={styles.agentFlag}>[CLAIM NEEDED: source]</span>
        </span>
      </div>
    </div>
  )
}

/**
 * Reviews: a queue of approvals.
 *
 * A QUEUE, NOT A DIFF. This first showed one review with its changed files
 * and their added and deleted line counts, which is a developer's view of
 * the same event — it says "here is a patch" when the card's headline is
 * that a person still approves the work.
 *
 * THE FLOW IS REAL, THE ITEMS ARE ILLUSTRATIVE. A push opens a numbered
 * review holding what the files would become and writes nothing live;
 * merging is a separate, human step; Claude Desktop can propose through MCP
 * but cannot write live, delete or invite. The four titles are made up, and
 * safe to make up because they describe work rather than results.
 *
 * BOTH STATES ARE SHOWN. Nothing but pending items reads as a backlog;
 * nothing but ticks reads as a rubber stamp. Two of each, with the approved
 * ones carrying the name of the person who approved them, is what makes the
 * gate look like a decision rather than a delay.
 */
const APPROVALS = [
  { id: 'positioning', title: 'Tighten the positioning statement', by: 'brand-strategist', done: false },
  { id: 'launch', title: 'Q3 launch copy — 6 assets', by: 'comms-writer', done: false },
  { id: 'rates', title: 'Update the rate card', by: 'media-strategist', done: true },
  { id: 'tone', title: 'Tone pass on the FAQ', by: 'comms-writer', done: true },
]

function ReviewsPreview() {
  const pending = APPROVALS.filter(a => !a.done).length

  return (
    /* Framed and punched in, like the repository panel — approvals are a
       screen in the product, so this one is a window rather than a graphic.
       Agents and Measurement stay frameless: there is no agents screen and
       no dashboard, and dressing those as apps would claim screens that do
       not exist.

       Zoomed one step less than the repository. That panel is a wide window
       in a 21:9 card; this is a narrow one in a 4:5 card, where the same 32%
       and the same overhang would eat the meta line under every task. */
    <div className={`${styles.ui} ${styles.uiZoomed} ${styles.uiZoomTight}`}>
      <div className={styles.uiTop}>
        <span className={styles.uiCrumb}>Approvals</span>
        <span className={styles.uiSlash}>/</span>
        <span className={styles.uiCrumbMuted}>{pending} pending</span>
      </div>

      <div className={styles.review}>
        {APPROVALS.map(({ id, title, by, done }) => (
          <span key={id} className={styles.task}>
            {/* Two of these are empty, and that is the product. */}
            <span className={`${styles.taskBox}${done ? ' ' + styles.taskBoxDone : ''}`} aria-hidden="true">
              {done ? '✓' : ''}
            </span>
            <span className={styles.taskText}>
              <span className={`${styles.taskTitle}${done ? ' ' + styles.taskTitleDone : ''}`}>{title}</span>
              <span className={styles.taskMeta}>
                {done ? 'approved by chris-church' : `proposed by ${by}`}
              </span>
            </span>
          </span>
        ))}
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
        {id === 'agents' ? <AgentsPreview /> : null}
        {id === 'reviews' ? <ReviewsPreview /> : null}
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

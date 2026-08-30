import { Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList } from 'lucide-react'
import { dashboard as DASH } from '../data/dashboard'
import { agents as ROSTER } from '../data/agents'

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
    lead: 'Repo',
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

   Agents moved down to the second row, which leaves Repo alone
   first. It takes the whole width there rather than sitting at half with a
   hole beside it: one card in a two-column row is a gap, and a gap in a
   section this sparse reads as something failing to load. */

/**
 * The Repo card's preview: the product's own UI, rebuilt in
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
                /* The legend under the bar names only the top three. */
                data-tip={`${name} · ${pct}%`}
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
 * IT SHOWS PERFORMANCE, NOT OUTPUT, because that is what the card promises —
 * "what shipped and what it moved" — and a dashboard of assets-shipped
 * counts only ever answered the first half. Lift, click rate, conversions, a
 * weekly conversion trend, and conversion rate by channel.
 *
 * ALL OF IT IS INVENTED, AND THAT IS WHY THE PANEL SAYS SAMPLE DATA. This
 * used to be counts precisely because a made-up count of drafts is obviously
 * a mock while a made-up conversion rate is a performance claim a visitor
 * cannot tell from a real one. The tag is what makes the second kind
 * publishable: it frames the whole panel rather than any one figure.
 * DO NOT REMOVE IT WHILE THESE NUMBERS ARE MADE UP.
 *
 * The weekly figures sum to the conversions total on purpose. A panel whose
 * headline does not match its own chart is the detail that gives a mock
 * away.
 *
 * THE LIFT IS FILLED IN, ON REQUEST, AND THE PANEL SAYS "SAMPLE DATA"
 * BECAUSE OF IT.
 *
 * The +18% is invented. There is no sourced client lift anywhere in this
 * repo or the brand one — Data/ holds Super Conscious's own site analytics
 * (GA users, GSC impressions, single-digit daily actives across eight days
 * in August 2026), which is our traffic during instrumentation, not a client
 * outcome. Nothing in it can honestly be called a lift.
 *
 * A count of drafts is obviously a mock. A percentage with a plus in front
 * of it is a performance claim, and a reader cannot tell an illustrative one
 * from a real one — which is why it sat as '––' before. The marker in the
 * label is what resolves that: it makes the panel say it is a demo, so the
 * number is framed rather than asserted. It covers the counts too, which
 * were always invented.
 *
 * IF A REAL FIGURE ARRIVES, swap it in and delete the marker. Do not delete
 * the marker while the number is still made up.
 */

function DashPreview() {
  const peak = Math.max(...DASH.weeks)
  const best = Math.max(...DASH.channels.map(c => c.rate))

  return (
    <div className={styles.panel}>
      <span className={styles.panelLabel}>
        Performance · last 8 weeks
        <span className={styles.sample}>Sample data</span>
      </span>

      <div className={styles.dashStats}>
        {DASH.stats.map(({ value, label, empty }) => (
          <span key={label} className={styles.dashStat}>
            <b className={`${styles.dashValue}${empty ? ' ' + styles.dashValueEmpty : ''}`}>{value}</b>
            <span className={styles.dashLabel}>{label}</span>
          </span>
        ))}
      </div>

      <div className={styles.dashChart}>
        {DASH.weeks.map((v, i) => (
          /* Keyed by position: eight weeks, two of which can hold the same
             value. */
          <span
            key={i}
            className={styles.dashBar}
            data-tip={`Week ${i + 1} · ${v} conversions`}
            style={{ height: `${(v / peak) * 100}%` }}
          />
        ))}
      </div>

      <div className={styles.dashRows}>
        {DASH.channels.map(({ name, rate }) => (
          <span key={name} className={styles.dashRow} data-tip={`${name} · ${rate}% of clicks convert`}>
            <span className={styles.dashRowName}>{name}</span>
            <span className={styles.dashTrack}>
              <span className={styles.dashFill} style={{ width: `${(rate / best) * 100}%` }} />
            </span>
            <span className={styles.dashPct}>{rate}%</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/**
 * Agents: a character-select screen.
 *
 * THE ROSTER IS THE CONTENT AND THE FRAME IS THE JOKE. Six slots, one
 * picked, and a plate underneath naming what that agent will not do. It
 * reads as a game because a card that says "six specialist agents" and then
 * lists six hyphenated job titles is a paragraph pretending to be a
 * feature — this makes the roster something you look at.
 *
 * EVERY "WILL NOT" IS FROM THE AGENT'S OWN DEFINITION, not written to fit
 * the layout. brand-strategist marks a claim it cannot source; comms-writer
 * escalates positioning rather than deciding it; media-strategist marks an
 * unverified rate; design-critic measures rather than opines; sales-analyst
 * produces evidence and hands strategy on; studio-ops passes persuasive
 * prose to comms-writer. Those are the six agents' actual contracts, and
 * they are the reason this card is worth a slot on the page: the refusals
 * are the product.
 *
 * brand-strategist is the one picked because its refusal is the one with a
 * marker to show — [CLAIM NEEDED: …] is a string those agents genuinely
 * write, and the brand's notes call the markers the product rather than
 * boilerplate.
 *
 * WHAT THIS DROPPED. The previous version was a ring of nodes wired to the
 * repository, with the source files listed under it. The ring said "they
 * share one source", which is true and is also what the Repo
 * card two rows up already says with an actual screenshot of the repository.
 * This says the thing only this card can: what the six of them refuse to do.
 */
/* The roster and every refusal now live in src/data/agents.js, shared with
   the Encode step on a service page. Icons stay here because they are this
   card's own. */
const AGENT_ICONS = [Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList]
const AGENTS = ROSTER.map((a, i) => ({ ...a, Icon: AGENT_ICONS[i] }))

/* brand-strategist, because its refusal is the one with a marker to show. */
const PICKED = 0

function AgentsPreview() {
  const picked = AGENTS[PICKED]

  return (
    <div className={styles.panel}>
      <span className={styles.panelLabel}>Select agent</span>

      <div className={styles.roster}>
        {AGENTS.map(({ name, Icon }, i) => (
          <span
            key={name}
            className={`${styles.slot}${i === PICKED ? ' ' + styles.slotPicked : ''}`}
            /* The five unpicked names are not written anywhere on the card —
               the plate only describes the one that is selected — so without
               this the roster is five anonymous icons. */
            data-tip={`${name} · will not ${AGENTS[i].wont.toLowerCase()}`}
          >
            <Icon className={styles.slotIcon} size={18} strokeWidth={1.4} aria-hidden="true" />
            {/* The name is in the plate below, not in the tile: six of these
                at tile width would each wrap to three lines. The title
                attribute carries it for a mouse, and the roster is written
                out in the code either way. */}
          </span>
        ))}
      </div>

      <div className={styles.plate}>
        <span className={styles.plateName}>{picked.label ?? picked.name}</span>
        <span className={styles.plateDoes}>{picked.does}</span>
        <span className={styles.plateWont}>
          <span className={styles.plateWontKey}>Will not</span> {picked.wont}
        </span>
        <span className={styles.agentFlag}>[CLAIM NEEDED: source]</span>
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
            it is part of the card's shape; give it an href with the page.
            The tip is what stops that being a broken promise: the badge
            reads as a link, so hovering it should say why nothing happens. */}
        <span className={styles.arrow} data-tip="Coming soon" aria-hidden="true">↗</span>
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

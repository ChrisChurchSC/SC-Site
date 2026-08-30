import { Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList } from 'lucide-react'

import styles from './AgentWindow.module.css'
import { agents } from '../data/agents'

/**
 * ONE AGENT, AT WORK — the window in the "what they are" section.
 *
 * THE FILE, NOT ITS OUTPUT. It showed a draft with a marker in it, which
 * demonstrated what an agent DOES — but the section it sits in is explaining
 * what an agent IS, and the answer to that is the definition.
 *
 * Every line is from comms-writer's own definition: what it drafts, which
 * files it reads, the tools it has, and the thing it escalates rather than
 * deciding. [CLAIM NEEDED: …] is a string these agents genuinely write — the
 * brand's notes call the markers the product rather than boilerplate.
 */
const ICONS = {
  'brand-strategist': Compass,
  'comms-writer': PenLine,
  'media-strategist': TrendingUp,
  'design-critic': Ruler,
  'sales-analyst': ChartBar,
  'studio-ops': ClipboardList,
}

const AGENT = agents.find((a) => a.name === 'comms-writer') ?? agents[0]
const AgentIcon = ICONS[AGENT.name] ?? PenLine

const DEFINITION = [
  {
    key: 'Role',
    value: 'Drafts and edits anything the brand says out loud — launch copy, landing pages, emails, posts, decks, client comms, case studies.',
  },
  {
    key: 'Reads',
    value: 'Verbal/tone-of-voice.md · Strategy/positioning.md',
  },
  {
    key: 'Tools',
    value: 'Read · Grep · Glob · Write · Edit',
  },
  {
    key: 'Escalates',
    value: 'Positioning and claims → brand-strategist',
  },
]

export default function AgentWindow() {
  return (
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand / Agents /</span>
        <span className={styles.name}>{AGENT.name}.md</span>
        <span className={styles.badge}>Agent</span>
      </div>

      <div className={styles.tabs}>
        <span className={styles.tabOn}>Definition</span>
        <span className={styles.tab}>Drafts</span>
        <span className={styles.tab}>Sources</span>
        <span className={styles.sample}>Sample data</span>
      </div>

      <div className={styles.body}>
        <aside className={styles.side}>
          {/* The agent itself, at the top of its own panel — the definition
              below is its file, and this is who the file is for. */}
          <div className={styles.who}>
            <span className={styles.avatar}>
              <AgentIcon size={18} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <span className={styles.whoText}>
              <span className={styles.whoName}>{AGENT.name}</span>
              <span className={styles.whoDoes}>{AGENT.does}</span>
            </span>
          </div>

        </aside>

        <div className={styles.doc}>
          <span className={styles.sideLabel}>{AGENT.name}.md</span>

          <dl className={styles.def}>
            {DEFINITION.map(({ key, value }) => (
              <div key={key} className={styles.defRow}>
                <dt className={styles.defKey}>{key}</dt>
                <dd className={styles.defValue}>{value}</dd>
              </div>
            ))}
          </dl>

          {/* THE REFUSAL AS A BLOCK. It is the line that makes the rest of
              the file trustworthy, so it is not a row like the others. */}
          <p className={styles.marker}>
            <span className={styles.markerKey}>Will not</span>
            <span className={styles.markerBody}>{' '}
              {AGENT.wont.toLowerCase()} — where there is no proof point it writes
              [CLAIM NEEDED] rather than something plausible.
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

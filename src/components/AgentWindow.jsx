import { Compass, PenLine, TrendingUp, Ruler, ChartBar, ClipboardList } from 'lucide-react'

import styles from './AgentWindow.module.css'
import { agents } from '../data/agents'

/**
 * ONE AGENT'S DEFINITION FILE — the window in the "what they are" section.
 *
 * IT IS THE FILE, drawn the way the file actually looks: frontmatter at the
 * top, then the body. That is the answer to "what is an agent" — a markdown
 * file with a name, a description, a tool list and a rule it will not break.
 *
 * EVERYTHING HERE IS REAL. The description and the escalation are
 * comms-writer's own; the tool list is the one it is given; [CLAIM NEEDED: …]
 * is a string these agents genuinely write, and the brand's notes call the
 * markers the product rather than boilerplate. The dates in the side panel
 * are sample, which is what the tag says.
 *
 * comms-writer is shown because its refusal is the legible one: it drafts
 * everything the brand says out loud, and it still will not decide what may
 * be claimed.
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

/* The frontmatter, as it is written in the file. */
const FRONTMATTER = [
  ['name', 'comms-writer'],
  ['description', 'Drafts and edits anything the brand says out loud.'],
  ['tools', 'Read, Grep, Glob, Write, Edit'],
]

const SECTIONS = [
  {
    head: 'Use when',
    lines: ['Finished words are the deliverable — launch copy, landing pages, emails, posts, decks, client comms, case studies.'],
  },
  {
    head: 'Reads',
    lines: ['Verbal/tone-of-voice.md', 'Strategy/positioning.md', 'Strategy/proof-points.md'],
    mono: true,
  },
  {
    head: 'Escalates',
    lines: ['Positioning and claims → brand-strategist'],
    mono: true,
  },
]

/* The side panel's meta. Type and model are what a subagent actually
   carries; the dates are sample. */
const META = [
  ['Type', 'Subagent'],
  ['Scope', 'SC-Brand'],
  ['Version', 'v4'],
  ['Updated', '08-22'],
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
          <div className={styles.who}>
            <span className={styles.avatar}>
              <AgentIcon size={18} strokeWidth={1.4} aria-hidden="true" />
            </span>
            <span className={styles.whoText}>
              <span className={styles.whoName}>{AGENT.name}</span>
              <span className={styles.whoDoes}>{AGENT.does}</span>
            </span>
          </div>

          <dl className={styles.meta}>
            {META.map(([k, v]) => (
              <div key={k} className={styles.metaRow}>
                <dt className={styles.metaKey}>{k}</dt>
                <dd className={styles.metaValue}>{v}</dd>
              </div>
            ))}
          </dl>

          {/* THE REFUSAL, in the side panel where it reads as a property of
              the agent rather than as one more section of the file. */}
          <div className={styles.wont}>
            <span className={styles.wontKey}>Will not</span>
            <span className={styles.wontValue}>{AGENT.wont.toLowerCase()}</span>
          </div>
        </aside>

        <div className={styles.doc}>
          {/* Frontmatter, fenced as it is in the file — this is the part that
              makes an agent a thing rather than a prompt. */}
          <div className={styles.front}>
            <span className={styles.fence}>---</span>
            {FRONTMATTER.map(([k, v]) => (
              <span key={k} className={styles.frontRow}>
                <span className={styles.frontKey}>{k}:</span>
                <span className={styles.frontValue}>{v}</span>
              </span>
            ))}
            <span className={styles.fence}>---</span>
          </div>

          {SECTIONS.map(({ head, lines, mono }) => (
            <section key={head} className={styles.sec}>
              <h4 className={styles.secHead}>{head}</h4>
              {lines.map((l) => (
                <p key={l} className={mono ? styles.secMono : styles.secLine}>{l}</p>
              ))}
            </section>
          ))}

          {/* The marker it writes when it has to stop — the output, not an
              error state. */}
          <div className={styles.marker}>
            <span className={styles.markerKey}>[ CLAIM NEEDED: … ]</span>
            <span className={styles.markerBody}>
              Written in place of any claim with no proof point behind it, so the gap comes
              back to you as a gap.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

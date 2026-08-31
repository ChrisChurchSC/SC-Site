import { Folder, MousePointer2 } from 'lucide-react'

import styles from './ClaudeCodeWindow.module.css'

/**
 * THE TERMINAL — a Claude Code session, drawn as the thing it actually is.
 *
 * WHY THIS RATHER THAN A DRAWN "AI PANEL". The work genuinely happens here:
 * the brand is a folder of plain files, a model is pointed at it over MCP, and
 * what comes back is a draft and a proposed review. Every previous version of
 * this visual invented a product surface that does not exist — a chat pane
 * with a brand logo on it — which is a picture of software nobody has built.
 * A terminal is not decoration; it is where the repo is used.
 *
 * THE CHROME IS COPIED FROM THE REAL THING, down to the traffic lights, the
 * folder in the title, the dimensions in the tab name, the ›-prefixed input
 * bars and the status line. It reads as true because it is.
 *
 *
 * THE TRANSCRIPT IS ILLUSTRATIVE and the panel says so. What is NOT
 * illustrative is the shape: a question, a draft made from the files, and a
 * marker where a claim had no proof point — which is exactly what
 * comms-writer does.
 */

/* Rendered in order. `kind` picks the row's treatment:
     say    — Claude's turn, bulleted
     ask    — a person's input, on the lighter bar the real client draws
     muted  — the dim tool line between turns
     mark   — a refusal marker, in the pink the rest of the site uses
     cont   — a continuation line, indented under the row above */
const SESSION = [
  { kind: 'muted', text: 'Connected to SC-Brand over MCP · 24 files' },
  { kind: 'ask', text: 'draft the launch email' },
  { kind: 'say', text: 'comms-writer drafted it from Verbal/tone-of-voice.md and the approved claims in Strategy/proof-points.md.' },
  { kind: 'muted', text: 'Read 4 files' },
  { kind: 'cont', text: 'One line had no proof point behind it, so it is marked rather than written:' },
  { kind: 'mark', text: '[CLAIM NEEDED: 40% faster onboarding — brand-strategist]' },
  { kind: 'ask', text: 'who decided we spell it US?' },
  { kind: 'say', text: 'Chris, on 2026-08-27 — Verbal/tone-of-voice.md:144. Twelve replacements across five files in Agents/.' },
  { kind: 'ask', text: 'open a review for the email' },
  { kind: 'say', text: 'Review #132 opened. Nothing is live until you merge it.' },
]


export default function ClaudeCodeWindow() {
  return (
    <div className={styles.wrap}>
      <div className={styles.term}>
        <div className={styles.bar}>
          <span className={styles.lights} aria-hidden="true">
            <span className={`${styles.light} ${styles.red}`} />
            <span className={`${styles.light} ${styles.amber}`} />
            <span className={`${styles.light} ${styles.green}`} />
          </span>
          <span className={styles.barTitle}>
            <span className={styles.barDim}>chrischurch —</span> SC-Brand{' '}
            <span className={styles.barDim}>— mcp ‹ claude</span>
          </span>
        </div>

        <div className={styles.body}>
          {SESSION.map(({ kind, text }, i) => {
            if (kind === 'ask') {
              return (
                <p key={i} className={styles.ask}>
                  <span className={styles.caret}>&rsaquo;</span>
                  {text}
                </p>
              )
            }
            if (kind === 'say') {
              return (
                <p key={i} className={styles.say}>
                  <span className={styles.bullet}>&#9679;</span>
                  {text}
                </p>
              )
            }
            if (kind === 'mark') return <p key={i} className={styles.mark}>{text}</p>
            if (kind === 'cont') return <p key={i} className={styles.cont}>{text}</p>
            return <p key={i} className={styles.muted}>{text}</p>
          })}

          {/* The live prompt. The block after it is the caret, which is what
              makes the window read as a session in progress rather than a
              screenshot of one that ended. */}
          <p className={styles.prompt}>
            <span className={styles.caret}>&rsaquo;</span>
            <span className={styles.cursor} aria-hidden="true" />
          </p>
        </div>

        {/* THE DRAG. Chris described the whole thing as "drag and drop into an
            LLM and it will connect", and that gesture is the ten-second
            version of this page — so it is drawn on top of the real client
            rather than described in the list beside it. The transcript stays
            readable underneath: the folder is what you do, the session is
            what you get back, and the card needs both. */}
        <div className={styles.dropLayer} aria-hidden="true">
          <span className={styles.dropRing} />
          <span className={styles.dragFolder}>
            <Folder className={styles.dragIcon} size={17} strokeWidth={1.5} />
            <span className={styles.dragName}>SC-Brand</span>
            <span className={styles.dragCount}>24 files</span>
            <MousePointer2 className={styles.dragCursor} size={15} strokeWidth={1.6} />
          </span>
          <span className={styles.dropHint}>Drop to use as source</span>
        </div>

        <div className={styles.status}>
          <span className={styles.statusOn}>mcp connected</span>
          <span className={styles.statusDim}>· 24 files · 1 review open</span>
          <span className={styles.statusRight}>SC-Brand</span>
        </div>
      </div>

    </div>
  )
}

import { useState } from 'react'
import { BarChart3, Check, Download, Folder, History, User } from 'lucide-react'

import styles from './VisualSystemWindow.module.css'
import ScMark from './ScMark'
import LogoWordmark from './LogoWordmark'

/**
 * THE DESIGN SYSTEM, AS A SCREEN — the centre of the diagram on Build.
 *
 * IT REPLACED THE FILE BROWSER. RepoWindow sat here and listed five paths,
 * which answered "where does the brand live" on a page whose question is
 * "what is a brand made of". A foundations board answers the second one, and
 * it is the one thing on this page that shows the work rather than naming it.
 *
 * EVERY VALUE IN IT IS REAL, and that is the point of drawing it from the
 * codebase rather than typing it:
 *
 *   The logomark and logotype are ScMark and LogoWordmark — the actual
 *   components the nav renders, not a picture of them.
 *   The palette is the four tokens in src/index.css. If those change, this
 *   swatch row is wrong, which is the correct kind of coupling.
 *   Signifier and Roboto Mono are the two faces the site loads.
 *   The radii are --r-control / --r-surface / --r-panel off .page.
 *
 * WHAT IS DELIBERATELY NOT HERE: a spacing scale. The reference for this
 * board read "4px base · 12-column", and there is no spacing scale anywhere
 * in the design system — base.css declares none. 12-column is real, used in
 * Home and CaseStudy, so that half stayed and the invented half did not.
 *
 * PHOTOGRAPHY AND ILLUSTRATION ARE CUT, not hidden. The board sits in the
 * diagram's centre column, which FlowDiagram caps at ~470px; nine cells in
 * that height crushed every row into the one below it. The two that went
 * were the two with nothing in them — there is no artwork in this repo, so
 * they were empty wells with a label, which is the least a cell can do.
 * They belong here the moment there is something to put in them.
 */

/* The four tokens, from src/index.css. Names as the stylesheet has them. */
const PALETTE = [
  { hex: '#0A0A0A', token: '--bg' },
  { hex: '#DF4ED6', token: '--pink' },
  { hex: '#4ECFB3', token: '--teal' },
  { hex: '#5A76E5', token: '--blue' },
]

const ICONS = [Folder, Check, Download, BarChart3, User, History]

/* VERBAL IS REAL AND IS QUOTED, not paraphrased. All of it comes out of
   SC-Brand/Verbal/tone-of-voice.md v1, decided 2026-08-27: the six principle
   names, the governing test verbatim, the opening of the kill-on-sight list,
   and four of the mechanics. */
const PRINCIPLES = [
  'Say the thing',
  'Show the arithmetic',
  'Talk from inside the room',
  'Volunteer the uncomfortable part',
  'Sound like a person, not a category',
  'Earn the second sentence',
]

const KILL = ['seamless', 'robust', 'leverage', 'unlock', 'empower', 'game-changing', 'best-in-class', 'synergy']

const MECHANICS = ['US English', 'Oxford comma', 'Sentence case', 'Contractions', 'No emoji in owned copy']

/* AUDIO IS EMPTY, AND THAT IS THE HONEST STATE. There is no Audio folder in
   SC-Brand and no sound of any kind in this repo; the nearest thing that
   exists is "Sound" listed inside the Design input group. Four rows named and
   marked undefined is the truth. Filling them with an invented sonic logo
   would be the one thing a page about a brand system must not do — and the
   empty tab makes the better argument anyway: a system that shows you what
   it has not settled yet is a system you can trust about what it has. */
const AUDIO = ['Sonic logo', 'Voice and casting', 'Music direction', 'Interface sound']

const TABS = ['Visual', 'Verbal', 'Audio']

export default function VisualSystemWindow() {
  const [tab, setTab] = useState('Visual')

  return (
    /* NOT aria-hidden any more: the tabs are real buttons, so the panel is
       operable and has to be reachable. */
    <div className={styles.window}>
      <div className={styles.head}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.name}>{tab}</span>
        <span className={styles.badge}>System</span>
      </div>

      {/* THE THREE MODES A BRAND COMES IN, not a design-system's own
          sections. Foundations/Components describes how a component library
          is organised; Visual/Verbal/Audio describes what a brand is, which
          is the question this section asks.

          TWO OF THE THREE ARE FOLDERS IN SC-BRAND TODAY — Visual/ holds the
          design system, Verbal/ holds the tone of voice. Audio is not: the
          nearest thing that exists is "Sound" inside the Design input group.
          It is on the tab row because a brand has a sound whether or not we
          have filed one, but it is the one of the three that is ahead of the
          repo. The crumb follows the open tab, as a path does. */}
      <div className={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={t === tab ? styles.tabOn : styles.tab}
            aria-pressed={t === tab}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
        <span className={styles.version}>v3</span>
      </div>

      {tab === 'Visual' && (
      <div className={styles.board}>
        <div className={`${styles.cell} ${styles.cellMark}`}>
          <span className={styles.label}>Logomark</span>
          <span className={styles.markWrap}><ScMark className={styles.mark} /></span>
        </div>

        <div className={`${styles.cell} ${styles.cellType}`}>
          <span className={styles.label}>Type</span>
          <span className={styles.serif}>Signifier</span>
          <span className={styles.mono}>Roboto Mono</span>
        </div>

        <div className={`${styles.cell} ${styles.cellUi}`}>
          <span className={styles.label}>UI</span>
          <span className={styles.btnFilled}>Start a project</span>
          <span className={styles.btnGhost}>See pricing</span>
          <span className={styles.field}>you@company.com</span>
          <span className={styles.uiRow}>
            <span className={styles.toggle}><span className={styles.knob} /></span>
            <span className={styles.chip}>Live</span>
          </span>
        </div>

        <div className={`${styles.cell} ${styles.cellWord}`}>
          <span className={styles.label}>Logotype</span>
          <span className={styles.wordWrap}><LogoWordmark fill="#f0f0f0" /></span>
        </div>

        <div className={`${styles.cell} ${styles.cellPalette}`}>
          <span className={styles.label}>Palette</span>
          <span className={styles.swatches}>
            {PALETTE.map(({ hex, token }) => (
              <span key={token} className={styles.swatchWrap}>
                <span className={styles.swatch} style={{ background: hex }} />
                <span className={styles.hex}>{hex}</span>
              </span>
            ))}
          </span>
        </div>


        <div className={`${styles.cell} ${styles.cellIcons}`}>
          <span className={styles.label}>Icons</span>
          <span className={styles.icons}>
            {ICONS.map((Glyph, i) => <Glyph key={i} className={styles.icon} strokeWidth={1.5} />)}
          </span>
        </div>


        <div className={`${styles.cell} ${styles.cellGrid}`}>
          <span className={styles.label}>Grid &amp; radii</span>
          <span className={styles.rule} />
          <span className={styles.mono}>12-column &middot; 4 / 12 / 18px</span>
        </div>
      </div>
      )}

      {tab === 'Verbal' && (
        <div className={styles.verbal}>
          {/* THE TEST LEADS. It is the one line in tone-of-voice.md that
              outranks the rest — "this test outranks every other" — so it
              sits at the top set as a sentence rather than buried under a
              list of six. */}
          <div className={styles.verbalLead}>
            <span className={styles.label}>The governing test</span>
            <p className={styles.quote}>
              Would this sentence survive if you swapped in a competitor&rsquo;s name?
            </p>
            <p className={styles.quoteNote}>If yes, delete it. It is category description, not us.</p>
          </div>

          {/* Numbered because they ARE numbered in the file — one to six —
              and the order is the file's, not a layout choice. */}
          <div className={styles.verbalRow}>
            <span className={styles.label}>Six principles</span>
            <ol className={styles.principles}>
              {PRINCIPLES.map((p, i) => (
                <li key={p} className={styles.principle}>
                  <span className={styles.pn}>{String(i + 1).padStart(2, '0')}</span>
                  {p}
                </li>
              ))}
            </ol>
          </div>

          <div className={styles.verbalSplit}>
            <div>
              <span className={styles.label}>Kill on sight</span>
              <span className={styles.chips}>
                {KILL.map((k) => <span key={k} className={styles.struck}>{k}</span>)}
              </span>
            </div>
            <div>
              <span className={styles.label}>Mechanics</span>
              <span className={styles.chips}>
                {MECHANICS.map((m) => <span key={m} className={styles.word}>{m}</span>)}
              </span>
            </div>
          </div>
        </div>
      )}

      {tab === 'Audio' && (
        <div className={styles.empty}>
          <span className={styles.emptyLead}>Not defined yet.</span>
          <span className={styles.emptyNote}>
            Nothing has been settled here, so the system says so rather than showing you
            something nobody agreed to.
          </span>
          <span className={styles.emptyRows}>
            {AUDIO.map((a) => (
              <span key={a} className={styles.emptyRow}>
                {a}
                <span className={styles.undef}>Undefined</span>
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  )
}

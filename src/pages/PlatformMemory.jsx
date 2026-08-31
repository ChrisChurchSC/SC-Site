import styles from './PlatformMemory.module.css'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import ServiceFaq from '../components/ServiceFaq'
import MemoryCards from '../components/MemoryCards'
import MemoryWindow from '../components/MemoryWindow'
import MemoryMap from '../components/MemoryMap'
import EmailCaptureForm from '../components/EmailCaptureForm'
import HowItWorks from '../components/HowItWorks'
import TestimonialCard from '../components/TestimonialCard'
import DotNav from '../components/DotNav'
import { useMeta } from '../hooks/useMeta'
import { markers } from '../data/decisions'

/**
 * /platform/memory — the fourth of the six platform pages.
 *
 * THE GROUND THIS PAGE HAS TO HOLD, or it should be cut. Repo already sells
 * structure and history; Reviews already sells approval. Memory is only worth
 * a nav row if it does something neither does, and it does: it keeps the
 * REASON attached to the rule, and the option that was REJECTED alongside the
 * one that won. A version history tells you the line changed. It cannot tell
 * you what else was on the table, or why that lost, and that is the first
 * thing gone when the person who decided it leaves.
 *
 * CHRIS SET THE BOUNDARY: Reviews is the gate, Memory is after. The page
 * states it outright in its own section rather than leaving two nav rows to
 * fight over the same idea, and the first How it works step hands off from the
 * review queue so the sequence carries it too.
 *
 * EVERY DECISION ON THIS PAGE IS REAL. Not sample, not illustrative — three
 * decisions out of the SC-Brand working copy, on the dates they were made, in
 * the files they govern, with their line references checked before they went
 * up. See src/data/decisions.js, which also records the one open decision
 * deliberately left off: proof-points.md turns on getting permission to name
 * two clients, and naming them while saying we may not is the thing itself.
 *
 * SO THE HERO CARRIES NO SAMPLE DATA TAG. It is the only window on this site
 * that does not need one, and that is the strongest fact the page has.
 *
 * THE COPY IS MINE AND UNAPPROVED — the headline, the intros, the four steps
 * and all six answers below.
 */

/* The questions the page provokes. Every mechanism in an answer is real: the
   numbered review, the struck-and-dated entry in tone-of-voice.md, the markers
   addressed to an owner, and plain files that outlive a model.
   THE WORDING IS MINE AND UNAPPROVED. */
const FAQS = [
  {
    q: 'Is this just our chat history?',
    a: 'No. A transcript is everything that was said. This is only what was decided — written into the file the decision governs, with a date and a name on it. You read three lines rather than three hours, and you read them where the rule already lives.',
  },
  {
    q: 'What actually goes in it?',
    a: 'Decisions and the reasoning behind them, the option that was rejected, results that have already been merged, and the questions nobody has answered yet. Anything unanswered is addressed to whoever can answer it rather than left as a general worry.',
  },
  {
    q: 'How is that different from the repo’s history?',
    a: 'A history tells you the line changed, when, and by whom. It cannot tell you what else was on the table or why that lost. This keeps the alternative next to the decision, so the argument does not have to be reconstructed from a diff.',
  },
  {
    q: 'Who decides what gets recorded?',
    a: 'A person, at the review. Reviews is the gate — nothing lands until somebody merges it. Memory is what the gate leaves behind. Nothing writes itself into the record on the way past.',
  },
  {
    q: 'Does it keep the things we got wrong?',
    a: 'Yes, deliberately. A reversed decision is struck through and dated rather than deleted, because “we tried that in August and here is why it did not work” is the single most expensive thing to lose. A record that only holds what survived is a highlight reel.',
  },
  {
    q: 'Does it survive us changing model?',
    a: 'It is plain files. Nothing in the record is a feature of whichever model is current this year — hand the folder to the next one and the decisions, the dates and the reasons come with it.',
  },
]

export default function PlatformMemory() {
  useMeta({
    title: 'Memory | Super Conscious',
    description: 'What was decided, what shipped, and why — so nothing is reinvented twice.',
  })

  return (
    <main className={styles.page}>
      <V3Nav />

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>[ Memory ]</p>
          <h1 className={styles.headline}>
            Every decision, with the reason still attached.
          </h1>
          <p className={styles.intro}>
            What was decided, when, and what it ruled out &mdash; kept in the files it governs, so
            the same question is not argued twice and the answer outlives whoever was in the room.
          </p>
          <div className={styles.formWrap}>
            <EmailCaptureForm
              styles={styles}
              variant="compact"
              placeholder="What's your work email?"
              submitLabel="See the record"
              subject="Memory page — demo request"
              requestType="platform-memory-demo"
              confirmMessage="Thanks — we will send over a time and open the record with you."
            />
            {/* Says what the form does, and nothing about how fast anyone
                replies. Response times are Chris's to keep. */}
            <p className={styles.formNote}>We&rsquo;ll follow up by email.</p>
          </div>
        </div>

        {/* THE RECORD ITSELF, and it is ours. The other platform heroes draw a
            plausible screen; this one draws three decisions that actually got
            made, which is why it is the hero rather than a section. */}
        <div className={styles.heroStage}>
          <MemoryWindow bare />
        </div>
      </header>

      <hr className={styles.divider} />

      <section className={styles.cardsBlock} aria-label="What memory does for the brand">
        <MemoryCards />
      </section>

      <hr className={styles.divider} />

      {/* THE BOUNDARY, STATED. Two nav rows that both sound like "we keep track
          of changes" would cannibalize each other, so the page draws the line
          itself and reuses the review queue rather than redrawing it. */}
      {/* THE RECORD, LAID OUT. Full width rather than a card beside a
          paragraph: this is meant to be read across, and the reference Chris
          gave for it is a canvas, not a panel. */}
      <section className={`${styles.block} ${styles.dotted}`} aria-labelledby="boundary">
        <div className={styles.mapHead}>
          <p className={styles.sectionEyebrow}>[ Where it starts ]</p>
          <h2 className={styles.blockHead} id="boundary">
            Reviews is the gate. Memory is what it leaves behind.
          </h2>
          <p className={styles.blockIntro}>
            A push opens a numbered review and writes nothing live; a person merges it. That is
            the gate, and it is the only way in. What the record holds is the far side of it
            &mdash; the decision, the date, the name, and the alternative that did not get
            merged.
          </p>
        </div>

        <MemoryMap />
      </section>

      <hr className={styles.divider} />

      <section className={`${styles.block} ${styles.blockCentered} ${styles.blockTight}`} aria-labelledby="markers">
        <p className={styles.sectionEyebrow}>[ When there is no answer yet ]</p>
        <h2 className={styles.blockHead} id="markers">
          A gap gets a name and an owner.
        </h2>
        <p className={styles.blockIntro}>
          The expensive failure is not a wrong answer, it is a missing one that reads as settled.
          So nothing unevidenced gets smoothed over &mdash; it gets marked, in the text, addressed
          to whoever can close it. These four are the conventions the repo already runs on.
        </p>

        <div className={styles.markers}>
          {markers.map(({ tag, owner, note }) => (
            <div key={tag} className={styles.marker}>
              <span className={styles.markerTag}>[{tag}]</span>
              <span className={styles.markerNote}>{note}</span>
              <span className={styles.markerOwner}>{owner}</span>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      <HowItWorks slug="memory" />

      <hr className={styles.divider} />

      <TestimonialCard variant="memory" />

      <hr className={styles.divider} />

      <ServiceFaq items={FAQS} headline="The ones we get asked about memory." />

      <FooterCard columns={FOOTER_COLS} />
      <V3Signoff />
      <DotNav />
    </main>
  )
}

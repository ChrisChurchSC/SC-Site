import styles from './PlatformMemory.module.css'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import ServiceFaq from '../components/ServiceFaq'
import MemoryCards from '../components/MemoryCards'
import InputsWindow from '../components/InputsWindow'
import MemoryMap from '../components/MemoryMap'
import EmailCaptureForm from '../components/EmailCaptureForm'
import HowItWorks from '../components/HowItWorks'
import TestimonialCard from '../components/TestimonialCard'
import DotNav from '../components/DotNav'
import { useMeta } from '../hooks/useMeta'
import { corpus, corpusTotal } from '../data/brandCorpus'

/**
 * /platform/memory — the fourth of the six platform pages.
 *
 * WHAT THE PAGE IS ABOUT, which is not the same as what it used to be about.
 * It is about what the brand KNOWS — positioning, voice, evidence, the design
 * system, the agents and what shipped, all of it written down and carried as
 * memory. Decisions are one thing that memory holds, and leading on them made
 * the page read as a changelog.
 *
 * WHERE THE REAL RECORD SURVIVES, which is now a short list and worth keeping
 * an eye on. The hero draws the input taxonomy; the markers section has been
 * cut. What is left that came off the working copy: the Governance card and
 * the open row of the Define table, the whole of the Usage card, the treemap,
 * and the rotating memory step of How it works. Everything else on the page is
 * a product surface carrying a Sample data tag.
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
    description: 'Everything that defines the brand, held as memory a model can read.',
  })

  return (
    <main className={styles.page}>
      <V3Nav />

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>[ Memory ]</p>
          {/* THE PAGE IS ABOUT WHAT THE BRAND KNOWS, and the hero has to say
              that before anything else does. It used to open on decisions,
              which is one thing the memory holds rather than the thing itself —
              positioning, voice, the design system and the evidence are all in
              there too, and leading on decisions made the page sound like a
              changelog. The decisions are still the sharpest proof it is real,
              so they stay in the window beside this and in the record below. */}
          <h1 className={styles.headline}>
            Everything that defines the brand, held as memory.
          </h1>
          {/* The two figures are read from src/data/brandCorpus.js, which was
              measured off the working copy, so they cannot drift from the map
              further down the page. */}
          <p className={styles.intro}>
            Positioning, voice, evidence, the design system and what shipped &mdash;{' '}
            {corpus.length} files and around {Math.round(corpusTotal / 1000)}k tokens of it.
            Anything working on this brand starts from what it already knows, rather than from
            whatever fits in one prompt.
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

        {/* WHAT THE BRAND KNOWS, INVENTORIED. The hero used to draw the three
            real decisions, which made the page read as a changelog of them.
            Decisions are one row of this taxonomy and they keep the record
            further down, where the fact that they are real is the argument.

            SAME SIZE AS ITS SIBLINGS: 1 / 1, the ratio the measurement and repo
            heroes use, so the three platform pages open identically.

            THE DECISION RECORD IS NO LONGER PERMANENTLY ON THIS PAGE. It was
            the hero, and it was the one window here that needed no Sample data
            tag. It now appears only in the rotating memory step of How it
            works. Real entries still show in the Governance card and in the
            open row of Define. */}
        <div className={styles.heroStage}>
          <InputsWindow ratio="1 / 1" />
        </div>
      </header>

      <hr className={styles.divider} />

      <section className={styles.cardsBlock} aria-label="What memory does for the brand">
        <MemoryCards />
      </section>

      <hr className={styles.divider} />

      {/* THE MEMORY, MEASURED. Full width rather than a card beside a
          paragraph: this is meant to be read across, and the reference Chris
          gave for it is a canvas, not a panel.

          THE BOUNDARY WITH REVIEWS used to be argued here, and is not any more
          — this section shows what the memory is made of. The line is still
          drawn twice on the page, in the first How it works step and in the
          "Who decides what gets recorded?" answer, so the two nav rows still
          do not cannibalize each other. */}
      <section className={`${styles.block} ${styles.dotted}`} aria-labelledby="corpus">
        <div className={styles.mapHead}>
          <p className={styles.sectionEyebrow}>[ Where it starts ]</p>
          <h2 className={styles.blockHead} id="corpus">
            The brand, defined into something that can be remembered.
          </h2>
          <p className={styles.blockIntro}>
            Not a deck and not a folder of exports &mdash; {corpus.length} files, each one a piece
            of what the brand knows. Every box below is one of them, sized by how much of the
            memory it takes up.
          </p>
        </div>

        <MemoryMap />
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

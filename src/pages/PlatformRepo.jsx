import { NavLink } from 'react-router-dom'

import styles from './PlatformRepo.module.css'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import ServiceFaq from '../components/ServiceFaq'
import RepoWindow from '../components/RepoWindow'
import RepoCards from '../components/RepoCards'
import RepoTree from '../components/RepoTree'
import RepoUse from '../components/RepoUse'
import HowItWorks from '../components/HowItWorks'
import TestimonialCard from '../components/TestimonialCard'
import EmailCaptureForm from '../components/EmailCaptureForm'
import DotNav from '../components/DotNav'
import { useMeta } from '../hooks/useMeta'

/**
 * /platform/repo — the third of the six platform pages.
 *
 * THIS IS THE ONE PAGE WHERE THE THING BEING SOLD IS SITTING RIGHT THERE. The
 * agents page had to draw a definition file; the measurement page runs on
 * sample figures. The repo is real: SC-Brand exists, it has these folders, the
 * sync CLI pulls and pushes it, a push opens a numbered review holding what
 * the files would become, and merging is a person's job. Every claim on this
 * page is a description of something in the working copy rather than a
 * promise about a product.
 *
 * THE PATHS ARE ALREADY PUBLIC. Strategy/positioning.md,
 * Verbal/tone-of-voice.md, Agents/*.md and Data/metrics.csv are drawn in the
 * repo window, the diff window and the dashboard on four other pages of this
 * site, so showing the structure here exposes nothing that was not already on
 * screen.
 *
 * THE COPY IS MINE AND UNAPPROVED.
 */
const FAQS = [
  {
    q: 'Is it literally a repository?',
    a: 'Yes — files in folders, with a history. That is the whole idea: the brand is kept the way software is kept, so it can be versioned, reviewed and read by a machine rather than living in a slide nobody can find.',
  },
  {
    q: 'Do I need to know git to use it?',
    a: 'No. You open it in Claude, in the app, or as a folder. The versioning happens underneath; nothing asks you to branch or rebase.',
  },
  {
    q: 'What stops someone changing the brand by accident?',
    a: 'Every change is proposed rather than written. A push opens a numbered review holding what the files would become and writes nothing live, and merging is a person’s job. The sync also refuses to run over a conflict rather than picking a winner.',
  },
  {
    q: 'How do I know what changed, and when?',
    a: 'Every file is tracked against a checksum, so the system knows exactly what moved. What you read is a diff with a date and a name on it, which is a better answer than anyone’s memory of a meeting.',
  },
  {
    q: 'Can our other tools read it?',
    a: 'That is the point of keeping it in plain files. Drop the folder into a model and it has your positioning and voice; connect it over MCP and the model reads the live version and can propose changes back.',
  },
  {
    q: 'Who owns it?',
    a: 'You do. It is your brand in your repo — portable, readable without us, and not locked to whichever model or tool is current this year.',
  },
]

export default function PlatformRepo() {
  useMeta({
    title: 'Repo | Super Conscious',
    description: 'The structure that holds everything the brand is made of, and keeps it usable.',
  })

  return (
    <main className={styles.page}>
      <V3Nav />

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>[ Repo ]</p>
          <h1 className={styles.headline}>
            The brand, kept the way software is kept.
          </h1>
          <p className={styles.intro}>
            Positioning, voice, assets, agents and data in one structure — versioned, readable
            by a machine, and open to anyone you give it to.
          </p>
          <div className={styles.formWrap}>
            <EmailCaptureForm
              styles={styles}
              variant="compact"
              placeholder="What's your work email?"
              submitLabel="See the repo"
              subject="Repo page — demo request"
              requestType="platform-repo-demo"
              confirmMessage="Thanks — we will send over a couple of times to show you around it."
            />
            <p className={styles.formNote}>We&rsquo;ll follow up by email.</p>
          </div>
        </div>

        <div className={styles.heroStage}>
          <RepoWindow big ratio="1 / 1" />
        </div>
      </header>

      <hr className={styles.divider} />

      <section className={styles.cardsBlock} aria-label="What the repo gives you">
        <RepoCards />
      </section>

      <hr className={styles.divider} />

      <RepoTree />

      <hr className={styles.divider} />

      <RepoUse />

      <hr className={styles.divider} />

      <HowItWorks slug="repo" />

      <hr className={styles.divider} />

      <TestimonialCard variant="repo" />

      <hr className={styles.divider} />

      <ServiceFaq items={FAQS} headline="The ones we get asked about the repo." />

      <FooterCard columns={FOOTER_COLS} />
      <V3Signoff />
      <DotNav />
    </main>
  )
}

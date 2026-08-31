import { NavLink } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import styles from './PlatformOverview.module.css'
import V3Nav, { FOOTER_COLS, PLATFORM_PAGES } from '../components/V3Nav'
import FooterCard from '../components/FooterCard'
import V3Signoff from '../components/V3Signoff'
import ServiceFaq from '../components/ServiceFaq'
import PlatformLoop from '../components/PlatformLoop'
import EmailCaptureForm from '../components/EmailCaptureForm'
import HowItWorks from '../components/HowItWorks'
import TestimonialCard from '../components/TestimonialCard'
import DotNav from '../components/DotNav'
import { useMeta } from '../hooks/useMeta'

/**
 * /platform — the parent of the six, and the only one about the whole.
 *
 * THE GAP IT FILLS. The nav has carried a Platform menu with six children and
 * `href: null` on the trigger since it was written: six destinations and no
 * page saying what the thing is for. Services, Case Studies and Company all
 * pair a panel with an index. This is Platform's.
 *
 * BENEFITS, NOT FEATURES — that is the whole brief. The six child pages each
 * argue one mechanism well; a visitor who has not decided they care about a
 * decision record does not want a seventh mechanism, they want the sentence
 * they recognise themselves in. So the spine of this page is six problems,
 * each paired with the part that answers it. That pairing does a second job:
 * it is the argument for why the nav has six rows rather than four.
 *
 * IT IS HONEST ABOUT WHERE THIS IS. V3Nav says plainly that the platform is
 * still a proposal — no route, nothing in Sanity, no part of the site a
 * client logs into — and the menu panel says "Coming soon". A benefits page
 * that read as shipped SaaS would be the site contradicting its own nav, so
 * the hero carries a status line naming what runs today and what does not.
 * Do not quietly drop it when the product catches up; change it.
 *
 * NO INVENTED OUTCOMES. Every gain below is structural — a thing that is true
 * because of how the system is shaped, not a result somebody measured. "New
 * people are productive in a day" is the sentence this page wants and cannot
 * have, because nobody has measured it.
 *
 * THE COPY IS MINE AND UNAPPROVED.
 */

/* THE SIX PROBLEMS, each answered by one row of the nav. Keyed by name so the
   link, the icon and the label come from PLATFORM_PAGES — a part with no page
   yet renders unlinked, the way the nav panel already renders it.

   These are ordinary failure modes of running a brand across more than a few
   people. None of them is a claim about a client, and none is a statistic.
   THE WORDING IS MINE AND UNAPPROVED. */
const HELPS = [
  {
    part: 'Repo',
    problem: 'The brand really only exists in two or three people’s heads.',
    note: 'Everything it is made of, in one structure anyone can open.',
  },
  {
    part: 'Agents',
    problem: 'Everything anyone writes has to be checked by hand, by whoever knows the voice.',
    note: 'They draft from your files, and mark what they cannot back up.',
  },
  {
    part: 'Reviews',
    problem: 'Work goes out that nobody senior actually approved.',
    note: 'Every change is proposed. A person merges it, or it does not land.',
  },
  {
    part: 'Memory',
    problem: 'The same argument comes back every quarter, and nobody remembers what was settled.',
    note: 'The decision, the date, the reason, and what was rejected.',
  },
  {
    part: 'Library',
    problem: 'Nobody can find the current version, so somebody makes it again.',
    note: 'What has been made, and what each piece is standing on.',
  },
  {
    part: 'Measurement',
    problem: 'You can see the numbers moved. You cannot see which work moved them.',
    note: 'Results joined to the asset, the draft and the brief behind them.',
  },
]

/* WHAT CHANGES. Three, and every one is structural rather than measured —
   see the note at the top about invented outcomes. THE WORDING IS MINE. */
const GAINS = [
  {
    lead: 'Someone who was not in the room can still use it.',
    line: 'The brand is a folder they can read, not a meeting they missed or a deck they cannot find.',
  },
  {
    lead: 'A draft comes back sounding like you.',
    line: 'And where a claim has nothing behind it, it comes back marked rather than confidently wrong.',
  },
  {
    lead: 'It stays yours.',
    line: 'Plain files you own — readable without us, and not tied to whichever model is current this year.',
  },
]

/* Platform-level questions: the ones asked before anybody cares which of the
   six does what. Every answer describes something real — the folder, the sync
   CLI, MCP, the agents' refusals — or says plainly that it is not built yet.
   THE WORDING IS MINE AND UNAPPROVED. */
const FAQS = [
  {
    q: 'Is this software we log into?',
    a: 'Not yet, and the nav says so rather than implying otherwise. Today it is a repository you own: a folder on your machine, open in the app, or connected to Claude over MCP. The parts described here run that way now; the hosted product a client signs into is being built.',
  },
  {
    q: 'Do we have to use Claude?',
    a: 'No. It is plain files, which is the point. Drop the folder into any model and it reads your positioning, voice and approved claims. The MCP connection is the step up — it reads the live repo rather than a copy, and can propose changes back — and that one is Claude today.',
  },
  {
    q: 'What happens to the brand guidelines we already have?',
    a: 'They become the starting contents. The work is turning a document written for people into a structure a machine can also read — which is mostly a matter of splitting what is true from how it sounds, and giving every claim somewhere to keep its source.',
  },
  {
    q: 'Who runs it — you or us?',
    a: 'Build sets it up and puts the brand into it. Grow runs it with you, or your own team does once it is standing. Nothing about it requires us to stay: that is the difference between a platform and a retainer.',
  },
  {
    q: 'How is this different from a brand portal?',
    a: 'A portal publishes the rules for people to read. This is read and written by the tools that make the work — so the brand is not a reference somebody is supposed to consult, it is the thing the draft comes out of.',
  },
  {
    q: 'What if we stop working with you?',
    a: 'You keep the repository. It is your files, in a format anything can read, with the whole history and the reasoning attached. There is no export to request and nothing to unpick.',
  },
]

const byName = (name) => PLATFORM_PAGES.find((p) => p.name === name)

export default function PlatformOverview() {
  useMeta({
    title: 'Platform | Super Conscious',
    description: 'One place to run the brand — what it is for, and what it helps with.',
  })

  return (
    <main className={styles.page}>
      <V3Nav />

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>[ Platform ]</p>

          {/* Where it actually is. See the note at the top of this file. */}
          <p className={styles.status}>
            <span className={styles.statusKey}>In build</span>
            The repo, the agents and the reviews run today. There is nothing to log into yet.
          </p>

          <h1 className={styles.headline}>
            One place to run the brand.
          </h1>
          <p className={styles.intro}>
            Everything the brand is made of, held so that people and models can both use it &mdash;
            and so that what gets made from it sounds right, gets approved, and teaches the next
            round something.
          </p>
          <div className={styles.formWrap}>
            <EmailCaptureForm
              styles={styles}
              variant="compact"
              placeholder="What's your work email?"
              submitLabel="See it working"
              subject="Platform overview — demo request"
              requestType="platform-overview-demo"
              confirmMessage="Thanks — we will be in touch to show you around the whole thing."
            />
            {/* Says what the form does, and nothing about how fast anyone
                replies. Response times are Chris's to keep. */}
            <p className={styles.formNote}>We&rsquo;ll follow up by email.</p>
          </div>
        </div>

        {/* THE CIRCUIT, which is the one picture only this page gets to draw.
            Its children each own one screen; the parent owns the order they
            run in and the fact that the last one feeds the first. */}
        <div className={styles.heroStage}>
          <PlatformLoop />
        </div>
      </header>

      <hr className={styles.divider} />

      <section className={`${styles.block} ${styles.blockTight}`} aria-labelledby="helps">
        <p className={styles.sectionEyebrow}>[ What it helps with ]</p>
        <h2 className={styles.blockHead} id="helps">
          Six things that go wrong, and the part that stops each one.
        </h2>
        <p className={styles.blockIntro}>
          None of these is a failure of effort. They are what happens to a brand once more than a
          few people are making things from it, and no amount of care fixes them &mdash; only
          somewhere for the answer to live does.
        </p>

        <div className={styles.helps}>
          {HELPS.map(({ part, problem, note }) => {
            const page = byName(part)
            const Icon = page?.Icon
            const href = page?.href

            const inner = (
              <>
                {Icon && <Icon className={styles.helpIcon} size={15} strokeWidth={1.5} aria-hidden="true" />}
                <span>
                  <span className={styles.helpName}>
                    {part}
                    {!href && <span className={styles.helpSoon}>Soon</span>}
                    {href && <ArrowUpRight size={12} strokeWidth={1.6} aria-hidden="true" />}
                  </span>
                  <span className={styles.helpNote}>{note}</span>
                </span>
              </>
            )

            return (
              <div key={part} className={styles.help}>
                <p className={styles.helpProblem}>{problem}</p>
                {href
                  ? <NavLink to={href} className={styles.helpAnswer}>{inner}</NavLink>
                  /* No page yet, so no link and no hover — the nav's rule. */
                  : <span className={styles.helpAnswer}>{inner}</span>}
              </div>
            )
          })}
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={`${styles.block} ${styles.blockCentered} ${styles.blockTight}`} aria-labelledby="gains">
        <p className={styles.sectionEyebrow}>[ What changes ]</p>
        <h2 className={styles.blockHead} id="gains">
          What you actually get out of it.
        </h2>

        <div className={styles.gains}>
          {GAINS.map(({ lead, line }) => (
            <div key={lead} className={styles.gain}>
              <h3 className={styles.gainLead}>{lead}</h3>
              <p className={styles.gainLine}>{line}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className={styles.divider} />

      <HowItWorks slug="platform" />

      <hr className={styles.divider} />

      <TestimonialCard variant="platform" />

      <hr className={styles.divider} />

      <ServiceFaq items={FAQS} headline="The ones we get asked about the platform." />

      <FooterCard columns={FOOTER_COLS} />
      <V3Signoff />
      <DotNav />
    </main>
  )
}

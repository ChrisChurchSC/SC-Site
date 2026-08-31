import { useEffect, useRef, useState } from 'react'
import { Globe, Megaphone, Share2, Sparkles } from 'lucide-react'

import styles from './BuiltInSection.module.css'
import DesignWindow from './DesignWindow'
import DeployWindow from './DeployWindow'
import AssetsGridWindow from './AssetsGridWindow'
import InMarketPanel from './InMarketPanel'
import RepoWindow from './RepoWindow'

/**
 * WHAT WE BUILD, AND WHERE IT ENDS UP — the section on /services/build that
 * matches the embedded-team card on Grow.
 *
 * THE ARGUMENT IS THE LAST STEP, not the list. Plenty of studios will build a
 * brand, a site, a campaign and a set of channels. The difference here is
 * that all of it is put into the platform rather than handed over as files,
 * which is what makes it usable by people who were not in the room and
 * scalable past the launch.
 *
 * THE STACK IS THE PICTURE OF THAT. Each thing we build is a real window from
 * this site — the identity system, the deploy view, the asset library, the
 * channel panel — shuffling one at a time down onto the repo, which sits at
 * the back holding all of them. Reused rather than drawn: a second,
 * illustrated version of any of these would drift from the one the rest of
 * the site shows.
 *
 * IT HOLDS STILL for anyone who asked for less movement, and while it is off
 * screen, because a stack cycling in an unseen section is work the browser is
 * doing for nobody.
 *
 * THE WORDING IS MINE AND UNAPPROVED.
 */
/* `chrome` wraps a visual that has none of its own, so every card in the
   stack is a window. Only the deploy sheet needs it. */
const BUILT = [
  { key: 'Brand', Visual: DesignWindow },
  {
    key: 'Owned channels',
    Visual: DeployWindow,
    chrome: { name: 'Owned channels', badge: 'Live', tabs: ['Website', 'App', 'Email'] },
  },
  { key: 'Campaign', Visual: AssetsGridWindow },
  { key: 'Channels', Visual: InMarketPanel },
]

function Chromed({ chrome, children }) {
  if (!chrome) return children
  return (
    <span className={styles.win}>
      <span className={styles.winHead}>
        <span className={styles.crumbMuted}>SC-Brand</span>
        <span className={styles.slash}>/</span>
        <span className={styles.winName}>{chrome.name}</span>
        <span className={styles.winBadge}>{chrome.badge}</span>
      </span>
      <span className={styles.winTabs}>
        {chrome.tabs.map((t, i) => (
          <span key={t} className={i === 0 ? styles.tabOn : styles.tab}>{t}</span>
        ))}
      </span>
      <span className={styles.winBody}>{children}</span>
    </span>
  )
}

const POINTS = [
  {
    Icon: Sparkles,
    key: 'Brand',
    line: 'Positioning, identity, voice — the source everything else has to be right against.',
  },
  {
    Icon: Globe,
    key: 'Website & app',
    line: 'Where people actually meet it, built to change without starting over.',
  },
  {
    Icon: Megaphone,
    key: 'Campaign',
    line: 'What takes it to market, drawn from the brand rather than invented beside it.',
  },
  {
    Icon: Share2,
    key: 'Channels',
    line: 'Where it keeps showing up once the launch is over.',
  },
]

const SHUFFLE_MS = 6500

export default function BuiltInSection() {
  const [front, setFront] = useState(0)
  const stackRef = useRef(null)

  useEffect(() => {
    const el = stackRef.current
    if (!el) return

    const still = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (still.matches) return

    let timer = null
    const start = () => {
      if (timer) return
      timer = setInterval(() => setFront((f) => (f + 1) % BUILT.length), SHUFFLE_MS)
    }
    const stop = () => {
      if (!timer) return
      clearInterval(timer)
      timer = null
    }

    /* Only while it is on screen. */
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0.25 },
    )
    io.observe(el)

    return () => {
      io.disconnect()
      stop()
    }
  }, [])

  return (
    <section className={styles.section} aria-labelledby="built-in">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>[ What we build ]</p>
          <h2 className={styles.headline} id="built-in">
            What we build, and why it all goes in one place.
          </h2>
          <p className={styles.body}>
            Four things, built to work together — and put in the platform rather than handed
            over, so whoever picks them up next can use them without asking us.
          </p>

          <dl className={styles.points}>
            {POINTS.map(({ Icon, key, line }) => (
              <div key={key} className={styles.point}>
                <dt className={styles.pointKey}>
                  <Icon className={styles.pointIcon} aria-hidden="true" />
                  {key}
                </dt>
                <dd className={styles.pointLine}>{line}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* THE STACK. The repo sits behind everything, because that is where
            the rest of it lands. Decorative — the list beside it is what a
            screen reader gets. */}
        <div className={styles.visual} ref={stackRef} aria-hidden="true">
          <span className={styles.base}>
            <RepoWindow label="Repo" />
          </span>

          {BUILT.map(({ key, Visual, chrome }, i) => {
            /* Depth from the front, wrapping — so the card that just left the
               front goes to the back rather than sliding through the others. */
            const depth = (i - front + BUILT.length) % BUILT.length
            return (
              <span
                key={key}
                className={styles.card}
                style={{
                  zIndex: BUILT.length - depth,
                  transform: `translate(${depth * 26}px, ${depth * -22}px) scale(${1 - depth * 0.04})`,
                  opacity: depth > 2 ? 0 : 1 - depth * 0.18,
                }}
              >
                <Chromed chrome={chrome}>
                  <Visual />
                </Chromed>
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

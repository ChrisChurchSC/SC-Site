import { useEffect, useState } from 'react'

import styles from './PromoCard.module.css'

/**
 * The promo card: a small panel that arrives in the bottom-right corner.
 *
 * IT WAITS FOR THE READER TO HAVE READ SOMETHING. It appears after the hero
 * has been scrolled past rather than on a timer, because a panel that slides
 * in over an untouched page is an interruption, and one that arrives after
 * you have chosen to keep reading is an offer. The threshold is the viewport
 * height, which is the hero.
 *
 * IT CAN BE DISMISSED AND STAYS DISMISSED. sessionStorage rather than
 * localStorage: closing it should hold for the visit, not for a year — a
 * decision made in one session is weak evidence about the next one, and a
 * promo that never returns is a promo nobody can change their mind about.
 * Wrapped in try/catch because storage throws outright in some privacy
 * modes, and a corner panel is not worth a blank page.
 *
 * IT SAYS WHAT IS TRUE. The platform is not built — the section above says
 * Coming soon in the same words — so this offers a demo of the work rather
 * than access to software that does not exist. No countdown, no seat count,
 * no "12 people are viewing this": there is nothing scarce here and
 * inventing scarcity is the cheapest thing a corner panel can do.
 */
const KEY = 'sc-v3-promo-dismissed'

export default function PromoCard({ onBook }) {
  const [state, setState] = useState('hidden')

  useEffect(() => {
    let dismissed = false
    try {
      dismissed = sessionStorage.getItem(KEY) === '1'
    } catch {
      /* Storage unavailable — treat as not dismissed and never write. */
    }
    if (dismissed) return

    const onScroll = () => {
      if (window.scrollY > window.innerHeight * 0.9) {
        setState('shown')
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    /* Fires once on mount too: a reload halfway down the page should not
       require another scroll to bring it back. */
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const dismiss = () => {
    setState('hidden')
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* Nothing to do; it will simply come back next scroll. */
    }
  }

  if (state !== 'shown') return null

  return (
    <aside className={styles.card} aria-label="Offer">
      <button className={styles.close} onClick={dismiss} aria-label="Dismiss">×</button>

      <span className={styles.label}>The platform</span>
      <p className={styles.body}>
        Repo, agents and approvals. Not built yet — but the team
        behind it is.
      </p>
      <button className={styles.cta} onClick={onBook}>Start a project</button>
    </aside>
  )
}

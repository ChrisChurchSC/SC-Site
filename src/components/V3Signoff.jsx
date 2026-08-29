import styles from './V3Signoff.module.css'
import LogoWordmark from './LogoWordmark'

/**
 * The page-end sign-off: the wordmark, pink and lit, over a wash that
 * resolves the page into the brand colour.
 *
 * SHARED RATHER THAN COPIED. It was inline in HomeV3 and /pricing needed the
 * same ending; a second copy of a three-shadow glow and a 55vh gradient is
 * two things to keep in step for no reason.
 *
 * aria-hidden, and not a link. It is the last flourish on the page, and the
 * accessible name is already on the wordmark in the bar at the top — read
 * out twice it is just noise.
 */
export default function V3Signoff() {
  return (
    <div className={styles.signoff} aria-hidden="true">
      <LogoWordmark fill="currentColor" />
    </div>
  )
}

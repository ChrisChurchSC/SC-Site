import styles from './V3Signoff.module.css'

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
 *
 * A PNG, NOT THE SVG WORDMARK. The bar at the top keeps the clean vector
 * mark; the page ends on the hand-drawn cobweb lettering instead, which only
 * exists as raster art. It is already pink in the file, so the fill no longer
 * follows currentColor — the glow in the stylesheet still does, and it is set
 * to the same --pink, so the two stay in step by convention rather than by
 * construction. The alpha channel is real, which is what lets drop-shadow
 * trace the letters rather than the image's box.
 */
export default function V3Signoff() {
  return (
    <div className={styles.signoff} aria-hidden="true">
      <img
        className={styles.mark}
        src="/wordmark-footer.png"
        alt=""
        width="5249"
        height="676"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}

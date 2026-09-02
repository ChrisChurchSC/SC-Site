import home from '../pages/Home.module.css'
import v3 from '../pages/HomeV3.module.css'
import FooterCard from './FooterCard'
import V3Nav, { FOOTER_COLS } from './V3Nav'
import V3Signoff from './V3Signoff'

/**
 * THE V3 CHROME, AS A FRAME: the bar on top, the footer card and the pink
 * sign-off underneath, the page stack's padding and gap around whatever is
 * inside. The v3 pages each assemble this by hand; the pages that were
 * still wearing the old side nav — case studies, client overviews, thought
 * posts, contact, privacy, terms and the old services page — get it by
 * wrapping (2026-09-02), so nothing a visitor can reach from the v3 site
 * drops them back into the old one. Their own layouts sit inside as a div,
 * with the padding they carried for the side nav zeroed in their own
 * stylesheets.
 */
export default function V3Frame({ children }) {
  return (
    <main className={`${home.main} ${v3.stack}`}>
      <V3Nav />
      {children}
      <FooterCard columns={FOOTER_COLS} />
      <V3Signoff />
    </main>
  )
}

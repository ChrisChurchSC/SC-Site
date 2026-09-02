import { Navigate, useParams } from 'react-router-dom'

import home from './Home.module.css'
import v3 from './HomeV3.module.css'
import ContactCTA from '../components/ContactCTA'
import FooterCard from '../components/FooterCard'
import ScrollCards from '../components/ScrollCards'
import V3Nav, { FOOTER_COLS } from '../components/V3Nav'
import V3Signoff from '../components/V3Signoff'
import { useCalDrawer } from '../context/CalDrawerContext'
import { useMeta } from '../hooks/useMeta'
import { disciplineSlug } from '../lib/disciplineSlug'
import { disciplinePanels } from '../data/disciplinePages'
import { DISCIPLINES } from './Services'

/**
 * ONE DISCIPLINE — the /studio card stage, starting at the top.
 *
 * NO STATEMENT HERO. The pinned split stage from /studio is the hero: it
 * sits directly under the bar, full height, the discipline's name and
 * description in the right-hand card. That is the ask — the card structure
 * from the about page, starting where a hero would.
 *
 * FIVE PASSAGES, IN A SET ORDER. What we do, the channels it is good for,
 * who we would recommend it for (industry and stage), what it helps with,
 * how it works — see src/data/disciplinePages.js, which owns the order, the
 * copy and what is still a placeholder. This page only decides which
 * discipline.
 *
 * ONLY THE LIVE ONES RESOLVE. LIVE is the set of slugs with a page; the
 * rest redirect to /disciplines rather than render a page that is a card
 * repeated. The grid on /disciplines links a card only when its slug is
 * here, so nothing links to a redirect. Adding a discipline is adding its
 * slug — the route, the card link and this page are already generic.
 */
export const LIVE = new Set(['creative-direction', 'writing', 'design', 'illustration', 'film-photo', '3d-motion', 'animation', 'editing', 'production', 'media', 'search', 'engineering'])

const CLOSING = 'It might change your life. At minimum, we can answer your burning marketing questions.'

export default function Discipline() {
  const { slug } = useParams()
  const cal = useCalDrawer()
  const index = DISCIPLINES.findIndex(({ name }) => disciplineSlug(name) === slug)
  const discipline = DISCIPLINES[index]

  useMeta({
    title: discipline ? `${discipline.name} | Super Conscious` : 'Disciplines | Super Conscious',
    description: discipline?.body ?? '',
    path: `/disciplines/${slug}`,
  })

  if (!discipline || !LIVE.has(slug)) return <Navigate to="/disciplines" replace />

  const panels = disciplinePanels({ slug, name: discipline.name, body: discipline.body, index })

  return (
    <main className={`${home.main} ${v3.stack}`}>
      <V3Nav />

      <ScrollCards panels={panels} bleed bareFirst titleFirst />

      {/* The same close as the homepage and the careers page. */}
      <ContactCTA sub={CLOSING} form={false} bare>
        <button className={v3.contactCta} onClick={cal.open}>Start a project</button>
      </ContactCTA>

      <FooterCard columns={FOOTER_COLS} />

      <V3Signoff />
    </main>
  )
}

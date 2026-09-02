import {
  Box, Brush, Camera, ClipboardList, Code, Compass,
  Megaphone, PenLine, Play, Scissors, Search, Shapes,
} from 'lucide-react'

import styles from './DisciplinesSection.module.css'
/* THE CARDS COME FROM THE SERVICES PAGE'S STYLESHEET, not a second copy of
   them. /services has rendered this grid of <details> for a long time and it
   is the pattern that works for the list — twelve descriptions open at once
   is most of a screen of body copy for something whose job is to be scanned.
   Importing another page's module is the same move V3Nav makes with
   HomeV3.module.css. */
import roles from '../pages/Services.module.css'
import { DISCIPLINES } from '../pages/Services'

/**
 * THE TWELVE DISCIPLINES, as a section.
 *
 * THE DATA IS SHARED, THE MARKUP IS NOT — yet. /services renders its own
 * copy of this grid and is deliberately left alone: it is the legacy design,
 * not a v3 page, and rewiring it to this component would change how it looks
 * for a request that was about the service pages. What drifts in practice is
 * the list itself, and that is one export both read. Point Services.jsx at
 * this component the next time that page is touched.
 *
 * THE SHELL IS THE PAGE'S, NOT A NEW ONE. The padding, the label chip and
 * the headline scale are BrandTokens' to the value — that is the section
 * shell every other block on /services/build and /services/grow uses, and a
 * second set of numbers here would be a second rhythm on one page.
 *
 * NOTHING IS WRITTEN HERE. The names and the descriptions are DISCIPLINES,
 * which is Services' own COPY — the same export DepartmentPanel and the
 * footer read.
 */
/* ONE ICON PER DISCIPLINE, keyed by name rather than by index so reordering
   the list cannot silently shuffle them. A rename in Services' COPY misses
   here and the card renders without an icon rather than with the wrong one —
   which is the failure worth having, and the reason for the fallback. */
const ICONS = {
  'Creative direction': Compass,
  Writing: PenLine,
  Design: Shapes,
  Illustration: Brush,
  'Film & photo': Camera,
  '3D & motion': Box,
  Animation: Play,
  Editing: Scissors,
  Production: ClipboardList,
  Media: Megaphone,
  Search: Search,
  Engineering: Code,
}

export default function DisciplinesSection({ eyebrow, headline, intro }) {
  return (
    <section className={styles.section} aria-labelledby="disciplines">
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      {headline && (
        <h2 className={styles.headline} id="disciplines">{headline}</h2>
      )}
      {intro && <p className={styles.intro}>{intro}</p>}

      {/* Two classes: the grid is Services' and the gap above it is this
          page's — without an intro the headline had nothing between it and
          the first card, where every other section on the page has the
          intro's bottom margin. */}
      <div className={`${styles.grid} ${roles.rolesGrid}`}>
        {DISCIPLINES.map(({ name, body }) => (
          <details key={name} className={`${styles.card} ${roles.roleCard}`}>
            <summary className={`${styles.summary} ${roles.roleSummary}`}>
              {ICONS[name] && (
                <span className={styles.icon} aria-hidden="true">
                  {(() => { const Icon = ICONS[name]; return <Icon size={16} strokeWidth={1.5} /> })()}
                </span>
              )}
              <span className={`${styles.name} ${roles.roleName}`}>{name}</span>
              <span className={`${styles.toggle} ${roles.roleToggle}`} aria-hidden="true" />
            </summary>
            <p className={`${styles.desc} ${roles.roleDesc}`}>{body}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

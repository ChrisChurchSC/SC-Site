import { useEffect, useState } from 'react'

import styles from './DotNav.module.css'

/**
 * The dot navigation: one dot per section, down the right edge.
 *
 * IT FINDS THE SECTIONS RATHER THAN BEING TOLD THEM. Every section on this
 * page is rendered by a different component, and most of those components
 * are shared with / and /v2 — adding an id to each would mean editing six
 * files that two other pages depend on, to serve one. So it queries the
 * page's own sections at mount and derives a label from each heading.
 *
 * That means it cannot go stale. Reorder the page, drop a section, add one,
 * and the dots follow, because the page is the source rather than a list
 * kept beside it.
 *
 * SECTIONS WITHOUT A HEADING ARE SKIPPED, which is the filter that keeps
 * this honest: a dot leading somewhere with nothing to announce is a dot
 * whose label would have to be invented.
 *
 * IntersectionObserver rather than a scroll handler doing arithmetic: the
 * browser already knows what is on screen, and asking it costs nothing per
 * frame. rootMargin pulls the trigger line to the middle of the viewport so
 * the active dot changes when a section is actually being read, not when its
 * first pixel appears.
 */
/* A section's name, in order of what actually names it.
 *
 * The heading first. Failing that the bracketed eyebrow — the Services
 * section has no heading at all, only a "[ Services ]" label, and taking the
 * first h3 instead gave that dot the name of the first CARD in it: "Build".
 * A rail that mislabels a section is worse than one that skips it, because
 * the skip is visible and the wrong name is not. */
/* Section labels on this page are written "[ Like This ]". */
const strip = (t) => t.replace(/^\[\s*|\s*\]$/g, '')

function labelFor(el) {
  /* THE WRAPPER'S LABEL WINS, and the order here is the whole point.
 
     Taking the first heading looked obviously right and was wrong: the cards
     inside the services row are themselves h2s, so the first h2 in that
     section is "Build" — the name of one card — and that became the name of
     the section. The layout component that wraps it renders the real name,
     "[ Services ]", as a sibling of the section rather than a child, so
     nothing inside the section could ever have said so.
 
     Guarded on the parent not being <main>, because every section descends
     from main and reaching that far would hand unrelated sections whatever
     paragraph came first on the page. */
  const wrapper = el.parentElement
  if (wrapper && wrapper.tagName !== 'MAIN') {
    const beside = wrapper.querySelector(':scope > p, :scope > [class*="label"]')?.textContent?.trim()
    if (beside) return strip(beside)
  }

  const heading = el.querySelector('h1, h2')?.textContent?.trim()
  if (heading) return heading

  const inside = el.querySelector('[class*="eyebrow"], [class*="label"]')?.textContent?.trim()
  if (inside) return strip(inside)

  return el.querySelector('h3')?.textContent?.trim()
}

export default function DotNav() {
  const [items, setItems] = useState([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const main = document.querySelector('main')
    if (!main) return

    /* Every section, at any depth — not just the direct children. Two of
       this page's sections are wrapped by a layout component, so scoping to
       > section silently dropped Services and the closing CTA and left a
       rail that claimed the page had six parts when it has eight. */
    const all = [...main.querySelectorAll('section')]

    const found = all
      /* Keep the innermost of any nest: a wrapper containing another
         section is scaffolding, and a dot for it would land in the same
         place as the dot for its child. */
      .filter((el) => !el.querySelector('section'))
      .map((el) => ({ el, label: labelFor(el) }))
      .filter((s) => s.label)
      .map((s) => ({ ...s, label: s.label.replace(/\s+/g, ' ').slice(0, 42) }))

    if (found.length < 2) return
    setItems(found)

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const i = found.findIndex((s) => s.el === entry.target)
          if (i > -1) setActive(i)
        }
      },
      /* A 1px band across the middle of the viewport: whatever crosses it is
         what is being read. */
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    )

    found.forEach((s) => io.observe(s.el))
    return () => io.disconnect()
  }, [])

  if (!items.length) return null

  return (
    /* aria-hidden and not focusable. Every one of these scrolls to a heading
       that is already in the document, in order — a keyboard or screen-reader
       user reaches all of it by reading the page, and a second parallel set
       of controls to the same places is noise rather than access. It is a
       pointer convenience. */
    <nav className={styles.rail} aria-hidden="true">
      {items.map(({ el, label }, i) => (
        <button
          key={i}
          type="button"
          tabIndex={-1}
          className={i === active ? styles.dotOn : styles.dot}
          data-tip={label}
          onClick={() => el.scrollIntoView({ behavior: 'smooth', block: 'start' })}
        />
      ))}
    </nav>
  )
}

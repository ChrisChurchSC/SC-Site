import { useEffect, useState } from 'react'
import s from './system.module.css'
import { Icon, Button } from './primitives'

/* Navigation — moving through a document or a sequence.
 *
 * Separate from the shell's Sidebar and SectionNav, which move between areas
 * of a product. These move within one thing: down a long page, through a set
 * of steps, between two neighbours.
 */

/* ── Accordion ─────────────────────────────────────────────────────────────
   Many-open by default. Single-open is a choice you make when the panels are
   alternatives; making it the default means opening one silently closes the
   thing somebody was reading. */
export function Accordion({ items, single, defaultOpen = [] }) {
  const [open, setOpen] = useState(new Set(defaultOpen))
  const toggle = (key) => setOpen((o) => {
    if (single) return new Set(o.has(key) ? [] : [key])
    const next = new Set(o)
    next.has(key) ? next.delete(key) : next.add(key)
    return next
  })

  return (
    <div className={s.accordion}>
      {items.map((it) => {
        const isOpen = open.has(it.key ?? it.title)
        const key = it.key ?? it.title
        return (
          <div key={key} className={s.accItem}>
            <button
              type="button"
              className={s.accHead}
              aria-expanded={isOpen}
              onClick={() => toggle(key)}
            >
              <Icon name={isOpen ? 'chevron-down' : 'chevron-right'} size={12} />
              <span className={s.accTitle}>{it.title}</span>
              {it.meta && <span className={s.accMeta}>{it.meta}</span>}
            </button>
            {isOpen && <div className={s.accBody}>{it.body}</div>}
          </div>
        )
      })}
    </div>
  )
}

/* ── Stepper ───────────────────────────────────────────────────────────────
   Shows where you are in a sequence whose length you cannot change. Done steps
   get a tick, the current one gets its number, and the rest stay numbered —
   a stepper that hides what is ahead is a progress bar with extra steps. */
export function Stepper({ steps, current = 0, onStep }) {
  return (
    <ol className={s.stepper}>
      {steps.map((label, i) => {
        const done = i < current
        const now = i === current
        return (
          <li key={label} className={s.stepItem}>
            <button
              type="button"
              className={`${s.stepMark} ${done ? s.stepDone : ''} ${now ? s.stepNow : ''}`}
              aria-current={now ? 'step' : undefined}
              onClick={() => onStep?.(i)}
              disabled={!onStep}
            >
              {done ? <Icon name="check" size={12} /> : i + 1}
            </button>
            <span className={`${s.stepLabel} ${now ? s.stepLabelNow : ''}`}>{label}</span>
            {i < steps.length - 1 && <span className={s.stepRule} aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

/* A stepper with the panels attached, and the rule that you cannot skip
   forward past work you have not done. */
export function MultiStep({ steps, children, onDone }) {
  const [step, setStep] = useState(0)
  const last = step === steps.length - 1

  return (
    <div className={s.multiStep}>
      <Stepper steps={steps} current={step} onStep={(i) => i < step && setStep(i)} />
      <div className={s.multiBody}>{children?.[step]}</div>
      <div className={s.multiActions}>
        <Button size="sm" icon="chevron-left" onClick={() => setStep((x) => Math.max(0, x - 1))} disabled={step === 0}>
          Back
        </Button>
        <Button
          size="sm"
          variant="solid"
          icon={last ? 'check' : 'chevron-right'}
          onClick={() => (last ? onDone?.() : setStep((x) => x + 1))}
        >
          {last ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  )
}

/* ── Scrollspy ─────────────────────────────────────────────────────────────
   Marks the section you are reading. IntersectionObserver rather than a scroll
   handler: a scroll listener fires on every pixel and still gets the answer
   wrong at the bottom of the page, where the last section can never reach the
   top of the viewport. */
export function Scrollspy({ sections, offset = '-40% 0px -55% 0px' }) {
  const [active, setActive] = useState(sections[0]?.id)

  useEffect(() => {
    const nodes = sections.map((x) => document.getElementById(x.id)).filter(Boolean)
    if (!nodes.length) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (hit) setActive(hit.target.id)
      },
      { rootMargin: offset },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [sections, offset])

  return (
    <nav className={s.spy} aria-label="On this page">
      {sections.map((x) => (
        <a
          key={x.id}
          href={`#${x.id}`}
          aria-current={active === x.id ? 'true' : undefined}
          className={`${s.spyLink} ${active === x.id ? s.spyLinkOn : ''}`}
        >
          {x.label}
        </a>
      ))}
    </nav>
  )
}

/* A flat list of links with one marked current. Distinct from the shell's
   Tree: no disclosure, no nesting, no counts — for a settings page or a docs
   sidebar where every destination is a sibling. */
export function SidebarNav({ items, value, onChange, title }) {
  return (
    <nav className={s.sideNav} aria-label={title ?? 'Sections'}>
      {title && <span className={s.railTitle}>{title}</span>}
      {items.map((it) => (
        <button
          key={it.key ?? it.label}
          type="button"
          aria-current={value === (it.key ?? it.label) ? 'page' : undefined}
          className={`${s.sideLink} ${value === (it.key ?? it.label) ? s.sideLinkOn : ''}`}
          onClick={() => onChange?.(it.key ?? it.label)}
        >
          {it.icon && <Icon name={it.icon} size={13} />}
          <span className={s.sideLabel}>{it.label}</span>
          {it.count !== undefined && <span className={s.treeCount}>{it.count}</span>}
        </button>
      ))}
    </nav>
  )
}

/* Previous and next, each naming where it goes. An arrow labelled only
   "Previous" makes you click to find out whether you want it. */
export function PrevNext({ prev, next, onGo }) {
  return (
    <div className={s.prevNext}>
      {prev ? (
        <button type="button" className={s.pnItem} onClick={() => onGo?.(prev)}>
          <span className={s.pnDir}><Icon name="arrow-left" size={12} />Previous</span>
          <span className={s.pnLabel}>{prev.label}</span>
        </button>
      ) : <span />}
      {next && (
        <button type="button" className={`${s.pnItem} ${s.pnNext}`} onClick={() => onGo?.(next)}>
          <span className={s.pnDir}>Next<Icon name="arrow-right" size={12} /></span>
          <span className={s.pnLabel}>{next.label}</span>
        </button>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { useCalDrawer } from '../context/CalDrawerContext'
import ProjectBrief from './ProjectBrief'
import styles from './CalDrawer.module.css'

/**
 * TWO STEPS NOW (2026-09-02): the brief, then the booking. "Start a project"
 * used to open straight onto the calendar; it opens onto ProjectBrief —
 * service, industry, stage, outcome, disciplines — and the calendar is the
 * step after the brief is sent, so the call is booked by someone who has
 * already said what it is about. Anyone who only wants the call has a
 * line to skip to it. The calendar's container stays in the DOM through
 * both steps (hidden, not unmounted) so the Cal embed initialises once,
 * as before. The step is remembered: a sent brief is not asked for twice.
 */
export default function CalDrawer() {
  const { isOpen, close } = useCalDrawer()
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState('brief') // brief | book
  const [sent, setSent] = useState(false)

  // Initialize Cal inline embed once — the element is always in the DOM so
  // the iframe persists across open/close cycles without re-initializing.
  useEffect(() => {
    // window.Cal is a queuing proxy set by the IIFE in index.html, so this
    // call is safe even if the Cal embed script hasn't finished loading yet.
    window.Cal?.('inline', {
      elementOrSelector: '#cal-drawer-container',
      calLink: 'super-conscious/discovery-call',
      config: { layout: 'month_view' },
    })
    // Close drawer after a successful booking
    window.Cal?.('on', {
      action: 'bookingSuccessful',
      callback: () => {
        // dataLayer, not gtag. GTM owns a GA4 tag for this event and also
        // listens on dataLayer — and gtag() writes to dataLayer, so a gtag call
        // fired BOTH the gtag config and the GTM tag. Verified in Realtime: one
        // gtag call produced 2 events, one dataLayer push produced 1.
        //
        // Deleting the GTM tag and standardising on gtag would be tidier, but
        // container GTM-W47TGDKM is not accessible from the account that owns
        // this property. Routing through GTM matches what /contact already does
        // and gives exactly one event per booking with the access we have.
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ event: 'discovery_call_booked' })
        setTimeout(close, 1200)
      },
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Drive open/close animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      document.body.style.overflow = 'hidden'
    } else {
      setVisible(false)
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close() }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.overlayVisible : ''}`}
      style={{ pointerEvents: isOpen ? 'all' : 'none' }}
      onClick={close}
    >
      <div
        className={`${styles.drawer} ${visible ? styles.drawerVisible : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handle} />
        <div className={styles.header}>
          <h2 className={styles.title}>{step === 'brief' ? 'Start a project' : 'Book a discovery call'}</h2>
          <button className={styles.closeBtn} onClick={close} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {step === 'brief' && (
          <div className={styles.briefScroll}>
            <ProjectBrief onSent={() => { setSent(true); setStep('book') }} />
            <p className={styles.skip}>
              Just want to talk?{' '}
              <button type="button" className={styles.skipLink} onClick={() => setStep('book')}>Skip to booking →</button>
            </p>
          </div>
        )}
        {step === 'book' && sent && (
          <p className={styles.sentNote} role="status">Brief sent. Pick a time and we will come prepared.</p>
        )}
        <div id="cal-drawer-container" className={styles.calContainer} hidden={step !== 'book'} />
      </div>
    </div>
  )
}

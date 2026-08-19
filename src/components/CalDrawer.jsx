import { useEffect, useState } from 'react'
import { useCalDrawer } from '../context/CalDrawerContext'
import styles from './CalDrawer.module.css'

export default function CalDrawer() {
  const { isOpen, close } = useCalDrawer()
  const [visible, setVisible] = useState(false)

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
          <h2 className={styles.title}>Book a discovery call</h2>
          <button className={styles.closeBtn} onClick={close} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div id="cal-drawer-container" className={styles.calContainer} />
      </div>
    </div>
  )
}

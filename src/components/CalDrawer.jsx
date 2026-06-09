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
        window.gtag?.('event', 'discovery_call_booked')
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

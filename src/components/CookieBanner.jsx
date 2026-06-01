import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './CookieBanner.module.css'

const CONSENT_KEY = 'cookie_consent'
const RB2B_KEY = '4O7Z0HE5K2NX'

function loadRB2B() {
  if (window.reb2b) return
  window.reb2b = { loaded: true }
  const s = document.createElement('script')
  s.async = true
  s.src = `https://ddwl4m2hdecbv.cloudfront.net/b/${RB2B_KEY}/${RB2B_KEY}.js.gz`
  document.head.appendChild(s)
}

function grantAnalytics() {
  window.gtag?.('consent', 'update', { analytics_storage: 'granted' })
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) {
      setVisible(true)
    } else if (consent === 'accepted') {
      grantAnalytics()
      loadRB2B()
    }
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    grantAnalytics()
    loadRB2B()
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <p className={styles.text}>
        We use cookies and tracking to improve the site and identify business visitors.{' '}
        <NavLink to="/privacy" className={styles.link}>Privacy Policy</NavLink>
      </p>
      <div className={styles.actions}>
        <button className={styles.decline} onClick={decline}>Decline</button>
        <button className={styles.accept} onClick={accept}>Accept</button>
      </div>
    </div>
  )
}

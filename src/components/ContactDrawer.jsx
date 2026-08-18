import { useState, useEffect } from 'react'
import { useContactDrawer } from '../context/ContactDrawerContext'
import styles from './ContactDrawer.module.css'
import { submitLead } from '../lib/submitLead'

export default function ContactDrawer() {
  const { isOpen, close } = useContactDrawer()
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('') // idle | sending | done | error

  // Mount before animating in; unmount after animating out
  useEffect(() => {
    if (isOpen) {
      setMounted(true)
      // Double rAF ensures the element is in the DOM before the transition fires
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)))
      document.body.style.overflow = 'hidden'
    } else {
      setVisible(false)
      document.body.style.overflow = ''
      const t = setTimeout(() => { setMounted(false); setStatus('idle') }, 450)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close() }
    if (isOpen) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, close])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')

    const result = await submitLead(e.target)

    if (!result.ok) {
      // Only ever a confirmed store counts as sent. The previous version
      // showed success whenever the request resolved, regardless of outcome.
      setError(result.error)
      setStatus('error')
      return
    }

    window.gtag?.('event', 'generate_lead', { method: 'contact_form' })
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'contact_form_submit' })
    setStatus('done')
    setTimeout(close, 2200)
  }

  if (!mounted) return null

  return (
    <div
      className={`${styles.overlay} ${visible ? styles.overlayVisible : ''}`}
      onClick={close}
    >
      <div
        className={`${styles.drawer} ${visible ? styles.drawerVisible : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.handle} />

        <div className={styles.header}>
          <h2 className={styles.title}>Start a project</h2>
          <button className={styles.closeBtn} onClick={close} aria-label="Close">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {status === 'done' ? (
          <p className={styles.success}>Message sent. We'll be in touch shortly.</p>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
            <div className={styles.row}>
              <label className={styles.field}>
                <span className={styles.label}>Name</span>
                <input className={styles.input} type="text" name="name" required autoComplete="name" />
              </label>
              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <input className={styles.input} type="email" name="email" required autoComplete="email" />
              </label>
            </div>
            <label className={styles.field}>
              <span className={styles.label}>Company <span className={styles.optional}>(optional)</span></span>
              <input className={styles.input} type="text" name="company" autoComplete="organization" />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Project</span>
              <textarea className={styles.textarea} name="message" rows={4} required />
            </label>
            {status === 'error' && (
              <p className={styles.error} role="alert">{error || 'Something went wrong.'} Email us at contact@super-conscious.studio.</p>
            )}
            <button className={styles.submit} type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

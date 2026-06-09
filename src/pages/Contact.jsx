import { useState } from 'react'
import styles from './Contact.module.css'
import { useMeta } from '../hooks/useMeta'

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [toast, setToast] = useState(false)

  useMeta({
    title: 'Start a Project | Super Conscious',
    description: 'Tell us about your project. We build brands, content, and digital products with founders and marketing teams.',
    path: '/contact',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.target
    const data = Object.fromEntries(new FormData(form))
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        window.gtag?.('event', 'generate_lead', { method: 'contact_form' })
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({ event: 'contact_form_submit' })
        form.reset()
        setStatus('idle')
        setToast(true)
        setTimeout(() => setToast(false), 4500)
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <p className={styles.headerLabel}>Contact</p>
        <h1 className={styles.headline}>Let's build together.</h1>
        <p className={styles.sub}>
          Tell us a little about what you're working on and we'll get back to you within a day or two.
        </p>
        <button
          type="button"
          className={styles.bookBtn}
          data-cal-namespace="discovery-call"
          data-cal-link="super-conscious/discovery-call"
          data-cal-origin="https://app.cal.com"
          data-cal-config='{"layout":"month_view"}'
          onClick={() => {
            window.dataLayer = window.dataLayer || []
            window.dataLayer.push({ event: 'discovery_call_click' })
            window.dataLayer.push({ event: 'cta_click', cta_location: 'contact' })
          }}
        >
          Prefer to talk? Book a discovery call →
        </button>
      </section>

      <section className={styles.formSection}>
        <form className={styles.form} onSubmit={handleSubmit}>
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
            <textarea className={styles.textarea} name="message" rows={6} required />
          </label>

          {status === 'error' && (
            <p className={styles.error}>Something went wrong. Email us directly at contact@super-conscious.studio.</p>
          )}

          <button className={styles.submit} type="submit" disabled={status === 'sending'}>
            {status === 'sending' ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </section>

      {toast && (
        <div className={styles.toast} role="status">
          Message sent. We'll be in touch shortly.
        </div>
      )}
    </main>
  )
}

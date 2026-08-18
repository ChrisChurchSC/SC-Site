import { useState } from 'react'
import styles from './Contact.module.css'
import { useMeta } from '../hooks/useMeta'
import { FORMSPREE_ENDPOINT, submitLead } from '../lib/submitLead'
export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [error, setError] = useState('')
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
    setStatus('sending')

    const result = await submitLead(form)

    if (!result.ok) {
      setError(result.error)
      setStatus('error')
      return
    }

    window.gtag?.('event', 'generate_lead', { method: 'contact_form' })
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'contact_form_submit' })
    form.reset()
    setStatus('idle')
    setToast(true)
    setTimeout(() => setToast(false), 4500)
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
          onClick={() => window.gtag?.('event', 'cta_click', { cta_location: 'contact' })}
        >
          Prefer to talk? Book a discovery call →
        </button>
      </section>

      <section className={styles.formSection}>
        <form
      className={styles.form}
      // Posting natively to Formspree means a submit that lands before
      // hydration still captures the lead. The page is prerendered, so the
      // form looks interactive well before React attaches: without this a
      // fast submit did a native GET to the current URL and the enquiry
      // vanished into a query string.
      action={FORMSPREE_ENDPOINT}
      method="POST"
      onSubmit={handleSubmit}
    >
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
            <textarea className={styles.textarea} name="message" rows={6} required />
          </label>

          {status === 'error' && (
            <p className={styles.error} role="alert">{error || 'Something went wrong.'} Email us directly at contact@super-conscious.studio.</p>
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

import { useState } from 'react'
import styles from './Contact.module.css'
import { useMeta } from '../hooks/useMeta'

// Formspree form ID (https://formspree.io).
const FORMSPREE_ID = 'xzdobjza'
const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | error
  const [toast, setToast] = useState(false)

  useMeta({
    title: 'Contact | Super Conscious',
    description: 'Tell us about your project. We build brands, content, and digital products with founders and marketing teams.',
    path: '/contact',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.target
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
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

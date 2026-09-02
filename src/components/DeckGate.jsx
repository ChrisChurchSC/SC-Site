import { useEffect, useState } from 'react'
import styles from './DeckGate.module.css'

/**
 * Gate UI for the sales decks.
 *
 * The password is verified server-side by /api/deck-auth, which sets an
 * httpOnly signed cookie. This component no longer knows the password — the
 * previous version compared against a constant that shipped in the bundle,
 * and the deck chunks were downloadable regardless.
 *
 * Children are not rendered until the server confirms, which also means the
 * lazy deck chunk is never even requested while locked.
 */
export default function DeckGate({ children }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [checking, setChecking] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/deck-auth', { credentials: 'same-origin' })
      .then((r) => (r.ok ? r.json() : { unlocked: false }))
      .then((d) => !cancelled && setUnlocked(!!d.unlocked))
      .catch(() => {})
      .finally(() => !cancelled && setChecking(false))
    return () => {
      cancelled = true
    }
  }, [])

  const handleUnlock = async (e) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/deck-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password: pw }),
      })
      if (res.ok) {
        setUnlocked(true)
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body.error || 'Incorrect password.')
        setPw('')
      }
    } catch {
      setError('Could not reach the server. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (checking) return <div className={styles.gate} aria-busy="true" />

  if (!unlocked) return (
    <div className={styles.gate}>
      <div className={styles.gateInner}>
        <p className={styles.gateLabel}>Super Conscious</p>
        <form className={styles.gateForm} onSubmit={handleUnlock}>
          <label className={styles.gateSrOnly} htmlFor="deck-password">Password</label>
          <input
            id="deck-password"
            className={`${styles.gateInput}${error ? ` ${styles.gateInputError}` : ''}`}
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            autoFocus
          />
          <span className={styles.gateError} role="status" aria-live="polite">{error}</span>
          <button type="submit" className={styles.gateSubmit} disabled={submitting}>
            {submitting ? 'Checking…' : 'Enter →'}
          </button>
        </form>
      </div>
    </div>
  )

  return children
}

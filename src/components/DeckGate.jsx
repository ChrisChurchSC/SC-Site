import { useState } from 'react'
import styles from './DeckGate.module.css'

const HUB_PASSWORD = 'sc-preview'
const SESSION_KEY = 'landing_hub_unlocked'

export default function DeckGate({ children }) {
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [manualUnlock, setManualUnlock] = useState(false)

  const sessionUnlocked = typeof localStorage !== 'undefined'
    && localStorage.getItem(SESSION_KEY) === '1'
  const unlocked = manualUnlock || sessionUnlocked

  const handleUnlock = (e) => {
    e.preventDefault()
    if (pw === HUB_PASSWORD) {
      localStorage.setItem(SESSION_KEY, '1')
      setManualUnlock(true)
    } else {
      setError(true)
      setPw('')
      setTimeout(() => setError(false), 600)
    }
  }

  if (!unlocked) return (
    <div className={styles.gate}>
      <div className={styles.gateInner}>
        <p className={styles.gateLabel}>Super Conscious</p>
        <form className={styles.gateForm} onSubmit={handleUnlock}>
          <input
            className={`${styles.gateInput}${error ? ` ${styles.gateInputError}` : ''}`}
            type="password"
            placeholder="Password"
            value={pw}
            onChange={e => setPw(e.target.value)}
            autoFocus
          />
          <span className={styles.gateError}>{error ? 'Incorrect password.' : ''}</span>
          <button type="submit" className={styles.gateSubmit}>Enter →</button>
        </form>
      </div>
    </div>
  )

  return children
}

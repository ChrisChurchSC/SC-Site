import { createContext, useContext, useRef, useState } from 'react'

const TransitionContext = createContext(null)

export function TransitionProvider({ children }) {
  const [scrim, setScrim] = useState(false)
  const timerRef = useRef(null)

  const showScrim = () => {
    clearTimeout(timerRef.current)
    setScrim(true)
  }

  const hideScrim = () => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setScrim(false), 400)
  }

  return (
    <TransitionContext.Provider value={{ showScrim, hideScrim }}>
      {children}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        opacity: scrim ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: 'none',
        zIndex: 50,
      }} />
    </TransitionContext.Provider>
  )
}

export const useTransition = () => useContext(TransitionContext)

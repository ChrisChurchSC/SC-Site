import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import './Loader.css'

export default function TransitionBar() {
  const location = useLocation()
  const [key, setKey] = useState(0)
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    setKey(k => k + 1)
    setVisible(true)
    setDone(false)
    const t1 = setTimeout(() => setDone(true), 700)
    const t2 = setTimeout(() => setVisible(false), 1200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [location.pathname])

  if (!visible) return null

  return <div key={key} className={`loader-bar${done ? ' loader-bar--done' : ''}`} />
}

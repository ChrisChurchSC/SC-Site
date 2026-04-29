import { useEffect, useState } from 'react'
import './Loader.css'

export default function Loader({ onDone }) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setDone(true), 900)
    const t2 = setTimeout(() => onDone(), 1400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return <div className={`loader-bar${done ? ' loader-bar--done' : ''}`} />
}

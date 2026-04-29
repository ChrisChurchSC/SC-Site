import { useEffect, useRef } from 'react'

export default function KitForm({ uid }) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current || !uid) return
    if (ref.current.querySelector('script')) return
    const script = document.createElement('script')
    script.src = `https://super-conscious.kit.com/${uid}/index.js`
    script.async = true
    script.setAttribute('data-uid', uid)
    ref.current.appendChild(script)
  }, [uid])

  return <div ref={ref} />
}

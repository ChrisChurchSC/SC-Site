import { useEffect, useRef, useState } from 'react'

/**
 * Video that defers loading until the element scrolls within `rootMargin`
 * of the viewport. Once loaded, it autoplays muted/loop/playsInline.
 * Drop-in replacement for a stripped-down <video autoPlay muted loop playsInline>.
 */
export default function LazyVideo({
  src,
  className,
  style,
  rootMargin = '300px',
  pauseOffscreen = true,
  onError,
}) {
  const ref = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true); setInView(true)
      return
    }
    const obs = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          setShouldLoad(true)
          setInView(true)
        } else {
          setInView(false)
        }
      }
    }, { rootMargin })
    obs.observe(el)
    return () => obs.disconnect()
  }, [rootMargin])

  useEffect(() => {
    const vid = ref.current
    if (!vid || !shouldLoad) return
    if (inView) vid.play?.().catch(() => {})
    else if (pauseOffscreen) vid.pause?.()
  }, [inView, shouldLoad, pauseOffscreen])

  return (
    <video
      ref={ref}
      src={shouldLoad ? src : undefined}
      data-src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className={className}
      style={style}
      onError={onError}
    />
  )
}

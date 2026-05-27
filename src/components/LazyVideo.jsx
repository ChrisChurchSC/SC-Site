import { useEffect, useRef, useState } from 'react'

const isMobile = () => typeof window !== 'undefined' && window.innerWidth <= 768

export default function LazyVideo({
  src,
  className,
  style,
  rootMargin,
  pauseOffscreen = true,
  onError,
}) {
  const ref = useRef(null)
  const [shouldLoad, setShouldLoad] = useState(false)
  const [inView, setInView] = useState(false)

  // Tighter pre-load window on mobile to limit concurrent video decoders
  const margin = rootMargin ?? (isMobile() ? '50px' : '300px')

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
    }, { rootMargin: margin })
    obs.observe(el)
    return () => obs.disconnect()
  }, [margin])

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

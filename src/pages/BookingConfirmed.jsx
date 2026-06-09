import { useEffect } from 'react'
import { useMeta } from '../hooks/useMeta'

export default function BookingConfirmed() {
  useMeta({
    title: 'Discovery Call Booked | Super Conscious',
    description: 'Your discovery call is confirmed. We look forward to talking.',
    path: '/booking-confirmed',
  })

  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'discovery_call_booked' })
    window.gtag?.('event', 'schedule', { method: 'cal_com' })
  }, [])

  return (
    <main style={{ padding: '120px 40px', minHeight: '100vh', background: '#0a0a0a' }}>
      <p style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 8, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.2)', marginBottom: 24 }}>
        BOOKING CONFIRMED
      </p>
      <h1 style={{ fontFamily: "'Signifier', Georgia, serif", fontWeight: 300, fontSize: 'clamp(28px, 4vw, 52px)', color: 'rgba(255,255,255,0.85)', margin: '0 0 20px', maxWidth: 600 }}>
        We'll see you on the call.
      </h1>
      <p style={{ fontFamily: "'Signifier', Georgia, serif", fontWeight: 300, fontSize: 'clamp(15px, 1.4vw, 18px)', color: 'rgba(255,255,255,0.45)', margin: '0 0 48px', maxWidth: 480 }}>
        Check your email for the calendar invite. In the meantime, take a look at our work.
      </p>
      <a href="/work" style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
        View our work →
      </a>
    </main>
  )
}

import { useState } from 'react'

import { FORMSPREE_ENDPOINT, submitLead } from '../lib/submitLead'

/**
 * Email capture on the pricing card.
 *
 * This replaces a form that posted to /api/newsletter — an endpoint that
 * depended on an unset Resend key and failed silently, for a newsletter that
 * does not exist. Someone asking for rates was told "Sent. Check your inbox."
 * and then heard nothing.
 *
 * It goes through the same Formspree path as the contact form, so the request
 * is stored durably whatever the site's configuration is doing. The hidden
 * `_subject` marks it as a pricing request, which both labels the notification
 * and separates these from general enquiries in the inbox — they are a warmer
 * signal, arriving at the moment someone is asking what things cost.
 *
 * @param {{ className?: string, styles: Record<string,string> }} props
 *   `styles` is passed in so the form adopts the host page's CSS module
 *   (About and AboutUs style their pricing card differently).
 */
export default function PricingRequestForm({ styles }) {
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')

    const result = await submitLead(e.target)

    if (!result.ok) {
      // Never claim it was sent. The form this replaces reported success
      // regardless of what happened.
      setError(result.error)
      setStatus('error')
      return
    }

    window.gtag?.('event', 'generate_lead', { method: 'pricing_request' })
    setStatus('done')
  }

  if (status === 'done') {
    return <p className={styles.pricingConfirm}>Thanks — we&rsquo;ll send rates over shortly.</p>
  }

  return (
    <form
      className={styles.pricingForm}
      // Posting natively to Formspree means a submit that lands before
      // hydration still captures the lead. The page is prerendered, so the
      // form looks interactive well before React attaches: without this a
      // fast submit did a native GET to the current URL and the enquiry
      // vanished into a query string.
      action={FORMSPREE_ENDPOINT}
      method="POST"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="_subject" value="Pricing request from super-conscious.studio" />
      <input type="hidden" name="request_type" value="pricing" />
      {/* Formspree's honeypot — bots complete it, people never see it. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
      />
      <label className={styles.pricingSrOnly ?? ''} htmlFor="pricing-email">Email address</label>
      <input
        id="pricing-email"
        className={styles.pricingInput}
        type="email"
        name="email"
        placeholder="Email address"
        required
        autoComplete="email"
      />
      <button className={styles.pricingSubmit} type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Get rates →'}
      </button>
      {status === 'error' && (
        <p className={styles.pricingError ?? ''} role="alert">
          {error} Email us at contact@super-conscious.studio.
        </p>
      )}
    </form>
  )
}

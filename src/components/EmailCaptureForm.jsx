import { useState } from 'react'

import { FORMSPREE_ENDPOINT, submitLead } from '../lib/submitLead'

/**
 * Email capture, used in more than one place and therefore told where it is.
 *
 * This was PricingRequestForm, with the button label, the confirmation, the
 * Formspree `_subject` and the `request_type` all hardcoded to pricing. It was
 * then rendered on the careers page under "Join our freelancer roster", so
 * anyone offering to freelance was shown a "Get rates" button, told "we'll
 * send rates over shortly", and filed in Formspree as a pricing lead. The name
 * described one caller and the component believed it.
 *
 * Nothing here is optional. Every caller states its own copy and its own
 * labelling, so a new context cannot silently inherit another one's.
 *
 * @param {object}  props
 * @param {Record<string,string>} props.styles  host page's CSS module — must
 *   define emailForm, emailInput, emailSubmit, emailConfirm, emailError and
 *   emailSrOnly. tests/lib/emailCaptureStyles.test.mjs enforces that, because
 *   a missing class is not an error, just an unstyled control: on /about-us
 *   four of the six were absent and the input rendered as a bare white box
 *   overlapping the button.
 * @param {string}  props.submitLabel     button text
 * @param {string}  props.confirmMessage  shown after a successful submit
 * @param {string}  props.subject         Formspree `_subject`
 * @param {string}  props.requestType     `request_type`, to separate these in the inbox
 * @param {string}  props.placeholder
 */
export default function EmailCaptureForm({
  styles,
  submitLabel,
  confirmMessage,
  subject,
  requestType,
  placeholder = 'Email address',
}) {
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')

    const result = await submitLead(e.target)

    if (!result.ok) {
      // Never claim it was sent. The form this replaced reported success
      // regardless of what happened.
      setError(result.error)
      setStatus('error')
      return
    }

    window.gtag?.('event', 'generate_lead', { method: requestType })
    setStatus('done')
  }

  if (status === 'done') {
    return <p className={styles.emailConfirm}>{confirmMessage}</p>
  }

  return (
    <form
      className={styles.emailForm}
      // Posting natively to Formspree means a submit that lands before
      // hydration still captures the lead. The page is prerendered, so the
      // form looks interactive well before React attaches: without this a
      // fast submit did a native GET to the current URL and the enquiry
      // vanished into a query string.
      action={FORMSPREE_ENDPOINT}
      method="POST"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="_subject" value={subject} />
      <input type="hidden" name="request_type" value={requestType} />
      {/* Formspree's honeypot — bots complete it, people never see it. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }}
      />
      <label className={styles.emailSrOnly} htmlFor={`email-${requestType}`}>Email address</label>
      <input
        id={`email-${requestType}`}
        className={styles.emailInput}
        type="email"
        name="email"
        placeholder={placeholder}
        required
        autoComplete="email"
      />
      <button className={styles.emailSubmit} type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : submitLabel}
      </button>
      {status === 'error' && (
        <p className={styles.emailError} role="alert">
          {error} Email us at contact@super-conscious.studio.
        </p>
      )}
    </form>
  )
}

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
 *   a missing class is not an error, just an unstyled control: on /careers
 *   four of the six were absent and the input rendered as a bare white box
 *   overlapping the button.
 * @param {string}  props.submitLabel     button text
 * @param {string}  props.confirmMessage  shown after a successful submit
 * @param {string}  props.subject         Formspree `_subject`
 * @param {string}  props.requestType     `request_type`, to separate these in the inbox
 * @param {string}  props.placeholder
 * @param {'compact'|'contact'} props.variant  'compact' is the one-line email
 *   capture. 'contact' adds a name and a message and stacks them. Both post
 *   the same way — submitLead sends `new FormData(form)`, so every named
 *   field here reaches Formspree. Do not add a field that is not wanted in
 *   the inbox; it will arrive.
 */
export default function EmailCaptureForm({
  styles,
  submitLabel,
  confirmMessage,
  subject,
  requestType,
  placeholder = 'Email address',
  variant = 'compact',
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
      // The stacked layout hangs off this rather than a second class, so the
      // compact callers are not asked to define a class they never apply.
      data-variant={variant}
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
      {variant === 'contact' ? (
        <ContactFields styles={styles} requestType={requestType} />
      ) : (
        <>
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
        </>
      )}
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

/**
 * The 'contact' variant's fields. Kept in its own function so the classes it
 * needs are separable from the ones every caller needs — the style test reads
 * this function's body to work out which classes only the contact variant
 * requires, and does not hold the compact callers to those.
 *
 * The names sit inside the boxes. Each field still carries a real <label>,
 * hidden visually — a placeholder is not a label to a screen reader, so
 * dropping the element would leave three unnamed boxes. This way the form
 * looks the way it is meant to and still announces itself.
 *
 * Every field here is submitted: submitLead posts new FormData(form).
 */
function ContactFields({ styles, requestType }) {
  return (
    <>
      <div className={styles.emailRow}>
        <div className={styles.emailField}>
          <label className={styles.emailSrOnly} htmlFor={`name-${requestType}`}>Name</label>
          <input
            id={`name-${requestType}`}
            className={styles.emailInput}
            type="text"
            name="name"
            placeholder="Name"
            required
            autoComplete="name"
          />
        </div>
        <div className={styles.emailField}>
          <label className={styles.emailSrOnly} htmlFor={`email-${requestType}`}>Email</label>
          <input
            id={`email-${requestType}`}
            className={styles.emailInput}
            type="email"
            name="email"
            placeholder="Email"
            required
            autoComplete="email"
          />
        </div>
      </div>
      <div className={styles.emailField}>
        <label className={styles.emailSrOnly} htmlFor={`message-${requestType}`}>What's on your mind?</label>
        <textarea
          id={`message-${requestType}`}
          className={styles.emailTextarea}
          name="message"
          rows={4}
          placeholder="What's on your mind?"
          required
        />
      </div>
    </>
  )
}

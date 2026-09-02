import styles from './ContactCTA.module.css'
import EmailCaptureForm from './EmailCaptureForm'

/**
 * The closing call to action: a headline, a line under it, and the email
 * capture.
 *
 * This lived inline in Services.jsx until the homepage wanted the same block.
 * Duplicating it would have meant two copies of the same offer drifting apart
 * — and the last time this form was copied between pages, the careers page
 * inherited pricing's button text, confirmation and request_type, so
 * freelancer signups were filed as pricing leads.
 *
 * Which is why the form's props are NOT baked in here. Label, confirmation,
 * subject and requestType are all passed by the caller, defaulting to the
 * general enquiry the homepage wants. A page with a different ask supplies
 * its own, and tests/lib/emailCaptureStyles.test.mjs asserts no two consumers
 * share a subject or request type.
 */
export default function ContactCTA({
  label = 'Talk to a Super-Conscious human.',
  sub = 'It might change your life. At minimum, we can probably answer some of your burning marketing questions.',
  submitLabel = 'Get in touch →',
  confirmMessage = "Thanks — we'll be in touch shortly.",
  subject = 'Enquiry from super-conscious.studio',
  requestType = 'enquiry',
  /* `form` false drops the capture fields and renders `children` in their
     place. Default true, so / and /v2 keep the form they have — and keep the
     single submission path this component exists to enforce. A page that
     turns the form off is opting out of collecting anything here, so it has
     to supply its own way onward; that is what children is for. */
  form = true,
  children = null,
  /* `bare` drops the card behind the block — its ground, its 20px grid and
     its grain layer — so the copy sits on the page. Off by default: / and
     /v2 are built around that card. */
  bare = false,
}) {
  return (
    <section className={styles.pricingSection}>
      <div className={`${styles.pricingCard}${bare ? ' ' + styles.pricingCardBare : ''}`}>
        <p className={styles.pricingLabel}>{label}</p>
        <p className={styles.pricingSub}>{sub}</p>
        {form ? (
          <EmailCaptureForm
            styles={styles}
            variant="contact"
            submitLabel={submitLabel}
            confirmMessage={confirmMessage}
            subject={subject}
            requestType={requestType}
          />
        ) : children}
      </div>
    </section>
  )
}

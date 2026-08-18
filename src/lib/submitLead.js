/**
 * Single submission path for every lead-capture form on the site.
 *
 * Formspree is the system of record: it stores each submission in its own
 * dashboard, independently of this site's configuration. That property is the
 * whole point. The previous design posted to /api/contact, which fanned out to
 * Attio and Resend and kept no copy of its own — so when the environment
 * variables stopped being present on the project serving the domain, every
 * enquiry was accepted and discarded with no trace, for ten weeks, while the
 * form reported success.
 *
 * There is deliberately one of these. Two contact forms previously held their
 * own copy of the submit logic.
 */

export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xjgjzlaz'

/**
 * Submit a form element's fields.
 *
 * Always returns a result object — never throws, and never reports success it
 * has not been told about. A caller that ignores `ok` shows a false confirmation,
 * which is the failure this replaced.
 *
 * @param {HTMLFormElement} form
 * @returns {Promise<{ok: true} | {ok: false, error: string}>}
 */
export async function submitLead(form) {
  let res
  try {
    res = await fetch(FORMSPREE_ENDPOINT, {
      method: 'POST',
      body: new FormData(form),
      // Without this Formspree replies with a redirect to its own thank-you
      // page instead of JSON, and the fetch resolves to something the caller
      // cannot interpret.
      headers: { Accept: 'application/json' },
    })
  } catch {
    return { ok: false, error: 'Could not reach the server. Please try again.' }
  }

  if (res.ok) return { ok: true }

  // Formspree reports problems as { errors: [{ message, field }] }.
  let message = 'Something went wrong.'
  try {
    const body = await res.json()
    if (Array.isArray(body?.errors) && body.errors[0]?.message) {
      message = body.errors[0].message
    }
  } catch {
    // Non-JSON error body; the generic message stands.
  }
  return { ok: false, error: message }
}

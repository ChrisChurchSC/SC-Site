const RESEND_BASE = 'https://api.resend.com'
const ATTIO_BASE = 'https://api.attio.com/v2'

async function addToResendAudience(email, audienceId, apiKey) {
  const res = await fetch(`${RESEND_BASE}/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, unsubscribed: false }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Resend audience error: ${res.status} ${text}`)
  }
  return res.json()
}

async function addToAttio(email, apiKey) {
  const res = await fetch(`${ATTIO_BASE}/objects/people/records`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: { values: { email_addresses: [{ email_address: email }] } } }),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Attio error: ${res.status} ${text}`)
  }
  return res.json()
}

async function sendWelcomeEmail(email, fromEmail, apiKey) {
  const html = `<!DOCTYPE html>
<html>
<body style="font-family:Georgia,serif;background:#fff;color:#0a0a0a;max-width:540px;margin:0 auto;padding:48px 24px;line-height:1.65;">
  <p style="font-size:10px;letter-spacing:0.14em;text-transform:uppercase;font-family:monospace;color:#999;margin:0 0 40px;">Super Conscious</p>
  <p style="font-size:20px;margin:0 0 20px;font-weight:400;">Thanks for subscribing.</p>
  <p style="color:#555;margin:0 0 32px;font-size:16px;">We write about brand, content, and building creative companies — when we have something worth saying.</p>
  <p style="color:#555;margin:0 0 16px;font-size:15px;">To start:</p>
  <p style="margin:0 0 10px;"><a href="https://super-conscious.studio/thoughts/the-case-for-toolkits" style="color:#0a0a0a;font-size:15px;">The case for toolkits →</a></p>
  <p style="margin:0 0 10px;"><a href="https://super-conscious.studio/thoughts/build-slow-grow-fast" style="color:#0a0a0a;font-size:15px;">Build slow, grow fast →</a></p>
  <p style="margin:0 0 40px;"><a href="https://super-conscious.studio/thoughts/rethinking-the-workweek" style="color:#0a0a0a;font-size:15px;">Rethinking the workweek →</a></p>
  <p style="font-size:11px;color:#bbb;border-top:1px solid #eee;padding-top:24px;margin:0;">
    <a href="https://super-conscious.studio" style="color:#bbb;text-decoration:none;">super-conscious.studio</a>
  </p>
</body>
</html>`

  const text = `Thanks for subscribing.

We write about brand, content, and building creative companies — when we have something worth saying.

To start:

The case for toolkits
https://super-conscious.studio/thoughts/the-case-for-toolkits

Build slow, grow fast
https://super-conscious.studio/thoughts/build-slow-grow-fast

Rethinking the workweek
https://super-conscious.studio/thoughts/rethinking-the-workweek

—
super-conscious.studio`

  const res = await fetch(`${RESEND_BASE}/emails`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: fromEmail,
      to: email,
      subject: 'Good to have you.',
      html,
      text,
    }),
  })
  if (!res.ok) {
    const t = await res.text()
    throw new Error(`Resend email error: ${res.status} ${t}`)
  }
  return res.json()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email } = req.body || {}
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const RESEND_KEY = process.env.RESEND_API_KEY
  const RESEND_FROM = process.env.RESEND_FROM_EMAIL
  const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID
  const ATTIO_KEY = process.env.ATTIO_API_KEY

  if (!RESEND_KEY || !RESEND_FROM || !AUDIENCE_ID) {
    return res.status(500).json({ error: 'Missing Resend env vars' })
  }

  try {
    await addToResendAudience(email, AUDIENCE_ID, RESEND_KEY)
    await sendWelcomeEmail(email, RESEND_FROM, RESEND_KEY)
    if (ATTIO_KEY) await addToAttio(email, ATTIO_KEY)
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('newsletter error:', err.message)
    return res.status(500).json({ error: 'Subscription failed' })
  }
}

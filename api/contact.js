const ATTIO_BASE = 'https://api.attio.com/v2'

async function attio(path, method, body, key, params) {
  const url = new URL(`${ATTIO_BASE}${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Attio ${method} ${path} → ${res.status}: ${text}`)
  }
  return res.json()
}

/** Submitted text lands in an HTML email the recipient trusts and clicks from. */
const escapeHtml = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

async function notify(name, email, company, message, key, from) {
  // No sandbox fallback. Resend's onboarding@resend.dev only delivers to the
  // account owner and 403s otherwise — silently, which is exactly the class of
  // failure this endpoint used to hide. An unset sender is a misconfiguration
  // and must be loud.
  if (!from) throw new Error('RESEND_FROM_EMAIL is not set')

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: ['chris@super-conscious.studio'],
      reply_to: email,
      subject: `New inquiry from ${name}${company ? ` (${company})` : ''}`,
      html: [
        `<p><strong>Name:</strong> ${escapeHtml(name)}</p>`,
        `<p><strong>Email:</strong> <a href="mailto:${encodeURIComponent(email)}">${escapeHtml(email)}</a></p>`,
        company ? `<p><strong>Company:</strong> ${escapeHtml(company)}</p>` : '',
        `<p><strong>Project:</strong></p>`,
        `<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      ].join(''),
    }),
  })

  // The original awaited this fetch and never inspected it, so a 401 from a
  // rotated key resolved normally and the lead evaporated behind a green
  // "Message sent".
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Resend → ${res.status}: ${text}`)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, company, message } = req.body || {}
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const ATTIO_KEY = process.env.ATTIO_API_KEY
  const RESEND_KEY = process.env.RESEND_API_KEY
  const RESEND_FROM = process.env.RESEND_FROM_EMAIL

  // With no channel configured there is nowhere for a lead to land. Reporting
  // success here is the worst possible answer.
  if (!ATTIO_KEY && !RESEND_KEY) {
    console.error('[contact] no delivery channel configured — ATTIO_API_KEY and RESEND_API_KEY are both unset')
    return res.status(503).json({ error: 'Contact is temporarily unavailable.' })
  }

  // The lead is delivered if it reached a durable destination. Enrichment steps
  // that fail afterwards are logged but do not fail the submission.
  let crmRecorded = false
  let emailSent = false
  const failures = []

  if (ATTIO_KEY) {
    try {
      const parts = name.trim().split(/\s+/)
      const firstName = parts[0]
      const lastName = parts.slice(1).join(' ') || ''

      const personRes = await attio('/objects/people/records', 'PUT', {
        data: {
          values: {
            name: [{ first_name: firstName, last_name: lastName, full_name: name.trim() }],
            email_addresses: [{ email_address: email.trim() }],
          },
        },
      }, ATTIO_KEY, { matching_attribute: 'email_addresses' })

      const personId = personRes?.data?.id?.record_id

      if (personId) {
        const noteLines = [
          'Inbound inquiry via super-conscious.studio',
          '',
          company ? `Company: ${company}` : null,
          '',
          'Project:',
          message.trim(),
        ].filter(l => l !== null).join('\n')

        await attio('/notes', 'POST', {
          data: {
            parent_object: 'people',
            parent_record_id: personId,
            title: `Website inquiry${company ? ` — ${company}` : ''}`,
            format: 'plaintext',
            content: noteLines,
          },
        }, ATTIO_KEY)

        // Person + note is the durable record of the lead. Everything below is
        // pipeline convenience.
        crmRecorded = true
      }

      if (company?.trim() && personId) {
        try {
          const companyRes = await attio('/objects/companies/records', 'POST', {
            data: { values: { name: [company.trim()] } },
          }, ATTIO_KEY)

          const companyId = companyRes?.data?.id?.record_id

          if (companyId) {
            await attio('/lists/sales/entries', 'POST', {
              data: {
                parent_object: 'companies',
                parent_record_id: companyId,
                entry_values: {
                  stage: 'Intro',
                  main_point_of_contact: [{ target_object: 'people', target_record_id: personId }],
                },
              },
            }, ATTIO_KEY)

            await attio(`/objects/people/records/${personId}`, 'PATCH', {
              data: { values: { company: [{ target_object: 'companies', target_record_id: companyId }] } },
            }, ATTIO_KEY)
          }
        } catch (err) {
          console.error('[contact] Attio company/list error:', err.message)
          failures.push(`Attio company/list: ${err.message}`)
        }
      }
    } catch (err) {
      console.error('[contact] Attio error:', err.message)
      failures.push(`Attio: ${err.message}`)
    }
  }

  if (RESEND_KEY) {
    try {
      await notify(name, email, company, message, RESEND_KEY, RESEND_FROM)
      emailSent = true
    } catch (err) {
      console.error('[contact] Resend error:', err.message)
      failures.push(`Resend: ${err.message}`)
    }
  }

  if (!crmRecorded && !emailSent) {
    // Every configured channel failed. Say so, so the form shows its error
    // state and the prospect gets the fallback address instead of walking away
    // believing they made contact.
    console.error('[contact] DELIVERY FAILED — lead not recorded:', failures.join(' | '))
    return res.status(502).json({ error: 'We could not deliver your message.' })
  }

  if (failures.length) {
    // Delivered, but degraded — worth alerting on without failing the prospect.
    console.warn('[contact] delivered with partial failures:', failures.join(' | '))
  }

  // Never echo upstream vendor errors to the browser.
  return res.status(200).json({ ok: true })
}
